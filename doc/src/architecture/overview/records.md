# DB Records + Files

```mermaid
classDiagram
     class AdmissionApplicationTable:::editorOnly
     class ApplicationDataset:::editorOnly
     class ApplicationRecordEdited:::editorOnly

     class ApplicationRecordState {
         state: Enum<new|editing|partiallySubmitted|finallySubmitted>
         tmpFormData: EncryptedFormData  // allow:user.to.resume.editing
     }
     class ApplicationAttachment {
         token
	 id: Nonce  // provided.by:frontend
	 filename
	 uploadDate
     }
     class ApplicationFormData {
         token
	 formName
	 filename
	 uploadDate
     }

     class ApplicationAttachmentFile:::encrypted {
         +path: Token
	 +name: Date+ID
     }
     class ApplicationFormDataFile:::encrypted {
         +path: Token
	 +name: Date+FormName
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
     ApplicationDataset o-- "0..*" ApplicationAttachment
     ApplicationDataset o-- "1" ApplicationRecordEdited

     ApplicationRecordEdited "1" <-- "1..*" ApplicationRecordState : created from
     ApplicationRecordState "1" <-- "0..*" ApplicationAttachment
     ApplicationRecordState "1" <-- "1..*" ApplicationFormData
     ApplicationAttachment "1" *-- "1" ApplicationAttachmentFile : encrypted
     ApplicationFormData "1" *-- "1" ApplicationFormDataFile : encrypted
     ApplicationFormDataFile "0..*" o-- "1..*" ApplicationAttachmentFileMeta
     ApplicationAttachmentFile "1" --* "1" ApplicationAttachmentFileMeta


     ApplicationRecordState "1" <-- "1" Token
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
