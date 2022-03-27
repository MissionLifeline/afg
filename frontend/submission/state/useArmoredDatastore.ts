import {Key, WebStream} from 'openpgp'
import zustand from 'zustand'

import {encryptBlob, encryptString, withPubKeys} from '../utils'


type ID = string
type ArmoredDatastoreState = {
  encryptedFormData?: WebStream<Uint8Array>
  encryptedFileBlobs: { id: ID, stream: WebStream<Uint8Array> }[]
  pubKeys: Key[],
  setFormData: (data: any) => void
  setSerializedPubKeys: (serializedPubKeys: string[]) => void
  addUploadBlob: (id: ID, fileBlob: Blob) => void
  removeUploadBlob: (fileId: ID) => void
}

export const useArmoredDatastore = zustand<ArmoredDatastoreState>(set => ({
  encryptedFileBlobs: [],
  pubKeys: [],
  setSerializedPubKeys: serializedPubKeys => {
    withPubKeys(serializedPubKeys).then(pubKeys =>
      set(() =>
        ({pubKeys})))
  },
  setFormData: ( data: any) => {
    set(({pubKeys}) => {
      const dataString = JSON.stringify(data)
      encryptString(dataString, pubKeys)
        .then(encrypted =>
          set(() => ({encryptedFormData: encrypted}))
        )
    })
  },
  addUploadBlob: (id, fileBlob) => {
    set(({pubKeys}) => {
      encryptBlob(fileBlob, pubKeys)
        .then(encryptedBlob =>
          set( ({encryptedFileBlobs}) =>
            ({encryptedFileBlobs: [
              ...encryptedFileBlobs,
      {id, stream: encryptedBlob}] })))
    })
  },
  removeUploadBlob: fileId => {
    set(({encryptedFileBlobs}) => ({
      encryptedFileBlobs: encryptedFileBlobs.filter(({id}) => fileId === id)
    }))
  }
}))

