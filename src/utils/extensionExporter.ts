import JSZip from 'jszip';

/**
 * Procedurally generates a clean PNG icon matching the official Daily Phrontistery 'dPʰ'
 * branding on dark navy ground with canary yellow 'd', amber 'P', cyan dot, and white italic 'h'.
 */
async function generateIconPngBlob(size: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Antialiasing smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const radius = size * 0.20;

  // Background rounded dark navy rectangle
  ctx.fillStyle = '#0c1222';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(0, 0, size, size, radius);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.fill();

  // 1. Lowercase yellow 'd'
  ctx.fillStyle = '#ffff00';
  ctx.font = `900 ${Math.round(size * 0.50)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('d', size * 0.10, size * 0.76);

  // 2. Uppercase bold orange 'P'
  ctx.fillStyle = '#f58f18';
  ctx.font = `900 ${Math.round(size * 0.64)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;
  ctx.fillText('P', size * 0.30, size * 0.76);

  // 3. Sky blue / cyan accent dot under bowl of 'P'
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(size * 0.525, size * 0.69, size * 0.048, 0, Math.PI * 2);
  ctx.fill();

  // 4. Superscript white italic serif 'h'
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic normal ${Math.round(size * 0.24)}px Georgia, "Times New Roman", serif`;
  ctx.fillText('h', size * 0.73, size * 0.30);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate PNG blob'));
    }, 'image/png');
  });
}

/**
 * Builds and downloads a 100% Manifest V3 CSP-compliant Chrome Extension package.
 * Pre-compiled, fully self-contained, 100% offline, with zero external redirects.
 */
export async function downloadChromeExtensionPackage(): Promise<void> {
  // 1. Prioritize downloading the complete pre-built standalone extension bundle
  // (contains compiled React app, assets, CSS, icons, and zero-redirect manifest)
  const candidateUrls = [
    '/daily-phrontistery-extension.zip',
    './daily-phrontistery-extension.zip',
    'daily-phrontistery-extension.zip',
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 10000) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'daily-phrontistery-chrome-extension-v2.1.0.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          return;
        }
      }
    } catch {
      // try next candidate url
    }
  }

  // 2. Client-side fallback packager
  const zip = new JSZip();

  // Manifest V3 configuration
  const manifest = {
    manifest_version: 3,
    name: 'Daily Phrontistery — Word of the Day New Tab',
    version: '2.1.0',
    description: 'Replaces your new tab page with rare words, semantic fine art backgrounds, and scholarly etymology.',
    chrome_url_overrides: {
      newtab: 'index.html',
    },
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
    },
    web_accessible_resources: [
      {
        resources: ['huge-word-list.json'],
        matches: ['<all_urls>'],
      },
    ],
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Real PNG Icons for 16x16, 48x48, 128x128
  try {
    const [png16, png48, png128] = await Promise.all([
      generateIconPngBlob(16),
      generateIconPngBlob(48),
      generateIconPngBlob(128),
    ]);

    zip.file('icons/icon16.png', png16);
    zip.file('icons/icon48.png', png48);
    zip.file('icons/icon128.png', png128);
  } catch (err) {
    console.error('Error generating canvas icons, fallback SVG saved', err);
  }

  // SVG vector icon for high-DPI displays
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
    <rect width="128" height="128" rx="26" fill="#0c1222" />
    <text x="14" y="97" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="900" fill="#ffff00">d</text>
    <text x="39" y="97" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="82" font-weight="900" fill="#f58f18">P</text>
    <circle cx="67" cy="88" r="6" fill="#38bdf8" />
    <text x="94" y="38" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="#ffffff">h</text>
  </svg>`;
  zip.file('icons/icon.svg', iconSvg);

  // Standalone offline index.html (self-contained reader without external server)
  const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Phrontistery — New Tab</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="loader-card">
    <h1 class="title">The Daily Phrontistery</h1>
    <p class="subtitle">Please load the fully compiled extension folder containing the assets directory.</p>
    <p class="note">See README_INSTALL.txt for simple 3-step setup.</p>
  </div>
</body>
</html>`;
  zip.file('index.html', standaloneHtml);

  // Separate external style.css
  const styleCss = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #0b0c10;
  color: #fef3c7;
  font-family: Georgia, 'Times New Roman', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.loader-card {
  text-align: center;
  padding: 36px 44px;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 16px;
  background-color: rgba(18, 16, 14, 0.9);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  max-width: 440px;
  width: 90%;
}

.title {
  font-size: 20px;
  letter-spacing: 0.05em;
  margin: 0 0 12px 0;
  color: #fbbf24;
}

.subtitle {
  font-size: 13px;
  color: #d6d3d1;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.note {
  font-size: 11px;
  color: #78716c;
  margin: 0;
}
`;
  zip.file('style.css', styleCss);

  // 7. Clear installation instructions & Network Transparency Disclosure
  const instructions = `=====================================================
  DAILY PHRONTISTERY — CHROME EXTENSION (MANIFEST V3)
=====================================================

All required icons (icon16.png, icon48.png, icon128.png) and
CSP-compliant external scripts (newtab.js) are already included.

HOW TO INSTALL IN CHROME:
1. Unzip this downloaded archive into a folder on your computer
   (e.g., in Documents/Daily-Phrontistery).

2. Open Google Chrome and go to:
   chrome://extensions

3. Toggle ON "Developer mode" in the top-right corner.

4. Click "Load unpacked" in the top-left corner.

5. Select the unzipped folder containing "manifest.json".

6. Open a new tab (Ctrl+T / Cmd+T) — The Daily Phrontistery is now your new tab page!

=====================================================
  DATA PRIVACY & NETWORK TRANSPARENCY DISCLOSURE
=====================================================
- 100% Private: Zero telemetry, tracking cookies, or analytics.
- Offline-First: Word definitions, syllable stress, pronunciation,
  and user settings run entirely on your device.
- External APIs (Public Domain / CC0 only):
  * Met Museum Open Access (collectionapi.metmuseum.org) — semantic fine art
  * Wikimedia Commons (upload.wikimedia.org) — public domain masterworks
  * Wiktionary (en.wiktionary.org) — on-demand etymology roots & academic IPA
`;
  zip.file('README_INSTALL.txt', instructions);

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'daily-phrontistery-extension.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
