# `get_keys`

```graphql
{get_keys(token: "exampleToken")}
```

This query (in future) returns the public keys, that should be used to encrypt a dataset submitted using `token`.

For development+tesing a keyfile can be specified when starting the backend:

```sh
TEST_PUBKEY_FILE=data/keys/test.pub.gpg lein run
```

If you use `backend/data/keys/test.pub.gpg`, you find the corresponding **`test.sec.key`** next to it. The Passphrase is `test`. 

```sh
gpg --import backend/data/keys/test.sec.gpg
gpg --decrypt-files backend/data/upload/exampleToken/*.pgp
```
