{ stdenv,
  yarn2nix-moretea,
}:
let

  afg-submission-deps = yarn2nix-moretea.mkYarnPackage {
    pname = "afg-submission-deps";
    src = ./.;  ## The dependencies should not be rebuild when the frontend code changed
    yarnLock = ../yarn.lock;
    yarnNix = ./yarn.nix;
    dontStrip = true;
  };

  afg-submission-staticHTML = stdenv.mkDerivation {
    name = "swlkup-frontend-staticHTML";
    src = ./..;
    buildPhase = ''
      export PATH="${afg-submission-deps}/libexec/afg-escape-submission/node_modules/.bin/:$PATH"
      ln -s ${afg-submission-deps}/libexec/afg-escape-submission/node_modules ./node_modules
      next build
      next export
    '';
    installPhase = ''
      cp -r out $out
    '';
  };

in {
  inherit
    afg-submission-deps
    afg-submission-staticHTML;
}
