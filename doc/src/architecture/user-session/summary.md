# Privacy friendly user sessions

## Goals

### Pseudonym users
* only invited users can submit -> `token`
* `token`s must only be used by a single user -> limit token to an random id, created and stored by the user

### Users should be able to continue editing, while data must not be permanently readable from client device
* store data encrypted at server, serve it only for limited time
* private key of user is stored at localstore

## Threat model
* server must not have any access to unencrypted data
* client device should have access only for limited time
* it can be considered unlikely, that an attacker gains access to server and client 
