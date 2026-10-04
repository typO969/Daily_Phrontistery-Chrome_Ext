import React from 'react';
import { Sparkles, Sliders, Volume2, VolumeX, Shuffle, Bookmark, Download, Calendar, Eye, EyeOff, Info } from 'lucide-react';
import { DisplayMode, ColorTheme } from '../types';

interface TopBarProps {
  theme: ColorTheme;
  displayMode: DisplayMode;
  onToggleDisplayMode: () => void;
  onNextWord: () => void;
  onOpenLayoutStudio: () => void;
  onOpenArchive: () => void;
  onExportExtension: () => void;
  onOpenColophon?: () => void;
  isAmbientSoundActive: boolean;
  onToggleAmbientSound: () => void;
  favoritesCount: number;
  isArtFocusMode: boolean;
  onToggleArtFocus: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  displayMode,
  onToggleDisplayMode,
  onNextWord,
  onOpenLayoutStudio,
  onOpenArchive,
  onExportExtension,
  onOpenColophon,
  isAmbientSoundActive,
  onToggleAmbientSound,
  favoritesCount,
  isArtFocusMode,
  onToggleArtFocus,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/25 transition-colors">
      {/* Zone 1: Single Brand element */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="group flex items-center gap-2.5 text-stone-100 hover:text-amber-200 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider">
            Daily Phrontistery
          </span>
          <span className="text-[10px] font-mono-data font-medium px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300/90 border border-amber-500/30">
            v2.1.0
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation & Mode Selection */}
      <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-sans-ui text-stone-300">
        <button
          onClick={onToggleDisplayMode}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          title="Toggle between fixed daily word or fresh word on each new tab"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {displayMode === 'daily' ? 'Mode: Daily Epoch' : 'Mode: Fresh per Tab'}
          </span>
        </button>

        <button
          onClick={onToggleAmbientSound}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          title="Toggle soft library rain acoustic ambience"
        >
          {isAmbientSoundActive ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span>{isAmbientSoundActive ? 'Ambience: On' : 'Ambience: Muted'}</span>
        </button>

        <button
          onClick={onToggleArtFocus}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          title="Dim card to admire background masterpiece artwork"
        >
          {isArtFocusMode ? (
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span>{isArtFocusMode ? 'Show Text' : 'View Artwork'}</span>
        </button>

        <button
          onClick={onOpenArchive}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Lexicon Archive {favoritesCount > 0 && `(${favoritesCount})`}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleArtFocus}
          className="lg:hidden flex items-center p-1.5 text-xs text-stone-300 bg-white/10 rounded-lg hover:bg-white/20"
          title="Toggle Art View"
        >
          {isArtFocusMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onNextWord}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-ui font-medium text-stone-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-all active:scale-95 whitespace-nowrap shadow-sm"
          title="Discover another rare word (Shortcut: Space or N)"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Next Word</span>
        </button>

        <button
          onClick={onOpenLayoutStudio}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-ui font-medium text-stone-900 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 rounded-lg transition-all active:scale-95 whitespace-nowrap shadow-sm font-semibold"
          title="Customize layout hierarchy, typography, and visibility"
        >
          <Sliders className="w-3.5 h-3.5 text-stone-900" />
          <span>Layout Studio</span>
        </button>

        <a
          href="/daily-phrontistery-extension.zip"
          download="daily-phrontistery-chrome-extension-v2.1.0.zip"
          onClick={(e) => {
            // Also call exporter function if available
            if (onExportExtension) {
              e.preventDefault();
              onExportExtension();
            }
          }}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans-ui text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10 whitespace-nowrap cursor-pointer"
          title="Download Manifest V3 Chrome Extension package (v2.1.0)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export .zip</span>
        </a>

        {onOpenColophon && (
          <button
            onClick={onOpenColophon}
            className="flex items-center gap-1.5 p-1.5 text-xs font-sans-ui text-stone-400 hover:text-amber-300 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
            title="Colophon, API disclosures, and data privacy"
          >
            <Info className="w-4 h-4" />
            <span className="sr-only">Colophon & Privacy</span>
          </button>
        )}
      </div>
    </header>
  );
};
