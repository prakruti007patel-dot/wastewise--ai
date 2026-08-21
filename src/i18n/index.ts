import { en } from './en';
import { gu } from './gu';
import { hi } from './hi';
import type { Language } from '../types';

export type Translations = typeof en;

const translations: Record<Language, Translations> = { en, gu, hi };

export const getTranslations = (lang: Language): Translations =>
  translations[lang] || translations['en'];

export { en, gu, hi };
