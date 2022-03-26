{
  config,
  pkgs,
  ...
}: {
  users.users."afg-frontend" = {
    group = "afg-frontend";
    isSystemUser = true;
    createHome = true;
    home = "/var/lib/afg-frontend";
    openssh.authorizedKeys.keys = config.users.users.root.openssh.authorizedKeys.keys;
    shell = "${pkgs.bash}/bin/bash";
  };
  users.groups."afg-frontend" = {};
}
