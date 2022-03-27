import * as openpgp from 'openpgp'
import {Key} from 'openpgp'

export class Encryption {
  readonly pubkeysPromise: Promise<Awaited<Key>[]>

  constructor(pubkeys: string[]) {
    this.pubkeysPromise = Promise.all(
      pubkeys.map(pubkey =>
        openpgp.readKey({armoredKey: pubkey})
      )
    )
  }

  /// input: string or ReadableStream
  async encrypt(input: string | ReadableStream) {
    const pubkeys = await this.pubkeysPromise

    return await openpgp.encrypt({
      message: await openpgp.createMessage({text: input}),
      encryptionKeys: pubkeys,
      format: 'binary',
    })
  }
}
