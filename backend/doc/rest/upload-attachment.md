# /api/upload-attachment

```sh
curl -X POST localhost:4000/api/upload-attachment?token=exampleToken&userId=userKeyId&fileId=nonceCreatedByFrontend
```

Not doing much now — plz send me the first data, than I know the format (raw/multipart/…) and will handle it…

Decide yourself, if you want send the token via body (probably the cleaner solution) or via url parameter.


I will:
* accept only `*.gpg` files, binary format is fine
* check if the token is valid (existing and correct userKeyId), then
  * store it in a directory named by token
  * create a database record
    * keep track of mapping `[token, fileId] -> filename`
    * store date (so we can later easily query all updates from editor frontend)
* id is also used in the formData to associate metadata (e.g. description of content)
* HTTP 200 will signalize to frontend, that upload was successful

Questions:
* Should `upload-form` be called every time additionally to store the metadata? Than it might be better, to include the form in the same multipart request.
* maximum file size (high limit was required and we have a lot of storage, suggestion: 10MB)
* maximum number of files that can be uploaded with a token (probably high, suggestion: 100)
