# Self-Hosted Linux Infrastructure, Networking & Homelab Administration

This project documents the design, deployment, administration, security hardening, and continued development of a self-hosted Linux homelab environment.

Unlike the application-development projects in this portfolio, this project focuses primarily on infrastructure engineering and systems administration: Linux server administration, networking, containerization, identity and access management, secure remote access, storage architecture, monitoring, backup and recovery, game-server hosting, and operational troubleshooting.

The environment is actively used rather than existing solely as a demonstration lab. Changes are therefore introduced conservatively, with configuration inspection, rollback planning, testing, and post-change verification.

## Architecture Overview

The environment currently centers on:

- GMKtec NucBox M6 Ultra running Ubuntu 26.04 LTS
- NanoPi R4S running OpenWrt/FriendlyWrt as the private router, firewall, DHCP/DNS authority, and LAN gateway
- TP-Link unmanaged Ethernet switch
- Ubiquiti UniFi U6+ wireless access point
- Self-hosted UniFi OS Server / UniFi Network management
- Docker and Docker Compose application workloads
- Podman for the UniFi OS Server runtime
- External ext4 storage for persistent bulk service data
- Tailscale for private remote administration
- GNOME Remote Login / Desktop Sharing for private graphical administration over Tailscale
- Cloudflare Tunnel and Cloudflare Access for deliberately published web services
- Keycloak for centralized identity and SSO/OIDC where supported
- A production Palworld dedicated-server workload with narrowly scoped public gameplay exposure and private administrative interfaces

The NanoPi remains the routing and firewall authority. The UniFi environment manages wireless infrastructure but does not replace the existing router.

## Hosted and Managed Services

Current or actively maintained services include:

- Nextcloud
- PostgreSQL
- Keycloak
- Uptime Kuma
- Portainer
- Cockpit
- OpenSSH
- GNOME Remote Desktop / Remote Login
- Cloudflare Tunnel
- Tailscale
- UniFi Network
- CUPS printing services
- Palworld dedicated server

The environment also supports continuing development and deployment of additional private and public web-service, application, and game-server workloads where appropriate.

## Networking

The network was deliberately restructured from an earlier configuration in which the server relied primarily on the household Wi-Fi network.

The current architecture uses:

- wired Ethernet as the server's primary network path;
- the NanoPi-managed private LAN as the trusted infrastructure network;
- household Wi-Fi as a fallback connection rather than the primary server route;
- the UniFi U6+ as the wireless access layer;
- Tailscale as the primary private remote-access fabric;
- OpenWrt/FriendlyWrt and host-firewall policy to control deliberately exposed public services.

A legacy standalone WireGuard deployment was retained until its remaining dependencies were audited and Tailscale was proven to replace its required administrative functions. It was then retired along with its associated firewall rules and routing configuration.

## Remote Administration

Private administration is separated from public application access.

The environment supports:

- SSH over trusted LAN and Tailscale paths;
- Cockpit over trusted administrative paths;
- GNOME Remote Login and Desktop Sharing over Tailscale for graphical administration from the trusted Windows workstation;
- firewall restrictions that prevent the RDP listeners from becoming general public services.

GNOME Remote Desktop was configured and tested as an unattended remote-management path. Remote login and desktop sharing were validated across reboot, including successful reconnection to the Ubuntu graphical environment through the server's Tailscale address.

The relevant RDP listeners use the GNOME Remote Desktop service rather than a separately exposed public RDP gateway. Host-firewall rules limit access to the trusted Tailscale path/client rather than opening the service broadly to the Internet.

## Application Exposure Model

A major security-hardening objective is to distinguish intentionally public application traffic from administrative or backend exposure.

Docker-hosted application backends such as:

- Keycloak
- Nextcloud
- Uptime Kuma
- Portainer

are published only to the server's loopback interface rather than directly on every host network interface where the deployment architecture permits it.

External browser access, where intentionally provided, is routed through Cloudflare Tunnel and protected with the appropriate application-level or Cloudflare Access controls.

Administrative access such as SSH, Cockpit, and GNOME Remote Desktop remains restricted to trusted private-network and/or Tailscale paths.

Game-server traffic is handled separately because real-time game protocols may require direct public transport rather than an HTTP reverse-proxy path. The current Palworld deployment therefore uses a deliberately narrow public-exposure model:

- **UDP 8211** is intentionally exposed for public Palworld gameplay;
- public traffic follows the ISP → NanoPi/OpenWrt → Ubuntu host path;
- the Ubuntu firewall permits the required gameplay port while avoiding unnecessary additional exposure;
- the Palworld REST interface on **TCP 8212** remains bound to `127.0.0.1` and is not a public management interface;
- RCON remains disabled;
- redundant legacy/LAN-specific firewall rules were removed after the final exposure model was verified.

This replaces the earlier plan to keep all future game-server traffic private through Tailscale. The current design instead applies least exposure: publish only the gameplay transport that actually requires public reachability while retaining management and administrative surfaces on private or loopback-only paths.

## Palworld Dedicated Server

The Palworld workload was rebuilt and production-certified in November 2026.

The final verified state includes:

- Docker-based dedicated-server deployment;
- container restart policy configured as `unless-stopped`;
- public gameplay service on UDP 8211;
- REST management/health interface restricted to localhost on TCP 8212;
- public DNS through `palworld.loreweavercreations.com`;
- synchronized dynamic DNS;
- successful external connectivity validation from outside the home LAN;
- custom world/server settings installed and verified;
- automated backup scheduling enabled and active;
- REST health verification returning a valid server response;
- RCON disabled;
- firewall cleanup after the final production path was proven.

The deployment was subjected to a final Ubuntu production-certification sequence and reached a PASS state after public connectivity, configuration, DDNS, service health, backups, and firewall behavior were verified.

## Storage and Recovery

The server's storage architecture was rebuilt to eliminate an earlier accidental dependency on a directory that had been treated as though it were an external mount point.

The external 2 TB data disk now uses:

- Linux-native ext4
- a persistent filesystem UUID
- a deliberate `/srv/loreweaver` hierarchy
- service-specific ownership and permissions

Historical data was staged, restored, and verified before the original filesystem was replaced.

The recovery process included:

- pre-migration staging
- SHA-256 integrity verification
- synchronized application/database recovery points
- encrypted recovery archives
- configuration backups
- whole-set checksum validation
- preservation of rollback copies before consequential changes

The external storage volume is treated as primary storage, not as an independent backup.

Operational workloads such as the Palworld server use their own application-appropriate backup procedures in addition to the broader infrastructure recovery model.

## Security Practices

Security work includes:

- restrictive host firewall configuration
- separation of public services from administrative interfaces
- Tailscale-based private administration
- private GNOME Remote Desktop access over Tailscale
- retirement of obsolete WireGuard infrastructure
- removal of stale or redundant WAN/NAT/firewall rules
- deliberate least-exposure public game-server forwarding
- loopback-only backend and management bindings where appropriate
- Cloudflare Access protection for selected web interfaces
- SSH public-key authentication
- service-specific identities and credentials
- centralized identity through Keycloak where appropriate
- deliberate review of IPv4, IPv6, Docker, host-level, and router-level exposure

The presence of an intentionally public service does not imply broad host exposure. Public ports are treated as explicit exceptions that must be justified, narrowly scoped, tested from outside the LAN, and kept separate from administrative interfaces.

Machine credentials, API tokens, database passwords, cryptographic keys, tunnel credentials, and other secrets remain unique and are not committed to this repository.

## Operational Method

Infrastructure changes are normally performed using the following sequence:

1. Inspect the current runtime state.
2. Identify dependencies before modifying configuration.
3. Create a rollback copy before consequential changes.
4. Change only the minimum required configuration.
5. Validate syntax or configuration structure before deployment.
6. Apply the change.
7. Verify local service health.
8. Verify network reachability and intended access restrictions.
9. Perform restart or reboot persistence testing where relevant.
10. Update project documentation after the final architecture is established.

For public-facing game or web services, validation also includes testing from a genuinely external network rather than relying only on same-LAN or hairpin behavior.

This approach is especially important for networking, storage, authentication, firewall, remote-access, and backup operations where an incorrect assumption can cause service loss, access loss, security exposure, or data loss.

## Technologies and Skills Demonstrated

This project demonstrates practical experience with:

- Ubuntu Linux administration
- OpenWrt/FriendlyWrt
- Docker and Docker Compose
- Podman
- Ethernet and Wi-Fi networking
- DHCP and DNS
- routing and interface metrics
- IPv4 and IPv6
- UFW and firewall policy
- NAT and port forwarding
- dynamic DNS
- UniFi wireless infrastructure
- Tailscale
- WireGuard migration and retirement
- GNOME Remote Desktop / Remote Login
- RDP over private overlay networking
- Cloudflare Tunnel
- Cloudflare Access
- TLS/HTTPS
- Keycloak and OIDC
- PostgreSQL
- Nextcloud
- Portainer
- Uptime Kuma
- SSH
- CUPS
- Palworld dedicated-server administration
- public game-server deployment and validation
- Linux filesystem administration
- ext4
- persistent mounts and filesystem UUIDs
- backup and disaster-recovery planning
- scheduled service/application backups
- performance testing with iperf3
- service monitoring and troubleshooting
- technical documentation

## Current Project Status

The environment is operational and remains under active development.

Infrastructure audit, recovery, storage migration, wired-network repair, self-hosted UniFi deployment, administrative-access hardening, credential rotation, secret cleanup, and legacy-service cleanup are complete through Phase M.

Additional completed operational work includes:

- retirement of the earlier public Palworld exposure model and creation of a rebuilt, production-certified Palworld deployment;
- deliberate public exposure of only UDP 8211 for gameplay while keeping the REST interface private on localhost;
- dynamic-DNS verification and automated Palworld backup scheduling;
- custom Palworld world/server settings with post-change validation;
- GNOME Remote Login and Desktop Sharing over Tailscale;
- successful unattended remote GUI reconnection after reboot from the trusted Windows workstation.

Phase N remains in progress and focuses on final service deployment and the six-user authorization model. A dedicated Keycloak application realm (`loreweaver`) has been established for human-facing services. Five named trusted users have been provisioned with individual credentials and a first-login password-update requirement; the deliberately restricted shared Guest identity remains credential-free until explicitly activated.

Current Nextcloud identity-integration work has:

- established and verified the six-user Keycloak authorization baseline;
- created verified recovery points after credential provisioning;
- audited Keycloak's OIDC client and scope baseline;
- normalized Nextcloud's reverse-proxy configuration for its public HTTPS URL;
- retained Cloudflare Access as the current outer access gate;
- installed and enabled Nextcloud `user_oidc` 8.11.0;
- verified that no Nextcloud OIDC provider or Keycloak `nextcloud` client has yet been configured.

The exact current pause point is immediately before the read-only Nextcloud/Keycloak OIDC contract preflight. The next step is to validate the installed callback route, Keycloak authorization-code capabilities, existing authorization boundaries, and absence of conflicting client/provider configuration before creating the `nextcloud` Keycloak client.

Automatic bidirectional Windows/Nextcloud file synchronization has been discussed as a future workflow but is not represented here as completed infrastructure.

## Repository Scope and Secret Handling

This repository contains project documentation and may include sanitized configuration examples suitable for demonstrating infrastructure design and administration.

It does **not** contain:

- real passwords;
- API or authentication tokens;
- private keys;
- tunnel credentials;
- database credentials;
- live `.env` files;
- database dumps;
- application user data;
- recovery archives;
- private server backups;
- generated service databases or volumes;
- real private-network trust policy values where publication would be inappropriate.

Live operational configuration is reviewed and sanitized before any representative version is committed.

## Development and AI Assistance

This project is developed and maintained by Joshua Norstein.

AI-assisted tools may be used during development for tasks such as proofreading documentation, troubleshooting, configuration review, syntax and error checking, research assistance, and identifying potential problems. Infrastructure changes are evaluated, executed, tested, and maintained by the project author.

Project-specific source code, configuration work, architecture, and documentation are authored by the developer unless otherwise identified. Third-party and open-source software is used in accordance with its applicable licenses and attribution requirements.

## Third-Party Software

This project administers and integrates third-party software including Ubuntu, OpenWrt, Docker, Podman, Nextcloud, PostgreSQL, Keycloak, Portainer, Uptime Kuma, Tailscale, Cloudflare services, GNOME Remote Desktop, Ubiquiti UniFi software, and the Palworld dedicated server.

Nextcloud `user_oidc` 8.11.0 is used as the OpenID Connect user backend for the planned Keycloak integration. It is third-party software licensed under AGPL-3.0-or-later and is not authored by this project.

The project does not claim authorship of the third-party applications it operates or integrates. This repository documents their configuration, administration, networking, deployment, and integration within the homelab environment rather than redistributing their source code.
