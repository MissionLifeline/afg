import {Key, WebStream} from 'openpgp'
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
  blob: Blob,
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

  sendFormData: () => void

  attachments: AttachmentState[]
  addAttachment: (blob: Blob) => ID
  removeAttachment: (fileId: ID) => void
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
    body.append('userId', "TODOmock")
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

  addAttachment: (fileBlob) => {
    // TODO: what if pubKeys promise is still pending in case of a
    // very flakey network connection?
    const {attachments, pubKeys} = get()
    const id = Math.max(get().attachments.map(({ id }) => id).concat(0)) + 1
    set({ attachments: [
      ...attachments,
      {
        id,
        status: AttachmentStatus.NEW,
        blob: fileBlob,
      }
    ]})
    // start uploading if not already doing so
    uploadWorker(set, get)

    return id
  },

  removeAttachment: fileId => {
    set(({encryptedFileAttachments}) => ({
      encryptedFileAttachments: encryptedFileAttachments.filter(({id}) => fileId === id)
    }))
  }
}))

const uploadWorker = async (set, get) => {
  if (get().uploadIsRunning) {
    return
  }

  let id, blob
  for(const attachment of get().attachments) {
    if (attachment.status != AttachmentStatus.DONE) {
      id = attachment.id
      blob = attachment.blob
      break
    }
  }
  const updateAttachment = f =>
    set({ attachments: get().attachments.map(attachment =>
      attachment.id === id ? f(attachment) : attachment
    )})

  set({ uploadIsRunning: true })
  try {
    updateAttachment(attachment => ({
      ...attachment,
      status: AttachmentStatus.UPLOADING,
    }))
    const { token, pubKeys } = get()
    let encryptedStream = await encryptBlob(blob, pubKeys)
    const body = new FormData()
    body.append('token', token)
    body.append('userId', "TODOmock")
    body.append('fileId', id)
    // TODO: does this work?
    body.append('attachment', encryptedStream)
    const res = await fetch(`${config.backend_base_url}/api/upload-attachment`, {
      method: 'POST',
      body,
    })
    if (!res.ok) {
      throw new Error(`upload-form: HTTP ${res.status}`)
    }

    updateAttachment(attachment => ({
      ...attachment,
      status: AttachmentStatus.DONE,
    }))
  } finally {
    set({ uploadIsRunning: false })
  }
}
