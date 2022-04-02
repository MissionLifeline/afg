# Cypress

## Setup

Ensure you use the same `cypress` version in `node-packages.json` as the version of the cypress-binary provided by flake.nix.

`default.nix`, `node-env.nix` and `node-packages.nix` can be updated by:

```bash
cd frontend/nix/tools/cypress

 nix run ../../../..#pkgs.nodePackages.node2nix -- -i node-packages.json
```

## Usage

```bash
cd frontend/submission

nix run ../..#cypress -- run   ## ci run
nix run ../..#cypress -- open  ## gui
```
