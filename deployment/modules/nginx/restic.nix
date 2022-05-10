{ config, pkgs, nixpkgs, ... }:
{
  imports = [
    ./common.nix
  ];

  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    "restic.${config.networking.domain}"
  ];

  services.nginx.virtualHosts = {
    "restic.${config.networking.domain}" = {
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://localhost:8000";
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
  };
}
