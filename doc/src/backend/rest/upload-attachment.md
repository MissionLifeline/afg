# /api/upload-attachment

```sh
curl -X POST localhost:4000/api/upload-attachment?token=exampleToken
```

Not doing much now — plz send me the first data, than I know the format (raw/multipart/…) and will handle it…

Decide yourself, if you want send the token via body (probably the cleaner solution) or via url parameter.


I will:
* accept only `*.gpg` files, binary format is fine
* check if the token is valid, then
  * store it in a directory named by token
  * return a hash of the content, that should be associated in the form data with the metadata (e.g. description of content)

Question to be decided:
* maximum file size
* maximum number of files that can be uploaded with a token
