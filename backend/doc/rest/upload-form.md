# /api/upload-form

This endpoint is used to submit the complete `formData` of **all subforms** (wizard steps).

> should be as close as possible to [/api/upload-attachment](./upload-attachment)

Required Params:
* `token`
* `userId`

In comparison to `upload-attachment`, this endpoint doesn't expect the `fileId`.
