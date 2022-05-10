{ config, pkgs, ... }:
{
  imports = [
    ../nginx/restic.nix
  ];

  services.restic.server = {
    enable = true;
    privateRepos = true;
    appendOnly = true;
  };

  ## TODO: /var/lib/restic/.htpasswd from sops
}
