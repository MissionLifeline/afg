import * as openpgp from 'openpgp'
import {Key} from 'openpgp'

export const readPubKeys: (pubKeys: string[]) => Promise<Key[]> = (pubKeys: string[]) =>
  Promise
    .all(pubKeys.map(pubkey => openpgp.readKey({armoredKey: pubkey})))

export const encryptString = async (text: string, pubKeys: Key[]) =>
  await openpgp.encrypt({
    message: await openpgp.createMessage({text}),
    encryptionKeys: pubKeys,
    format: 'binary'
  })

export const encryptBlob = async (blob: Blob, pubKeys: Key[]) =>
  await openpgp.encrypt({
    // @ts-ignore
    message: await openpgp.createMessage({binary: blob.stream()}),
    encryptionKeys: pubKeys,
    format: 'binary'
  })
