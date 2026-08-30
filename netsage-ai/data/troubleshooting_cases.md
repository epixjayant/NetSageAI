# NetSage AI — Troubleshooting Cases

> A curated collection of Cisco-style network troubleshooting scenarios used to evaluate the NetSage AI Copilot.

## Cases

---
### IP-001 — Wrong IP Address

**Domain:** IP Addressing  
**Severity:** High

**User Symptom**

> PC-01 cannot communicate with other devices on its local network.

**Network Context**

PC-01 is intended to belong to the `192.168.10.0/24` network.

Expected configuration:

```text
IP Address:      192.168.10.20
Subnet Mask:     255.255.255.0
Default Gateway: 192.168.10.1
```

**Fault**

PC-01 has been configured with:

```text
IP Address:      192.168.20.20
Subnet Mask:     255.255.255.0
Default Gateway: 192.168.10.1
```

The device is therefore configured for the wrong IP network.

**Likely Root Cause**

Incorrect IP address assigned to PC-01.

**Useful Evidence**

```text
PC-01 IP: 192.168.20.20
Expected network: 192.168.10.0/24
Gateway: 192.168.10.1
```

**Recommended Investigation**

Check the end-device IP configuration and compare it with the intended subnet.

**Recommended Fix**

Configure PC-01 with an IP address belonging to the intended network, such as:

```text
IP Address:      192.168.10.20
Subnet Mask:     255.255.255.0
Default Gateway: 192.168.10.1
```

**Verification**

Confirm that PC-01 can communicate with its local gateway and intended local-network devices.

---

### IP-002 — Wrong Subnet Mask

**Domain:** IP Addressing  
**Severity:** High

**User Symptom**

> PC-01 can communicate with some devices but cannot reliably reach devices that should belong to the same network.

**Network Context**

The intended network is:

```text
192.168.10.0/24
```

PC-01 should use:

```text
IP Address:  192.168.10.20
Subnet Mask: 255.255.255.0
```

**Fault**

PC-01 has:

```text
IP Address:  192.168.10.20
Subnet Mask: 255.255.0.0
```

The subnet mask is broader than intended and causes PC-01 to interpret network boundaries incorrectly.

**Likely Root Cause**

Incorrect subnet mask configured on PC-01.

**Useful Evidence**

```text
IP Address:  192.168.10.20
Configured Mask: 255.255.0.0
Expected Mask:   255.255.255.0
```

**Recommended Investigation**

Inspect the end-device IP configuration and compare the subnet mask with the intended network design.

**Recommended Fix**

Configure:

```text
Subnet Mask: 255.255.255.0
```

**Verification**

Confirm that PC-01 correctly identifies local and remote destinations and can reach the intended devices.

---

### IP-003 — Wrong Default Gateway

**Domain:** IP Addressing  
**Severity:** High

**User Symptom**

> PC-01 can communicate with devices on its local subnet but cannot reach devices on other networks.

**Network Context**

PC-01 belongs to:

```text
Network:  192.168.10.0/24
IP:       192.168.10.20
```

The intended router interface is:

```text
Gateway: 192.168.10.1
```

**Fault**

PC-01 has been configured with:

```text
Default Gateway: 192.168.20.1
```

The configured gateway is not the intended gateway for PC-01's network.

**Likely Root Cause**

Incorrect default gateway configuration.

**Useful Evidence**

```text
PC IP:             192.168.10.20
Subnet Mask:       255.255.255.0
Configured Gateway: 192.168.20.1
Expected Gateway:   192.168.10.1
```

**Recommended Investigation**

Check the PC's IP configuration and determine whether the configured gateway matches the intended local network.

**Recommended Fix**

Configure:

```text
Default Gateway: 192.168.10.1
```

**Verification**

Confirm that PC-01 can reach its gateway and then communicate with a destination on another network.

---

### IP-004 — Duplicate IP Address

**Domain:** IP Addressing  
**Severity:** Critical

**User Symptom**

> PC-01 intermittently loses connectivity, or communication with another device using the same IP address is inconsistent.

**Network Context**

The network contains:

```text
PC-01
IP: 192.168.10.20

PC-02
IP: 192.168.10.20
```

Both devices are configured with the same IPv4 address.

**Fault**

Two devices have been assigned the same IP address.

**Likely Root Cause**

Duplicate IP address configuration.

**Useful Evidence**

```text
PC-01: 192.168.10.20
PC-02: 192.168.10.20
```

The same IP address is assigned to multiple devices.

**Recommended Investigation**

Compare the IP configuration of devices experiencing intermittent connectivity and identify whether the same address is assigned more than once.

**Recommended Fix**

Assign a unique IP address to one of the devices while maintaining the intended subnet.

For example:

```text
PC-01: 192.168.10.20
PC-02: 192.168.10.21
```

**Verification**

Confirm that both devices have unique addresses and can communicate normally.

---
---

### CON-001 — Interface Administratively Down

**Domain:** Interfaces & Connectivity  
**Severity:** High

**User Symptom**

> PC-01 cannot communicate with the network.

**Network Context**

PC-01 is connected to switch SW-01, which connects to router R1.

The relevant router interface should provide connectivity for the local network.

**Fault**

The router interface has been administratively shut down.

**Likely Root Cause**

The interface is configured with `shutdown`.

**Useful Evidence**

```text
show ip interface brief
```

Expected evidence:

```text
GigabitEthernet0/0    192.168.10.1    administratively down    down
```

**Recommended Investigation**

Check the interface status using:

```text
show ip interface brief
```

If necessary, inspect the interface configuration.

**Recommended Fix**

Enter the affected interface configuration mode and enable the interface:

```text
no shutdown
```

**Verification**

Confirm that the interface becomes operational and that PC-01 can reach its gateway.

---

### CON-002 — Physical/Link Connectivity Failure

**Domain:** Interfaces & Connectivity  
**Severity:** High

**User Symptom**

> PC-01 cannot reach the network even though its IP configuration appears correct.

**Network Context**

PC-01 is connected to SW-01 through a physical/link connection.

The device should have an active Ethernet connection.

**Fault**

The connection between the devices is not operational.

In a Packet Tracer environment, this may be represented by an incorrect cable, disconnected link, or inactive interface.

**Likely Root Cause**

Physical or Layer 1 connectivity failure.

**Useful Evidence**

```text
show ip interface brief
```

Possible evidence:

```text
GigabitEthernet0/1    unassigned    down    down
```

**Recommended Investigation**

Check:

- Interface status
- Physical/link connection
- Correct device ports
- Cable/link state

**Recommended Fix**

Restore the correct physical connection or correct the affected interface/link configuration.

**Verification**

Confirm that the interface changes to an operational state and that connectivity is restored.

---

### CON-003 — Interface Protocol Down

**Domain:** Interfaces & Connectivity  
**Severity:** High

**User Symptom**

> A router interface has an IP address configured, but devices connected through it cannot communicate.

**Network Context**

R1 has an interface configured with:

```text
IP Address: 192.168.20.1
Subnet Mask: 255.255.255.0
```

However, the interface is not operational.

**Fault**

The interface has an operational state indicating that the physical/link layer is not functioning correctly.

**Likely Root Cause**

Layer 1 or Layer 2 connectivity problem affecting the interface.

**Useful Evidence**

```text
show ip interface brief
```

Example:

```text
GigabitEthernet0/1    192.168.20.1    up    down
```

**Recommended Investigation**

Inspect:

```text
show ip interface brief
```

Then investigate the physical connection, neighboring interface, and link configuration.

**Recommended Fix**

Restore the underlying link or correct the relevant interface configuration.

**Verification**

The interface should reach:

```text
up    up
```

and end-to-end connectivity should be tested.

---

### CON-004 — Unreachable Default Gateway

**Domain:** Interfaces & Connectivity  
**Severity:** High

**User Symptom**

> PC-01 has a valid IP address and default gateway configured, but it cannot ping its gateway.

**Network Context**

PC-01:

```text
IP Address:      192.168.10.20
Subnet Mask:     255.255.255.0
Default Gateway: 192.168.10.1
```

The gateway should be provided by R1.

**Fault**

The configured gateway address is correct, but the path between PC-01 and the gateway is not operational.

**Likely Root Cause**

Possible local connectivity failure between PC-01 and its gateway, such as:

- Interface down
- Incorrect VLAN assignment
- Link failure
- Gateway interface unavailable

**Useful Evidence**

The user reports:

```text
ping 192.168.10.1
Request timed out.
```

and:

```text
PC-01 IP: 192.168.10.20
Gateway: 192.168.10.1
```

**Recommended Investigation**

First verify whether PC-01 can reach its own default gateway.

Then inspect the relevant switch and router interfaces.

Useful commands include:

```text
show ip interface brief
show vlan brief
```

**Recommended Fix**

Correct the underlying local connectivity problem identified during investigation.

**Verification**

PC-01 should successfully ping:

```text
192.168.10.1
```

before testing connectivity to remote networks.

---
---
## VLANs
### VLAN-001 — Missing VLAN

**Domain:** VLANs  
**Severity:** High

**User Symptom**

> PC-01 cannot communicate with other devices that should be in the same VLAN.

**Network Context**

PC-01 is intended to belong to:

```text
VLAN: 10
Network: 192.168.10.0/24
```

SW-01 should have VLAN 10 configured.

**Fault**

VLAN 10 does not exist on SW-01.

**Likely Root Cause**

Required VLAN is missing from the switch configuration.

**Useful Evidence**

```text
show vlan brief
```

Example output:

```text
VLAN Name                             Status    Ports
---- -------------------------------- --------- ----------------
1    default                          active    Fa0/1, Fa0/2
20   STUDENTS                         active    Fa0/10
```

VLAN 10 is absent.

**Recommended Investigation**

Run:

```text
show vlan brief
```

and compare the configured VLANs with the intended topology.

**Recommended Fix**

Create VLAN 10 and assign the appropriate switch ports according to the network design.

**Verification**

Confirm VLAN 10 appears in the VLAN table and that the affected port belongs to the correct VLAN.

---

### VLAN-002 — Wrong Access VLAN

**Domain:** VLANs  
**Severity:** High

**User Symptom**

> PC-01 has a valid IP configuration but cannot communicate with devices in its intended VLAN.

**Network Context**

PC-01 should belong to:

```text
VLAN: 10
```

The switch port connected to PC-01 should therefore be configured as an access port in VLAN 10.

**Fault**

The port connected to PC-01 has been assigned to VLAN 20 instead.

**Likely Root Cause**

Incorrect access VLAN assignment.

**Useful Evidence**

```text
show vlan brief
```

Example:

```text
VLAN Name                             Status    Ports
---- -------------------------------- --------- ----------------
10   USERS                            active    Fa0/5
20   SERVERS                          active    Fa0/6, Fa0/7
```

PC-01 is connected to `Fa0/6`, but that port belongs to VLAN 20.

**Recommended Investigation**

Identify the switch port connected to PC-01 and inspect its VLAN assignment.

Useful commands:

```text
show vlan brief
show interfaces switchport
```

**Recommended Fix**

Assign the PC's switch port to the intended VLAN 10.

**Verification**

Confirm that the PC's switch port appears under VLAN 10 and test connectivity to another device in VLAN 10.

---

### VLAN-003 — Incorrect Access/Trunk Port Mode

**Domain:** VLANs  
**Severity:** High

**User Symptom**

> Devices connected to a switch cannot communicate across the expected VLAN path.

**Network Context**

SW-01 connects to another network device over a link that is intended to carry multiple VLANs.

The link should operate as a trunk.

**Fault**

The inter-switch connection has been configured as an access port rather than a trunk.

**Likely Root Cause**

Incorrect switchport mode on the inter-device link.

**Useful Evidence**

```text
show interfaces switchport
```

Example evidence:

```text
Administrative Mode: static access
Operational Mode: static access
```

The link is expected to operate as a trunk.

**Recommended Investigation**

Inspect the switchport mode of the link between the switches.

Useful command:

```text
show interfaces switchport
```

**Recommended Fix**

Configure the intended inter-switch link as a trunk and ensure the required VLANs are permitted according to the topology.

**Verification**

Run:

```text
show interfaces trunk
```

and confirm that the expected interface is operating as a trunk.

---

### VLAN-004 — Incorrect VLAN Assignment Across Devices

**Domain:** VLANs  
**Severity:** High

**User Symptom**

> Two hosts that should be in the same VLAN cannot communicate even though both hosts have apparently valid IP configurations.

**Network Context**

PC-01 is connected to SW-01.

PC-02 is connected to SW-02.

Both PCs are intended to belong to:

```text
VLAN: 10
Network: 192.168.10.0/24
```

The switches are connected to each other.

**Fault**

PC-01 is assigned to VLAN 10, but PC-02's switch port is assigned to VLAN 20.

**Likely Root Cause**

Inconsistent VLAN assignment between endpoint access ports.

**Useful Evidence**

SW-01:

```text
show vlan brief

VLAN 10    active    Fa0/5
```

SW-02:

```text
show vlan brief

VLAN 20    active    Fa0/5
```

The same endpoint role is mapped to different VLANs.

**Recommended Investigation**

Compare the VLAN assignment of both endpoint ports.

Useful commands:

```text
show vlan brief
show interfaces switchport
```

Also verify that the inter-switch link is correctly carrying VLAN 10.

**Recommended Fix**

Assign both endpoint ports to VLAN 10 according to the intended topology.

**Verification**

Confirm:

```text
SW-01 → PC-01 → VLAN 10
SW-02 → PC-02 → VLAN 10
```

and test connectivity between PC-01 and PC-02.

---
---
## Trunking
### TRK-001 — Trunk Not Operational

**Domain:** Trunking  
**Severity:** High

**User Symptom**

> Devices in the same VLAN but connected to different switches cannot communicate.

**Network Context**

SW-01 and SW-02 are connected through an inter-switch link.

The link is intended to operate as a trunk and carry VLAN 10.

```text id="4b9x2s"
PC-01
  │
SW-01
  │
  │  Trunk
  │
SW-02
  │
PC-02
```

Both PC-01 and PC-02 belong to VLAN 10.

**Fault**

The inter-switch link is not operating as a trunk.

**Likely Root Cause**

The switch-to-switch interface is configured as an access port or otherwise is not operating in trunk mode.

**Useful Evidence**

Run:

```text id="d7a9ph"
show interfaces trunk
```

Example:

```text id="f5e8b2"
Port        Mode         Encapsulation  Status        Native vlan
Fa0/24      static       802.1q         not-trunking  1
```

The interface expected to carry VLAN 10 is not operating as a trunk.

**Recommended Investigation**

Inspect the switchport configuration on both ends of the inter-switch link.

Useful commands:

```text id="4s7d8e"
show interfaces switchport
show interfaces trunk
```

**Recommended Fix**

Configure the inter-switch link according to the intended topology so that it operates as a trunk.

**Verification**

Confirm that:

```text id="3cq7a8"
show interfaces trunk
```

shows the expected interface as an active trunk and that VLAN 10 is allowed across the link.

---

### TRK-002 — VLAN Not Allowed on Trunk

**Domain:** Trunking  
**Severity:** High

**User Symptom**

> Devices in VLAN 20 can communicate when connected to the same switch, but cannot communicate when separated across two switches.

**Network Context**

SW-01 and SW-02 are connected through a trunk.

The trunk should carry:

```text id="r5gk9a"
VLAN 10
VLAN 20
VLAN 30
```

PC-01 and PC-02 are both members of VLAN 20 but are connected to different switches.

**Fault**

The trunk is operational, but VLAN 20 is not included in the allowed VLAN list.

**Likely Root Cause**

VLAN 20 is being filtered from the trunk.

**Useful Evidence**

Run:

```text id="8eq6jz"
show interfaces trunk
```

Example:

```text id="c6l6x8"
Port        Mode         Encapsulation  Status        Native vlan
Fa0/24      on           802.1q         trunking      1

Vlans allowed on trunk
10,30
```

VLAN 20 is missing from the allowed VLAN list.

**Recommended Investigation**

Check:

```text id="i9r9di"
show interfaces trunk
```

and compare the allowed VLANs with the intended network design.

**Recommended Fix**

Allow VLAN 20 on the appropriate trunk according to the intended topology.

**Verification**

Confirm that VLAN 20 appears in the trunk's allowed VLAN list and test connectivity between the VLAN 20 endpoints.

---

### TRK-003 — Native VLAN Mismatch

**Domain:** Trunking  
**Severity:** Medium

**User Symptom**

> An inter-switch trunk is operational, but unexpected connectivity or VLAN-related warnings occur between the switches.

**Network Context**

SW-01 and SW-02 are connected through an 802.1Q trunk.

The intended native VLAN is:

```text id="jgnqpf"
VLAN 99
```

Both ends of the trunk should use the same native VLAN.

**Fault**

The two ends of the trunk use different native VLANs.

Example:

```text id="7py9qd"
SW-01 native VLAN: 99
SW-02 native VLAN: 1
```

**Likely Root Cause**

Native VLAN mismatch on the trunk.

**Useful Evidence**

The trunk configuration or device output indicates different native VLANs on the two ends.

Useful command:

```text id="i2s52p"
show interfaces trunk
```

Example:

```text id="0xkz6n"
SW-01:
Native VLAN: 99

SW-02:
Native VLAN: 1
```

**Recommended Investigation**

Inspect the trunk configuration on both switches and compare their native VLAN settings.

**Recommended Fix**

Configure the same intended native VLAN on both ends of the trunk.

**Verification**

Run:

```text id="v5kq7q"
show interfaces trunk
```

on both switches and confirm that the native VLAN matches.
---
---
## Routing
### RTR-001 — Missing Route

**Domain:** Routing  
**Severity:** Critical

**User Symptom**

> PC-01 can reach its default gateway but cannot reach Server-01 on another network.

**Network Context**

```text id="l5s9w4"
PC-01
Network: 192.168.10.0/24
Gateway: 192.168.10.1

Server-01
Network: 192.168.30.0/24
```

R1 is responsible for forwarding traffic toward the destination network.

**Fault**

R1 does not have a route to `192.168.30.0/24`.

**Likely Root Cause**

Missing route for the destination network.

**Useful Evidence**

```text id="6g0l6r"
show ip route
```

Example:

```text id="4zpj9x"
C 192.168.10.0/24 is directly connected
```

No route exists for:

```text id="nynf7s"
192.168.30.0/24
```

**Recommended Investigation**

Inspect the routing table:

```text id="zh8n2n"
show ip route
```

Determine whether the destination network is known.

**Recommended Fix**

Configure the appropriate static or dynamic routing mechanism according to the intended topology.

**Verification**

Confirm that the routing table contains a valid route to:

```text id="xk4y3n"
192.168.30.0/24
```

Then test connectivity from PC-01 to Server-01.

---

### RTR-002 — Incorrect Route

**Domain:** Routing  
**Severity:** Critical

**User Symptom**

> Traffic reaches the router but is sent toward the wrong network path.

**Network Context**

The destination network is:

```text id="v10xiz"
192.168.30.0/24
```

R1 should forward traffic toward the correct next-hop router.

**Fault**

R1 has a route for the destination network, but the route points to an incorrect next hop or interface.

**Likely Root Cause**

Incorrect routing-table entry.

**Useful Evidence**

```text id="v73s8g"
show ip route 192.168.30.0
```

Example:

```text id="j7h8td"
S 192.168.30.0/24 [1/0] via 192.168.40.9
```

The configured next hop does not match the intended topology.

**Recommended Investigation**

Inspect the route to the destination:

```text id="d4e0jq"
show ip route 192.168.30.0
```

Then compare the next hop with the network topology.

**Recommended Fix**

Correct the routing configuration so that traffic is forwarded through the intended next hop.

**Verification**

Confirm the routing table contains the correct path and test connectivity to the destination.

---

### RTR-003 — Missing Default Route

**Domain:** Routing  
**Severity:** High

**User Symptom**

> Internal networks are reachable, but traffic to unknown or external networks fails.

**Network Context**

R1 knows its directly connected internal networks but should forward all other traffic toward an upstream router.

Expected upstream router:

```text id="p5w7iq"
Next Hop: 192.168.100.1
```

**Fault**

R1 does not have a default route.

**Likely Root Cause**

Missing default route (`0.0.0.0/0`).

**Useful Evidence**

```text id="yn8g8x"
show ip route
```

Example:

```text id="3h0f3w"
C 192.168.10.0/24 is directly connected
C 192.168.100.0/24 is directly connected
```

No default route is present.

**Recommended Investigation**

Inspect the routing table and determine whether a default route exists.

**Recommended Fix**

Configure the appropriate default route according to the topology.

**Verification**

Confirm that the routing table contains:

```text id="u7k4dc"
S* 0.0.0.0/0 ...
```

or the appropriate dynamically learned default route.

Then test connectivity to a destination outside the router's known internal networks.

---

### RTR-004 — Incorrect Next Hop

**Domain:** Routing  
**Severity:** High

**User Symptom**

> A route exists for the destination network, but packets do not reach the destination.

**Network Context**

R1 needs to reach:

```text id="85h6q1"
192.168.30.0/24
```

The intended next-hop router is:

```text id="bax8qs"
192.168.20.2
```

**Fault**

The configured route uses:

```text id="c1s0uc"
192.168.20.3
```

instead of the intended next hop.

**Likely Root Cause**

Incorrect next-hop address in the routing configuration.

**Useful Evidence**

```text id="7b5x4a"
show ip route 192.168.30.0
```

Example:

```text id="1b3yq7"
S 192.168.30.0/24 [1/0] via 192.168.20.3
```

Topology evidence indicates the correct next hop is `192.168.20.2`.

**Recommended Investigation**

Compare:

```text id="h6o0sm"
Configured next hop
```

with:

```text id="q2h72g"
Intended topology
```

Also verify reachability of the configured next hop.

**Recommended Fix**

Correct the route to use the intended next-hop address.

**Verification**

Confirm that the route points to the correct next hop and verify end-to-end connectivity.

---

### RTR-005 — Routing Loop

**Domain:** Routing  
**Severity:** Critical

**User Symptom**

> Traffic toward a destination network does not arrive and repeated routing behavior is observed.

**Network Context**

Two or more routers have incorrect routing information for the same destination network.

Example:

```text id="y6gkq8"
R1 → R2
R2 → R1
```

Both routers incorrectly forward traffic for the destination toward each other.

**Fault**

Routing information causes packets to repeatedly circulate between routers.

**Likely Root Cause**

Incorrect routing configuration creating a routing loop.

**Useful Evidence**

A traceroute or equivalent path investigation may show repeated router addresses.

Example:

```text id="hl7xbi"
1  192.168.20.1
2  192.168.30.1
3  192.168.20.1
4  192.168.30.1
...
```

The path repeats instead of progressing toward the destination.

**Recommended Investigation**

Inspect the routing tables on the involved routers:

```text id="u9w9c3"
show ip route
```

Compare the routes for the affected destination network across both routers.

**Recommended Fix**

Correct the routing configuration so that each router has a valid path toward the destination and does not forward the same traffic back toward the previous router.

**Verification**

Repeat the path test and confirm that the route progresses toward the destination without repeated hops.
---
---
## Inter -VLAN Routing
VLAN → gateway → router → routing → destination VLAN
### IVR-001 — Router-on-a-Stick Subinterface Missing

**Domain:** Inter-VLAN Routing  
**Severity:** Critical

**User Symptom**

> Devices in VLAN 10 can communicate with each other, but they cannot communicate with devices in VLAN 20.

**Network Context**

The network uses router-on-a-stick:

```text id="x3u7b9"
VLAN 10 ──┐
          │
        SW-01
          │
        Trunk
          │
          R1
```

R1 should provide gateways for both VLANs.

Expected configuration:

```text id="m7jz0g"
VLAN 10 → 192.168.10.1
VLAN 20 → 192.168.20.1
```

**Fault**

The subinterface for VLAN 20 does not exist or is not configured correctly.

**Likely Root Cause**

Missing router subinterface for VLAN 20.

**Useful Evidence**

```text id="xq0g9m"
show ip interface brief
```

Example:

```text id="w7q6bh"
GigabitEthernet0/0       unassigned    up    up
GigabitEthernet0/0.10    192.168.10.1  up    up
```

There is no corresponding subinterface for VLAN 20.

**Recommended Investigation**

Inspect the router interfaces and determine whether a subinterface exists for each required VLAN.

Useful commands:

```text id="kz9wz6"
show ip interface brief
show running-config
```

**Recommended Fix**

Create/configure the required VLAN 20 subinterface with the appropriate 802.1Q encapsulation and gateway address.

**Verification**

Confirm that the VLAN 20 subinterface is operational and that hosts in VLAN 20 can reach their gateway.

Then test connectivity between VLAN 10 and VLAN 20.

---

### IVR-002 — Incorrect 802.1Q VLAN Tag

**Domain:** Inter-VLAN Routing  
**Severity:** High

**User Symptom**

> One VLAN cannot communicate through the router even though the router has a subinterface configured.

**Network Context**

R1 uses router-on-a-stick.

The expected mapping is:

```text id="whm8sl"
VLAN 10 → Gi0/0.10
VLAN 20 → Gi0/0.20
```

**Fault**

The subinterface intended for VLAN 20 is configured with the wrong VLAN ID.

Example:

```text id="39m8v9"
interface GigabitEthernet0/0.20
 encapsulation dot1Q 30
```

The subinterface number suggests VLAN 20, but the 802.1Q tag identifies VLAN 30.

**Likely Root Cause**

Incorrect 802.1Q encapsulation VLAN ID.

**Useful Evidence**

```text id="02jby1"
show running-config
```

Example:

```text id="c7qjgo"
interface GigabitEthernet0/0.20
 encapsulation dot1Q 30
 ip address 192.168.20.1 255.255.255.0
```

The intended VLAN is 20, but the configured tag is 30.

**Recommended Investigation**

Inspect the router subinterface configuration and compare:

```text id="7m8zuw"
Subinterface
802.1Q VLAN ID
IP network
```

with the intended topology.

**Recommended Fix**

Configure the subinterface with the correct 802.1Q VLAN ID.

**Verification**

Confirm that VLAN 20 traffic reaches the correct router subinterface and that hosts in VLAN 20 can reach their gateway.

---

### IVR-003 — Trunk Does Not Carry Required VLAN to Router

**Domain:** Inter-VLAN Routing  
**Severity:** Critical

**User Symptom**

> VLAN 10 devices can reach their gateway, but VLAN 20 devices cannot reach their gateway.

**Network Context**

SW-01 connects to R1 through a trunk.

Both VLAN 10 and VLAN 20 should be transported from the switch to the router.

```text id="5r2q7m"
VLAN 10 ──┐
VLAN 20 ──┼── SW-01 ═══ Trunk ═══ R1
           │
```

**Fault**

The trunk does not allow VLAN 20.

**Likely Root Cause**

VLAN 20 is missing from the trunk's allowed VLAN list.

**Useful Evidence**

On SW-01:

```text id="cbyy20"
show interfaces trunk
```

Example:

```text id="t2b1n9"
Port        Status       Native vlan
Gi0/1       trunking     1

Vlans allowed on trunk
10
```

VLAN 20 is not being carried across the trunk.

**Recommended Investigation**

Inspect the trunk configuration and compare the allowed VLAN list with the VLANs required by the router-on-a-stick configuration.

Useful command:

```text id="6q2o4v"
show interfaces trunk
```

**Recommended Fix**

Allow VLAN 20 on the trunk between SW-01 and R1.

**Verification**

Confirm that both VLAN 10 and VLAN 20 are allowed on the trunk and that hosts in both VLANs can reach their respective gateways.

Then test inter-VLAN connectivity.
---
---
## DHCP — 3 cases
### DHCP-001 — DHCP Pool Missing

**Domain:** DHCP  
**Severity:** High

**User Symptom**

> PC-01 does not receive an IP address automatically.

**Network Context**

R1 is configured to provide DHCP services for the client network:

```text id="a7x5p2"
Network: 192.168.10.0/24
Gateway: 192.168.10.1
```

PC-01 is configured to obtain its address through DHCP.

**Fault**

No DHCP pool exists for the client network.

**Likely Root Cause**

The router does not have a DHCP pool configured for `192.168.10.0/24`.

**Useful Evidence**

The PC does not receive a valid address.

Router configuration inspection may show that no corresponding DHCP pool exists.

Useful command:

```text id="2y7z4f"
show running-config
```

**Recommended Investigation**

Inspect the router's DHCP configuration and determine whether a pool exists for the affected network.

**Recommended Fix**

Create the appropriate DHCP pool containing:

- Correct network
- Subnet mask
- Default gateway
- Any other required DHCP options

**Verification**

Renew the client's DHCP lease and confirm that PC-01 receives an address in the expected network.

---

### DHCP-002 — Incorrect DHCP Default Gateway

**Domain:** DHCP  
**Severity:** High

**User Symptom**

> PC-01 receives an IP address automatically but cannot communicate with devices outside its local network.

**Network Context**

The client network is:

```text id="ys6f2b"
192.168.10.0/24
```

The correct default gateway is:

```text id="7m7a3e"
192.168.10.1
```

**Fault**

The DHCP pool provides an incorrect default gateway.

Example:

```text id="g8k1wf"
default-router 192.168.20.1
```

instead of:

```text id="7d5w2r"
default-router 192.168.10.1
```

**Likely Root Cause**

Incorrect DHCP default-router configuration.

**Useful Evidence**

Inspect:

```text id="a2u7h9"
show running-config
```

and identify the DHCP pool configuration.

Example:

```text id="f8k4d2"
ip dhcp pool USERS
 network 192.168.10.0 255.255.255.0
 default-router 192.168.20.1
```

**Recommended Investigation**

Compare the DHCP-provided gateway with the intended gateway for the client's subnet.

**Recommended Fix**

Configure the DHCP pool with the correct default gateway:

```text id="q3k8xz"
default-router 192.168.10.1
```

**Verification**

Renew the PC's DHCP lease and confirm that the client receives:

```text id="1y9d0p"
IP:      192.168.10.x
Gateway: 192.168.10.1
```

Then test connectivity to another network.

---

### DHCP-003 — DHCP Address Pool Exhausted

**Domain:** DHCP  
**Severity:** Medium

**User Symptom**

> New clients cannot obtain an IP address through DHCP, while existing clients continue to work.

**Network Context**

The DHCP server provides addresses from a limited address range.

Example:

```text id="y6e2ms"
192.168.10.100 – 192.168.10.110
```

The network has more active DHCP clients than available addresses.

**Fault**

The DHCP address pool has no available leases.

**Likely Root Cause**

DHCP address pool exhaustion.

**Useful Evidence**

Inspect DHCP bindings/statistics:

```text id="7b3e6q"
show ip dhcp binding
```

and:

```text id="w9z8j0"
show ip dhcp pool
```

Example:

```text id="a3n5v6"
Pool USERS :
 Utilization mark (high/low) : 100 / 0
 Total addresses             : 11
 Leased addresses            : 11
```

**Recommended Investigation**

Determine:

- Total available addresses
- Currently leased addresses
- Whether the pool is fully utilized

**Recommended Fix**

Expand or redesign the DHCP address pool according to the intended network design, or release stale leases where appropriate.

**Verification**

Confirm that an address becomes available and that a new client can successfully obtain a DHCP lease.
---
---
## ACL — 4 cases.
These cases demonstrate why NetSage needs to distinguish between:
> The network path is broken

and
> The path works, but policy intentionally/accidentally blocks the traffic.


### ACL-001 — ACL Blocking Intended Traffic

**Domain:** ACL  
**Severity:** High

**User Symptom**

> PC-01 can reach its gateway but cannot reach Server-01.

**Network Context**

PC-01:

```text id="8q0j1v"
IP: 192.168.10.20
```

Server-01:

```text id="6g2x9p"
IP: 192.168.30.50
```

Routing between the two networks is expected to work.

**Fault**

An access control list blocks traffic from the client network to the server network.

**Likely Root Cause**

An ACL deny statement prevents the intended traffic.

**Useful Evidence**

```text id="3xk4qm"
show access-lists
```

Example:

```text id="w0a2m8"
Extended IP access list USERS-FILTER
    10 deny ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255
    20 permit ip any any
```

The first rule explicitly denies traffic from VLAN/network 10 to network 30.

**Recommended Investigation**

Inspect:

```text id="1r3p8n"
show access-lists
```

Then determine whether the ACL is applied to the relevant interface and direction.

**Recommended Fix**

Modify the ACL according to the intended security policy so that legitimate traffic is permitted.

**Verification**

Confirm that the intended traffic is permitted and test connectivity from PC-01 to Server-01.

---

### ACL-002 — ACL Applied to Wrong Interface or Direction

**Domain:** ACL  
**Severity:** High

**User Symptom**

> A network service works from one direction but fails when traffic enters or leaves a particular interface.

**Network Context**

An ACL was created to restrict traffic entering a router interface.

The intended policy applies the ACL inbound on:

```text id="3m2a8s"
GigabitEthernet0/0
```

**Fault**

The ACL has been applied to a different interface or in the wrong direction.

**Likely Root Cause**

Incorrect ACL interface/direction assignment.

**Useful Evidence**

Inspect the interface configuration:

```text id="r4n1hz"
show running-config
```

Example:

```text id="y0v4nq"
interface GigabitEthernet0/0
 ip access-group USERS-FILTER out
```

The ACL is applied outbound even though the intended policy requires inbound filtering.

**Recommended Investigation**

Identify:

```text id="f8b2j7"
1. Which ACL is involved
2. Which interface it is applied to
3. Whether it is inbound or outbound
```

**Recommended Fix**

Apply the ACL to the intended interface and direction according to the network security policy.

**Verification**

Test the affected traffic from both relevant directions and confirm that only the intended traffic is permitted or denied.

---

### ACL-003 — ACL Rule Order Causes Unexpected Denial

**Domain:** ACL  
**Severity:** High

**User Symptom**

> A specific type of traffic should be permitted, but the traffic is denied even though a permit rule exists.

**Network Context**

An extended ACL contains multiple rules.

The intended policy is to permit HTTPS traffic from the client network to the application server.

**Fault**

A broader deny rule appears before the specific permit rule.

Example:

```text id="c5k1m9"
10 deny ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255
20 permit tcp 192.168.10.0 0.0.0.255 host 192.168.30.50 eq 443
```

The packet matches rule 10 first and is denied before rule 20 can be evaluated.

**Likely Root Cause**

ACL rule ordering causes the intended traffic to be denied.

**Useful Evidence**

```text id="q8h1t6"
show access-lists
```

The deny rule appears before the more specific permit rule.

**Recommended Investigation**

Evaluate ACL entries from top to bottom and determine which rule matches the affected traffic first.

**Recommended Fix**

Reorder or modify the ACL entries according to the intended security policy.

**Verification**

Confirm that the intended HTTPS traffic matches the appropriate permit rule and that unrelated traffic remains subject to the intended restrictions.

---

### ACL-004 — Required Return Traffic Blocked

**Domain:** ACL  
**Severity:** High

**User Symptom**

> A connection appears to leave the client successfully, but the application does not establish a working session.

**Network Context**

PC-01 initiates a connection to Server-01.

The forward path appears operational.

However, a security policy on the return path filters traffic coming back toward the client network.

**Fault**

The ACL blocks required return traffic.

**Likely Root Cause**

ACL policy does not permit the traffic required for the return path of the connection.

**Useful Evidence**

```text id="s4d2vx"
show access-lists
```

The ACL counters indicate packets are being denied on the return interface.

**Recommended Investigation**

Inspect:

- ACL entries
- ACL interface placement
- Traffic direction
- Source and destination addresses
- Relevant protocol/port

Determine whether the return traffic is being denied.

**Recommended Fix**

Adjust the ACL according to the intended security policy so that legitimate return traffic is permitted.

**Verification**

Confirm that the required traffic is no longer denied and verify the application connection end-to-end.

---
---
## NAT — 2 cases
### NAT-001 — Missing NAT Translation

**Domain:** NAT  
**Severity:** High

**User Symptom**

> Internal PC-01 can reach its local gateway but cannot access the external network.

**Network Context**

PC-01 uses a private address:

```text id="w4m3ps"
192.168.10.20
```

R1 connects the internal network to an external network.

NAT should translate the internal private address when traffic leaves the network.

**Fault**

The required NAT configuration is missing, so traffic from the internal network is not being translated.

**Likely Root Cause**

NAT rule or translation configuration is missing or incomplete.

**Useful Evidence**

Inspect the NAT configuration:

```text id="r1y0k7"
show running-config
```

Check active translations:

```text id="x3m8f2"
show ip nat translations
```

Expected evidence is that traffic from PC-01 does not produce the expected NAT translation.

**Recommended Investigation**

Verify:

- Inside interface designation
- Outside interface designation
- NAT rule
- Source network
- Active translations

Useful commands:

```text id="8q2k6m"
show ip nat translations
show running-config
```

**Recommended Fix**

Configure the appropriate NAT rule and ensure the relevant interfaces are correctly identified as inside or outside according to the topology.

**Verification**

Generate traffic from PC-01 toward the external network and confirm that a NAT translation appears.

---

### NAT-002 — Incorrect NAT Inside/Outside Interface

**Domain:** NAT  
**Severity:** High

**User Symptom**

> NAT is configured, but internal clients cannot access the external network as expected.

**Network Context**

R1 has:

```text id="m7x1c5"
Inside interface:  GigabitEthernet0/0
Outside interface: GigabitEthernet0/1
```

Internal clients are connected through the inside interface.

**Fault**

The NAT inside/outside roles are assigned incorrectly.

Example:

```text id="8d3p2n"
interface GigabitEthernet0/0
 ip nat outside
```

when this interface should be the inside interface.

**Likely Root Cause**

Incorrect NAT interface role configuration.

**Useful Evidence**

Inspect the interface configuration:

```text id="0b7j8s"
show running-config
```

Example:

```text id="x5v1n6"
interface GigabitEthernet0/0
 ip nat outside

interface GigabitEthernet0/1
 ip nat inside
```

The roles are reversed relative to the intended topology.

**Recommended Investigation**

Identify which router interface connects to:

```text id="f8z3w2"
1. Internal/private network
2. External/public network
```

Then compare those roles with the NAT configuration.

**Recommended Fix**

Correct the `ip nat inside` and `ip nat outside` assignments according to the intended topology.

**Verification**

Generate traffic from an internal host and confirm that the expected NAT translation is created.
---
---
## DNS & Wirless - 2+2 cases
### DNS-001 — Incorrect DNS Server

**Domain:** DNS  
**Severity:** Medium

**User Symptom**

> PC-01 can reach websites or servers by IP address but cannot reach them using their hostnames.

**Network Context**

PC-01 has valid IP connectivity and can reach the network gateway.

The client should use the organization's DNS server:

```text
DNS Server: 192.168.10.10
```

**Fault**

PC-01 is configured with an incorrect DNS server:

```text
DNS Server: 192.168.20.10
```

**Likely Root Cause**

Incorrect DNS server configuration.

**Useful Evidence**

The client can successfully reach a destination by IP:

```text
ping 192.168.30.50
```

but hostname resolution fails:

```text
ping server01.example.local
```

The client configuration shows the wrong DNS server.

**Recommended Investigation**

Verify:

- Client DNS server configuration
- DNS server reachability
- Whether the hostname resolves

**Recommended Fix**

Configure the client to use the intended DNS server:

```text
192.168.10.10
```

**Verification**

Confirm that:

```text
server01.example.local
```

resolves to the expected IP address and that the client can reach the resolved destination.

---

### DNS-002 — DNS Service Unavailable

**Domain:** DNS  
**Severity:** High

**User Symptom**

> Network connectivity works by IP address, but hostname resolution fails for multiple clients.

**Network Context**

Multiple clients use the same DNS server:

```text
DNS Server: 192.168.10.10
```

Clients can communicate with their gateway and other network resources.

**Fault**

The DNS service is unavailable or the DNS server is not responding to queries.

**Likely Root Cause**

DNS service failure or DNS server reachability problem.

**Useful Evidence**

Clients can reach the DNS server's IP:

```text
ping 192.168.10.10
```

but DNS queries fail.

For example:

```text
nslookup server01.example.local
```

returns a timeout or server failure.

**Recommended Investigation**

Determine whether:

1. The DNS server is reachable.
2. The DNS service is running.
3. DNS queries are being answered.
4. Multiple clients experience the same failure.

**Recommended Fix**

Restore DNS service availability or correct the DNS server configuration/network path as appropriate.

**Verification**

Confirm that DNS queries successfully return the expected IP address and that hostname-based connectivity works.

---

### WIR-001 — Incorrect Wireless SSID or Security Configuration

**Domain:** Wireless  
**Severity:** High

**User Symptom**

> A wireless client cannot connect to the expected wireless network.

**Network Context**

The intended wireless network is:

```text
SSID: NETSAGE-LAB
Security: WPA2
```

The wireless access point is operational.

**Fault**

The client is attempting to connect using an incorrect SSID or incompatible security credentials.

**Likely Root Cause**

Mismatch between the wireless client configuration and the access point configuration.

**Useful Evidence**

Access point configuration:

```text
SSID: NETSAGE-LAB
Security: WPA2
```

Client configuration:

```text
SSID: NETSAGE-LABS
```

The client is attempting to connect to a different SSID.

**Recommended Investigation**

Compare:

```text
Client SSID
Access Point SSID
Security configuration
Authentication credentials
```

**Recommended Fix**

Configure the client with the correct SSID and compatible security settings.

**Verification**

Confirm that the client successfully associates with the access point and receives the expected network configuration.

---

### WIR-002 — Wireless Client Associated but No IP Connectivity

**Domain:** Wireless  
**Severity:** High

**User Symptom**

> A wireless client successfully connects to the wireless network but cannot access network resources.

**Network Context**

The client successfully associates with the access point.

The wireless network should provide addresses through DHCP.

Expected client network:

```text
Network: 192.168.10.0/24
Gateway: 192.168.10.1
```

**Fault**

The wireless client does not receive a valid IP configuration after association.

**Likely Root Cause**

Possible DHCP or network-path failure between the wireless client and the DHCP service.

**Useful Evidence**

Wireless association is successful, but the client has no valid address.

Example:

```text
IP Address: 0.0.0.0
```

or an address outside the intended network.

**Recommended Investigation**

Check:

- Wireless association status
- Client IP configuration
- DHCP availability
- VLAN/network assignment for the wireless network
- Gateway reachability

Useful commands or diagnostics depend on the simulated environment.

**Recommended Fix**

Correct the DHCP or network configuration preventing the wireless client from receiving the intended network settings.

**Verification**

Confirm that the wireless client receives:

```text
IP:      192.168.10.x
Gateway: 192.168.10.1
```

and can reach the gateway and other network resources.