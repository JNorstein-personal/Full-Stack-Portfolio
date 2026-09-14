# Self-Hosted Linux Infrastructure, Networking & Homelab Administration

This project documents the design, deployment, administration, security hardening, and continued development of a self-hosted Linux homelab environment.

Unlike the application-development projects in this portfolio, this project focuses primarily on infrastructure engineering and systems administration: Linux server administration, networking, containerization, identity and access management, secure remote access, storage architecture, monitoring, backup and recovery, and operational troubleshooting.

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
- Cloudflare Tunnel and Cloudflare Access for deliberately published web services
- Keycloak for centralized identity and SSO/OIDC where supported

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
- Cloudflare Tunnel
- Tailscale
- UniFi Network
- CUPS printing services

The environment also supports development and future deployment of private game-server and web-service workloads.

## Networking

The network was deliberately restructured from an earlier configuration in which the server relied primarily on the household Wi-Fi network.

The current architecture uses:

- wired Ethernet as the server's primary network path;
- the NanoPi-managed private LAN as the trusted infrastructure network;
- household Wi-Fi as a fallback connection rather than the primary server route;
- the UniFi U6+ as the wireless access layer;
- Tailscale as the primary remote-access fabric.

A legacy standalone WireGuard deployment was retained until its remaining dependencies were audited and Tailscale was proven to replace its required administrative functions. It was then retired along with its associated firewall rules and routing configuration.

## Application Exposure Model

A major security-hardening objective is to distinguish public application access from direct infrastructure exposure.

Docker-hosted application backends such as:

- Keycloak
- Nextcloud
- Uptime Kuma
- Portainer

are now published only to the server's loopback interface rather than directly on every host network interface.

External browser access, where intentionally provided, is routed through Cloudflare Tunnel and protected with the appropriate application-level or Cloudflare Access controls.

Administrative access such as SSH and Cockpit is restricted to trusted private-network and Tailscale paths.

Legacy public Palworld firewall and WAN forwarding rules were removed. Future game-server deployment is intended to use private/Tailscale access rather than unrestricted public port forwarding.

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

## Security Practices

Security work includes:

- restrictive host firewall configuration
- separation of public services from administrative interfaces
- Tailscale-based private administration
- retirement of obsolete WireGuard infrastructure
- removal of stale WAN NAT and firewall rules
- loopback-only Docker backend bindings
- Cloudflare Access protection for selected web interfaces
- SSH public-key authentication
- service-specific identities and credentials
- centralized identity through Keycloak where appropriate
- deliberate review of IPv4, IPv6, Docker, and host-level exposure

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

This approach is especially important for networking, storage, authentication, firewall, and backup operations where an incorrect assumption can cause service loss or data loss.

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
- UniFi wireless infrastructure
- Tailscale
- WireGuard migration and retirement
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
- Linux filesystem administration
- ext4
- persistent mounts and filesystem UUIDs
- backup and disaster-recovery planning
- performance testing with iperf3
- service monitoring and troubleshooting
- technical documentation

## Current Project Status

The environment is operational and remains under active development.

Major completed work includes:

- current-state infrastructure inventory;
- verified backup and recovery baseline;
- external-storage migration and Nextcloud data reconciliation;
- repair of the server's wired private-LAN path;
- self-hosted UniFi deployment and U6+ adoption;
- migration to Tailscale as the primary remote-access mechanism;
- retirement of legacy WireGuard and obsolete public game-server exposure;
- restriction of major Docker application backends to loopback-only host bindings;
- completion of host, firewall, IPv6, and administrative-service exposure hardening;
- separation and rotation of Keycloak/PostgreSQL and Nextcloud/PostgreSQL credentials;
- administrator credential recovery and verified recovery-point replacement for Portainer and Uptime Kuma;
- hardening of Uptime Kuma persistent authentication and database storage;
- audit and cleanup of remaining host-level credential, authorization, and rollback material;
- retirement of the unused OpenVPN and NetworkManager OpenVPN stack after dependency and profile validation;
- cleanup of obsolete rollback artifacts associated with Cloudflare Tunnel and SSH while preserving verified recovery copies;
- hardening of credential-bearing dormant Palworld configuration and consolidation of redundant recovery archives while retaining verified recovery points;
- retirement of an obsolete Palworld backup job while preserving the current external save mirror; and
- final verification of active administrative, tunneling, monitoring, and remote-access services following cleanup.

Phase M — Credential Rotation and Legacy Cleanup is complete. Active credentials and authorization material have been reconciled, obsolete legacy access mechanisms and stale rollback artifacts have been retired, and retained recovery material has been verified and preserved outside live configuration paths.

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
- generated service databases or volumes.

Live operational configuration is reviewed and sanitized before any representative version is committed.

## Development and AI Assistance

This project is developed and maintained by Joshua Norstein.

AI-assisted tools may be used during development for tasks such as proofreading documentation, troubleshooting, configuration review, syntax and error checking, research assistance, and identifying potential problems. Infrastructure changes are evaluated, executed, tested, and maintained by the project author.

Project-specific source code, configuration work, architecture, and documentation are authored by the developer unless otherwise identified. Third-party and open-source software is used in accordance with its applicable licenses and attribution requirements.

## Third-Party Software

This project administers and integrates third-party software including Ubuntu, OpenWrt, Docker, Podman, Nextcloud, PostgreSQL, Keycloak, Portainer, Uptime Kuma, Tailscale, Cloudflare services, and Ubiquiti UniFi software.

These components are not authored by this project. This repository documents their configuration and integration within the homelab environment rather than redistributing their source code.
