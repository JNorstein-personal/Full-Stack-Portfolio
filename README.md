# Self-Hosted Linux Infrastructure, Networking & Homelab Administration

This project documents the design, deployment, administration, security hardening, recovery, and continued development of a self-hosted Linux homelab environment.

Unlike the application-development projects in this portfolio, this project focuses primarily on infrastructure engineering and systems administration: Linux server administration, networking, containerization, identity and access management, secure remote access, storage architecture, wireless infrastructure, monitoring, printing/scanning, backup and recovery, and operational troubleshooting.

The environment is actively used rather than existing solely as a demonstration lab. Changes are therefore introduced conservatively, with configuration inspection, rollback planning, testing, and post-change verification.

## Architecture Overview

The environment centers on:

* GMKtec NucBox M6 Ultra running Ubuntu 26.04 LTS
* NanoPi R4S running OpenWrt as the private router, firewall, DHCP/DNS authority, NAT gateway, and LAN gateway
* TP-Link unmanaged Ethernet switch
* Ubiquiti UniFi U6+ wireless access point
* self-hosted UniFi OS Server / UniFi Network management
* Docker and Docker Compose application workloads
* Podman for the UniFi OS Server runtime
* external ext4 storage for persistent bulk service data
* Tailscale for private remote administration
* Cloudflare Tunnel and Cloudflare Access for deliberately published web services
* Keycloak for centralized application identity and SSO/OIDC where supported
* CUPS and SANE/AirScan for centralized printer/scanner infrastructure

The NanoPi remains the routing and firewall authority. The UniFi environment manages wireless infrastructure but does not replace the existing router.

## Browser-First User Architecture

A core design principle is now:

**Browser-first for end users; native protocols for administration.**

The homelab supports six human identities: one infrastructure administrator, four additional trusted users, and one deliberately restricted Guest identity.

Most users are nontechnical end users. Wherever technically practical, remotely accessible applications intended for them are therefore designed to be used through authenticated browser interfaces rather than requiring VPN configuration, command-line tools, native network protocols, IP addresses, ports, or local driver installation.

The intended user experience is:

```text
User
  ↓
Authenticated Loreweaver web access
  ↓
Authorized browser application
  ↓
Internal service/backend
```

Examples include:

* Nextcloud
* planned browser-based printing
* planned browser-based scanning
* private wiki content
* chatbot/assistant services
* private website tools
* selected wedding-administration tools
* future shared applications

Administrative protocols such as SSH, Cockpit, Portainer, native IPP, direct service ports, and recovery interfaces remain private administrator tools.

## Hosted and Managed Services

Current or actively maintained services include:

* Nextcloud
* PostgreSQL
* Keycloak
* Uptime Kuma
* Portainer
* Cockpit
* OpenSSH
* Cloudflare Tunnel
* Tailscale
* UniFi Network
* CUPS
* SANE / sane-airscan
* Brother MFC-J1205W network printing and scanning

The environment also supports development and future deployment of public websites, private browser applications, game servers, and other self-hosted workloads.

## Networking

The network was deliberately restructured from an earlier configuration in which the server relied primarily on the household Wi-Fi network.

The current architecture uses:

* wired Ethernet as the server's primary network path;
* the NanoPi-managed private LAN as the trusted infrastructure network;
* household Wi-Fi as a fallback connection rather than the primary server route;
* the UniFi U6+ as the managed wireless access layer;
* Tailscale as the primary remote-administration fabric.

A legacy standalone WireGuard deployment was retained only until its dependencies were audited and Tailscale was proven to replace its required administrative functions. It was then retired along with obsolete public-service firewall and routing configuration.

## Wireless and IoT Design

The Ubiquiti U6+ is managed through a self-hosted UniFi Network environment running on the GMKtec.

The long-term human Wi-Fi model is designed around independently revocable credentials rather than sharing one universal wireless password among all users. Wi-Fi credentials remain separate from Keycloak/application passwords.

A dedicated `Loreweaver IOT` wireless network is operational for the Brother multifunction printer and future IoT devices.

The IoT network currently shares the private LAN while application deployment is completed. Dedicated VLAN/firewall segmentation remains a future hardening option.

## Identity and Access Management

Keycloak provides the centralized application identity layer where supported.

Two realms have distinct responsibilities:

* `master` — Keycloak administration
* `loreweaver` — human application identities and service OIDC

The application realm contains:

* five named trusted user identities;
* one restricted Guest identity.

Trusted users are grouped separately from Guest so applications can enforce service-specific authorization.

Infrastructure administration remains administrator-only.

Machine credentials, database passwords, API tokens, client secrets, cryptographic keys, and tunnel credentials remain separate from human application credentials.

## Nextcloud and OIDC

Nextcloud is integrated with the production Keycloak `loreweaver` realm through the third-party `user_oidc` application.

The completed design includes:

* centralized Keycloak authentication;
* trusted-user authorization;
* deliberate Guest exclusion;
* Cloudflare Access as an outer web-access layer;
* loopback-only backend publication;
* a retained local Nextcloud administrator account for break-glass recovery;
* a direct recovery login path independent of external OIDC.

The implementation was developed incrementally with pre-change recovery points, client/scope inspection, reverse-proxy validation, controlled secret handling, user-by-user testing, logout/recovery verification, and a final post-OIDC recovery boundary.

## Application Exposure Model

A major security objective is to distinguish human-facing web access from direct infrastructure exposure.

Docker-hosted application backends such as:

* Keycloak
* Nextcloud
* Uptime Kuma
* Portainer

use loopback-only host bindings where appropriate rather than publishing indiscriminately on every host interface.

External browser access, where intentionally provided, is routed through Cloudflare Tunnel and protected using the selected Cloudflare Access and application-level authentication controls.

Administrative services such as SSH, Cockpit, UniFi management, and Portainer remain private and restricted to trusted network/Tailscale paths.

Legacy public Palworld firewall and WAN-forwarding rules were removed. Future game-server deployment is intended to prefer private/Tailscale access rather than unrestricted public port forwarding.

## Printing and Scanning

A Brother MFC-J1205W is connected to the dedicated IoT wireless network with a stable DHCP reservation.

The GMKtec acts as the print/scan intermediary.

### Printing

CUPS has been configured with one authoritative Brother queue.

Work completed includes:

* Brother Linux driver installation
* successful local physical test printing
* stable network printer addressing
* removal of an automatically duplicated cups-browsed queue
* default-printer configuration
* explicit CUPS listener configuration
* private-LAN firewall access
* administrator Tailscale access
* successful remote TCP/HTTP validation over Tailscale

Native IPP remains available as an administrator/power-user path.

The production user experience is being revised toward browser-based printing so ordinary users do not need to install network printers or understand CUPS/IPP configuration.

### Scanning

The Brother scanner is available through both the Brother Linux backend and driverless eSCL/AirScan.

A real local AirScan scan has been successfully completed and validated.

Raw network SANE (`saned`) remains disabled.

The planned production approach is a browser-based scanner interface layered over the existing SANE/AirScan backend rather than exposing the raw scanner protocol directly.

Browser printing and scanning are the current active deployment workstream.

## Storage and Recovery

The server's storage architecture was rebuilt to eliminate an earlier accidental dependency on a directory that had been treated as though it were an external mount point.

The external 2 TB data disk now uses:

* Linux-native ext4
* a persistent filesystem UUID
* a deliberate `/srv/loreweaver` hierarchy
* service-specific persistent storage paths

Historical data was staged, restored, and verified before the original filesystem was replaced.

The recovery process included:

* pre-migration staging
* SHA-256 integrity verification
* synchronized application/database recovery points
* protected recovery archives
* configuration backups
* whole-set checksum validation
* preservation of rollback copies before consequential changes

The external storage volume is treated as primary storage, not as an independent backup.

Independent/offsite backup and recurring restoration testing remain required operational work.

## Security Practices

Security work includes:

* restrictive host firewall defaults
* separation of public services from administrative interfaces
* Tailscale-based private administration
* retirement of obsolete standalone WireGuard infrastructure
* removal of stale WAN NAT and firewall rules
* loopback-only Docker backend bindings
* Cloudflare Access protection for selected web interfaces
* SSH public-key authentication
* service-specific identities and credentials
* centralized application identity through Keycloak
* break-glass recovery paths
* deliberate IPv4, IPv6, Docker, Podman, UFW, and Tailscale exposure review
* avoidance of raw infrastructure protocols as ordinary remote user interfaces

Machine credentials, API tokens, database passwords, cryptographic keys, tunnel credentials, recovery archives, and other secrets are not committed to this repository.

## Operational Method

Infrastructure changes normally follow this sequence:

1. Inspect the current runtime state.
2. Identify dependencies before modifying configuration.
3. Create rollback material before consequential changes.
4. Change only the minimum required configuration.
5. Validate syntax or configuration structure before deployment.
6. Apply the change.
7. Verify local service health.
8. Verify network reachability and intended access restrictions.
9. Verify unintended interfaces and access paths remain blocked.
10. Perform restart or reboot persistence testing where relevant.
11. Update documentation after the final architecture is established.

This method is especially important for networking, storage, identity, firewall, database, and backup operations where an incorrect assumption can cause service or data loss.

## Technologies and Skills Demonstrated

This project demonstrates practical experience with:

* Ubuntu Linux administration
* OpenWrt
* Docker and Docker Compose
* Podman
* Ethernet and Wi-Fi networking
* DHCP and DNS
* routing and interface metrics
* IPv4 and IPv6
* UFW and firewall policy
* NAT and port forwarding
* UniFi wireless infrastructure
* Tailscale
* WireGuard migration and retirement
* Cloudflare Tunnel
* Cloudflare Access
* TLS/HTTPS
* Keycloak
* OpenID Connect
* PostgreSQL
* Nextcloud
* Portainer
* Uptime Kuma
* SSH
* CUPS / IPP
* SANE / AirScan / eSCL
* Linux filesystem administration
* ext4
* persistent mounts and filesystem UUIDs
* backup and disaster-recovery planning
* performance and connectivity testing
* service monitoring
* troubleshooting
* technical documentation
* change control

## Current Project Status

The environment is operational and remains under active development.

Infrastructure inventory, recovery, storage migration, wired-network repair, self-hosted UniFi deployment, administrative-access hardening, credential rotation, secret cleanup, legacy-service cleanup, and the major Phase M security work are complete.

Phase N is now in progress.

### Completed Phase N identity work

The six-user authorization model and Nextcloud OIDC integration are complete.

The current production identity architecture includes:

* the dedicated Keycloak `loreweaver` application realm;
* five trusted user identities;
* a restricted Guest identity;
* trusted-user group authorization;
* Nextcloud `user_oidc`;
* Cloudflare Access as an outer gate;
* a validated direct local-admin recovery path;
* a verified post-OIDC recovery point.

### Plex

Plex was brought through a successful first-launch validation using the official Docker image, pinned image identity, persistent configuration, GPU access, and protected recovery material.

It remains stopped, unclaimed, and deliberately deferred because it is currently lower priority than production user services.

### Print/Scan

The Brother MFC-J1205W is operational on the IoT wireless network.

Current completed work includes:

* stable DHCP addressing;
* successful local printing;
* a single authoritative CUPS queue;
* successful local AirScan/eSCL scanning;
* restricted CUPS LAN/Tailscale access;
* remote administrator IPP transport validation;
* raw `saned` remaining disabled.

The next implementation target is authenticated **browser-based Print/Scan access** for ordinary users.

The same browser-first principle will guide future remote human-facing applications wherever practical.

## Remaining Major Work

Major remaining items include:

* browser-based authenticated printing;
* browser-based authenticated scanning;
* integration of human-facing services into a coherent authenticated portal/navigation experience;
* six independently revocable human Wi-Fi credentials;
* optional IoT VLAN segmentation;
* final storage-permission hardening;
* Loreweaver Creations production web infrastructure;
* Norstein-Dashiell wedding-site deployment;
* wiki/chatbot/editor services;
* monitoring completion;
* routine backup schedules;
* independent/offsite backups;
* recurring restoration testing;
* final security and IPv6 exposure review;
* final architecture diagrams and portfolio documentation.

## Repository Scope and Secret Handling

This repository contains project documentation and may include sanitized configuration examples suitable for demonstrating infrastructure design and administration.

It does **not** contain:

* real passwords
* API or authentication tokens
* private keys
* tunnel credentials
* database credentials
* live `.env` files
* database dumps
* application user data
* recovery archives
* private server backups
* generated service databases or volumes
* Tailscale state
* live OAuth/OIDC client secrets

Live operational configuration is reviewed and sanitized before any representative version is committed.

## Development and AI Assistance

This project is developed and maintained by Joshua Norstein.

AI-assisted tools may be used during development for tasks such as proofreading documentation, troubleshooting, configuration review, syntax and error checking, research assistance, and identifying potential problems.

Infrastructure architecture and configuration decisions are evaluated by the project author. Operational changes are executed, tested, verified, and maintained by the project author.

Project-specific source code, configuration work, architecture, and documentation are authored by the developer unless otherwise identified. Third-party and open-source software is used in accordance with its applicable licenses and attribution requirements.

## Third-Party Software

This project administers and integrates third-party and open-source software including:

* Ubuntu
* OpenWrt
* Docker
* Docker Compose
* Podman
* Nextcloud
* PostgreSQL
* Keycloak
* Portainer
* Uptime Kuma
* Tailscale
* Cloudflare services
* Ubiquiti UniFi software
* CUPS
* SANE / sane-airscan
* Brother Linux printer/scanner software

Nextcloud `user_oidc` is used as the OpenID Connect user backend for the Keycloak integration. It is third-party software licensed under AGPL-3.0-or-later and is not authored by this project.

Browser-based printing and scanning frontends are currently being evaluated and will be documented here once their final implementations are selected and deployed.

These third-party components are not authored by this project. This repository documents their configuration and integration within the homelab environment rather than redistributing their source code.
