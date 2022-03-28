# `get_keys`

```graphql
{get_keys(token: "exampleToken")}
```

This query (in future) returns the public keys, that should be used to encrypt a dataset submitted using `token`.

For development+tesing a keyfile can be specified when starting the backend:

```sh
TEST_PUBKEY_FILE=data/keys/test.pub.gpg lein run
```
