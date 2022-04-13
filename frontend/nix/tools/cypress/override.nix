{ pkgs ? import <nixpkgs> { inherit system; },
  system ? builtins.currentSystem
}:
let
  nodePackages = import ./default.nix { inherit pkgs system; };

  cypressNpm = nodePackages."cypress-${pkgs.cypress.version}".override (oa: {
    preRebuild = ''
      export CYPRESS_INSTALL_BINARY=0
    '';
    dependencies = oa.dependencies ++ [ rec {
      name = "cypress-file-upload";
      packageName = name;
      version = "5.0.8";
      src = nodePackages."${packageName}-${version}".src;
    } ];
  });
in
pkgs.writeScriptBin "cypress" ''
  #!${pkgs.runtimeShell} -e

  [ -d ~/.config/Cypress ] && chmod -R +w ~/.config/Cypress
  export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress

  export PATH=$PATH:${pkgs.lib.makeBinPath (with pkgs; [xorg.xorgserver which])}
  export FONTCONFIG_PATH=${pkgs.fontconfig.out}/etc/fonts
  export CYPRESS_NODE_PATH=$NODE_PATH:${nodePackages."cypress-file-upload-5.0.8"}

  if [ -e cypress ]; then
    mkdir -p cypress/support/node_modules
    ln -s ${nodePackages."cypress-file-upload-5.0.8"}/lib/node_modules cypress/support/node_modules/cypress-file-upload
  fi
  ${cypressNpm.override (oa: builtins.trace "dependencies: ${pkgs.lib.generators.toPretty {} oa}" oa)}/bin/cypress $@
''
