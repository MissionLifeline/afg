import {Key, WebStream} from 'openpgp'
import { v4 as uuid } from 'uuid'
import zustand from 'zustand'

import {config} from '../config'
import {encryptBlob, encryptString, readPubKeys} from '../utils'

type ID = string

export enum AttachmentStatus {
  /// to be processed by uploadWorker
  NEW,
  /// in process by uploadWorker
  UPLOADING,
  /// uploaded
  DONE,
}

type AttachmentState = {
  id: ID
  blob: File,
  status: AttachmentStatus,
}

type ArmoredDatastoreState = {
  token: string
  setToken: (token: string) => void

  /// set keys in ascii-armored serialization
  setSerializedPubKeys: (serializedPubKeys: string[]) => void
  /// deserialized keys
  pubKeys: Key[]

  formData: any
  setFormData: (formData: any) => void

  sendFormData: () => Promise<void>

  attachments: AttachmentState[]
  addAttachment: (blob: File) => ID
  updateAttachment: (fileId: ID, f: (attachment: AttachmentState) => AttachmentState) => void
  removeAttachment: (fileId: ID) => void

  startWorker: () => void
  setWorkerStopped: () => void
  uploadIsRunning: boolean
}

export const useArmoredDatastore = zustand<ArmoredDatastoreState>((set, get) => ({
  // TODO: use token from router like at https://github.com/MissionLifeline/afg/pull/5
  token: 'exampleToken',
  // TODO: unused
  setToken: token => set(() => ({ token })),

  setSerializedPubKeys: serializedPubKeys => {
    readPubKeys(serializedPubKeys).then(pubKeys =>
      set(() =>
        ({pubKeys})))
  },
  pubKeys: [],

  formData: {},
  setFormData: (formData: any) => set({ formData }),

  sendFormData: async () => {
    const { formData, pubKeys, token } = get()
    const dataString = JSON.stringify(formData)
    const encryptedFormData = await encryptString(dataString, pubKeys)

    const body = new FormData()
    body.append('token', token)
    body.append('userId', 'TODOmock')
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

  addAttachment: (fileBlob: File): ID => {
    const id = uuid()
    // TODO: what if pubKeys promise is still pending in case of a
    // very flakey network connection?
    const {attachments, pubKeys} = get()
    set({ attachments: [
      ...attachments,
      {
        id,
        status: AttachmentStatus.NEW,
        blob: fileBlob,
      }
    ]})
    // start uploading if not already doing so
    get().startWorker()

    return id
  },

  updateAttachment: (fileId: ID, f: (attachment: AttachmentState) => AttachmentState) => {
    set({ attachments: get().attachments.map(attachment =>
      attachment.id === fileId ? f(attachment) : attachment
    )})
  },

  removeAttachment: (fileId: ID) => {
    set(({attachments}) => ({
      attachments: attachments.filter(({id}) => fileId === id)
    }))
  },

  uploadIsRunning: false,

  startWorker: () => {
    const { uploadIsRunning } = get()
    if (uploadIsRunning) {
      // no concurrent uploads
      return
    }

    // find next attachment to upload
    let id: ID | undefined = undefined
    let attachment: AttachmentState | undefined = undefined
    for(const attachment_ of get().attachments) {
      if (attachment_.status != AttachmentStatus.DONE) {
        id = attachment_.id
        attachment = attachment_
        break
      }
    }
    if (!id || !attachment?.blob) {
      return
    }

    set({ uploadIsRunning: true })
    uploadWorker(get, attachment)
  },

  setWorkerStopped: () => {
    set({ uploadIsRunning: false })
  }
}))

const uploadWorker = async (get: () => ArmoredDatastoreState, attachment: AttachmentState) => {
  const fileId = attachment.id
  const blob = attachment.blob
  const { token, pubKeys, updateAttachment, setWorkerStopped } = get()

  try {
    updateAttachment(fileId, attachment => ({
      ...attachment,
      status: AttachmentStatus.UPLOADING,
    }))
    const encryptedChunks: Uint8Array[] = await new Promise(async (resolve, reject) => {
      if (!attachment?.blob) {
        throw new Error("Blob vanished")
      }
      const encryptedStream = await encryptBlob(blob as Blob, pubKeys) as WebStream<Uint8Array>
      // consume the encryptedStream into encryptedChunks until finished
      let chunks: Uint8Array[] = []
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
    body.append('userId', 'TODOmock')
    body.append('fileId', fileId)
    body.append('fileType', blob.type)
    body.append('attachment', new Blob(encryptedChunks, { type: 'application/pgp-encrypted' }))
    const res = await fetch(`${config.backend_base_url}/api/upload-attachment`, {
      method: 'POST',
      body,
    })
    if (!res.ok) {
      throw new Error(`upload-form: HTTP ${res.status}`)
      // TODO: retry with a timeout except for HTTP 4xx
    }

    updateAttachment(fileId, attachment => ({
      ...attachment,
      status: AttachmentStatus.DONE,
    }))
  } finally {
    setWorkerStopped()
  }
}
