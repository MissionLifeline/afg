# DB Records + Files

```mermaid
classDiagram
     class AdmissionApplicationTable:::editorOnly
     class ApplicationDataset:::editorOnly
     class ApplicationRecordEdited:::editorOnly
     class ApplicationRecordSubmitted {
         submissionDate: Date
	 attachments: File[]  // uuid.tar.gpg
	 formData: ArmoredGpgMessage  // or:Attachment
     }
     class ApplicationFormData:::encrypted {
         -data: <JsonFormSchema>
     }
     class ApplicationAttachments:::encrypted {
         +path: Token
	 +name: Date+UUID
	 -originalNames: Hidden  // tar.gpg
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
     ApplicationDataset o-- "0..*" ApplicationAttachments
     ApplicationDataset o-- "1" ApplicationRecordEdited

     ApplicationRecordEdited "1" <-- "1..*" ApplicationRecordSubmitted : created from
     ApplicationRecordSubmitted "1" <-- "0..*" ApplicationAttachments : encrypted
     ApplicationRecordSubmitted "1" <-- "1" ApplicationFormData : encrypted
     ApplicationRecordSubmitted "0..*" <-- "1" Token
     Token "1" <-- "0..1" TokenMetadata : encrypted
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
