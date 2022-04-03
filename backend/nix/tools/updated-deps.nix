{
  pkgs,
  mvn2nix,
}:
pkgs.writeScriptBin "updateBackendDeps" ''
  #!${pkgs.runtimeShell} -e
  cd backend
  ${pkgs.leiningen}/bin/lein pom

  echo 'When you changed dependencies, you should run nvd-check'

  echo "Generating mvn2nix-lock.json, please wait…"
  ${mvn2nix}/bin/mvn2nix --repositories https://clojars.org/repo https://repo.maven.apache.org/maven2 > "nix/mvn2nix-lock.json"
''
