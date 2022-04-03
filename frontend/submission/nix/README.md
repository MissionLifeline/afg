The nix build of the frontend uses [yarn2nix](https://github.com/nix-community/yarn2nix)

## Create lockfile 

```sh
cd frontend/submission

yarn2nix > nix/yarn.nix
```

## Build

```sh
nix build .#afg-submission-staticHTML
```
