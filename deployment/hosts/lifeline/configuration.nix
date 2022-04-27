# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running ‘nixos-help’).

{ config, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the GRUB 2 boot loader.
  boot.loader.grub.enable = true;
  boot.loader.grub.version = 2;
  # boot.loader.grub.efiSupport = true;
  # boot.loader.grub.efiInstallAsRemovable = true;
  # boot.loader.efi.efiSysMountPoint = "/boot/efi";
  # Define on which hard drive you want to install Grub.
  boot.loader.grub.device = "/dev/nvme0n1"; # or "nodev" for efi only

  networking = {
    hostName = "lifeline";
    hostId = "deadbeef";
    useNetworkd = true;

    useDHCP = false;
    usePredictableInterfaceNames = false;
#   interfaces.eth0 = {
#     ipv4.addresses = [ {
#       address = "65.108.193.134";
#       prefixLength = 26;
#     } ];
#     ipv6.addresses = [ {
#       address = "2a01:4f9:1a:95a9::1";
#       prefixLength = 64;
#     } ];
#   };
#   defaultGateway = "65.108.193.129";
#   defaultGateway6 = {
#     address = "fe80::1";
#     interface = "eth0";
#   };
    nameservers = [ "9.9.9.9" "1.1.1.1" ];
    nat = {
      enable = true;
      enableIPv6 = true;
      externalInterface = "eth0";
      internalInterfaces = [ "uvm" ];
      forwardPorts = [ { destination = "10.0.0.2:22"; proto = "tcp"; sourcePort = 2222; }
                       { destination = "10.0.0.3:22"; proto = "tcp"; sourcePort = 2322; }
                       { destination = "10.0.0.3:1883"; proto = "tcp"; sourcePort = 1883; } ];
    };
  };
  systemd.network = {
    # Hetzner Uplink
    networks."00-eth0" = {
      matchConfig.Name = "eth0";
      addresses = [ {
        addressConfig.Address = "65.108.193.134/26";
      } {
        addressConfig.Address = "2a01:4f9:1a:95a9::1/64";
      } ];
      gateway = [ "65.108.193.129" "fe80::1" ];
    };
    # Create bridge
    netdevs."10-uvm".netdevConfig = {
      Kind = "bridge";
      Name = "uvm";
    };
    networks."10-uvm" = {
      matchConfig.Name = "uvm";
      networkConfig = {
        DHCPServer = true;
        IPv6SendRA = true;
      };
      addresses = [ {
        addressConfig.Address = "10.0.0.1/24";
      } {
        addressConfig.Address = "fd12:3456:789a::1/64";
      } ];
      ipv6Prefixes = [ {
        ipv6PrefixConfig.Prefix = "fd12:3456:789a::/64";
      } ];
    };
    # Attach MicroVM TAP interfaces to bridge
    networks."11-uvm" = {
      matchConfig.Name = "uvm-*";
      networkConfig.Bridge = "uvm";
    };
  };

  # Set your time zone.
  # time.timeZone = "Europe/Amsterdam";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkbOptions in tty.
  # };

  # Enable the X11 windowing system.
  # services.xserver.enable = true;


  

  # Configure keymap in X11
  # services.xserver.layout = "us";
  # services.xserver.xkbOptions = {
  #   "eurosign:e";
  #   "caps:escape" # map caps to escape.
  # };

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  # users.users.jane = {
  #   isNormalUser = true;
  #   extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
  # };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  #   wget
  #   firefox
  ];

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  services.openssh.enable = true;

  # Open ports in the firewall.
  networking.firewall.allowedTCPPorts = [ 22 2222 ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "22.05"; # Did you read the comment?

  users.users.root = {
    openssh.authorizedKeys.keys = [
      ## J03
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDW+YfsFtRz1h/0ubcKU+LyGfxH505yUkbWa5VtRFNWF2fjTAYGj6o5M4dt+fv1h370HXvvOBtt8sIlWQgMsD10+9mvjdXWhTcpnYPx4yWuyEERE1/1BhItrog6XJKAedbCDpQQ+POoewouiHWVAUfFByPj5RXuE8zKUeIEkGev/QKrKTLnTcS8zFs/yrokf1qYYR571B3U8IPDjpV/Y1GieG3MSNaefIMCwAAup1gPkUA0XZ4A1L7NdEiUEHlceKVu9eYiWUM+wDRunBXnLHubeGyP8KmBA7PNKgml3WWRNTZjqNQk4u9Bl+Qea5eCkD8KI257EqgXYXy0QBWNyF8X j03@l302"
    ];
  };

}

