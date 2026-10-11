# PassSecure — Algorithms & Mathematical Foundations

## 1. Information Entropy Calculation

PassSecure calculates Shannon Information Entropy to estimate theoretical search resistance:

$$H = L \cdot \log_2(R)$$

Where:
- $L$ is the length of the password string.
- $R$ is the size of the active character pool derived from the classes present in the password:
  - Lowercase characters ($a-z$): $+26$
  - Uppercase characters ($A-Z$): $+26$
  - Digits ($0-9$): $+10$
  - Standard ASCII Symbols: $+33$

### Why Length Outperforms Complexity
Notice that $L$ scales the entropy linearly, whereas $R$ is constrained inside a logarithmic function:
- An 8-character password with full complexity ($R = 95$):
  $$H = 8 \cdot \log_2(95) \approx 8 \cdot 6.57 = 52.56\text{ bits}$$
- A 16-character password with lowercase letters only ($R = 26$):
  $$H = 16 \cdot \log_2(26) \approx 16 \cdot 4.70 = 75.21\text{ bits}$$
- Combinatorial search space ratio:
  $$\frac{26^{16}}{95^8} \approx \frac{4.36 \times 10^{22}}{6.63 \times 10^{15}} \approx 6.57 \times 10^6$$
  The lowercase 16-character password is **over 6.5 million times harder** to brute force than the complex 8-character password.

---

## 2. Diceware Combinatorial Entropy

PassSecure bundles a curated dictionary of $N = 1,200+$ clean, memorable words derived from the EFF Diceware list.

When a passphrase of $W$ words is generated uniformly at random:

$$S = N^W$$
$$H_{\text{passphrase}} = W \cdot \log_2(N)$$

For a 4-word passphrase with $N = 1,200$:
$$S = 1200^4 \approx 2.07 \times 10^{12} \implies H \approx 40.9\text{ bits}$$

For a 5-word passphrase with $N = 7,776$ (full EFF list):
$$S = 7776^5 \approx 2.84 \times 10^{19} \implies H \approx 64.6\text{ bits}$$

Because each word is chosen independently and uniformly, grammar and syllable rules do not reduce the search space.

---

## 3. Cryptographic CSPRNG & Unbiased Rejection Sampling

Most naive password generators use `Math.random() % range`, which suffers from two security vulnerabilities:
1. **Predictability**: `Math.random()` is powered by pseudo-random algorithms (e.g. xorshift128+) that are cryptographically broken.
2. **Modulo Bias**: When the random integer space ($2^{32}$) is not an exact multiple of the character pool size ($R$), lower index numbers occur with higher probability.

### PassSecure Rejection Sampling Algorithm
PassSecure draws 32-bit unsigned integers from `window.crypto.getRandomValues(new Uint32Array(1))` and applies rejection sampling:

```typescript
const UINT32_MAX = 0xffffffff;
const limit = UINT32_MAX - (UINT32_MAX % max);
let randomVal: number;

do {
  window.crypto.getRandomValues(buffer);
  randomVal = buffer[0];
} while (randomVal >= limit);

return randomVal % max;
```

Any number falling in the biased remainder zone $[limit, 2^{32}-1]$ is discarded and redrawn, mathematically guaranteeing an exact uniform distribution across all characters.

---

## 4. Threat Model Scenarios & Guess Rate Assumptions

PassSecure models password crack times across four concrete adversary profiles:

1. **Online Throttled ($0.0278\text{ guesses/sec}$)**:
   - Web application with account lockout policies (100 attempts / hour).
2. **Online Fast ($10\text{ guesses/sec}$)**:
   - Misconfigured internal API without rate limiting or CAPTCHA.
3. **Offline Slow KDF ($10,000\text{ hashes/sec}$)**:
   - Password hash obtained from database breach protected with modern memory-hard KDF (Argon2id, bcrypt cost 12).
4. **Offline Fast Hash ($10^{10}\text{ hashes/sec}$)**:
   - Unsalted MD5, NTLM, or SHA-1 hashes attacked on an 8x NVIDIA RTX 4090 GPU cracking rig.
