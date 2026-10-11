# PassSecure — User Guide & Demonstration Manual

## 1. Quick Demonstration Workflow

Follow this guide to demonstrate PassSecure's capabilities for a presentation or evaluation:

### Step 1: The Weak Password Test
1. Navigate to **Password Analyzer**.
2. Click the preset button **"Predictable Corp"** (loads `Summer2024!`).
3. Observe:
   - Evaluated as **Weak** or **Very Weak** because it exists in the breach database.
   - The **Structural Pattern Analysis** detects:
     - 4-Digit Year pattern (`2024`)
     - Common "Word + Number + Symbol" corporate template
     - Dictionary word match
   - Review the **Illustrative Attack Time Models** showing that on a fast offline GPU cluster, it can be cracked in under a minute.

### Step 2: The Memorable Passphrase Alternative
1. Navigate to **Secure Generator**.
2. Switch to **Memorable Passphrase (Diceware)**.
3. Select **4 words**, separator **"-"**, and check **Capitalize Words**.
4. Click **Regenerate**. Observe generated output (e.g. `Cobalt-Falcon-Granite-Summit`).
5. Notice that it has **~51 bits of entropy** and is assessed as **Strong** or **Very Strong**, while being effortlessly memorable.

### Step 3: Zero-Knowledge Breach Checking
1. Navigate to **Breach Check (k-Anon)**.
2. Enter `Summer2024!`.
3. Notice the **Client-Side SHA-1 Decomposition** box showing the 5-character prefix and 35-character private suffix.
4. Check the **Opt-in Consent** box and click **Execute Privacy-Preserving k-Anonymity Audit**.
5. Observe the breach count and response time returned.

### Step 4: Enterprise Audit Simulation
1. Navigate to **Audit Simulation**.
2. Review the fictional Acme Corp enterprise setup.
3. Inspect how password reuse across **Acme Work Email**, **Jira**, and **VPN Portal** drops the organizational Hygiene Score to a critical level.

### Step 5: Session History & Export
1. Navigate to **Reports & History**.
2. Toggle **Enable Local Session Audit Logging**.
3. Inspect the strength distribution chart and click **Export Markdown Report**.
