# PassSecure — Technical Architecture & Security Specification

## 1. System Overview

**PassSecure** is an intelligent password security auditing platform built for academic and professional demonstration. Designed under the principle of **Zero Credential Retention**, PassSecure evaluates password strength, detects predictable patterns, simulates enterprise password hygiene risks, and performs privacy-preserving breached credential checks.

---

## 2. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER RUNTIME                            │
│                                                                        │
│  ┌───────────────────────┐         ┌───────────────────────────────┐   │
│  │   Password Input      │ ──────> │    Analyzer Engine (zxcvbn)   │   │
│  │   (Ephemeral State)   │         │    - Shannon Entropy Bits     │   │
│  └───────────────────────┘         │    - Structural Patterns      │   │
│                                    │    - 4x Threat Model Speeds   │   │
│                                    └───────────────────────────────┘   │
│                                                                        │
│  ┌───────────────────────┐         ┌───────────────────────────────┐   │
│  │  Crypto CSPRNG Gen    │ <─────  │   window.crypto API           │   │
│  │  - Rejection Sampling │         │   - Zero Modulo Bias          │   │
│  │  - Diceware Wordlist  │         │   - Fisher-Yates Shuffle      │   │
│  └───────────────────────┘         └───────────────────────────────┘   │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  k-Anonymity Engine (SubtleCrypto SHA-1)                        │   │
│  │  - Full Hash: 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8          │   │
│  │  - Prefix (5 hex): [5BAA6] ─────── HTTPS Range Query ───────┐   │   │
│  │  - Suffix (35 hex): [1E4C9...] ── Local Suffix Match ◄───┐ │   │   │
│  └──────────────────────────────────────────────────────────│─│─┘   │
└─────────────────────────────────────────────────────────────│─│────────┘
                                                              │ │
                                                5-Hex Prefix  │ │ ~800 Suffixes
                                                Query Only    │ │ Returned
                                                              ▼ │
                                    ┌───────────────────────────┴────┐
                                    │ Have I Been Pwned Range API /  │
                                    │ FastAPI Privacy Proxy          │
                                    │ (Zero Plaintext Accepted)      │
                                    └────────────────────────────────┘
```

---

## 3. Component Breakdown

### Frontend (`frontend/`)
- **React 19 + TypeScript**: Type-safe component architecture with clean lifecycle isolation.
- **Tailwind CSS v4**: High-contrast dark cybersecurity UI theme with accessible visual indicators.
- **Lucide Icons**: Clear security iconography for risk identification.
- **Recharts**: Non-sensitive aggregate distribution charts for audit logs.
- **zxcvbn**: Documented heuristic password guessability model.
- **Web Crypto API**: Native browser cryptographic randomness (`crypto.getRandomValues`) and SHA-1 hashing (`crypto.subtle.digest`).

### Backend (`backend/` — Optional Proxy & Metadata API)
- **FastAPI (Python 3.14)**: Asynchronous REST framework.
- **Strict Prefix Validation**: Regular expression validation (`^[0-9A-Fa-f]{5}$`) guarantees that full hashes or plaintext passwords are never processed.
- **Security Headers Middleware**: Enforces `nosniff`, `DENY` clickjacking protections, and `no-store` cache controls.

---

## 4. Trust Boundaries & Privacy Invariants

| Component | Can Access Plaintext Password? | Can Access Full Hash? | Network Transmission Allowed? |
| :--- | :---: | :---: | :---: |
| Password Analyzer | ✅ (Ephemeral memory only) | ❌ | ❌ (Strictly local) |
| Password Generator | ✅ (Generated secret only) | ❌ | ❌ (Strictly local) |
| Local Breach Checker | ✅ (Local compare only) | ❌ | ❌ (Strictly local) |
| k-Anonymity Breach Checker | ✅ (SHA-1 hashing only) | ✅ (Local slice only) | ⚠️ **5-Hex Prefix Only** |
| Session History Storage | ❌ **FORBIDDEN** | ❌ **FORBIDDEN** | ❌ (Local metadata only) |
| Backend FastAPI Server | ❌ **FORBIDDEN** | ❌ **FORBIDDEN** | ⚠️ **5-Hex Prefix Only** |
