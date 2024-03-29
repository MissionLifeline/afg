{
  config,
  pkgs,
  lib,
  ...
}: let
  cfg = config.services.afg-frontend;
in {
  options.services.afg-frontend = with lib; {
    enable = mkEnableOption "Afg Frontend";

    configName = mkOption {
      type = types.str;
      default = "test.edn";
    };
  };

  config = lib.mkIf cfg.enable {
    users.users."afg-frontend" = {
      group = "afg-frontend";
      isSystemUser = true;
      createHome = true;
      home = "/var/lib/afg-frontend";
      openssh.authorizedKeys.keys = config.users.users.root.openssh.authorizedKeys.keys;
      shell = "${pkgs.bash}/bin/bash";
    };
    users.groups."afg-frontend" = {};

    systemd.services.afg-frontend = {
      wantedBy = [ "multi-user.target" ];
      description = "Afg Submission Frontend";
      path = [ pkgs.afg-fullstack ];
      script = ''
        mkdir -p data
        for F in config keys seed ; do
          [ -e data/$F ] && rm data/$F
          ln -sf ${../../backend/data}/$F data/$F
        done
        chmod -R u+w data

        exec afg-backend
    '';
      serviceConfig = rec {
        User = "afg-frontend";
        Group = config.users.users.${User}.group;
        WorkingDirectory = config.users.users.${User}.home;
        Environment = "CONFIG=./data/config/${cfg.configName}";
        Restart = "on-failure";
        RestartSec = 5;
        AmbientCapabilities = "";
        CapabilityBoundingSet = "";
        RestrictAddressFamilies = "AF_INET AF_INET6";
        SystemCallArchitectures = "native";
        LockPersonality = true;
        RestrictNamespaces = true;
        RestrictRealtime = true;
        PrivateUsers = true;
        PrivateDevices = true;
        PrivateTmp = true;
        ProtectClock = true;
        ProtectControlGroups = true;
        ReadWritePaths = [ WorkingDirectory ];
        ProtectKernelLogs = true;
        ProtectKernelModules = true;
        ProtectKernelTunables = true;
        ProtectProc = "noaccess";
        ProtectHostname = true;
        ProtectSystem = "strict";
        UMask = "0066";
      };
    };
  };
}
