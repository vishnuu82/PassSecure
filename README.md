# PassSecure — Intelligent Password Security Auditor

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed%20(26%2F26)-brightgreen?logo=vitest)](https://vitest.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-Passed%20(8%2F8)-brightgreen?logo=pytest)](https://pytest.org/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Credential%20Retention-success)](#privacy-guarantee)

> **PassSecure** is an intelligent, privacy-preserving password security auditing platform built as a **B.Tech Artificial Intelligence and Data Science** capstone project. It helps users evaluate password strength, identify predictable structural patterns, simulate enterprise credential hygiene risks, and generate cryptographically resilient passwords and memorable passphrases without ever transmitting plaintext credentials.

---

## Table of Contents
1. [Core Features](#1-core-features)
2. [Privacy Guarantee & Trust Model](#2-privacy-guarantee--trust-model)
3. [Architecture Overview](#3-architecture-overview)
4. [Technology Stack](#4-technology-stack)
5. [Windows 11 Prerequisites & Setup](#5-windows-11-prerequisites--setup)
6. [Running the Application](#6-running-the-application)
7. [Automated Testing](#7-automated-testing)
8. [Demonstration Guide](#8-demonstration-guide)
9. [Documentation Index](#9-documentation-index)
10. [Known Limitations](#10-known-limitations)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Core Features

### 🛡️ Password Analyzer
- **Documented Heuristic Estimator**: Uses `zxcvbn` to evaluate real-world guessability and dictionary resistance.
- **Structural Pattern Detector**: Automatically identifies:
  - Length deficiencies (< 8 critical, 8–11 warning, 12–15 good, $\ge$ 16 excellent)
  - Consecutive repeated characters and excessive redundancy
  - Sequential alphabetical and numeric patterns (`abc`, `1234`)
  - Spatial keyboard walks on QWERTY layouts (`qwerty`, `asdfgh`)
  - Predictable leet-speak substitutions (`p@ss`, `w0rd`)
  - 4-digit years and calendar dates (`2024`, `1998`)
  - Common corporate template patterns (`Season + Year + !`)
- **Shannon Information Entropy**: Calculates theoretical entropy in bits ($H = L \cdot \log_2 R$).
- **Multi-Threat Attack Time Matrix**: Illustrative estimates across 4 adversary models (Online throttled, Fast API, Offline slow Argon2id/bcrypt KDF, and Offline fast GPU cluster) with documented assumptions.
- **Evidence-Based Remediation**: Actionable guidance derived from NIST Special Publication 800-63B.

### 🔑 Cryptographic Password & Passphrase Generator
- **CSPRNG Powered**: Utilizes `window.crypto.getRandomValues()` with **unbiased rejection sampling** to mathematically eliminate modulo bias.
- **Random Password Mode**: Configurable length (12 to 64), charset toggles (uppercase, lowercase, digits, symbols), and unambiguous character filtering (`0O1lI`). Guarantees inclusion of selected character sets with uniform Fisher-Yates shuffle.
- **Diceware Passphrase Mode**: Generates 3 to 8 word memorable passphrases using a bundled, curated EFF dictionary ($1,200+$ clean words) with custom separators, capitalization, and optional numeric suffixes.
- **Real-Time Evaluation**: Instant strength and entropy estimation of generated secrets.

### 🔍 Breached Credential Checker (k-Anonymity)
- **Mathematical Zero-Knowledge Privacy**: Computes the SHA-1 hash locally in browser memory. Transmits **only the first 5 hexadecimal characters** to the Have I Been Pwned API.
- **Local Suffix Matching**: The returned bucket of ~800 candidate suffixes is evaluated purely inside the browser. Plaintext passwords or full hashes never leave client memory.
- **Local Offline Dataset Mode**: Bundled offline database of top breached credentials for air-gapped demonstration.

### 🏢 Password Hygiene Audit Simulation
- **Educational Synthetic Simulation**: Demonstrates corporate identity vulnerabilities using fictional organizational profiles (Acme Corp & Tech Startup).
- **Attack Path Identification**: Visualizes credential reuse across work email, Jira, and VPN portals, missing MFA, and outdated credentials.
- **Automated Hygiene Scoring**: Calculates an organizational hygiene score (0–100) with remediation steps.

### 📚 Security Curriculum & Threat Literacy
- 8 in-depth interactive lessons covering credential stuffing, entropy mathematics, Diceware combinatorics, zero-knowledge password vaults, MFA tiers (SMS vs TOTP vs FIDO2), and incident response.
- Direct citations and links to official NIST SP 800-63B, CISA, and OWASP guidelines.

### 📊 Reports & Session History
- **Zero-Credential Metadata Storage**: Optional opt-in logging that stores non-sensitive metrics only (length, strength label, entropy, detected weaknesses).
- **Visual Analytics**: Interactive Recharts distribution of tested password scores.
- **Export Options**: One-click export to Markdown security audit reports and JSON metadata.

---

## 2. Privacy Guarantee & Trust Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRIVACY GUARANTEE                             │
│  "Your password is analyzed locally in this browser and is not stored  │
│                      or transmitted by PassSecure."                    │
└────────────────────────────────────────────────────────────────────────┘
```

PassSecure strictly enforces:
1. **Zero Storage of Plaintext Passwords**: No persistence in `localStorage`, `sessionStorage`, cookies, or browser cache.
2. **Zero URL Leakage**: Passwords never enter URL parameters, query strings, or fragments.
3. **Zero Telemetry**: No third-party tracking scripts, analytics, or error reporters.
4. **Immediate Memory Clearing**: Clearing the input or resetting disposes of component references.
5. **Strict API Guardrails**: The optional backend proxy rejects any input that is not a 5-hex character prefix with HTTP 422.

---

## 3. Architecture Overview

```
passsecure/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Modular UI components
│   │   │   ├── layout/           # Sidebar, Header, PrivacyBadge
│   │   │   ├── analyzer/         # Input, StrengthMeter, PatternDetector, CrackTimes
│   │   │   └── ...
│   │   ├── pages/                # Analyzer, Generator, Breach, Audit, Education, Reports
│   │   ├── services/             # analyzerEngine, cryptoGenerator, breachService, history
│   │   └── tests/                # 26 automated Vitest unit tests
├── backend/                      # Python 3.14 + FastAPI helper proxy
│   ├── app/                      # Routes, schemas, breach proxy, synthetic demo data
│   └── tests/                    # 8 automated pytest unit tests
└── docs/                         # In-depth architectural & mathematical specifications
```

---

## 4. Technology Stack

- **Frontend**: React 19, Vite 8, TypeScript 5.8, Tailwind CSS v4, Lucide React, Recharts.
- **Security Utilities**: `zxcvbn`, Web Crypto API (`SubtleCrypto`), EFF Diceware wordlist.
- **Backend (Optional)**: Python 3.14, FastAPI, Uvicorn, Pydantic, HTTPX.
- **Testing**: Vitest + jsdom (Frontend), pytest + TestClient (Backend).

---

## 5. Windows 11 Prerequisites & Setup

### Prerequisites
- **Node.js**: v18+ (tested on Node.js v24.19)
- **Python**: 3.10+ (tested on Python 3.14.7)
- **PowerShell**: Windows 11 default

> **Note on PowerShell Script Execution**: If PowerShell restricts running `.ps1` scripts, use `npm.cmd` and `npx.cmd` directly as documented below.

---

## 6. Running the Application

### Step 1: Start the Frontend (Vite)
Open Windows Terminal / PowerShell:
```powershell
cd C:\Users\vy333\.gemini\antigravity\scratch\passsecure\frontend
npm.cmd run dev
```
Open your browser at: **`http://localhost:5173`**

### Step 2: Start the Backend (Optional FastAPI Proxy)
Open a second PowerShell window:
```powershell
cd C:\Users\vy333\.gemini\antigravity\scratch\passsecure\backend
py -m uvicorn app.main:app --reload --port 8000
```
API Documentation available at: **`http://localhost:8000/docs`**

> **Note**: PassSecure operates **100% locally in the browser** even without the backend running!

---

## 7. Automated Testing

### Frontend Test Suite (Vitest)
```powershell
cd C:\Users\vy333\.gemini\antigravity\scratch\passsecure\frontend
npx.cmd vitest run
```
**Results**: 26 tests across 4 test suites passing (Analyzer, CSPRNG Generator, Breach Checker, Privacy Boundary).

### Backend Test Suite (Pytest)
```powershell
cd C:\Users\vy333\.gemini\antigravity\scratch\passsecure\backend
py -m pytest -v
```
**Results**: 8 tests passing (Health check, k-Anonymity prefix validation, rejection of full hashes and plaintext, demo data).

---

## 8. Demonstration Guide

1. **Weak vs Strong Comparison**:
   - In **Password Analyzer**, test `Summer2024!` vs `cobalt-falcon-granite-summit`.
   - Observe how pattern detection catches the corporate seasonal mask and how entropy scales from ~38 bits to ~52 bits.
2. **CSPRNG Generation**:
   - In **Secure Generator**, generate a 24-character password and inspect the character pills.
   - Switch to **Memorable Passphrase**, generate a 5-word Diceware passphrase, and copy it to the clipboard.
3. **Zero-Knowledge Breach Audit**:
   - In **Breach Check**, test `123456`.
   - Observe the live SHA-1 hash breakdown into `5BAA6` (public prefix) and `1E4C9...` (private suffix).
4. **Enterprise Audit Simulation**:
   - In **Audit Simulation**, switch between **Enterprise Corp Vault** and **Tech Startup Vault** to analyze credential stuffing risk paths.
5. **Download Non-Sensitive Report**:
   - In **Reports & History**, toggle session logging, review the Recharts distribution, and download the Markdown report.

---

## 9. Documentation Index

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): Architectural topology and trust boundaries.
- [`docs/PRIVACY_SPECIFICATION.md`](docs/PRIVACY_SPECIFICATION.md): Zero-retention model and k-anonymity protocol details.
- [`docs/ALGORITHMS_AND_MATHEMATICS.md`](docs/ALGORITHMS_AND_MATHEMATICS.md): Shannon entropy, Diceware combinatorics, and rejection sampling proofs.
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md): Step-by-step walkthrough for faculty and project reviewers.

---

## 10. Known Limitations

- **Theoretical Models**: Illustrative crack times are mathematical bounds based on combinatorial space; targeted credential stuffing or social engineering may compromise accounts faster.
- **Offline Breach Scope**: The local breach dataset contains a curated sample of high-frequency breached passwords. Exhaustive lookups require the k-anonymity cloud mode.
- **Browser Memory Volatility**: Passwords are wiped from state on component unmount, but JavaScript garbage collection timing is managed by the browser engine.

---

## 11. Future Enhancements

- WebAssembly (Wasm) implementation of Argon2id password-hashing benchmark inside the browser.
- Offline Bloom filter integration for compressed 10-million password breach checking without network access.
- Hardware FIDO2 / WebAuthn browser registration sandbox for testing security key credentials locally.

---

**Developed for**: B.Tech Artificial Intelligence and Data Science  
**License**: MIT Academic License
