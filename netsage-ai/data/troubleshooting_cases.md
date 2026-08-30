# NetSage AI — Troubleshooting Cases

> A curated collection of Cisco-style network troubleshooting scenarios used to evaluate the NetSage AI Copilot.

## Cases

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
