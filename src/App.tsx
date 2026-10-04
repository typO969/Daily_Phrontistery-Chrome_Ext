import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PhrontisteryWord, AppSettings, ArtworkBackground } from './types';
import {
  getDailyWord,
  getFreshWord,
  findWordByName,
  getTotalWordsCount,
  getAllPhrontisteryWords,
  clearWordsCache,
  enrichWord,
  getCustomWords,
  RAW_PHRONTISTERY_WORDS,
} from './data/phrontisteryWords';
import { GIST_THEMES, getArtworkForGist } from './utils/themeAndGist';
import { SVG_ARTWORKS } from './utils/svgArtworks';
import { fetchPublicArtForWord } from './utils/publicArtApi';
import { getRealEtymology } from './utils/etymologyService';
import { fetchVerifiedIpa } from './utils/pronunciationService';
import { toggleAmbientSound, isAmbientPlaying, speakWord } from './utils/audioSynth';
import { downloadChromeExtensionPackage } from './utils/extensionExporter';

import { TopBar } from './components/TopBar';
import { WordDisplay } from './components/WordDisplay';
import { PreviousWordsTicker } from './components/PreviousWordsTicker';
import { LayoutStudioModal } from './components/LayoutStudioModal';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { AmbientParticles } from './components/AmbientParticles';
import { ColophonModal } from './components/ColophonModal';

const DEFAULT_SETTINGS: AppSettings = {
  displayMode: 'daily',
  layoutStyle: 'monograph',
  fontFamily: 'cormorant',
  wordSize: 'balanced',
  boxAlignment: 'archetype',
  animationSpeed: 'gentle',
  enableAmbientParticles: true,
  enableAmbientSound: false,
  overlayOpacity: 0.65,
  frameOpacity: 0.65,
  isFrameTranslucent: true,
  pronunciationStyle: 'respelling',
  components: {
    showWord: true,
    showPhonetics: true,
    showPartOfSpeech: true,
    showDefinition: true,
    showEtymology: true,
    showExample: true,
    showGistBadge: true,
    showClock: true,
    showDate: true,
    showSearchBar: true,
    showTicker: true,
    showAudioButton: true,
  },
  favoriteWordList: [],
  viewedWordsHistory: [],
};

const SETTINGS_KEY = 'phrontistery_settings_v2';
const LEGACY_SETTINGS_KEY = 'phrontistery_settings_v1';

export default function App() {
  const [totalWordsCount, setTotalWordsCount] = useState<number>(() => getTotalWordsCount());
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Guarantee the signature archetype (monograph) is used if legacy was museum_placard or missing
        const layoutStyle = (!parsed.layoutStyle || parsed.layoutStyle === 'museum_placard')
          ? 'monograph'
          : parsed.layoutStyle;
        const boxAlignment = parsed.boxAlignment || 'archetype';
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          layoutStyle,
          boxAlignment,
          components: { ...DEFAULT_SETTINGS.components, ...(parsed.components || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [currentWord, setCurrentWord] = useState<PhrontisteryWord>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.displayMode === 'random_every_tab') {
          const history = (parsed.viewedWordsHistory || []).map((h: { word: string }) => h.word);
          return getFreshWord(history);
        }
      }
    } catch {}
    return getDailyWord(new Date());
  });

  const [artwork, setArtwork] = useState<ArtworkBackground>(() => {
    return getArtworkForGist(currentWord.gist || 'linguistics_literature', 0);
  });

  const [isLayoutStudioOpen, setIsLayoutStudioOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isColophonOpen, setIsColophonOpen] = useState(false);
  const [isAmbientAudioActive, setIsAmbientAudioActive] = useState(false);
  const [isArtFocusMode, setIsArtFocusMode] = useState(false);

  // Save settings whenever changed
  useEffect(() => {
    try {
      const serialized = JSON.stringify(settings);
      localStorage.setItem(SETTINGS_KEY, serialized);
      localStorage.setItem(LEGACY_SETTINGS_KEY, serialized);
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  // Current semantic theme
  const theme = useMemo(() => {
    const gist = currentWord.gist || 'linguistics_literature';
    return GIST_THEMES[gist] || GIST_THEMES.linguistics_literature;
  }, [currentWord]);

  // Track word in viewed history
  const recordWordInHistory = useCallback((wordObj: PhrontisteryWord) => {
    setSettings((prev) => {
      const existing = prev.viewedWordsHistory || [];
      // Don't add duplicate if it's the exact same recent word
      if (existing.length > 0 && existing[0].word.toLowerCase() === wordObj.word.toLowerCase()) {
        return prev;
      }
      const updated = [
        {
          word: wordObj.word,
          timestamp: Date.now(),
          definition: wordObj.definition,
        },
        ...existing.filter((item) => item.word.toLowerCase() !== wordObj.word.toLowerCase()),
      ].slice(0, 100); // keep last 100

      return {
        ...prev,
        viewedWordsHistory: updated,
      };
    });
  }, []);

  // Update background artwork when word changes (with deferred external API queries)
  useEffect(() => {
    let isCancelled = false;

    // First use fast fallback from curated collection to prevent layout shift
    const fastDefault = getArtworkForGist(currentWord.gist || 'linguistics_literature', currentWord.word.length);
    setArtwork(fastDefault);

    recordWordInHistory(currentWord);

    // Defer external API queries by 350ms so tab renders at 60fps immediately
    const timer = setTimeout(() => {
      if (isCancelled) return;

      // Then attempt live Public Museum API search
      fetchPublicArtForWord(currentWord.word, currentWord.gist || 'linguistics_literature').then(
        (matchedArt) => {
          if (!isCancelled && matchedArt) {
            setArtwork(matchedArt);
          }
        }
      );

      // Look up real etymology if not present
      if (!currentWord.etymology) {
        getRealEtymology(currentWord.word).then((realEtym) => {
          if (!isCancelled && realEtym) {
            setCurrentWord((prev) => {
              if (prev.word.toLowerCase() === currentWord.word.toLowerCase()) {
                return { ...prev, etymology: realEtym };
              }
              return prev;
            });
          }
        });
      }

      // Look up verified IPA if available
      fetchVerifiedIpa(currentWord.word).then((verifiedIpa) => {
        if (!isCancelled && verifiedIpa && verifiedIpa !== currentWord.ipa) {
          setCurrentWord((prev) => {
            if (prev.word.toLowerCase() === currentWord.word.toLowerCase()) {
              return { ...prev, ipa: verifiedIpa };
            }
            return prev;
          });
        }
      });
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [currentWord.word, currentWord.gist, recordWordInHistory]);

  // Action: Pick Next / Random Word
  const handleNextWord = useCallback(() => {
    const viewed = (settings.viewedWordsHistory || []).map((h) => h.word.toLowerCase());
    const next = getFreshWord(viewed);
    setCurrentWord(next);
  }, [settings.viewedWordsHistory]);

  // Action: Select Word by name
  const handleSelectWord = useCallback(
    (targetWordName: string) => {
      const found = findWordByName(targetWordName);
      if (found) {
        setCurrentWord(found);
      }
    },
    []
  );

  // Action: Toggle Favorite
  const handleToggleFavorite = useCallback(
    (wordName?: string) => {
      const target = (wordName || currentWord.word).toLowerCase();
      setSettings((prev) => {
        const favs = prev.favoriteWordList || [];
        const isFav = favs.includes(target);
        const updated = isFav ? favs.filter((w) => w !== target) : [...favs, target];
        return {
          ...prev,
          favoriteWordList: updated,
        };
      });
    },
    [currentWord]
  );

  // Action: Toggle Ambient Audio
  const handleToggleAmbientAudio = useCallback(() => {
    const nextState = !isAmbientAudioActive;
    toggleAmbientSound(nextState);
    setIsAmbientAudioActive(nextState);
  }, [isAmbientAudioActive]);

  // Action: Import custom JSON dictionary
  const handleImportCustomWords = async (file: File): Promise<number> => {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('JSON must be an array of word objects.');
    }

    const builtInWords = new Set(RAW_PHRONTISTERY_WORDS.map((w) => w.word.toLowerCase()));
    const existingCustom = getCustomWords();
    const existingCustomWords = new Set(existingCustom.map((w) => w.word.toLowerCase()));

    const newlyAdded: PhrontisteryWord[] = [];
    let duplicateCount = 0;

    for (const item of parsed) {
      if (item && typeof item.word === 'string' && typeof item.definition === 'string') {
        const lower = item.word.toLowerCase().trim();
        if (builtInWords.has(lower) || existingCustomWords.has(lower)) {
          duplicateCount++;
          continue; // Guard against duplicates!
        }
        existingCustomWords.add(lower);
        newlyAdded.push(
          enrichWord({
            word: item.word.trim(),
            definition: item.definition.trim(),
            part_of_speech: item.part_of_speech || 'noun',
            custom: true,
          })
        );
      }
    }

    if (newlyAdded.length === 0 && duplicateCount === 0) {
      throw new Error('No valid {word, definition} entries found.');
    }

    const updatedCustom = [...existingCustom, ...newlyAdded];
    // Persist deduplicated custom words in localStorage
    localStorage.setItem('phrontistery_custom_words', JSON.stringify(updatedCustom));
    clearWordsCache();
    const newTotal = getTotalWordsCount();
    setTotalWordsCount(newTotal);
    return newTotal;
  };

  // Clear viewed history
  const handleClearHistory = () => {
    setSettings((prev) => ({
      ...prev,
      viewedWordsHistory: [],
    }));
  };

  // Keyboard navigation shortcuts (Space / N = next word, P = pronounce, S = studio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNextWord();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        speakWord(currentWord.word);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsLayoutStudioOpen((prev) => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setIsArchiveOpen((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsColophonOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsLayoutStudioOpen(false);
        setIsArchiveOpen(false);
        setIsColophonOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextWord, currentWord]);

  const isCurrentFavorite = useMemo(() => {
    return (settings.favoriteWordList || []).includes(currentWord.word.toLowerCase());
  }, [settings.favoriteWordList, currentWord]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200"
      style={{ backgroundColor: theme.bgDark }}
    >
      {/* Background Image Layer with Ambient Slow Ken Burns Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          key={artwork.url}
          src={artwork.url}
          alt={artwork.title}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            settings.animationSpeed === 'normal'
              ? 'animate-ken-burns-normal'
              : settings.animationSpeed === 'gentle'
              ? 'animate-ken-burns-gentle'
              : ''
          }`}
          style={{
            willChange: settings.animationSpeed !== 'off' ? 'transform' : 'auto',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            filter: isArtFocusMode
              ? 'brightness(0.95) saturate(1.25) contrast(1.05)'
              : 'brightness(0.78) saturate(1.2) contrast(1.05)',
          }}
          onError={(e) => {
            const fallbackUri = SVG_ARTWORKS[currentWord.gist || 'linguistics_literature']?.svgDataUri;
            if (fallbackUri && e.currentTarget.src !== fallbackUri) {
              e.currentTarget.src = fallbackUri;
            }
          }}
        />

        {/* Dynamic Theme Color Atmosphere & Vignette */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 45%, transparent 0%, rgba(0, 0, 0, ${
              isArtFocusMode ? '0.2' : '0.5'
            }) 60%, rgba(0, 0, 0, ${isArtFocusMode ? '0.5' : '0.85'}) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-color transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: theme.accentSubtle }}
        />
      </div>

      {/* Ambient Floating Starlight/Dust Particles */}
      <AmbientParticles
        enabled={settings.enableAmbientParticles && settings.animationSpeed !== 'off'}
        accentColor={theme.accentGold}
      />

      {/* Top Bar Navigation */}
      <TopBar
        theme={theme}
        displayMode={settings.displayMode}
        onToggleDisplayMode={() =>
          setSettings((p) => ({
            ...p,
            displayMode: p.displayMode === 'daily' ? 'random_every_tab' : 'daily',
          }))
        }
        onNextWord={handleNextWord}
        onOpenLayoutStudio={() => setIsLayoutStudioOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onExportExtension={downloadChromeExtensionPackage}
        isAmbientSoundActive={isAmbientAudioActive}
        onToggleAmbientSound={handleToggleAmbientAudio}
        favoritesCount={settings.favoriteWordList?.length || 0}
        isArtFocusMode={isArtFocusMode}
        onToggleArtFocus={() => setIsArtFocusMode(!isArtFocusMode)}
        onOpenColophon={() => setIsColophonOpen(true)}
      />

      {/* Word of the Day Presentation */}
      <div
        className={`flex-1 flex flex-col justify-center transition-all duration-500 ${
          isArtFocusMode ? 'opacity-15 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <WordDisplay
          word={currentWord}
          theme={theme}
          layoutStyle={settings.layoutStyle}
          components={settings.components}
          fontFamily={settings.fontFamily}
          wordSize={settings.wordSize}
          boxAlignment={settings.boxAlignment || 'archetype'}
          overlayOpacity={settings.overlayOpacity}
          frameOpacity={settings.frameOpacity}
          isFrameTranslucent={settings.isFrameTranslucent}
          pronunciationStyle={settings.pronunciationStyle}
          onCycleFrameOpacity={() => {
            const current = settings.frameOpacity ?? settings.overlayOpacity ?? 0.65;
            const next = current <= 0.52 ? 0.65 : current <= 0.68 ? 0.8 : current <= 0.85 ? 1.0 : 0.5;
            setSettings((p) => ({
              ...p,
              frameOpacity: next,
              overlayOpacity: next,
              isFrameTranslucent: next < 0.98,
            }));
          }}
          artwork={artwork}
          isFavorite={isCurrentFavorite}
          onToggleFavorite={() => handleToggleFavorite()}
          onNextWord={handleNextWord}
          onOpenColophon={() => setIsColophonOpen(true)}
        />
      </div>

      {/* Previously Used Words Ticker */}
      {settings.components.showTicker && (
        <PreviousWordsTicker
          history={settings.viewedWordsHistory || []}
          totalWordsCount={totalWordsCount}
          theme={theme}
          onSelectWord={handleSelectWord}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Layout & Typography Studio Modal */}
      <LayoutStudioModal
        isOpen={isLayoutStudioOpen}
        onClose={() => setIsLayoutStudioOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onImportCustomWords={handleImportCustomWords}
        totalWordsCount={totalWordsCount}
        onOpenColophon={() => setIsColophonOpen(true)}
      />

      {/* Searchable Archive & Bookmarks Drawer */}
      <ArchiveDrawer
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        words={isArchiveOpen ? getAllPhrontisteryWords() : []}
        favorites={settings.favoriteWordList || []}
        history={settings.viewedWordsHistory || []}
        onSelectWord={handleSelectWord}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Colophon & Network Transparency Modal */}
      <ColophonModal
        isOpen={isColophonOpen}
        onClose={() => setIsColophonOpen(false)}
        theme={theme}
      />
    </div>
  );
}
