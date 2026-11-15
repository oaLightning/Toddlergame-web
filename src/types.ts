export type Locale = 'he' | 'en';
export type Theme = 'hebrew' | 'english' | 'numbers' | 'play';
export interface Choice { id: string; label: string; emoji?: string; image?: string; correct?: boolean }
export interface WordExample { word: string; highlight: string; emoji?: string; image?: string }
export type ExerciseKind = 'introduce' | 'trace' | 'find' | 'match' | 'color' | 'count' | 'arithmetic' | 'keypad' | 'build' | 'freeze' | 'puzzle' | 'keybash' | 'typing';
export interface Exercise {
  id: string;
  kind: ExerciseKind;
  instruction: string;
  speech?: string;
  audioId?: string;
  target?: string;
  examples?: WordExample[];
  choices?: Choice[];
  /** find: tap each occurrence of target in text */
  text?: string;
  /** trace: optional SVG path d strings in a 0 0 200 200 viewBox */
  strokes?: string[];
  /** count/keypad: expected answer; arithmetic can derive it from operands */
  answer?: number;
  count?: number;
  emoji?: string;
  operation?: '+' | '-';
  responseMode?: 'choices' | 'keypad';
  operands?: [number, number];
  /** build: selectable letters; target is the intended word */
  letters?: string[];
  help?: string;
  typingMode?: 'find' | 'repeat';
  keyboardLocale?: 'he' | 'en' | 'numbers';
  targets?: string[];
  sequences?: string[];
}
export interface Lesson {
  id: string;
  theme: Theme;
  locale: Locale;
  title: string;
  subtitle: string;
  cover: string;
  color?: string;
  pages: Exercise[];
}
export interface CharacterAsset { id: string; name: string; src?: string; image?: string; path?: string }
