import React, { useRef } from 'react';
import { X, Sliders, Type, Eye, Palette, Wind, Sparkles, Upload, RotateCcw, Check, LayoutGrid, Volume2, Download, ShieldCheck, Maximize2, Minimize2, Monitor, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { AppSettings, LayoutStyle, DisplayMode, BoxAlignment } from '../types';
import { downloadChromeExtensionPackage } from '../utils/extensionExporter';

interface LayoutStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onImportCustomWords: (file: File) => Promise<number>;
  totalWordsCount: number;
  onOpenColophon?: () => void;
}

export const LayoutStudioModal: React.FC<LayoutStudioModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onImportCustomWords,
  totalWordsCount,
  onOpenColophon,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleComponentToggle = (key: keyof typeof settings.components) => {
    onUpdateSettings((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        [key]: !prev.components[key],
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Parsing dictionary...');
      const count = await onImportCustomWords(file);
      setImportStatus(`Successfully loaded ${count} words!`);
      setTimeout(() => setImportStatus(null), 3500);
    } catch (err: unknown) {
      setImportStatus(`Error: ${(err as Error)?.message || 'Invalid JSON'}`);
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  const layoutOptions: {
    id: LayoutStyle;
    name: string;
    placement: string;
    desc: string;
  }[] = [
    {
      id: 'monograph',
      name: '1. Editorial Monograph (Signature)',
      placement: 'Left of Center (1/3 mark) · Lower Third',
      desc: 'Signature book layout positioned at ~1/3 from viewport left and shifted slightly below center for contemplative balance.',
    },
    {
      id: 'split_curatorial',
      name: '2. Split Curatorial',
      placement: 'Far Left Anchor · ~100px From Bottom',
      desc: 'Asymmetric dual columns (plate left, text right), anchored ~100px from page bottom leaving top sky open.',
    },
    {
      id: 'broadsheet',
      name: '3. Broadsheet Folio',
      placement: 'Between 1/3 & Center · Subtly North (+60px)',
      desc: 'Dual-column gazette folio resting between 1/3 and true center, elevated ~60px north of center.',
    },
    {
      id: 'zenith_minimal',
      name: '4. Zenith Minimalist',
      placement: 'Alternating 1/3 Left or Right · +50px Lift',
      desc: 'Unframed pure typography shifted 50px upward, anchoring at 1/3 left or 1/3 right per word.',
    },
    {
      id: 'museum_placard',
      name: '5. Museum Placard (Centered)',
      placement: 'Centered (Gallery Placard)',
      desc: 'Balanced museum gallery placard with refined framing and accession notes. Centered on all axes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border border-white/20 shadow-2xl p-6 sm:p-8 text-stone-100 font-sans-ui">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-cinzel font-bold text-stone-100">Layout & Visual Hierarchy Studio</h2>
              <p className="text-xs text-stone-400">Configure visual weight, typography, and component presence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Layout Archetypes & Spatial Placement */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Layout Archetype & Spatial Placement</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {layoutOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onUpdateSettings((p) => ({ ...p, layoutStyle: opt.id }))}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  settings.layoutStyle === opt.id
                    ? 'border-amber-400 bg-amber-400/10 text-stone-100 shadow-sm ring-1 ring-amber-400/40'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-amber-200">{opt.name}</span>
                  {settings.layoutStyle === opt.id && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[10px] font-mono-data text-amber-300/80 block mb-1.5">{opt.placement}</span>
                <p className="text-[11px] text-stone-400 leading-snug">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Spatial Viewport Alignment */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlignCenter className="w-3.5 h-3.5" />
              <span>Spatial Placement & Viewport Alignment</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono-data">
              Signature asymmetric vs. Classic centered
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'archetype',
                label: 'Signature Archetype',
                icon: LayoutGrid,
                desc: 'Bespoke asymmetric placement per layout (Monograph at 1/3 lower-third, Zenith at 1/3, Split Curatorial 100px from bottom, Broadsheet offset).',
              },
              {
                id: 'center',
                label: 'Classic Centered',
                icon: AlignCenter,
                desc: 'Keeps the word box and typography centered in the viewport across all layouts, classic museum style.',
              },
            ].map((item) => {
              const active = (settings.boxAlignment || 'archetype') === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onUpdateSettings((p) => ({ ...p, boxAlignment: item.id as BoxAlignment }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-amber-400 bg-amber-400/15 text-stone-100 shadow-sm ring-1 ring-amber-400/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <IconComp className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                      {item.label}
                    </span>
                    {active && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-stone-400 block leading-snug">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Component Visibility & Hierarchy */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Visible Components & Structural Blocks</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'showWord', label: 'Primary Word' },
              { key: 'showPartOfSpeech', label: 'Role in Language' },
              { key: 'showPhonetics', label: 'Phonetic IPA' },
              { key: 'showDefinition', label: 'Definition Prose' },
              { key: 'showEtymology', label: 'Etymology (if available)' },
              { key: 'showExample', label: 'Literary Example' },
              { key: 'showGistBadge', label: 'Semantic Gist Tag' },
              { key: 'showAudioButton', label: 'Pronunciation Audio' },
              { key: 'showSearchBar', label: 'New Tab Search Bar' },
              { key: 'showClock', label: 'Digital Clock' },
              { key: 'showDate', label: 'Gregorian Date' },
              { key: 'showTicker', label: 'History Ticker' },
            ].map(({ key, label }) => {
              const active = settings.components[key as keyof typeof settings.components];
              return (
                <button
                  key={key}
                  onClick={() => handleComponentToggle(key as keyof typeof settings.components)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-colors ${
                    active
                      ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="truncate mr-1">{label}</span>
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-400' : 'bg-stone-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Typography & Scale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Headword Typography</span>
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) =>
                onUpdateSettings((p) => ({ ...p, fontFamily: e.target.value as AppSettings['fontFamily'] }))
              }
              className="w-full bg-stone-800 border border-white/15 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            >
              <option value="cormorant">Cormorant Garamond (Classical Venetian)</option>
              <option value="playfair">Playfair Display (Transitional Editorial)</option>
              <option value="cinzel">Cinzel (Imperial Roman Carving)</option>
              <option value="instrument">Instrument Serif (Modern Expressive)</option>
              <option value="sans">Plus Jakarta Sans (Contemporary Clean)</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block flex items-center gap-1.5">
              <span>Title Scale Size</span>
            </label>
            <div className="flex gap-2">
              {(['compact', 'balanced', 'monumental'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings((p) => ({ ...p, wordSize: size }))}
                  className={`flex-1 py-2 text-xs rounded-lg border capitalize transition-colors ${
                    settings.wordSize === size
                      ? 'border-amber-400 bg-amber-400/10 text-amber-200 font-medium'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Pronunciation Guide Notation */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Pronunciation Guide Notation</span>
            </span>
            <span className="text-[11px] text-stone-400 font-normal">
              Works across all 17,000+ words
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'respelling', label: 'Phonetic Respelling', sample: '[AHRD-woolf]' },
              { id: 'ipa', label: 'IPA Notation', sample: '/ˈɑːrdˌwʊlf/' },
              { id: 'both', label: 'Both (Respelling & IPA)', sample: '[AHRD-woolf] · /ˈɑːrdˌwʊlf/' },
              { id: 'audio_only', label: 'Audio Icon Only', sample: '🔊 sound icon only' },
              { id: 'off', label: 'Hidden / Off', sample: 'no phonetics' },
            ].map((item) => {
              const active = (settings.pronunciationStyle ?? 'respelling') === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdateSettings((p) => ({
                      ...p,
                      pronunciationStyle: item.id as AppSettings['pronunciationStyle'],
                    }))
                  }
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    active
                      ? 'border-amber-400 bg-amber-400/15 text-amber-200 shadow-sm'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs truncate mr-1">{item.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] font-mono-data text-stone-400 truncate">{item.sample}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Display Mode & Animation Cadence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block">
              Cadence of Selection
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, displayMode: 'daily' }))}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                  settings.displayMode === 'daily'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200 font-medium'
                    : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                Daily Word
              </button>
              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, displayMode: 'random_every_tab' }))}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                  settings.displayMode === 'random_every_tab'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200 font-medium'
                    : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                New Each Tab
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              <span>Slow Ambient Motion</span>
            </label>
            <div className="flex gap-2">
              {(['off', 'gentle', 'normal'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings((p) => ({ ...p, animationSpeed: spd }))}
                  className={`flex-1 py-2 text-xs rounded-lg border capitalize transition-colors ${
                    settings.animationSpeed === spd
                      ? 'border-amber-400 bg-amber-400/10 text-amber-200 font-medium'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Word Frame Opacity & Artwork Visibility */}
        <div className="space-y-4 mb-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Word Frame Translucency</span>
              </span>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Allow background artwork to show through the card for heightened immersion
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isFrameTranslucent ?? true}
                onChange={(e) =>
                  onUpdateSettings((p) => ({
                    ...p,
                    isFrameTranslucent: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {(settings.isFrameTranslucent ?? true) && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center text-xs font-sans-ui">
                <span className="text-stone-300">
                  Frame Opacity:{' '}
                  <span className="text-amber-300 font-mono-data font-semibold">
                    {Math.round(((settings.frameOpacity ?? settings.overlayOpacity ?? 0.65)) * 100)}%
                  </span>
                  <span className="text-stone-400 text-[11px] ml-2 font-normal">
                    {Math.round(((settings.frameOpacity ?? settings.overlayOpacity ?? 0.65)) * 100) >= 95
                      ? '(Fully Opaque)'
                      : Math.round(((settings.frameOpacity ?? settings.overlayOpacity ?? 0.65)) * 100) <= 55
                      ? '(Half Transparent · Maximum Artwork)'
                      : '(Atmospheric Glassmorphism)'}
                  </span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono-data">Range: 50% – 100%</span>
              </div>

              {/* Opacity Slider with range 50% to 100% */}
              <input
                type="range"
                min="0.50"
                max="1.00"
                step="0.05"
                value={settings.frameOpacity ?? settings.overlayOpacity ?? 0.65}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings((p) => ({
                    ...p,
                    frameOpacity: val,
                    overlayOpacity: val,
                  }));
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-700 rounded-lg"
              />

              {/* Quick Opacity Presets */}
              <div className="flex gap-2 pt-1">
                {[
                  { label: '50% Half Transparent', val: 0.5 },
                  { label: '65% Atmospheric', val: 0.65 },
                  { label: '80% Frosted', val: 0.8 },
                  { label: '100% Solid', val: 1.0 },
                ].map((preset) => {
                  const currentVal = settings.frameOpacity ?? settings.overlayOpacity ?? 0.65;
                  const isCurrent = Math.abs(currentVal - preset.val) < 0.03;
                  return (
                    <button
                      key={preset.val}
                      onClick={() =>
                        onUpdateSettings((p) => ({
                          ...p,
                          frameOpacity: preset.val,
                          overlayOpacity: preset.val,
                          isFrameTranslucent: preset.val < 0.98,
                        }))
                      }
                      className={`flex-1 py-1.5 px-1 text-[11px] rounded-lg border transition-all text-center ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-400/15 text-amber-200 font-medium shadow-sm'
                          : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Floating Ambient Particles (Starlight / Dust)</span>
            </span>
            <input
              type="checkbox"
              checked={settings.enableAmbientParticles}
              onChange={(e) => onUpdateSettings((p) => ({ ...p, enableAmbientParticles: e.target.checked }))}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Section 6: Custom 17,000-Word JSON Upload */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold text-stone-200 block">Dictionary Database</span>
              <span className="text-[11px] text-stone-400">
                Currently loaded: <span className="text-amber-300 font-semibold">{totalWordsCount}</span> words
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-stone-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Import Custom JSON</span>
            </button>
          </div>
          {importStatus && (
            <p className="text-xs text-amber-300 font-mono-data mt-2 animate-pulse">{importStatus}</p>
          )}

          {/* Section 7: Chrome Extension Manifest V3 Export */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-200 block">Chrome Extension Package</span>
              <span className="text-[11px] text-stone-400">
                Download ready-to-load Manifest V3 zip with custom icons & instructions
              </span>
            </div>
            <button
              onClick={downloadChromeExtensionPackage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .zip</span>
            </button>
          </div>

          {/* Section 8: Colophon & Network Transparency */}
          {onOpenColophon && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-200 block">Data Privacy & External APIs</span>
                <span className="text-[11px] text-stone-400">
                  Full disclosure of all network requests, museum licenses, and zero-tracking pledge
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenColophon();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-amber-300 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Colophon & APIs</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
