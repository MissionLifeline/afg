import * as openpgp from 'openpgp'
import {Key} from 'openpgp'

export const readPubKeys: (pubKeys: string[]) => Promise<Key[]> = (pubKeys: string[]) =>
  Promise
    .all(pubKeys.map(pubkey => openpgp.readKey({armoredKey: pubkey})))

export const encryptString = (text: string, pubKeys: Key[]): Promise<Uint8Array> =>
  openpgp.createMessage({text})
    .then(message =>
      openpgp.encrypt({
        message,
        encryptionKeys: pubKeys,
        format: 'binary'
      }) as Promise<Uint8Array>
    )

export const encryptBlob = async (blob: Blob, pubKeys: Key[]) =>
  await openpgp.encrypt({
    // @ts-ignore
    message: await openpgp.createMessage({binary: blob.stream()}),
    encryptionKeys: pubKeys,
    format: 'binary'
  })
