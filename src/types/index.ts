export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adj'
  | 'adjective'
  | 'adv'
  | 'adverb'
  | 'propn'
  | 'pron'
  | 'num'
  | 'adp'
  | 'cconj'
  | 'x';

export type SemanticGist =
  | 'fauna_zoology'
  | 'botany_flora'
  | 'maritime_ocean'
  | 'cosmos_astronomy'
  | 'architecture_stone'
  | 'linguistics_literature'
  | 'spiritual_mythology'
  | 'anatomy_medicine'
  | 'philosophy_mind'
  | 'antiquity_history';

export interface PhrontisteryWord {
  id?: string;
  word: string;
  definition: string;
  part_of_speech: PartOfSpeech | string;
  ipa?: string;
  respelling?: string;
  etymology?: string;
  origin_language?: string;
  gist?: SemanticGist;
  example?: string;
  source?: string;
  custom?: boolean;
}

export type PronunciationStyle = 'respelling' | 'ipa' | 'both' | 'audio_only' | 'off';

export interface ColorTheme {
  id: string;
  name: string;
  bgDark: string;
  surfaceDark: string;
  surfaceBorderDark: string;
  textPrimary: string;
  textSecondary: string;
  accentGold: string;
  accentSubtle: string;
  badgeBg: string;
  badgeText: string;
  gradientOverlay: string;
}

export interface ArtworkBackground {
  id: string;
  title: string;
  artist: string;
  year?: string;
  gist: SemanticGist;
  url: string;
  commonsUrl?: string;
  source: string;
  license?: string;
  dominantColor?: string;
}

export type LayoutStyle =
  | 'monograph'        // Classic book / editorial layout with subtle left-anchor
  | 'museum_placard'   // Centered fine art gallery presentation with frame
  | 'zenith_minimal'   // Pure typography, maximum negative space
  | 'split_curatorial' // Two-column: Artwork focus left, scholarly treatise right
  | 'broadsheet';      // Newspaper / broadsheet bold literary folio

export type DisplayMode = 'daily' | 'random_every_tab';

export type BoxAlignment = 'archetype' | 'center';

export interface ComponentVisibility {
  showWord: boolean;
  showPhonetics: boolean;
  showPartOfSpeech: boolean;
  showDefinition: boolean;
  showEtymology: boolean;
  showExample: boolean;
  showGistBadge: boolean;
  showClock: boolean;
  showDate: boolean;
  showSearchBar: boolean;
  showTicker: boolean;
  showAudioButton: boolean;
}

export interface AppSettings {
  displayMode: DisplayMode;
  layoutStyle: LayoutStyle;
  fontFamily: 'cormorant' | 'playfair' | 'cinzel' | 'instrument' | 'sans';
  wordSize: 'compact' | 'balanced' | 'monumental';
  boxAlignment?: BoxAlignment; // 'archetype' (signature asymmetric layout position) vs 'center' (classic centered)
  animationSpeed: 'off' | 'gentle' | 'normal';
  enableAmbientParticles: boolean;
  enableAmbientSound: boolean;
  customBackgroundUrl?: string;
  overlayOpacity: number; // legacy 0.2 to 1.0
  frameOpacity: number; // 0.50 (half transparent) to 1.00 (fully opaque)
  isFrameTranslucent: boolean; // toggle for frame transparency
  pronunciationStyle: PronunciationStyle;
  components: ComponentVisibility;
  favoriteWordList: string[];
  viewedWordsHistory: {
    word: string;
    timestamp: number;
    definition: string;
  }[];
}
