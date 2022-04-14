{ config, ... }:
{
  microvm = {
    hypervisor = "qemu";
    mem = 8192;
    vcpu = 12;
    interfaces = [ {
      type = "tap";
      # max 15 chars
      id = "uvm-afg-staging";
      mac = "00:02:00:01:02:03";
    } ];
    shares = [ {
      proto = "9p";
      tag = "ro-store";
      source = "/nix/store";
      mountPoint = "/nix/.ro-store";
      socket = "ro-store.sock";
    } ];
    volumes = [ {
      image = "nix-store-overlay.img";
      mountPoint = config.microvm.writableStoreOverlay;
      size = 8192;
    } {
      image = "etc.img";
      mountPoint = "/etc";
      size = 64;
    } {
      image = "var.img";
      mountPoint = "/var";
      size = 8192;
    } {
      image = "home.img";
      mountPoint = "/home";
      size = 8192;
    } ];
  };

  networking = {
    hostName = "afg-staging";
    firewall.enable = false;
    interfaces.eth0 = {
      ipv4.addresses = [ {
        address = "10.0.0.2";
        prefixLength = 24;
      } ];
      ipv6.addresses = [ {
        address = "fd12:3456:789a::2";
        prefixLength = 64;
      } ];
    };
    defaultGateway = "10.0.0.1";
    defaultGateway6 = {
      address = "fd12:3456:789a::1";
      interface = "eth0";
    };
    nameservers = [ "9.9.9.9" ];
  };
  services.openssh = {
    enable = true;
  };
  users.users.root.openssh.authorizedKeys.keys = [
    # j03
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDW+YfsFtRz1h/0ubcKU+LyGfxH505yUkbWa5VtRFNWF2fjTAYGj6o5M4dt+fv1h370HXvvOBtt8sIlWQgMsD10+9mvjdXWhTcpnYPx4yWuyEERE1/1BhItrog6XJKAedbCDpQQ+POoewouiHWVAUfFByPj5RXuE8zKUeIEkGev/QKrKTLnTcS8zFs/yrokf1qYYR571B3U8IPDjpV/Y1GieG3MSNaefIMCwAAup1gPkUA0XZ4A1L7NdEiUEHlceKVu9eYiWUM+wDRunBXnLHubeGyP8KmBA7PNKgml3WWRNTZjqNQk4u9Bl+Qea5eCkD8KI257EqgXYXy0QBWNyF8X j03@l302"
    # astro
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGJJTSJdpDh82486uPiMhhyhnci4tScp5uUe7156MBC8 astro"
  ];
}
