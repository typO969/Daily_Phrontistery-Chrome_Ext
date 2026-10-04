import React from 'react';
import { X, ShieldCheck, Globe, Wifi, WifiOff, Database, BookOpen, ExternalLink, Lock } from 'lucide-react';
import { ColorTheme } from '../types';

interface ColophonModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ColorTheme;
}

export const ColophonModal: React.FC<ColophonModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="colophon-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 bg-stone-950/95 text-stone-100 shadow-2xl p-6 md:p-8 custom-scrollbar"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px ${theme.accentSubtle}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="colophon-title" className="font-cinzel text-xl font-bold tracking-wide text-amber-200">
                Colophon & Network Transparency
              </h2>
              <p className="text-xs text-stone-400 font-sans-ui mt-0.5">
                Privacy, data provenance, and network disclosure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
            aria-label="Close colophon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction */}
        <div className="mt-5 space-y-4 text-xs font-sans-ui text-stone-300 leading-relaxed">
          <p>
            In traditional publishing, a <em className="text-stone-100 not-italic font-serif">colophon</em> honors the sources,
            typography, and craftsmanship behind a work. For <strong className="text-amber-200">The Daily Phrontistery</strong>,
            we hold the same standard of uncompromising transparency regarding our data access, external APIs, and local privacy.
          </p>

          {/* Privacy & Zero-Tracking Badge */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-100 text-xs">100% Private — Zero Telemetry & Zero Cookies</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                No analytics, tracking pixels, or advertising beacons exist in this application. Your bookmarks, layout settings,
                and custom dictionaries never leave your browser&apos;s local storage.
              </p>
            </div>
          </div>

          {/* API Disclosure Matrix */}
          <div className="pt-2">
            <h3 className="font-cinzel text-sm font-semibold tracking-wider uppercase text-amber-300 flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-amber-400" />
              External APIs Accessed
            </h3>

            <div className="space-y-3">
              {/* The Met Museum */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100 text-xs flex items-center gap-1.5">
                    1. The Metropolitan Museum of Art Open Access API
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    CC0 Open Access
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-stone-400 pt-1">
                  <div>
                    <span className="text-stone-500 font-medium block">Endpoint:</span>
                    <code className="text-stone-300 text-[10px]">collectionapi.metmuseum.org</code>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">When & Why:</span>
                    <span>When exploring words online to retrieve semantically matched fine art.</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">How:</span>
                    <span>Anonymous HTTPS GET request. Zero authentication, zero headers tracked.</span>
                  </div>
                </div>
              </div>

              {/* Wikimedia Commons */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100 text-xs flex items-center gap-1.5">
                    2. Wikimedia Commons (Public Domain Media Archive)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Public Domain
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-stone-400 pt-1">
                  <div>
                    <span className="text-stone-500 font-medium block">Endpoint:</span>
                    <code className="text-stone-300 text-[10px]">upload.wikimedia.org</code>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">When & Why:</span>
                    <span>To stream verified public domain paintings (Piranesi, Turner, Monet, Audubon).</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">How:</span>
                    <span>Direct image request using <code className="text-stone-300">referrerPolicy=&quot;no-referrer&quot;</code>.</span>
                  </div>
                </div>
              </div>

              {/* Wiktionary API */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100 text-xs flex items-center gap-1.5">
                    3. Wiktionary API (Wikimedia Foundation)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    CC-BY-SA 4.0
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-stone-400 pt-1">
                  <div>
                    <span className="text-stone-500 font-medium block">Endpoint:</span>
                    <code className="text-stone-300 text-[10px]">en.wiktionary.org/w/api.php</code>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">When & Why:</span>
                    <span>On demand when inspecting deep etymological roots or scholarly IPA phonetics.</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">How:</span>
                    <span>Anonymous REST action query, cached in browser storage to avoid repeated calls.</span>
                  </div>
                </div>
              </div>

              {/* Google Fonts */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100 text-xs flex items-center gap-1.5">
                    4. Google Fonts CDN (Web Preview)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-500/20 text-stone-300 border border-stone-500/30">
                    OFL License
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-stone-400 pt-1">
                  <div>
                    <span className="text-stone-500 font-medium block">Endpoint:</span>
                    <code className="text-stone-300 text-[10px]">fonts.googleapis.com</code>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">When & Why:</span>
                    <span>On initial web load to render Cinzel, Cormorant Garamond, and Playfair Display.</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">How:</span>
                    <span>Standard font stylesheet stylesheet link; system fonts serve as instant fallbacks.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offline Capabilities */}
          <div className="pt-2">
            <h3 className="font-cinzel text-sm font-semibold tracking-wider uppercase text-amber-300 flex items-center gap-2 mb-3">
              <WifiOff className="w-4 h-4 text-amber-400" />
              What Runs 100% Offline (Local Computation)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">17,000+ Word Lexicon</strong>
                  <span className="text-stone-400">All seeded and imported dictionary words live completely on-device.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Phonetic Syllable Engine</strong>
                  <span className="text-stone-400">Algorithmic syllable-stress & respelling computed in pure client TypeScript.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Native Speech Synthesis</strong>
                  <span className="text-stone-400">Pronunciation uses the browser&apos;s built-in Web Speech API without external audio files.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                <Wifi className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Procedural Audio Ambience</strong>
                  <span className="text-stone-400">Rainfall and vinyl crackle are generated procedurally with the Web Audio API.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-500 font-sans-ui">
          <span>The Daily Phrontistery v2.1.0 · Manifest V3 Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
