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
    microvm = {
      url = "github:astro/microvm.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, sops-nix, dns, mvn2nix, microvm }:
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
      #./deployment/modules/monitoring/client.nix
      #nix-deploy-git.nixosModule
      #./deployment/modules/nix-deploy-git.nix
    ];
  in
  rec {

    nixosConfigurations = {
      lifeline = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules = commonModules ++ [
          microvm.nixosModules.host
          ./deployment/hosts/lifeline/configuration.nix
          ./deployment/modules/afg.nix
          ./deployment/modules/nginx/afg.nix
          ./deployment/modules/dns.nix
          #./deployment/modules/binarycache/server.nix
          #./deployment/modules/monitoring/server.nix
          #./deployment/modules/jenkins.nix
        ];
      });

      afg-staging = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules = commonModules ++ [
          microvm.nixosModules.microvm
          ./deployment/hosts/afg-staging/configuration.nix
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

    checks.${system}.submission-integration = with pkgs;
      let
        testResults = runCommandNoCC "afg-submission-integration-tests" {
          nativeBuildInputs = with self.packages.${system}; [
            curl gnupg
            self.packages.${system}.afg-fullstack
            cypress
          ];
        } ''
          export HOME=$(mktemp -d)

          mkdir backend
          pushd backend
          cp -r ${./backend/data} data
          gpg --import data/keys/test.sec.gpg
          chmod -R u+w data
          CONFIG=data/config/test.edn afg-backend &
          popd

          while ! curl -s http://localhost:4000; do
            echo Wait for backend
            sleep 1
          done

          mkdir -p frontend/submission $out
          cd frontend/submission
          cp ${./frontend/submission/cypress.json} cypress.json
          cp -r ${./frontend/submission/cypress} cypress
          chmod -R u+w cypress
          export CYPRESS_BASE_URL=http://localhost:4000
          set +e
          cypress run
          echo $? > $out/result
          set -e

          if [ -e cypress/results ]; then
            cp -r cypress/results $out/
          fi
          if [ -e cypress/screenshots ]; then
            cp -r cypress/screenshots $out/
          fi
        '';
      in runCommandNoCC "afg-submission-integration-check" {} ''
        echo See test results at ${testResults}
        ln -s ${testResults} $out
        RESULT=$(cat "${testResults}/result")
      '';

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
