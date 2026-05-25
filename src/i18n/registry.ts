import type { Language } from '../store/useStore';
import { commonDictionaries, type CommonKey } from './namespaces/common';
import { settingsDictionaries, type SettingsKey } from './namespaces/settings';
import { clientsDictionaries, type ClientsKey } from './namespaces/clients';
import { dashboardDictionaries, type DashboardKey } from './namespaces/dashboard';
import { numerologyDictionaries, type NumerologyKey } from './namespaces/numerology';
import { astrologyDictionaries, type AstrologyKey } from './namespaces/astrology';
import { chakrasDictionaries, type ChakrasKey } from './namespaces/chakras';
import { relationshipsDictionaries, type RelationshipsKey } from './namespaces/relationships';

export type TranslationKey = CommonKey | SettingsKey | ClientsKey | DashboardKey | NumerologyKey | AstrologyKey | ChakrasKey | RelationshipsKey;

const merged: Record<Language, Record<string, string>> = { sk: {}, en: {} };

for (const ns of [commonDictionaries, settingsDictionaries, clientsDictionaries, dashboardDictionaries, numerologyDictionaries, astrologyDictionaries, chakrasDictionaries, relationshipsDictionaries]) {
  Object.assign(merged.sk, ns.sk);
  Object.assign(merged.en, ns.en);
}

export function translate(lang: Language, key: TranslationKey): string {
  const val = merged[lang][key];
  if (val) return val;

  const fallback = merged.sk[key];
  if (fallback) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing '${lang}' translation for key: '${key}'`);
    }
    return fallback;
  }

  if (import.meta.env.DEV) {
    console.warn(`[i18n] Translation key not found: '${key}'`);
  }
  return key;
}
