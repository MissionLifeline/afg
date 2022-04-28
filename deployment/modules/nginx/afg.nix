{ config, pkgs, nixpkgs, ... }:
{
  imports = [
    ./common.nix
  ];

  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    "staging.${config.networking.domain}"
  ];

  services.nginx.virtualHosts = {
    "staging.${config.networking.domain}" = {
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://10.0.0.2:4000";
        extraConfig = "proxy_pass_header Authorization;";
      };
    };

    "mqtt.${config.networking.domain}" = {
      forceSSL = true;
      enableACME = true;
      locations."/" = {
        proxyPass = "http://10.0.0.3:8080";
      };
    };
  };
}
