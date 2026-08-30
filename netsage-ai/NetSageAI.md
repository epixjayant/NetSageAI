# NetSage AI

> **AI Network Troubleshooting Copilot for Cisco-Style Labs and Packet Tracer**

## 1. Product Definition

### 1.1 Product Name

**NetSage AI**

### 1.2 Product Category

**AI-powered Network Troubleshooting Copilot**

### 1.3 Product Vision

NetSage AI is an AI-assisted network troubleshooting system designed to help users diagnose networking problems in Cisco-style laboratory environments, with **Cisco Packet Tracer** as the initial target environment.

NetSage does not simply provide an answer to a networking problem. It guides the user through a structured troubleshooting process:

```text
Problem
   ↓
Evidence
   ↓
Investigation
   ↓
Diagnosis
   ↓
Verification
   ↓
Human Review
   ↓
Fix
   ↓
Verification
```

The goal is to help users move from a network symptom to an evidence-backed root-cause diagnosis while keeping a human network engineer or learner in control of the final decision.

---

# 2. Problem

Network troubleshooting is often difficult for junior engineers and networking students because a single symptom can have many possible causes.

For example:

> **"PC-01 cannot reach Server-01."**

This symptom alone does not tell us whether the problem is:

- IP addressing
- subnet mask
- default gateway
- VLAN configuration
- trunking
- interface status
- routing
- ACL configuration
- NAT
- DNS
- or another network configuration issue

A good troubleshooter does not immediately guess the root cause.

Instead, they collect evidence and progressively narrow down the possibilities.

NetSage AI is designed to assist with this process.

---

# 3. Product Idea

NetSage AI acts like a **network troubleshooting copilot sitting beside the engineer**.

The user provides information such as:

- Network symptom
- Network topology
- Device involved
- Cisco `show` command output
- Configuration information
- Logs or other available evidence

NetSage analyzes the available evidence and determines whether it has enough information to make a diagnosis.

If more information is required, NetSage recommends the **next best diagnostic command**.

The user provides the result.

NetSage analyzes the new evidence and continues the investigation.

Eventually, NetSage produces:

```text
Likely Root Cause
        ↓
Supporting Evidence
        ↓
Confidence
        ↓
Recommended Fix
        ↓
Verification Step
```

The final diagnosis must be reviewed by a human before it is accepted.

---

# 4. Core Product Principle

NetSage AI is **not** designed as:

> "ChatGPT for networking."

Instead, it is designed as:

> **An evidence-driven network troubleshooting system combining AI reasoning, deterministic verification, and human approval.**

The product has three core intelligence layers.

---

## 4.1 AI Reasoning Engine

The AI engine is responsible for tasks such as:

- Understanding the user's reported symptom
- Interpreting network evidence
- Connecting multiple pieces of evidence
- Generating possible hypotheses
- Identifying the most likely cause
- Explaining why a diagnosis is likely
- Determining what additional evidence is needed
- Recommending the next diagnostic command
- Recommending an appropriate remediation

The AI should not assume that its first hypothesis is correct.

---

## 4.2 Deterministic Verification Engine

The deterministic engine provides rule-based validation using Python.

It is responsible for checks where the answer can be determined reliably from structured information.

Initial checks include:

- Duplicate IP address
- Incorrect subnet mask
- Default gateway mismatch
- Interface-down condition
- Missing VLAN
- Missing route

The purpose of this layer is to prevent the AI from being the only source of truth.

The architecture therefore becomes:

```text
AI Reasoning
      +
Deterministic Network Verification
      ↓
Evidence-backed Diagnosis
```

rather than:

```text
LLM
 ↓
Answer
```

---

## 4.3 Human-in-the-Loop Review

NetSage requires a human to review the AI's diagnosis before accepting it.

The reviewer can:

```text
Approve
Edit
Reject
```

This is an important product safety mechanism.

The AI acts as the **assistant**.

The human remains the **decision maker**.

Human corrections should also be recorded so that the system can measure where the AI succeeds and where it fails.

---

# 5. Target Users

## Primary Users

### Networking Students

Students learning:

- Cisco networking
- CCNA-style concepts
- Packet Tracer
- Network troubleshooting

NetSage can help them understand **why** a problem occurs instead of simply giving them the answer.

### Junior Network Engineers

Junior engineers can use NetSage as a troubleshooting assistant when they are unsure which diagnostic command to run next.

### Networking Instructors

Instructors can use the system to create and analyze troubleshooting exercises and observe common failure patterns.

---

# 6. Initial Environment

The first product environment is:

**Cisco-style laboratory networks / Cisco Packet Tracer**

The initial version does not need to directly automate Packet Tracer.

Instead, the MVP can work with:

```text
Topology
+
Symptom
+
Cisco-style command output
```

This allows the core troubleshooting intelligence to be developed and tested independently of Packet Tracer integration.

Future versions can explore deeper integration with network simulation environments and real network infrastructure.

---

# 7. Core User Experience

A typical NetSage session should follow this workflow.

```text
User reports a problem
        ↓
NetSage analyzes available evidence
        ↓
Does it have enough evidence?
        ↓
      NO
        ↓
Recommend next diagnostic command
        ↓
User provides command output
        ↓
NetSage analyzes new evidence
        ↓
Repeat if necessary
        ↓
Diagnosis becomes sufficiently supported
        ↓
Deterministic verification
        ↓
Human review
        ↓
Approve / Edit / Reject
        ↓
Recommended fix
        ↓
Verification
        ↓
Incident closed
```

---

# 8. Example User Interaction

## Initial Problem

The user reports:

```text
PC-01 cannot reach Server-01.
```

The user provides:

```text
PC-01 IP: 192.168.10.20
Gateway: 192.168.10.1

Server-01 IP: 192.168.30.50
```

NetSage does not immediately claim that routing is broken.

Instead, it identifies several possibilities:

```text
Possible causes:

1. Routing
2. ACL
3. VLAN
4. Interface
5. Gateway
```

NetSage determines that more evidence is required.

---

## Investigation Step 1

NetSage recommends:

```text
show ip interface brief
```

The user provides:

```text
Gi0/0    192.168.10.1    up
Gi0/1    192.168.30.1    up
```

NetSage interprets the evidence:

```text
Both routed interfaces are operational.

Interface-down is therefore less likely.

Additional evidence is required to determine
whether the router knows the destination network.
```

---

## Investigation Step 2

NetSage recommends:

```text
show ip route
```

The user provides:

```text
C 192.168.10.0/24 is directly connected
```

NetSage observes that the routing table does not contain a route for:

```text
192.168.30.0/24
```

NetSage produces:

### Likely Root Cause

**Missing route to 192.168.30.0/24**

### Confidence

**High**

### Evidence

```text
Destination network:
192.168.30.0/24

Routing table:
No matching route found
```

### Recommended Remediation

```text
Configure or restore the appropriate route
according to the intended network topology.
```

---

# 9. Human Review

Before the diagnosis is accepted, NetSage presents:

```text
┌───────────────────────────────┐
│ Human Review                  │
│                               │
│ Diagnosis: Missing route      │
│ Confidence: High              │
│                               │
│ [✓ Approve] [Edit] [✕ Reject]│
└───────────────────────────────┘
```

If the engineer approves:

```text
Diagnosis
    ↓
Approved
    ↓
Fix
    ↓
Verification
```

If the engineer edits or rejects the diagnosis:

```text
AI Diagnosis
    ↓
Human Correction
    ↓
Correction Recorded
    ↓
Re-investigation
```

---

# 10. Product Output

Every troubleshooting session should eventually produce a structured result:

```text
Incident
├── Symptom
├── Topology
├── Devices
├── Evidence
│   ├── Command
│   └── Output
├── Hypotheses
├── Recommended Next Command
├── Root Cause
├── Confidence
├── Supporting Evidence
├── Deterministic Verification
├── Recommended Fix
├── Human Decision
│   ├── Approved
│   ├── Edited
│   └── Rejected
└── Verification Result
```

This structure allows the troubleshooting process to become reusable data rather than an unstructured chat conversation.

---

# 11. Product Differentiation

NetSage should differentiate itself from a generic AI chatbot through five principles.

### 1. Evidence First

The system should distinguish between:

```text
What we know
```

and:

```text
What we suspect
```

### 2. Next-Best Investigation

Instead of immediately guessing, NetSage can ask:

> **"What should I inspect next?"**

and recommend the most useful diagnostic command based on the evidence already collected.

### 3. Deterministic Verification

Known networking conditions should be verified using deterministic Python rules whenever possible.

### 4. Human Approval

The AI should not silently make or accept a network change.

A human remains responsible for the final decision.

### 5. Learning From Corrections

When a human disagrees with the AI, that correction becomes structured information.

Over time, the system can measure:

- AI/human agreement
- Common AI mistakes
- Frequently occurring network problems
- Frequently required diagnostic commands
- Diagnosis accuracy
- Correction patterns

---

# 12. Product Architecture

The initial architecture is:

```text
                     NETSAGE AI
                         │
                         ▼
                  ┌──────────────┐
                  │   Web UI     │
                  │  Copilot     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Backend API │
                  └──────┬───────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
       AI Engine    Rule Engine   Case Engine
            │            │            │
            └────────────┼────────────┘
                         │
                         ▼
                  Evidence Model
                         │
                         ▼
                  Human Review
                         │
                         ▼
                 Audit / Analytics
```

---

# 13. MVP Scope

The first version of NetSage should focus on a controlled Cisco/Packet Tracer-style troubleshooting environment.

The MVP should include:

- 30+ realistic troubleshooting cases
- Structured network evidence
- Symptoms
- Topology information
- Cisco-style `show` command outputs
- AI diagnosis
- Next-command recommendation
- Fix recommendation
- Deterministic Python checks
- Human approval workflow
- Approve/Edit/Reject actions
- Responsible-AI correction log
- Dashboard
- End-to-end demonstration

The MVP should prioritize **quality of reasoning and evidence** over the number of features.

---

# 14. Initial Troubleshooting Domains

The initial case library should cover common networking failure categories such as:

```text
IP Addressing
Subnet Masks
Default Gateway
Duplicate IP
Interface Status
VLAN
Trunking
Routing
Missing Routes
ACL
NAT
DHCP
DNS
Wireless
Inter-VLAN Connectivity
```

The final case taxonomy will be developed before constructing the 30+ case dataset.

---

# 15. Long-Term Product Vision

Packet Tracer is the initial controlled environment, not necessarily the final product boundary.

The longer-term vision is:

```text
                    NETSAGE
                       │
             Troubleshooting Engine
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Packet Tracer   Lab Networks   Real Networks
        │              │              │
        └──────────────┼──────────────┘
                       │
               Network Evidence
                       │
                AI + Rules
                       │
                Human Review
                       │
                Verified Result
```

The same fundamental troubleshooting methodology can eventually support broader network environments.

The product therefore starts with a **controlled educational environment** while keeping a path toward a broader network engineering assistant.

---

# 16. Product Philosophy

NetSage follows four principles:

### Understand before diagnosing.

Do not confuse a symptom with a root cause.

### Evidence before confidence.

A diagnosis should be supported by observable evidence.

### Assist before automating.

The AI should help the human make a better decision rather than silently making the decision.

### Verify before accepting.

A proposed solution should be checked whenever a deterministic verification method is available.

---

# 17. One-Sentence Product Definition

> **NetSage AI is an evidence-driven network troubleshooting copilot that helps users diagnose Cisco-style lab network problems by analyzing symptoms and network evidence, recommending the next best diagnostic command, verifying likely causes with deterministic rules, and keeping a human in control of the final diagnosis and fix.**

---

# 18. MVP Success Criteria

NetSage MVP will be considered successful when a user can:

```text
1. Report a networking problem
        ↓
2. Provide available evidence
        ↓
3. Receive a useful next diagnostic command
        ↓
4. Provide additional evidence
        ↓
5. Receive an evidence-backed diagnosis
        ↓
6. See deterministic verification
        ↓
7. Review the diagnosis
        ↓
8. Approve/Edit/Reject it
        ↓
9. Receive a recommended fix
        ↓
10. Verify the result
```

The system should demonstrate that it can **guide troubleshooting**, not merely generate networking answers.