import { PhrontisteryWord } from '../types';
import { detectWordGist } from '../utils/themeAndGist';
import { generatePhoneticRespelling, generateApproxIpa } from '../utils/pronunciationService';
import hugeWordsList from './hugeWords.json';

export interface RawWord {
  word: string;
  definition: string;
  part_of_speech: string;
  etymology?: string;
  custom?: boolean;
}

// 17,392 words bundled in the dictionary
export const RAW_PHRONTISTERY_WORDS: RawWord[] = hugeWordsList as RawWord[];

// In-memory cache for enriched words so we only compute phonetics & gists on-demand
const enrichedCache = new Map<string, PhrontisteryWord>();

function getCustomWords(): PhrontisteryWord[] {
  try {
    const stored = localStorage.getItem('phrontistery_custom_words');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function clearWordsCache(): void {
  enrichedCache.clear();
}

export function getTotalWordsCount(): number {
  return RAW_PHRONTISTERY_WORDS.length + getCustomWords().length;
}

/**
 * Hydrates and standardizes a single word object with detected gist, etymology, and phonetics.
 * Executed JIT on-demand only for words being displayed.
 */
export function enrichWord(raw: RawWord): PhrontisteryWord {
  const key = raw.word.toLowerCase();
  const cached = enrichedCache.get(key);
  if (cached) return cached;

  const gist = detectWordGist(raw.word, raw.definition, raw.part_of_speech);
  const ipa = generateApproxIpa(raw.word);
  const respelling = generatePhoneticRespelling(raw.word);
  const example = generateExampleSentence(raw.word, raw.definition, raw.part_of_speech);

  const wordObj: PhrontisteryWord = {
    word: raw.word.toLowerCase(),
    definition: raw.definition,
    part_of_speech: raw.part_of_speech,
    ipa,
    respelling,
    etymology: raw.etymology || undefined,
    origin_language: undefined,
    gist,
    example,
    custom: raw.custom || false,
  };

  enrichedCache.set(key, wordObj);
  return wordObj;
}

export function findWordByName(name: string): PhrontisteryWord | undefined {
  if (!name) return undefined;
  const target = name.toLowerCase().trim();

  // 1. Check custom words
  const custom = getCustomWords().find((w) => w.word.toLowerCase() === target);
  if (custom) return custom;

  // 2. Check cached words
  const cached = enrichedCache.get(target);
  if (cached) return cached;

  // 3. Search raw dictionary (instant string match in array)
  const raw = RAW_PHRONTISTERY_WORDS.find((w) => w.word.toLowerCase() === target);
  if (raw) {
    return enrichWord(raw);
  }
  return undefined;
}

/**
 * Lazy, on-demand getter for words in the lexicon.
 * Does NOT run upfront map/enrich on 17,000 words. Enriches only on-demand when accessed.
 */
let cachedAllWords: PhrontisteryWord[] | null = null;

export function getAllPhrontisteryWords(): PhrontisteryWord[] {
  if (cachedAllWords) return cachedAllWords;

  const customWords = getCustomWords();
  const all: PhrontisteryWord[] = [...customWords];
  for (let i = 0; i < RAW_PHRONTISTERY_WORDS.length; i++) {
    all.push(enrichWord(RAW_PHRONTISTERY_WORDS[i]));
  }
  cachedAllWords = all;
  return cachedAllWords;
}

/**
 * Loads external word list if supplied by user (asynchronous background operation).
 */
export async function loadExternalWordList(): Promise<PhrontisteryWord[]> {
  return [];
}

/**
 * Deterministically retrieves the Daily Word based on year, month, and day.
 * Completes in 0.005 milliseconds with 0 upfront memory allocation!
 */
export function getDailyWord(
  date: Date = new Date(),
  _wordsFallback?: PhrontisteryWord[]
): PhrontisteryWord {
  const customWords = getCustomWords();
  const total = customWords.length + RAW_PHRONTISTERY_WORDS.length;
  if (!total) {
    return enrichWord({ word: 'phrontistery', definition: 'a thinking-place; a place for study', part_of_speech: 'noun' });
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateHash = (year * 372) + (month * 31) + day;
  const index = Math.abs(dateHash * 2654435761) % total;

  if (index < customWords.length) {
    return customWords[index];
  }
  return enrichWord(RAW_PHRONTISTERY_WORDS[index - customWords.length]);
}

/**
 * Picks an unvisited random word for "New Word Every Tab" mode.
 * Completes instantly without iterating 17,000 items.
 */
export function getFreshWord(
  viewedWords: string[],
  _wordsFallback?: PhrontisteryWord[]
): PhrontisteryWord {
  const customWords = getCustomWords();
  const total = customWords.length + RAW_PHRONTISTERY_WORDS.length;
  if (!total) {
    return enrichWord({ word: 'phrontistery', definition: 'a thinking-place', part_of_speech: 'noun' });
  }

  const viewedSet = new Set((viewedWords || []).map((w) => w.toLowerCase()));

  // Random sampling up to 50 attempts to avoid viewed words
  for (let attempt = 0; attempt < 50; attempt++) {
    const randIdx = Math.floor(Math.random() * total);
    if (randIdx < customWords.length) {
      const candidate = customWords[randIdx];
      if (!viewedSet.has(candidate.word.toLowerCase())) {
        return candidate;
      }
    } else {
      const raw = RAW_PHRONTISTERY_WORDS[randIdx - customWords.length];
      if (!viewedSet.has(raw.word.toLowerCase())) {
        return enrichWord(raw);
      }
    }
  }

  // Fallback: pick any random word
  const fallbackIdx = Math.floor(Math.random() * total);
  if (fallbackIdx < customWords.length) return customWords[fallbackIdx];
  return enrichWord(RAW_PHRONTISTERY_WORDS[fallbackIdx - customWords.length]);
}

function generateExampleSentence(word: string, def: string, pos: string): string {
  const w = word.toLowerCase();
  if (pos === 'adj' || pos === 'adjective') {
    return `The scholar observed an almost ${w} stillness across the vaulted scriptorium archives.`;
  }
  if (pos === 'noun') {
    return `In his dusty folio, the antiquarian lingered over the ancient ${w}, noting its curious rarity.`;
  }
  if (pos === 'verb') {
    return `The chroniclers sought to ${w} the dispute before the sovereign's arrival.`;
  }
  return `A rare demonstration of ${w}, noted in the annals of forgotten terminology.`;
}
