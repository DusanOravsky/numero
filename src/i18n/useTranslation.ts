import { useStore } from '../store/useStore';
import { translate, type TranslationKey } from './translations';

/**
 * Hook na preklad.
 * Použitie: const { t } = useTranslation(); ... t('nav.dashboard')
 */
export function useTranslation() {
  const language = useStore(s => s.language);
  return {
    language,
    t: (key: TranslationKey) => translate(language, key),
  };
}
