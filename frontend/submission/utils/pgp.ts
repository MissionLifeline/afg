import * as openpgp from 'openpgp'

export class Encryption {
  readonly pubkeysPromise: Promise

  constructor(pubkeys: string[]) {
    this.pubkeysPromise = Promise.all(
      pubkeys.map(pubkey =>
        openpgp.readKey({ armoredKey: pubkey })
      )
    )
  }

  /// input: string or ReadableStream
  async encrypt(input) {
    const pubkeys = await this.pubkeysPromise

    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: input }),
      encryptionKeys: pubkeys,
      format: 'binary',
    })
    return encrypted
  }
}
