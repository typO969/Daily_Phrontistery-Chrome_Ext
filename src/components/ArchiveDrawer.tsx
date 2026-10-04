import React, { useState, useMemo } from 'react';
import { X, Search, Bookmark, BookmarkCheck, History, BookOpen, Volume2, Filter } from 'lucide-react';
import { PhrontisteryWord, SemanticGist } from '../types';
import { GIST_LABELS, formatPartOfSpeech } from '../utils/themeAndGist';
import { speakWord } from '../utils/audioSynth';

interface ArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  words: PhrontisteryWord[];
  favorites: string[];
  history: { word: string; timestamp: number; definition: string }[];
  onSelectWord: (word: string) => void;
  onToggleFavorite: (word: string) => void;
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({
  isOpen,
  onClose,
  words,
  favorites,
  history,
  onSelectWord,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGist, setSelectedGist] = useState<SemanticGist | 'all'>('all');
  const [displayCount, setDisplayCount] = useState(50);

  const filteredWords = useMemo(() => {
    let pool = words;

    if (activeTab === 'favorites') {
      pool = words.filter((w) => favorites.includes(w.word.toLowerCase()));
    } else if (activeTab === 'history') {
      const historyWords = new Set(history.map((h) => h.word.toLowerCase()));
      pool = words.filter((w) => historyWords.has(w.word.toLowerCase()));
    }

    if (selectedGist !== 'all') {
      pool = pool.filter((w) => w.gist === selectedGist);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter((w) => w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q));
    }

    return pool;
  }, [words, favorites, history, activeTab, selectedGist, searchQuery]);

  // Reset display count on filter change
  React.useEffect(() => {
    setDisplayCount(50);
  }, [activeTab, searchQuery, selectedGist]);

  const visibleWords = useMemo(() => {
    return filteredWords.slice(0, displayCount);
  }, [filteredWords, displayCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-stone-900 border-l border-white/15 flex flex-col text-stone-100 font-sans-ui shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-cinzel font-bold text-stone-100">Phrontistery Lexicon</h2>
            <p className="text-xs text-stone-400">
              Browse {words.length} rare and curious words from the classical archives
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 px-6 pt-3 gap-6 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'all' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            All Words ({words.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked ({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Viewed ({history.length})</span>
          </button>
        </div>

        {/* Search & Realm filter */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, definitions, or roots..."
              className="w-full bg-stone-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedGist('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap border transition-colors ${
                selectedGist === 'all'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                  : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
              }`}
            >
              All Realms
            </button>
            {Object.entries(GIST_LABELS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedGist(key as SemanticGist)}
                className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap border transition-colors ${
                  selectedGist === key
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                    : 'border-white/10 bg-white/5 text-stone-400 hover:text-stone-200'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-white/10">
          {filteredWords.length === 0 ? (
            <div className="py-16 text-center text-stone-500 text-xs">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No words match your current query.</p>
            </div>
          ) : (
            <>
              {visibleWords.map((item) => {
                const isFav = favorites.includes(item.word.toLowerCase());
                return (
                  <div
                    key={item.word}
                    className="py-3 px-2 rounded-lg hover:bg-white/5 transition-colors flex items-start justify-between gap-3 group"
                  >
                    <div
                      onClick={() => {
                        onSelectWord(item.word);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-base text-stone-100 group-hover:text-amber-300 transition-colors capitalize">
                          {item.word}
                        </span>
                        <span className="text-[10px] font-sans-ui text-stone-400 uppercase tracking-wider">
                          {formatPartOfSpeech(item.part_of_speech)}
                        </span>
                        {item.origin_language && (
                          <span className="text-[10px] text-stone-500">· {item.origin_language}</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300 font-editorial-body line-clamp-2">
                        {item.definition}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-1">
                      <button
                        onClick={() => speakWord(item.word)}
                        className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors rounded"
                        title="Pronounce"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleFavorite(item.word)}
                        className={`p-1.5 transition-colors rounded ${
                          isFav ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
                        }`}
                        title={isFav ? 'Remove bookmark' : 'Bookmark'}
                      >
                        {isFav ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {displayCount < filteredWords.length && (
                <div className="pt-4 pb-2 text-center">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 50)}
                    className="px-4 py-2 text-xs text-amber-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  >
                    Load More Words ({filteredWords.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
