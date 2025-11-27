# JavaScript Obfuscation Guide for WLQI Calculator

## Why Obfuscate?

The WLQI calculator contains proprietary algorithms and scoring methodologies that are the intellectual property of QuickCalcLabs. Obfuscation provides an additional layer of protection against:

1. **Code theft** - Making it difficult to copy our algorithms
2. **Reverse engineering** - Preventing competitors from understanding our methodology
3. **Unauthorized modifications** - Protecting the integrity of our scoring system

## Current Protection Layers

### 1. Proprietary Algorithm Design
- Non-linear transformations with custom curves
- Dynamic weight adjustments based on score variance
- Hidden normalization functions
- Sigmoid smoothing for score calibration
- Obfuscated constant arrays

### 2. Code Copyright
- Copyright notices in all source files
- Legal warnings against unauthorized use
- Trade secret designations

### 3. Legal Protection
- Copyright notice on website
- Terms of Service with IP protection clauses
- Prohibited uses clearly stated

## Full Obfuscation Setup (Optional - for Maximum Protection)

If you want to add another layer of protection, follow these steps:

### Step 1: Install JavaScript Obfuscator

```bash
npm install --save-dev javascript-obfuscator
```

### Step 2: Create Obfuscation Script

Add to your `package.json`:

```json
{
  "scripts": {
    "obfuscate": "javascript-obfuscator js/wlqi-calculator.js --output js/wlqi-calculator.min.js --config .obfuscate-config.json",
    "build": "npm run obfuscate"
  }
}
```

### Step 3: Run Obfuscation

```bash
npm run obfuscate
```

### Step 4: Update HTML to Use Obfuscated Version

In `work-life-quality-index.html`, change:
```html
<script src="js/wlqi-calculator.js"></script>
```
to:
```html
<script src="js/wlqi-calculator.min.js"></script>
```

### Step 5: Keep Original Secure

- **Never commit** `wlqi-calculator.js` to public repositories
- Store original source code in a private, secure location
- Only deploy the obfuscated `.min.js` version to production
- Add to `.gitignore`:
  ```
  js/wlqi-calculator.js
  .obfuscate-config.json
  ```

## Alternative: Online Obfuscation

If you prefer not to use npm, use an online obfuscator:

1. Go to: https://obfuscator.io/
2. Paste your `wlqi-calculator.js` code
3. Use these settings:
   - Control Flow Flattening: High
   - Dead Code Injection: Medium
   - String Array Encoding: Base64
   - Self Defending: Enabled
   - Rename Globals: Disabled (to avoid breaking functionality)
4. Click "Obfuscate"
5. Save as `wlqi-calculator.min.js`

## Best Practices

1. **Always test** the obfuscated version thoroughly before deployment
2. **Keep backups** of your original source code
3. **Version control** - Use private Git repositories for source code
4. **Regular updates** - Re-obfuscate after any code changes
5. **Monitor** for unauthorized copies of your calculator online

## Additional Protection Measures

1. **Server-side validation** - Consider moving critical calculations to backend API
2. **Rate limiting** - Prevent automated scraping of your calculator
3. **Watermarking** - Add unique identifiers to detect copied versions
4. **Legal action** - Be prepared to send cease and desist letters to violators

## Legal Notice

The WLQI calculator algorithm is proprietary to QuickCalcLabs and protected by:
- Copyright law (automatic upon creation)
- Trade secret protection (keep source code confidential)
- Terms of Service (binding agreement with users)

Unauthorized use, copying, or distribution is prohibited and will result in legal action.

---

**For questions or licensing inquiries, contact:** licensing@quickcalclabs.com

