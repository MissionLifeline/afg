{ config, pkgs, nixpkgs, ... }:
{
  imports = [
    ./common.nix
  ];

  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    "backend.${config.networking.domain}"
    "submission.${config.networking.domain}"
  ];

  services.nginx.virtualHosts = {
    "backend.${config.networking.domain}" = {
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://10.0.0.2:4000";
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
    "submission.${config.networking.domain}" = {
      #default = true;  ## we would need cors settings supporting multiple hosts
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://10.0.0.2:3000";
        proxyWebsockets = true;
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
  };
}
