# The Daily Phrontistery 🏛️📖

> **An atmospheric fine-art and rare lexicon New Tab extension (Chrome Manifest V3) and scholarly web application.**  
> *Transform every new browser tab into a contemplative thinking-place paired with public domain museum masterworks.*  
> **Version:** `v2.1.0` · [View Release Notes](RELEASE_NOTES.md)

---

## ✦ Overview

**The Daily Phrontistery** (from the Greek *phrontistērion*, a place for reflection and study) replaces the utilitarian blank tab with a quiet, museum-grade curatorial experience. 

Each time you open a tab, you are presented with an extraordinary, obscure word from historical English lexicons, paired with an intelligently matched fine-art masterpiece from world-renowned public collections (The Met, Art Institute of Chicago, and Cleveland Museum of Art), enriched with etymology, audio pronunciation, and bespoke editorial typography.

Whether configured as a **synchronous Daily Word** (the same word each day for mindful study) or a **New Word Every Tab** (continuous serendipitous discovery), the extension is designed to be calm, distraction-free, and endlessly rich.

---

## ✨ Key Features

### 🖼️ Curatorial Fine Art & Semantic Gist Pairing
- **Intelligent Gist Classifier**: Every word is automatically analyzed across 10 semantic archetypes:
  - *Fauna & Zoology* (Audubon, Stubbs, Dürer)
  - *Botany & Flora* (Redouté, Van Gogh, botanical engravings)
  - *Maritime & Oceans* (Turner, Hokusai, Homer)
  - *Cosmos & Astronomy* (Celestial cartography, Galileo folios)
  - *Architecture & Stone* (Piranesi etchings, Greek ruins)
  - *Spiritual & Mythology* (Blake, Renaissance frescoes)
  - *Anatomy & Natural Philosophy* (Vesalius woodcuts, Da Vinci sketches)
  - *Philosophy & Mind* (Rodin, Rembrandt chiaroscuro)
  - *Antiquity & History* (Classical statuary, Roman friezes)
  - *Linguistics & Literature* (Gutenberg plates, illuminated manuscripts)
- **Slow Ken Burns Drift**: Fine art exhibits a subtle, slow pan and zoom that breathes life into the canvas.
- **Atmospheric Starlight & Dust**: Optional floating ambient dust particles tuned to the painting’s color palette.
- **Art Focus Mode (`V` key)**: Dims the typography so you can inspect the full painting without obstruction.

### 🎚️ Word Frame Translucency & Opacity Slider
- **Translucent Glassmorphism**: Toggleable card translucency with a slider calibrated from **50% (half transparent)** to **100% (solid)**.
- **Immersive Art Visibility**: Allows the color, brushwork, and motion of the painting behind the card to intensify the emotional depth of reading the word.
- **On-Card Quick Cycle**: Click the discreet `Opacity: 65%` badge directly in the card header to jump through presets on the fly.
- **High-Contrast Typography**: Layered `backdrop-blur` and ambient drop-shadows ensure crisp text legibility regardless of background brightness.

### 🗣️ Versatile Pronunciation Engine
- **Supports Any 17,000+ Word List**: Operates automatically without needing pre-existing phonetics in your word list.
- **5 Selectable Pronunciation Styles** (in Layout Studio):
  1. **Phonetic Respelling** (e.g. `[AHRD-woolf]`, `[uh-BASS-ih-nayt]`) — Friendly English syllables with stressed syllables capitalized.
  2. **International Phonetic Alphabet** (e.g. `/ˈɑːrdˌwʊlf/`, `/əˈbæs.ɪ.neɪt/`) — Standard scholarly linguistic notation.
  3. **Both (Respelling & IPA)** — Side-by-side display for thorough study.
  4. **Audio Icon Only** — Minimalist speaker button.
  5. **Hidden / Off** — Pure typography layout.
- **Native Web Speech Pronunciation (`P` key)**: Natural voice synthesis spoken aloud at the press of a button.
- **Wiktionary Academic IPA**: Queries scholarly IPA transcriptions in the background and caches them locally.

### 📐 5 Editorial Layout Presets
- **Museum Placard**: Centered gallery placard with framed borders, gist badge, and clean action row.
- **Monograph Folio**: Left-anchored scholarly folio with illuminated drop cap and margin commentary notes.
- **Zenith Minimal**: Pure, unadorned typography maximizing negative space and painting visibility.
- **Split Curatorial**: Two-column layout showcasing a high-resolution art plate on the left and full scholarly lexicon on the right.
- **Broadsheet Gazette**: Double-column historical newspaper layout with dateline and classical masthead.

### 📚 17,000+ Custom Word List Importer
- Import your own Phrontistery dataset (or custom dictionary) via JSON anytime.
- Instantly hydrates all words with automatic semantic gist categorization, etymological web lookups, and phonetic respellings.

### 🧭 Research, Archive & Study Tools
- **Lexicon Archive Drawer (`A` key)**: Search all 17,000+ words with real-time fuzzy filtering, part of speech tags, and instant jumping.
- **Previous Words Ticker**: Horizontal tape at the bottom displaying your recently discovered words.
- **Favorites & Bookmarks**: Save notable words locally for revision.
- **One-Click Etymology Research**: Direct links to Wiktionary and Etymonline for deep root exploration.
- **Quick New Tab Search Bar**: Optional non-intrusive omnibar supporting Google, Wikipedia, and Etymonline queries.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> or <kbd>N</kbd> | Next Word / Shuffle Word |
| <kbd>S</kbd> | Open **Layout Studio** (presets, fonts, opacity, pronunciation) |
| <kbd>A</kbd> | Open **Lexicon Archive & Search** drawer |
| <kbd>V</kbd> | Toggle **Artwork Focus Mode** (dim text to inspect painting) |
| <kbd>P</kbd> | Play **Audio Pronunciation** |
| <kbd>M</kbd> | Toggle **Ambient Soundscape** (Rain / Vinyl) |
| <kbd>Esc</kbd> | Close any open modal or drawer |

---

## 🚀 Installation Guide

### Option 1: Load as a Google Chrome Extension (Manifest V3)

1. **Download the Extension Zip**:
   - In the app's top bar (or at the bottom of the **Layout Studio**), click **"Export .zip"**.
   - Save `daily-phrontistery-extension.zip` to your computer.
2. **Unzip the Archive**:
   - Extract the `.zip` file into a local folder (e.g. `~/Documents/daily-phrontistery-extension`).
3. **Open Chrome Extensions**:
   - In Google Chrome, navigate to `chrome://extensions`.
4. **Enable Developer Mode**:
   - Toggle the **"Developer mode"** switch in the top-right corner.
5. **Load Unpacked**:
   - Click **"Load unpacked"** in the top-left corner.
   - Select the folder you extracted in Step 2.
6. **Enjoy**:
   - Open a new tab (<kbd>Ctrl+T</kbd> / <kbd>Cmd+T</kbd>). Your new tab page is now The Daily Phrontistery!

---

### Option 2: Run & Develop Locally as a Web App

Requirements: Node.js (v18+) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/daily-phrontistery.git
cd daily-phrontistery

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

```bash
# 4. Build production bundle
npm run build

# 5. Typecheck & Lint
npm run lint
```

---

## 📋 Custom 17,000-Word JSON Specification

You can import any dictionary list into The Daily Phrontistery via the **Layout Studio** -> **Import Custom JSON** button. 

The importer supports two standard JSON formats:

### Format A: Array of Word Objects (Recommended)
```json
[
  {
    "word": "aardwolf",
    "definition": "a striped, hyena-like nocturnal mammal of southern and eastern Africa that feeds mainly on termites",
    "part_of_speech": "noun",
    "etymology": "Afrikaans, from Dutch aard (earth) + wolf (wolf)"
  },
  {
    "word": "abacinate",
    "definition": "to blind someone using a red-hot metal plate or iron basin held before their eyes",
    "part_of_speech": "verb"
  }
]
```

### Format B: Key-Value Dictionary Object
```json
{
  "aardwolf": "a striped hyena-like mammal of southern and eastern Africa",
  "abacinate": "to blind by placing a red-hot copper basin before the eyes",
  "defenestration": "the act of throwing someone out of a window"
}
```

*Note: Missing fields like `part_of_speech`, `etymology`, `ipa`, and `respelling` will be automatically detected and generated on import!*

---

## 🛠️ Architecture & Tech Stack

```
daily-phrontistery/
├── src/
│   ├── components/
│   │   ├── TopBar.tsx              # Navigation, mode toggle, audio controls
│   │   ├── WordDisplay.tsx         # Layout engine for the 5 editorial presets
│   │   ├── LayoutStudioModal.tsx   # Typography, opacity, and pronunciation preferences
│   │   ├── ArchiveDrawer.tsx       # 17k-word fuzzy search and favorites drawer
│   │   ├── PreviousWordsTicker.tsx # Bottom history ticker
│   │   └── AmbientParticles.tsx    # Canvas starlight & dust particle generator
│   ├── data/
│   │   └── phrontisteryWords.ts    # Seeded classical lexicon & enrichment pipeline
│   ├── utils/
│   │   ├── pronunciationService.ts # Syllable-stress engine, IPA generator & Wiktionary API
│   │   ├── etymologyService.ts     # Real-time Wiktionary etymology retrieval
│   │   ├── publicArtApi.ts         # Met Museum & Art Institute public domain integrations
│   │   ├── svgArtworks.ts          # Curated offline fine-art masterworks
│   │   ├── themeAndGist.ts         # 10-category semantic classifier & color palette
│   │   ├── audioSynth.ts           # Speech synthesis & ambient rain/vinyl soundscapes
│   │   └── extensionExporter.ts    # Chrome Manifest V3 bundler
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces and layout definitions
│   ├── App.tsx                     # State orchestrator & keybinding listener
│   └── main.tsx                    # React 19 entry point
├── manifest.json                   # Chrome Extension Manifest V3 configuration
├── package.json
└── README.md
```

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, `@tailwindcss/vite`
- **Iconography**: Lucide React
- **Audio Engine**: Web Speech API (`speechSynthesis`) & Web Audio API procedural sound synthesis
- **Data Persistence**: `localStorage` (100% private, zero external tracking)
- **Extension Format**: Google Chrome Manifest V3 (`chrome_url_overrides.newtab`)

---

## 🔒 Privacy, Offline Capability & Network Transparency

### 🛡️ 100% Private — Zero Telemetry & Local Storage
- **Zero Tracking**: No Google Analytics, telemetry, trackers, or advertising beacons.
- **Local Storage Only**: Your bookmark history, layout choices, and custom dictionaries are saved exclusively on your own computer in browser `localStorage`.
- **Zero Identification**: No cookies, logins, or tracking identifiers.

---

### 🌐 Network Disclosure Matrix (When, Why, and How)

For complete transparency and compliance with Chrome Web Store User Data policies, here is the full record of all network endpoints accessed by The Daily Phrontistery:

| Service / Endpoint | When Accessed | Why Accessed | How Accessed | Data Sent |
| :--- | :--- | :--- | :--- | :--- |
| **Metropolitan Museum of Art Open Access**<br>`collectionapi.metmuseum.org` | When opening/shuffling words online | To fetch open-access (CC0) artworks semantically matching the word's theme | Anonymous client-side HTTPS `GET` | Only the semantic search term (e.g. `falcon`, `ruins`) |
| **Wikimedia Commons**<br>`upload.wikimedia.org` | When streaming curated public domain fine art backdrops | Displays high-resolution historical paintings (Piranesi, Turner, Monet, Audubon) | Static image load with `referrerPolicy="no-referrer"` | None |
| **Wiktionary API**<br>`en.wiktionary.org/w/api.php` | When opening etymology or fetching academic IPA notation | Queries scholarly etymological roots and phonetic transcriptions | Anonymous REST API query (cached locally to avoid repeated requests) | The word being looked up |
| **Google Fonts**<br>`fonts.googleapis.com` | On initial web app load | Renders classical editorial serif typography (Cinzel, Cormorant Garamond) | Standard CSS stylesheet request (system fonts serve as instant fallbacks) | Standard browser user-agent |

---

### 📴 What Operates 100% Offline (Local Computation)

- **17,000+ Obscure Lexicon**: All dictionary entries are stored and queried on-device.
- **Algorithmic Phonetic Engine**: Syllable splitting, vowel stress, and phonetic respellings are computed entirely in client-side TypeScript.
- **Speech Pronunciation**: Uses the browser's native `window.speechSynthesis` API without downloading remote audio files.
- **Procedural Soundscape**: Library rainfall and vinyl crackle are generated mathematical wave functions via the Web Audio API.
- **Offline Vector Art**: Curated SVG masterworks function without internet access.

---

## 📜 License

Created with devotion to the preservation of rare English terminology and fine art.  
Public domain fine art assets are provided under Open Access (CC0) terms by The Metropolitan Museum of Art, The Art Institute of Chicago, and The Cleveland Museum of Art.
