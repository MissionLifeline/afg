## start our nixos-system with rescue-system via kvm+vnc

```sh
dev> ssh -CL 5900:localhost:5900 server
server> apt install qemu
server> qemu-system-x86_64 -enable-kvm -hda /dev/nvme0n1 -m 2048 -vnc 127.0.0.1:0 -cdrom latest-nixos-minimal-x86_64-linux.iso -boot d

dev> nix run nixpkg#remmina  ## connect to localhost:0
```

## debug failed boot

```sh
journalctl --list-boots
journalctl -b $NUMBER
```
