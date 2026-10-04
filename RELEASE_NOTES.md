# Release Notes — The Daily Phrontistery

---

## 🏛️ Version 2.1.0 (October 2026)

> **Theme**: *Curatorial Layout Archetypes, Lexicon Integrity & Packaging Reliability*

Version 2.1.0 marks a significant milestone in fulfilling the bespoke, non-centered editorial vision of The Daily Phrontistery, ensuring that every fresh tab and downloaded Chrome Extension boots into the signature book-folio layout with zero configuration required.

---

### ✨ Highlights

#### 1. Editorial Monograph as Default Archetype
* **Signature Left-Third Positioning**: Fresh installations and new tabs now default directly to **Editorial Monograph** (Layout Archetype #1). The word frame rests at the ~1/3 horizontal mark from the left edge and subtly into the lower third, establishing an asymmetrical, contemplative balance against the fine-art background.
* **Storage Migration**: Existing browser sessions with legacy centered defaults (`museum_placard`) or missing layout keys automatically upgrade to the signature Monograph layout.
* **Layout Studio Reordering**: Layout Studio presets have been reorganized to put Editorial Monograph at #1, while preserving centered Museum Placard, Zenith Minimalist, Split Curatorial, and Broadsheet Folio.

#### 2. Strict Lexicon De-duplication Guard
* **Auto-Deduplication**: Resolved an issue where importing `huge-word-list.json` or custom dictionaries could cause the word counter to double (e.g. 17,004 &rarr; 34,008).
* **Core Set Validation**: The dictionary loader (`getCustomWords`) and importer (`handleImportCustomWords`) now cross-reference all incoming and stored words against a fast lookup `Set` of the 17,004 built-in words. Duplicates are cleanly filtered out, ensuring the lexicon counter remains exact and unpolluted.

#### 3. Bulletproof Extension Packaging & Export
* **Direct Full-Bundle Exporter**: Replaced the legacy client-side placeholder stub with a direct, robust download pipeline that serves the complete ~803 KB Manifest V3 package (`daily-phrontistery-chrome-extension-v2.1.0.zip`).
* **Complete Offline Self-Containment**: Every exported `.zip` is guaranteed to contain:
  * `assets/` directory (compiled React application JS and Tailwind CSS bundle)
  * `huge-word-list.json` (offline 17,004-word lexicon)
  * `icons/` (16px, 48px, 128px PNGs + SVG vector master)
  * `index.html` (Manifest V3 entry point)
  * `manifest.json` (v2.1.0 configuration with zero remote script dependencies)
  * `README_INSTALL.txt` (step-by-step developer mode load instructions)
* **Automated Version Synchronization**: `scripts/package-extension.cjs` now automatically propagates the version from `package.json` into `manifest.json` during the build step, eliminating version drift.

#### 4. Visual Version Verification
* **Header & Colophon Badges**: Added an on-screen `v2.1.0` badge next to "Daily Phrontistery" in the top bar and within the Colophon dialog, making it easy to confirm that your loaded browser extension or web view is running the latest build.

---

### 🛠️ Maintenance & Refactoring
* **Codebase Cleanup**: Removed obsolete 4K scaling flags (`BoxScale`, `isImmersive`) and unneeded type definitions, ensuring strict TypeScript compilation with zero warnings.
* **Performance**: Retained deterministic $O(1)$ lazy word enrichment ($<0.005$ ms selection time) so browsing 17,000+ words never causes memory or frame drops.

---

### 📦 Installation
To install the v2.1.0 release in Google Chrome:
1. Click **Export .zip** in the top-right header (or grab `daily-phrontistery-extension.zip` from `public/`).
2. Unzip the archive into any local folder.
3. In Chrome, navigate to `chrome://extensions` and toggle **Developer mode** ON.
4. Click **Load unpacked** and select the unzipped directory.
