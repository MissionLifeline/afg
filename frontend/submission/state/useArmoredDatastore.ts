import {Key, WebStream} from 'openpgp'
import zustand from 'zustand'
import {config} from '../config'

import {encryptBlob, encryptString, readPubKeys} from '../utils'

type ID = string

type BlobState = {
  id: ID,
  stream: WebStream<Uint8array>,
  completed: boolean,
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

  blobs: BlobState[]
  addUploadBlob: (fileBlob: Blob) => ID
  removeUploadBlob: (fileId: ID) => void
}

export const useArmoredDatastore = zustand<ArmoredDatastoreState>((set, get) => ({
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

  blobs: [],

  addUploadBlob: (fileBlob) => {
    // TODO: what if pubKeys promise is still pending in case of a
    // very flakey network connection?
    const {blobs, pubKeys} = get()
    const id = Math.max(get().blobs.map(({ id }) => id).concat(0)) + 1
    set({ blobs: [
      ...blobs,
      { id }
    ]})

    encryptBlob(fileBlob, pubKeys)
      .then(encryptedBlob => {
        set({ blobs: get().blobs.map(blob =>
          blob.id === id ? ({ ...blob, stream: encryptedBlob}) : blob
        )})
        // TODO: start blob upload worker if not already running
      })
    return id
  },
  removeUploadBlob: fileId => {
    set(({encryptedFileBlobs}) => ({
      encryptedFileBlobs: encryptedFileBlobs.filter(({id}) => fileId === id)
    }))
  }
}))

