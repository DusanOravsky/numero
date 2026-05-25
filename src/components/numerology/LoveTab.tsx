import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import type { NumerologyResult } from '../../engine/numerologyEngine';
import { getLoveLanguageDescription, getLoveLanguageScoringExplanation } from '../../data/orvDescriptions';
import { useTranslation } from '../../i18n/useTranslation';

interface LoveTabProps {
  result: NumerologyResult;
}

export function LoveTab({ result }: LoveTabProps) {
  const { language } = useTranslation();
  return (
    <div className="space-y-4">
      <GlassCard>
        <p className="text-sm text-slate-400">
          {language === 'sk'
            ? <><strong className="text-white">5 jazykov lásky</strong> je koncept Garyho Chapmana, ktorý identifikuje 5 základných spôsobov, akými ľudia prijímajú a dávajú lásku. Numerologický výpočet odhaľuje váš prirodzený jazyk lásky na základe rozloženia čísel vo vašej mriežke.</>
            : <><strong className="text-white">5 Love Languages</strong> is a concept by Gary Chapman that identifies 5 fundamental ways people receive and give love. The numerological calculation reveals your natural love language based on the distribution of numbers in your grid.</>}
        </p>
        <p className="text-xs text-slate-500 mt-2">{getLoveLanguageScoringExplanation(language)}</p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-4">{language === 'sk' ? 'Vaše jazyky lásky – numerologické skóre' : 'Your love languages – numerological score'}</h3>
        <div className="space-y-4">
          {result.loveLanguages.map((lang, idx) => {
            const langInfo = getLoveLanguageDescription(lang.language, language);
            return (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{lang.language}</span>
                  <span className="text-sm text-slate-400">{lang.score} {language === 'sk' ? 'bodov' : 'points'}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, (lang.score + 5) * 8))}%` }}
                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                    className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                  />
                </div>
                {langInfo && (
                  <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-slate-800/30 border border-slate-700/20'}`}>
                    <p className="text-xs text-slate-300 mb-1">{langInfo.description}</p>
                    <p className="text-xs text-slate-400"><strong className="text-slate-300">{language === 'sk' ? 'Príklady:' : 'Examples:'}</strong> {langInfo.examples}</p>
                    {idx === 0 && (
                      <p className="text-xs text-rose-300 mt-1"><strong>{language === 'sk' ? 'Ako prejaviť:' : 'How to express:'}</strong> {langInfo.howToShow}</p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-medium text-white mb-2">{language === 'sk' ? 'Ako pracovať s jazykmi lásky' : 'How to work with love languages'}</h3>
        <div className="space-y-2 text-sm text-slate-300">
          {language === 'sk' ? (
            <>
              <p>1. <strong className="text-rose-300">Váš primárny jazyk</strong> (najvyššie skóre) je spôsob, akým najprirodzejšie prijímate aj dávate lásku.</p>
              <p>2. <strong className="text-indigo-300">Sekundárny jazyk</strong> dopĺňa primárny a ukazuje ďalší dôležitý spôsob prepojenia.</p>
              <p>3. <strong className="text-slate-400">Nízke skóre</strong> neznamená neschopnosť – len to, že tento jazyk vyžaduje vedomé úsilie.</p>
              <p>4. Vo vzťahu je dôležité poznať jazyk lásky partnera a vedome ho používať.</p>
            </>
          ) : (
            <>
              <p>1. <strong className="text-rose-300">Your primary language</strong> (highest score) is the way you most naturally receive and give love.</p>
              <p>2. <strong className="text-indigo-300">Secondary language</strong> complements the primary and shows another important way of connection.</p>
              <p>3. <strong className="text-slate-400">Low score</strong> does not mean inability – only that this language requires conscious effort.</p>
              <p>4. In a relationship it is important to know your partner's love language and consciously use it.</p>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
