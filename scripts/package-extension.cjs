const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function syncAndPackageExtension() {
  const root = path.resolve(__dirname, '..');
  const distDir = path.join(root, 'dist');
  const extDir = path.join(root, 'extension');
  const publicDir = path.join(root, 'public');

  if (!fs.existsSync(distDir)) {
    console.error('dist/ does not exist. Run vite build first.');
    return;
  }

  // 1. Copy built HTML and assets to extension folder
  if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });
  
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndex)) {
    fs.copyFileSync(distIndex, path.join(extDir, 'index.html'));
  }

  const distAssets = path.join(distDir, 'assets');
  const extAssets = path.join(extDir, 'assets');
  if (fs.existsSync(distAssets)) {
    if (fs.existsSync(extAssets)) {
      fs.rmSync(extAssets, { recursive: true, force: true });
    }
    fs.mkdirSync(extAssets, { recursive: true });
    const assetFiles = fs.readdirSync(distAssets);
    for (const file of assetFiles) {
      fs.copyFileSync(path.join(distAssets, file), path.join(extAssets, file));
    }
  }

  // Also copy huge-word-list.json to extension root for standalone CRX distribution
  const candidates = [
    path.join(distDir, 'huge-word-list.json'),
    path.join(publicDir, 'huge-word-list.json'),
    path.join(root, 'huge-word-list.json')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, path.join(extDir, 'huge-word-list.json'));
      break;
    }
  }

  // Also ensure extension/manifest.json has matching version from package.json
  const pkgPath = path.join(root, 'package.json');
  const manifestPath = path.join(extDir, 'manifest.json');
  if (fs.existsSync(pkgPath) && fs.existsSync(manifestPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (pkg.version && manifest.version !== pkg.version) {
        manifest.version = pkg.version;
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`✓ Synchronized manifest.json version to v${pkg.version}`);
      }
    } catch (e) {
      console.warn('Could not sync manifest version:', e);
    }
  }

  // 2. Package everything into a standalone zip
  const zip = new JSZip();
  function addDir(dirPath, zipFolder) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDir(fullPath, zipFolder.folder(file));
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(file, content);
      }
    }
  }

  addDir(extDir, zip);

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = path.join(publicDir, 'daily-phrontistery-extension.zip');
  fs.writeFileSync(outPath, zipBuffer);
  console.log('✓ Successfully packaged standalone extension to:', outPath, `(${Math.round(zipBuffer.length / 1024)} KB)`);
}

syncAndPackageExtension().catch(console.error);
