{
  description = "Lifeline Server setup";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    sops-nix = {
      url = "github:Mic92/sops-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dns = {
      url = "github:kirelagin/dns.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    mvn2nix = {
      url = "github:fzakaria/mvn2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, sops-nix, dns, mvn2nix }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
    inherit (pkgs) lib;

    commonAttrs = {
      inherit system;
      extraArgs = { flake = self; inherit system dns; };
    };
    commonModules = [
      ./deployment/modules/nix.nix
      #sops-nix.nixosModules.sops
      #./deployment/modules/sops.nix
      ./deployment/modules/default.nix
      ./deployment/modules/dns.nix
      #./deployment/modules/monitoring/client.nix
      ./deployment/modules/nginx/afg.nix
      #nix-deploy-git.nixosModule
      #./deployment/modules/nix-deploy-git.nix
    ];
  in
  rec {

    nixosConfigurations = {
      lifeline = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules = commonModules ++ [
          ./deployment/hosts/lifeline/configuration.nix
          ./deployment/modules/afg.nix
          #./deployment/modules/binarycache/server.nix
          #./deployment/modules/monitoring/server.nix
          #./deployment/modules/jenkins.nix
        ];
      });
    };

    legacyPackages.${system} = { inherit pkgs; };

    packages.${system} =
      let
        ## The packages provided by the inputs of this flake
        inherit pkgs;
      in {
        ## Tools for devops
        updateBackendDeps = pkgs.callPackage ./backend/nix/tools/updated-deps.nix {
          inherit (mvn2nix.legacyPackages.${system}) mvn2nix;
        };
        cypress = import ./frontend/nix/tools/cypress/override.nix { inherit pkgs; };

        ## Derivations provided by this repo
        inherit (pkgs.callPackages ./frontend/submission/nix {})
          afg-submission-deps
          afg-submission-staticHTML;
        afg-backend = pkgs.callPackage ./backend/nix {
          inherit (mvn2nix.legacyPackages.${system}) buildMavenRepositoryFromLockFile;
          inherit pkgs;
        };
        afg-fullstack = self.packages.${system}.afg-backend.override {
          patchPublic = self.packages.${system}.afg-submission-staticHTML;
        };
      };

    # `nix develop`
    devShell.${system} = with nixpkgs.legacyPackages.${system}; mkShell {
      nativeBuildInputs = [
        # backend
        leiningen
        gnupg
        # frontend
        nodejs yarn
        self.packages.${system}.cypress
        # doc
        mdbook mdbook-mermaid
      ];
    };
  };
}
