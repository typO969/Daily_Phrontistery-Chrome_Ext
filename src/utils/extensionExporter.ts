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
 * Downloads the complete, pre-compiled Manifest V3 Chrome Extension package.
 * Contains the compiled React application, assets (JS/CSS), huge-word-list.json,
 * icons, and zero-redirect manifest.
 */
export async function downloadChromeExtensionPackage(): Promise<void> {
  const zipFileName = 'daily-phrontistery-extension.zip';
  const downloadName = 'daily-phrontistery-chrome-extension-v2.1.0.zip';

  // Construct absolute and relative candidate URLs
  const candidateUrls = [
    new URL(zipFileName, window.location.href).href,
    '/' + zipFileName,
    './' + zipFileName,
    zipFileName,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        // If server returns HTML (SPA 404 fallback), skip it
        if (contentType.includes('text/html')) {
          continue;
        }

        const blob = await res.blob();
        // The real extension zip is ~898 KB (must be > 100 KB)
        if (blob.size > 100000) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 10000);
          return;
        }
      }
    } catch (e) {
      console.debug('Could not stream zip from', url, e);
    }
  }

  // Native browser file download fallback directly to the static zip asset
  const a = document.createElement('a');
  a.href = '/' + zipFileName;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
