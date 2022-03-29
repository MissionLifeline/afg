# DB Records + Files

```mermaid
classDiagram
     class AdmissionApplicationTable:::editorOnly
     class ApplicationDataset:::editorOnly
     class ApplicationEditedRecord:::editorOnly

     class ApplicationStateRecord {
         state: Enum<new|editing|partiallySubmitted|finallySubmitted>
	 userId: KeyId  // ensure:token.used.only.by.one.user
         tmpFormData: EncryptedFormData  // allow:user.to.resume.editing
     }
     class ApplicationAttachmentRecord {
         token
	 id: Nonce  // provided.by:frontend
	 filename
	 uploadDate
     }
     class ApplicationFormDataRecord {
         token
	 filename
	 uploadDate
     }

     class ApplicationAttachmentFile:::encrypted {
         +path: Token
	 +name: Date+ID
     }
     class ApplicationFormDataFile:::encrypted {
         +path: Token
	 +name: Date
         -data: <JsonFormSchema>
     }
     class ApplicationAttachmentFileMeta:::encrypted {
	 -originalFilename
	 -description
     }

     class TokenMetadata:::encrypted {
         -mailAddress
	 -notes
     }
     class Token:::public {
         assignedEditor: Editor
     }
     class Editor:::public {
         +publicKey
	 name: Pseudonym  // protect:RealIdentity
     }
     class Editors:::public {
         +signature: GpgSignature  // integrityCheck
     }

     AdmissionApplicationTable o-- "1..*" ApplicationDataset
     ApplicationDataset o-- "0..*" ApplicationAttachmentRecord
     ApplicationDataset o-- "1" ApplicationEditedRecord

     ApplicationEditedRecord "1" <-- "1..*" ApplicationStateRecord : created from
     ApplicationStateRecord "1" <-- "0..*" ApplicationAttachmentRecord
     ApplicationStateRecord "1" <-- "1..*" ApplicationFormDataRecord
     ApplicationAttachmentRecord "1" *-- "1" ApplicationAttachmentFile : encrypted
     ApplicationFormDataRecord "1" *-- "1" ApplicationFormDataFile : encrypted
     ApplicationFormDataFile "0..*" o-- "1..*" ApplicationAttachmentFileMeta
     ApplicationAttachmentFile "1" --* "1" ApplicationAttachmentFileMeta


     ApplicationStateRecord "1" <-- "1" Token
     Token "1" *-- "1" TokenMetadata : encrypted
     Token "0..*" <-- "1..*" Editor
     Editors "1" *-- "1..*" Editor
```

<style>
  .editorOnly {
    stroke:red !important;
    stroke-width: 2px;
  }
  .encrypted {
    stroke:orange !important;
    stroke-width: 2px;
  }
  .public {
    stroke:green !important;
    stroke-width: 2px;
  }
</style>
