import mapValues from 'lodash/mapValues'
import {Key, WebStream} from 'openpgp'
import { v4 as uuid } from 'uuid'
import zustand from 'zustand'

import {config} from '../config'
import {encryptBlob, encryptString, readPubKeys} from '../utils'

export type ID = string

export enum AttachmentStatus {
  /// to be processed by uploadWorker
  NEW,
  /// in process by uploadWorker
  UPLOADING,
  /// uploaded
  DONE,
  /// HTTP error 4xx
  ERROR,
}

export type AttachmentState = {
  id: ID
  blob: File
  status: AttachmentStatus
  uploadStatus?: number
}

type ArmoredDatastoreState = {
  /// set keys in ascii-armored serialization
  setSerializedPubKeys: (serializedPubKeys: string[]) => void
  /// deserialized keys
  pubKeys: Key[]

  formData: any
  setFormData: (name: string, formData: any) => void

  sendFormData: (token: string, userId: string) => Promise<void>

  attachments: AttachmentState[]
  addAttachment: (token: string, userId: string, blob: File) => ID
  addOrReplaceAttachment: (token: string, userId: string, id: ID, blob: File) => ID
  updateAttachment: (fileId: ID, f: (attachment: AttachmentState) => AttachmentState) => void
  removeAttachment: (fileId: ID) => void

  startWorker: (token: string, userId: string) => void
  setWorkerStopped: (token: string, userId: string) => void
  uploadIsRunning: boolean
}

export const useArmoredDatastore = zustand<ArmoredDatastoreState>((set, get) => ({
  setSerializedPubKeys: serializedPubKeys => {
    readPubKeys(serializedPubKeys).then(pubKeys =>
      set(() =>
        ({pubKeys})))
  },
  pubKeys: [],

  formData: {},
  setFormData: (name: string, data: any) => {
    set(({formData}) => ({
      formData: preProcessFormData({
        ...formData,
        [name]: data,
      })
    }))
  },

  sendFormData: async (token: string, userId: string) => {
    const { pubKeys, attachments } = get()
    let { formData } = get()
    // synchronize attachment upload HTTP status into formData
    const updateUploadStatus = (id: ID, uploadStatus: undefined | number, data: any): any =>
      !data
      ? data
      : data && data.id === id
      ? { ...data, uploadStatus }
      : data.map
      ? data.map((upload_: any) => updateUploadStatus(id, uploadStatus, upload_))
      : typeof data == 'object'
      ? mapValues(data, (upload_: any) => updateUploadStatus(id, uploadStatus, upload_))
      : data
    for (const { id, uploadStatus } of attachments) {
      formData = updateUploadStatus(id, uploadStatus, formData)
    }

    const dataString = JSON.stringify(formData)
    const encryptedFormData = await encryptString(dataString, pubKeys)

    const body = new FormData()
    body.append('token', token)
    body.append('userId', userId)
    body.append('formData', new Blob([encryptedFormData]))

    const res = await fetch(`${config.backend_base_url}/api/upload-form`, {
      method: 'POST',
      body,
    })
    if (!res.ok) {
      throw new Error(`upload-form: HTTP ${res.status}`)
    }
  },

  attachments: [],

  addAttachment: (token: string, userId: string, fileBlob: File): ID => {
    const id = uuid()
    // TODO: what if pubKeys promise is still pending in case of a
    // very flakey network connection?
    const {attachments} = get()
    set({ attachments: [
      ...attachments,
      {
        id,
        status: AttachmentStatus.NEW,
        blob: fileBlob,
      }
    ]})
    // start uploading if not already doing so
    get().startWorker(token, userId)

    return id
  },
  addOrReplaceAttachment: (token, userId, id, fileBlob: File): ID => {
    // TODO: what if pubKeys promise is still pending in case of a
    // very flakey network connection?
    const newAttachment = {
      id,
      status: AttachmentStatus.NEW,
      blob: fileBlob,
    }
    set(({attachments}) => (
      { attachments: attachments.findIndex(({id: _id}) => _id === id) >= 0
          ? attachments.map(attachment => attachment.id === id ? newAttachment : attachment)
          : [...attachments, newAttachment]}))
    // start uploading if not already doing so
    get().startWorker(token, userId)

    return id
  },

  updateAttachment: (fileId: ID, f: (attachment: AttachmentState) => AttachmentState) => {
    set({ attachments: get().attachments.map(attachment =>
      attachment.id === fileId ? f(attachment) : attachment
    )})
  },

  removeAttachment: (fileId: ID) => {
    set(({attachments}) => ({
      attachments: attachments.filter(({id}) => fileId !== id)
    }))
  },

  uploadIsRunning: false,

  startWorker: (token: string, userId: string) => {
    const { uploadIsRunning } = get()
    if (uploadIsRunning) {
      // no concurrent uploads
      return
    }

    // find next attachment to upload
    let id: ID | undefined = undefined
    let attachment: AttachmentState | undefined = undefined
    for(const attachment_ of get().attachments) {
      if (attachment_.status != AttachmentStatus.DONE && attachment_.status != AttachmentStatus.ERROR) {
        id = attachment_.id
        attachment = attachment_
        break
      }
    }
    if (!id || !attachment?.blob) {
      return
    }

    set({ uploadIsRunning: true })
    uploadWorker(token, userId, get, attachment)
  },

  setWorkerStopped: (token: string, userId: string) => {
    set({ uploadIsRunning: false })

    // restart for next attachment
    get().startWorker(token, userId)
  }
}))

const preProcessFormData = (data: any): any => {
  return {
    ...data,
    fellowApplicants: {
      ...data?.fellowApplicants,
      fellowApplicantFamilyMembers: (
        data?.fellowApplicants?.fellowApplicantFamilyMembers || []
      ).map((m: any) => ({
        ...m,
        eligible: (m.relation === 'son' && m.dateOfBirth < '2004-')
          || (m.relation == 'daughter' && m.maritalStatus == 'single')
          || (m.relation == 'parent' && m.fragile)
          || (m.relation == 'uncleAunt' && m.requiresCare),
      })),
    }
  }
}

const uploadWorker = async (token: string, userId: string, get: () => ArmoredDatastoreState, attachment: AttachmentState) => {
  const fileId = attachment.id
  const blob = attachment.blob
  const { pubKeys, updateAttachment, setWorkerStopped } = get()

  try {
    updateAttachment(fileId, attachment => ({
      ...attachment,
      status: AttachmentStatus.UPLOADING,
    }))
    const encryptedChunks: Uint8Array[] = await new Promise(async (resolve, reject) => {
      if (!attachment?.blob) {
        throw new Error('Blob vanished')
      }
      const encryptedStream = await encryptBlob(blob as Blob, pubKeys) as WebStream<Uint8Array>
      // consume the encryptedStream into encryptedChunks until finished
      const chunks: Uint8Array[] = []
      // @ts-ignore
      encryptedStream.pipeTo(new WritableStream({
        write(chunk) {
          chunks.push(chunk)
        },
        close() {
          resolve(chunks)
        },
        abort: reject,
      }))
    })
    const body = new FormData()
    body.append('token', token)
    body.append('userId', userId)
    body.append('fileId', fileId)
    body.append('fileType', blob.type)
    body.append('attachment', new Blob(encryptedChunks, { type: 'application/pgp-encrypted' }))
    const res = await fetch(`${config.backend_base_url}/api/upload-attachment`, {
      method: 'POST',
      body,
    })
    if (res.status >= 400 && res.status < 500) {
      // do not retry
      updateAttachment(fileId, attachment => ({
        ...attachment,
        status: AttachmentStatus.ERROR,
        uploadStatus: res.status,
      }))
    } else if (res.ok) {
      // done
      updateAttachment(fileId, attachment => ({
        ...attachment,
        status: AttachmentStatus.DONE,
        uploadStatus: res.status,
      }))
    } else {
      throw new Error(`upload-form: HTTP ${res.status}`)
    }
  } catch (e) {
    // retry on error
    updateAttachment(fileId, attachment => ({
      ...attachment,
      status: AttachmentStatus.NEW,
    }))

    throw e
  } finally {
    setWorkerStopped(token, userId)
  }
}
