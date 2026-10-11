# PassSecure — Privacy Specification & Threat Model

## 1. Core Privacy Invariant

> **"Your password is analyzed locally in this browser and is not stored or transmitted by PassSecure."**

PassSecure treats all credential inputs as toxic liabilities. The system is designed to eliminate risk at the architectural level rather than relying solely on policy promises.

---

## 2. Mathematical k-Anonymity Protocol

When checking whether a password has appeared in compromised breach corpuses, PassSecure implements Troy Hunt's **k-Anonymity range model**:

1. **Local Digest**: The browser hashes the user's password using the Web Crypto API (`window.crypto.subtle.digest('SHA-1', ...)`).
2. **Decomposition**: The 40-character hexadecimal SHA-1 string is split:
   - **Prefix**: First 5 characters (e.g. `5BAA6`)
   - **Suffix**: Remaining 35 characters (e.g. `1E4C9B93F3F0682250B6CF8331B7EE68FD8`)
3. **Anonymized Query**: The browser requests `GET /range/5BAA6` over TLS.
4. **Candidate Cohort**: The API returns all known breached hashes that begin with `5BAA6` (typically 500 to 1,000 candidate records).
5. **Local Verification**: The browser scans the downloaded cohort for the 35-character suffix in memory.

### Privacy Guarantee
Because the 5-character prefix represents $16^5 = 1,048,576$ buckets across billions of passwords, an observer or the HIBP service cannot identify which specific password was queried out of the hundreds returned in that bucket.

---

## 3. Ephemeral Memory Lifecycle

- Passwords exist solely in ephemeral React state (`useState`).
- When the user clicks **Clear** or navigates to another module, the state reference is cleared.
- Form inputs have `autoComplete="off"`, `autoCorrect="off"`, `autoCapitalize="off"`, and `spellCheck="false"` to prevent browser caching, cloud spelling sync, and autofill caching.

---

## 4. Session History Privacy Boundary

PassSecure provides an optional, opt-in session history logger. If the user chooses to enable it:

- **What IS stored**:
  - Timestamp (epoch ms)
  - Password length (integer)
  - Estimated strength label (`Very Weak`, `Weak`, `Fair`, `Strong`, `Very Strong`)
  - Theoretical Shannon entropy (float bits)
  - Array of detected weakness categories (e.g. `["Sequential numbers", "Common dictionary word"]`)
- **What is NEVER stored**:
  - Plaintext password
  - Partial password
  - Salt or reversible cipher
  - SHA-1 or any cryptographic hash
  - Account username or URL identifiers

---

## 5. Threat Model Analysis

| Threat Vector | Mitigation Strategy |
| :--- | :--- |
| Network Eavesdropping (MitM) | No password data leaves the browser. Range query uses TLS 1.3 and only transfers 5 hex characters. |
| Malicious Server / Compromised API | Backend FastAPI server rejects any input longer than 5 hex characters with HTTP 422. |
| Browser Storage Scraping | Plaintext passwords and hashes are strictly forbidden from localStorage and sessionStorage. |
| Telemetry / Crash Reporting Leakage | Zero telemetry, error-tracking, or third-party analytics scripts are bundled into PassSecure. |
| Modulo Bias in Random Generation | Random integer generator uses rejection sampling over 32-bit unsigned buffers to guarantee uniform distribution. |
