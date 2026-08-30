# NetSage AI — Troubleshooting Taxonomy

> Taxonomy for the NetSage AI troubleshooting case library. The taxonomy defines the network-failure domains covered by the MVP and provides the classification structure used to organize, evaluate, and later analyze troubleshooting scenarios.

## Purpose

NetSage AI needs a broad but controlled set of networking failure scenarios so that its troubleshooting workflow can be evaluated consistently.

The taxonomy organizes cases by **failure domain** rather than by individual commands.

Each case in the library should ultimately allow NetSage to reason through:

```text
User Symptom
     ↓
Possible Causes
     ↓
Available Evidence
     ↓
Next Investigation
     ↓
Root Cause
     ↓
Verification
     ↓
Recommended Fix
```

The taxonomy is intentionally designed around common Cisco-style laboratory and Packet Tracer troubleshooting scenarios.

---

# 1. IP Addressing

**Purpose:** Identify endpoint addressing problems that prevent correct local or remote communication.

| ID | Failure Type | Description |
|---|---|---|
| IP-001 | Wrong IP Address | End device has an incorrect IP address for the intended network. |
| IP-002 | Wrong Subnet Mask | End device has an incorrect subnet mask, causing incorrect network/host determination. |
| IP-003 | Wrong Default Gateway | End device has an incorrect or inconsistent default gateway. |
| IP-004 | Duplicate IP Address | Two devices are configured with the same IP address, causing an IP address conflict. |

**Cases:** 4

---

# 2. Interfaces & Connectivity

**Purpose:** Identify failures at the physical, interface, or immediate connectivity layer.

| ID | Failure Type | Description |
|---|---|---|
| CON-001 | Interface Administratively Down | An interface has been disabled using the `shutdown` configuration. |
| CON-002 | Physical/Link Connectivity Failure | A physical connection or link between devices is not operational. |
| CON-003 | Interface Protocol Down | An interface has an IP address but its operational protocol state is down. |
| CON-004 | Unreachable Default Gateway | The configured gateway is valid, but the endpoint cannot reach it because of a local connectivity problem. |

**Cases:** 4

---

# 3. VLANs

**Purpose:** Identify Layer 2 segmentation and VLAN membership problems.

| ID | Failure Type | Description |
|---|---|---|
| VLAN-001 | Missing VLAN | A required VLAN does not exist on the switch. |
| VLAN-002 | Wrong Access VLAN | An endpoint switch port is assigned to the wrong VLAN. |
| VLAN-003 | Incorrect Access/Trunk Port Mode | A link expected to carry multiple VLANs is configured with an inappropriate switchport mode. |
| VLAN-004 | Incorrect VLAN Assignment Across Devices | Devices that should belong to the same VLAN have inconsistent VLAN assignments across switches. |

**Cases:** 4

---

# 4. Trunking

**Purpose:** Identify problems with VLAN traffic crossing trunk links.

| ID | Failure Type | Description |
|---|---|---|
| TRK-001 | Trunk Not Operational | An inter-switch or device link expected to operate as a trunk is not operating as a trunk. |
| TRK-002 | VLAN Not Allowed on Trunk | A required VLAN is missing from the trunk's allowed VLAN list. |
| TRK-003 | Native VLAN Mismatch | The native VLAN configured on the two ends of a trunk does not match. |

**Cases:** 3

---

# 5. Routing

**Purpose:** Identify Layer 3 forwarding problems between different networks.

| ID | Failure Type | Description |
|---|---|---|
| RTR-001 | Missing Route | A router has no route to the destination network. |
| RTR-002 | Incorrect Route | A routing entry exists but points traffic along an incorrect path. |
| RTR-003 | Missing Default Route | A router has no default route for destinations that are otherwise unknown. |
| RTR-004 | Incorrect Next Hop | A route points to an incorrect next-hop address. |
| RTR-005 | Routing Loop | Incorrect routing information causes traffic to repeatedly circulate between routers. |

**Cases:** 5

---

# 6. Inter-VLAN Routing

**Purpose:** Identify failures that prevent communication between different VLANs through a Layer 3 device.

| ID | Failure Type | Description |
|---|---|---|
| IVR-001 | Router Subinterface Missing | A required router-on-a-stick subinterface is missing or incorrectly configured. |
| IVR-002 | Incorrect 802.1Q VLAN Tag | A router subinterface uses an incorrect VLAN ID for 802.1Q encapsulation. |
| IVR-003 | Trunk Does Not Carry Required VLAN to Router | The switch-to-router trunk does not transport a required VLAN. |

**Cases:** 3

---

# 7. DHCP

**Purpose:** Identify failures in automatic client IP configuration.

| ID | Failure Type | Description |
|---|---|---|
| DHCP-001 | DHCP Pool Missing | No appropriate DHCP pool exists for the client network. |
| DHCP-002 | Incorrect DHCP Default Gateway | DHCP provides clients with an incorrect default gateway. |
| DHCP-003 | DHCP Address Pool Exhausted | All available DHCP addresses are leased and new clients cannot obtain an address. |

**Cases:** 3

---

# 8. ACL

**Purpose:** Identify policy-based traffic filtering problems.

| ID | Failure Type | Description |
|---|---|---|
| ACL-001 | ACL Blocking Intended Traffic | An ACL explicitly denies traffic that should be permitted. |
| ACL-002 | ACL Applied to Wrong Interface or Direction | An ACL is attached to an incorrect interface or applied in the wrong direction. |
| ACL-003 | ACL Rule Order Causes Unexpected Denial | A broader rule is evaluated before a more specific rule, producing an unintended result. |
| ACL-004 | Required Return Traffic Blocked | An ACL prevents legitimate traffic required for the return path of a connection. |

**Cases:** 4

---

# 9. NAT

**Purpose:** Identify address-translation problems between internal and external networks.

| ID | Failure Type | Description |
|---|---|---|
| NAT-001 | Missing NAT Translation | Required traffic is not being translated because the NAT configuration is missing or incomplete. |
| NAT-002 | Incorrect NAT Inside/Outside Interface | Router interfaces have incorrect NAT inside/outside roles. |

**Cases:** 2

---

# 10. DNS

**Purpose:** Identify name-resolution failures where network connectivity may still function by IP address.

| ID | Failure Type | Description |
|---|---|---|
| DNS-001 | Incorrect DNS Server | A client is configured to use an incorrect DNS server. |
| DNS-002 | DNS Service Unavailable | The DNS server or DNS service is unavailable or not responding to queries. |

**Cases:** 2

---

# 11. Wireless

**Purpose:** Identify common wireless association and client connectivity problems.

| ID | Failure Type | Description |
|---|---|---|
| WIR-001 | Incorrect Wireless SSID/Security Configuration | The wireless client configuration does not match the intended wireless network. |
| WIR-002 | Wireless Client Associated but No IP Connectivity | A wireless client associates successfully but fails to obtain valid network connectivity. |

**Cases:** 2

---

# Taxonomy Summary

| Domain | Cases |
|---|---:|
| IP Addressing | 4 |
| Interfaces & Connectivity | 4 |
| VLANs | 4 |
| Trunking | 3 |
| Routing | 5 |
| Inter-VLAN Routing | 3 |
| DHCP | 3 |
| ACL | 4 |
| NAT | 2 |
| DNS | 2 |
| Wireless | 2 |
| **Total** | **36** |

---

# Case ID Convention

Each troubleshooting case uses a domain prefix followed by a three-digit identifier.

Examples:

```text
IP-001
CON-001
VLAN-001
TRK-001
RTR-001
IVR-001
DHCP-001
ACL-001
NAT-001
DNS-001
WIR-001
```

The identifier should remain stable once a case has been added to the evaluation dataset.

---

# Case Design Principles

The case library should follow these principles.

## 1. Realistic Symptoms

Cases should begin with symptoms that a student or junior network engineer could realistically observe.

Example:

> PC-01 cannot reach Server-01.

The symptom should not reveal the root cause immediately.

---

## 2. Multiple Plausible Causes

Where appropriate, a symptom should have multiple possible explanations.

For example:

```text
PC cannot reach server
        ↓
   Possible causes
   ├── VLAN
   ├── Routing
   ├── ACL
   ├── Gateway
   └── Interface
```

This allows NetSage to demonstrate actual troubleshooting reasoning.

---

## 3. Evidence-Driven Diagnosis

A diagnosis should be supported by observable evidence.

NetSage should distinguish between:

```text
Known
```

and:

```text
Suspected
```

The system should avoid presenting an unsupported hypothesis as a confirmed root cause.

---

## 4. Progressive Investigation

Cases should support a troubleshooting sequence where additional evidence can be requested.

Example:

```text
Symptom
  ↓
show ip interface brief
  ↓
show ip route
  ↓
Diagnosis
```

This allows the case library to test NetSage's **next-best-command** capability.

---

## 5. Deterministic Verification

Whenever a failure can be reliably identified through structured information, a deterministic rule should eventually be available to verify it.

Examples include:

```text
Duplicate IP
Wrong subnet mask
Gateway mismatch
Interface down
Missing VLAN
Missing route
```

---

## 6. Human Review

Every AI diagnosis should be reviewable by a human.

The reviewer should be able to:

```text
Approve
Edit
Reject
```

The final human decision should be recorded for evaluation and responsible-AI analysis.

---

# Relationship to the NetSage Product

The taxonomy provides the foundation for several later deliverables:

```text
Troubleshooting Taxonomy
          │
          ├── 30+ Case Library
          │
          ├── Structured Evidence Dataset
          │
          ├── Deterministic Rules
          │
          ├── AI Prompt Evaluation
          │
          ├── Dashboard Categories
          │
          └── AI/Human Agreement Analysis
```

Therefore, the taxonomy should remain stable while individual case details, evidence, prompts, and implementation evolve.

---

# Current MVP Coverage

The MVP currently targets:

```text
Layer 1 / Connectivity
        ↓
IP Addressing
        ↓
Switching / VLANs
        ↓
Trunking
        ↓
Routing
        ↓
Inter-VLAN Routing
        ↓
DHCP
        ↓
ACL
        ↓
NAT
        ↓
DNS
        ↓
Wireless
```

This provides a controlled troubleshooting surface broad enough to demonstrate the NetSage Copilot concept while remaining manageable for the first implementation.