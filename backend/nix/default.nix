{
  pkgs,
  buildMavenRepositoryFromLockFile,
  patchPublic ? null,
}: let
  inherit (pkgs) lib stdenv jdk maven leiningen;
  inherit (stdenv) mkDerivation;

  mavenRepository = buildMavenRepositoryFromLockFile {file = ./mvn2nix-lock.json;};

  version = "0.1.0";
  pname = "afg-backend";
  name = "${pname}-${version}";

  afg-backend-jar = mkDerivation rec {
    inherit version pname name;

    src = ./..;
    buildInputs = [jdk maven leiningen mavenRepository];
    patchPhase =
      if isNull patchPublic
      then ""
      else "cp -r ${patchPublic}/* resources/public/";
    buildPhase = ''
      echo "Building with maven repository ${mavenRepository}"
      export HOME=`pwd`
      mkdir .lein
      echo '{:user {:offline? true :local-repo "${mavenRepository}"}}' > ~/.lein/profiles.clj
      lein uberjar
    '';
    #doCheck = true;
    #checkPhase = ''
    #  lein test
    #'';

    installPhase = ''
      mkdir $out
      cp target/${name}-standalone.jar $out/${pname}-standalone.jar
    '';
  };

in
  lib.mergeAttrs
  (pkgs.writeScriptBin "${pname}" ''
    #!${pkgs.runtimeShell}

    export MALLOC_ARENA_MAX=2
    export JAVA_TOOL_OPTIONS='-Dclojure.tools.logging.factory=clojure.tools.logging.impl/slf4j-factory -Dorg.slf4j.simpleLogger.defaultLogLevel=warn -Dlog4j2.formatMsgNoLookups=true'
    ${jdk}/bin/java -jar ${afg-backend-jar}/${pname}-standalone.jar $@
  '')
  {
    inherit mavenRepository;
    jar = afg-backend-jar;
  }
