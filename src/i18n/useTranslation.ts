import { useStore } from '../store/useStore';
import { translate, type TranslationKey } from './registry';

export type { TranslationKey };

export function useTranslation() {
  const language = useStore(s => s.language);
  return {
    language,
    t: (key: TranslationKey) => translate(language, key),
  };
}
