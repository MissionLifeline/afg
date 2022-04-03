## Update dependencies (mvn2nix-lock.json)

```bash
nix run .#updateBackendDeps
```

## Build + Test + Run

```bash
cd backend

CONFIG=data/config/test.edn nix run ..#afg-fullstack
```
