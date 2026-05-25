import type { Language } from '../../store/useStore';

export type AstrologyKey =
  | 'astrology.title' | 'astrology.subtitle' | 'astrology.sun' | 'astrology.moon'
  | 'astrology.ascendant' | 'astrology.dominantElement' | 'astrology.dominantQuality'
  | 'astrology.dominantPlanet' | 'astrology.moonPhase' | 'astrology.northNode' | 'astrology.southNode'
  | 'astrology.houses' | 'astrology.natalAspects' | 'astrology.chineseZodiac'
  | 'astrology.element' | 'astrology.planetsInSigns' | 'astrology.dominantEnergies'
  | 'astrology.currentTransits' | 'astrology.longTermTransits' | 'astrology.shortTermTransits'
  | 'astrology.karmicNodes' | 'astrology.growthDirection' | 'astrology.innateTalent'
  | 'astrology.harmonicAspects' | 'astrology.tenseAspects' | 'astrology.neutralAspects'
  | 'astrology.topAspects' | 'astrology.noBirthPlace'
  | 'astrology.sunSign' | 'astrology.moonSign' | 'astrology.ascSign'
  | 'astrology.whatToTakeAway' | 'astrology.yourReading'
  | 'astrology.chineseAnimal' | 'astrology.chineseElement' | 'astrology.chineseYinYang'
  | 'astrology.chineseCompat' | 'astrology.chineseNextYear' | 'astrology.chineseAdvice'
  | 'astrology.chineseWarning'
  | 'hd.title' | 'hd.subtitle' | 'hd.type' | 'hd.authority' | 'hd.strategy' | 'hd.profile'
  | 'hd.definedCenters' | 'hd.openCenters' | 'hd.channels' | 'hd.cross'
  | 'hd.tabOverview' | 'hd.tabGeneKeys' | 'hd.bodygraph'
  | 'hd.yourType' | 'hd.notSelfTheme' | 'hd.signature'
  | 'hd.howToReadBodygraph' | 'hd.personalityGates' | 'hd.designGates'
  | 'hd.activeChannels' | 'hd.profileLines' | 'hd.definition'
  | 'hd.variable' | 'hd.variableDesc'
  | 'hd.digestion' | 'hd.environment' | 'hd.motivation' | 'hd.perspective'
  | 'hd.geneKeys' | 'hd.geneKeysDesc'
  | 'hd.yourReading' | 'hd.whatToTakeAway'
  | 'kabalah.title' | 'kabalah.subtitle' | 'kabalah.primarySefira'
  | 'kabalah.secondarySefira' | 'kabalah.path' | 'kabalah.malchutAction'
  | 'kabalah.treeOfLife' | 'kabalah.yourReading';

type Dict = Record<AstrologyKey, string>;

const sk: Dict = {
  'astrology.title': 'Astrológia',
  'astrology.subtitle': 'Natálny horoskop',
  'astrology.sun': 'Slnko',
  'astrology.moon': 'Mesiac',
  'astrology.ascendant': 'Ascendent',
  'astrology.dominantElement': 'Dominantný živel',
  'astrology.dominantQuality': 'Dominantná kvalita',
  'astrology.dominantPlanet': 'Dominantná planéta',
  'astrology.moonPhase': 'Fáza Mesiaca',
  'astrology.northNode': 'Severný uzol',
  'astrology.southNode': 'Južný uzol',
  'astrology.houses': 'Astrologické domy (Whole Sign)',
  'astrology.natalAspects': 'Natálne aspekty',
  'astrology.chineseZodiac': 'Čínsky horoskop',
  'astrology.element': 'Element',
  'astrology.planetsInSigns': 'Planéty v znameniach',
  'astrology.dominantEnergies': 'Dominantné energie',
  'astrology.currentTransits': 'Aktuálne tranzity',
  'astrology.longTermTransits': 'Dlhodobé (vonkajšie planéty)',
  'astrology.shortTermTransits': 'Krátkodobé tranzity — Slnko, Mesiac, osobné planéty',
  'astrology.karmicNodes': 'Karmické uzly',
  'astrology.growthDirection': 'Smer rastu:',
  'astrology.innateTalent': 'Vrodený talent:',
  'astrology.harmonicAspects': 'Harmonické',
  'astrology.tenseAspects': 'Napäťové',
  'astrology.neutralAspects': 'Neutrálne',
  'astrology.topAspects': 'Top najpresnejších',
  'astrology.noBirthPlace': 'Pre presný ascendent a domy zadajte miesto narodenia.',
  'astrology.sunSign': 'Slnečné znamenie',
  'astrology.moonSign': 'Mesačné znamenie',
  'astrology.ascSign': 'Ascendent',
  'astrology.whatToTakeAway': 'Čo si z toho vziať',
  'astrology.yourReading': 'Tvoje čítanie — ako pracovať s horoskopom',
  'astrology.chineseAnimal': 'Zviera',
  'astrology.chineseElement': 'Element',
  'astrology.chineseYinYang': 'Yin/Yang',
  'astrology.chineseCompat': 'Kompatibilita',
  'astrology.chineseNextYear': 'Najbližší rok',
  'astrology.chineseAdvice': 'Rada',
  'astrology.chineseWarning': 'Čínsky horoskop potrebuje presný rok narodenia (lunárny kalendár).',
  'hd.title': 'Human Design',
  'hd.subtitle': 'Váš energetický odtlačok',
  'hd.type': 'Typ',
  'hd.authority': 'Autorita',
  'hd.strategy': 'Stratégia',
  'hd.profile': 'Profil',
  'hd.definedCenters': 'Definované centrá',
  'hd.openCenters': 'Otvorené centrá',
  'hd.channels': 'Kanály',
  'hd.cross': 'Inkarnačný kríž',
  'hd.tabOverview': 'Prehľad',
  'hd.tabGeneKeys': 'Génové kľúče',
  'hd.bodygraph': 'Bodygraph',
  'hd.yourType': 'Váš typ',
  'hd.notSelfTheme': 'Nie-ja téma',
  'hd.signature': 'Signatúra',
  'hd.howToReadBodygraph': 'Ako čítať bodygraph',
  'hd.personalityGates': 'Osobnostné brány (vedomé)',
  'hd.designGates': 'Dizajnové brány (nevedomé)',
  'hd.activeChannels': 'Aktívne kanály',
  'hd.profileLines': 'Profil — línie',
  'hd.definition': 'Definícia',
  'hd.variable': 'Variable — strava, prostredie, motivácia',
  'hd.variableDesc': 'Variable popisuje vaše optimálne podmienky pre fungovanie.',
  'hd.digestion': 'Strava (PHS Digestion)',
  'hd.environment': 'Prostredie (Environment)',
  'hd.motivation': 'Motivácia',
  'hd.perspective': 'Perspektíva',
  'hd.geneKeys': 'Génové kľúče',
  'hd.geneKeysDesc': 'Génové kľúče odhaľujú spektrum vášho potenciálu — od tieňa cez dar po siddhí.',
  'hd.yourReading': 'Tvoje čítanie — ako pracovať s Human Design',
  'hd.whatToTakeAway': 'Čo si z toho vziať',
  'kabalah.title': 'Kabala',
  'kabalah.subtitle': 'Strom života a vaša cesta',
  'kabalah.primarySefira': 'Primárna sefira',
  'kabalah.secondarySefira': 'Sekundárna sefira',
  'kabalah.path': 'Cesta',
  'kabalah.malchutAction': 'Akcia v Malchut',
  'kabalah.treeOfLife': 'Strom života',
  'kabalah.yourReading': 'Tvoje čítanie — ako pracovať s Kabalou',
};

const en: Dict = {
  'astrology.title': 'Astrology',
  'astrology.subtitle': 'Natal horoscope',
  'astrology.sun': 'Sun',
  'astrology.moon': 'Moon',
  'astrology.ascendant': 'Ascendant',
  'astrology.dominantElement': 'Dominant element',
  'astrology.dominantQuality': 'Dominant quality',
  'astrology.dominantPlanet': 'Dominant planet',
  'astrology.moonPhase': 'Moon phase',
  'astrology.northNode': 'North Node',
  'astrology.southNode': 'South Node',
  'astrology.houses': 'Astrological houses (Whole Sign)',
  'astrology.natalAspects': 'Natal aspects',
  'astrology.chineseZodiac': 'Chinese zodiac',
  'astrology.element': 'Element',
  'astrology.planetsInSigns': 'Planets in signs',
  'astrology.dominantEnergies': 'Dominant energies',
  'astrology.currentTransits': 'Current transits',
  'astrology.longTermTransits': 'Long-term (outer planets)',
  'astrology.shortTermTransits': 'Short-term transits — Sun, Moon, personal planets',
  'astrology.karmicNodes': 'Karmic nodes',
  'astrology.growthDirection': 'Growth direction:',
  'astrology.innateTalent': 'Innate talent:',
  'astrology.harmonicAspects': 'Harmonic',
  'astrology.tenseAspects': 'Tense',
  'astrology.neutralAspects': 'Neutral',
  'astrology.topAspects': 'Top most precise',
  'astrology.noBirthPlace': 'For precise Ascendant and houses, enter your birth place.',
  'astrology.sunSign': 'Sun sign',
  'astrology.moonSign': 'Moon sign',
  'astrology.ascSign': 'Ascendant',
  'astrology.whatToTakeAway': 'Key takeaways',
  'astrology.yourReading': 'Your reading — how to work with the horoscope',
  'astrology.chineseAnimal': 'Animal',
  'astrology.chineseElement': 'Element',
  'astrology.chineseYinYang': 'Yin/Yang',
  'astrology.chineseCompat': 'Compatibility',
  'astrology.chineseNextYear': 'Next year',
  'astrology.chineseAdvice': 'Advice',
  'astrology.chineseWarning': 'Chinese zodiac requires precise birth year (lunar calendar).',
  'hd.title': 'Human Design',
  'hd.subtitle': 'Your energetic blueprint',
  'hd.type': 'Type',
  'hd.authority': 'Authority',
  'hd.strategy': 'Strategy',
  'hd.profile': 'Profile',
  'hd.definedCenters': 'Defined centers',
  'hd.openCenters': 'Open centers',
  'hd.channels': 'Channels',
  'hd.cross': 'Incarnation cross',
  'hd.tabOverview': 'Overview',
  'hd.tabGeneKeys': 'Gene Keys',
  'hd.bodygraph': 'Bodygraph',
  'hd.yourType': 'Your type',
  'hd.notSelfTheme': 'Not-self theme',
  'hd.signature': 'Signature',
  'hd.howToReadBodygraph': 'How to read the bodygraph',
  'hd.personalityGates': 'Personality gates (conscious)',
  'hd.designGates': 'Design gates (unconscious)',
  'hd.activeChannels': 'Active channels',
  'hd.profileLines': 'Profile — lines',
  'hd.definition': 'Definition',
  'hd.variable': 'Variable — diet, environment, motivation',
  'hd.variableDesc': 'Variable describes your optimal conditions for functioning.',
  'hd.digestion': 'Diet (PHS Digestion)',
  'hd.environment': 'Environment',
  'hd.motivation': 'Motivation',
  'hd.perspective': 'Perspective',
  'hd.geneKeys': 'Gene Keys',
  'hd.geneKeysDesc': 'Gene Keys reveal the spectrum of your potential — from shadow through gift to siddhi.',
  'hd.yourReading': 'Your reading — how to work with Human Design',
  'hd.whatToTakeAway': 'Key takeaways',
  'kabalah.title': 'Kabbalah',
  'kabalah.subtitle': 'Tree of Life and your path',
  'kabalah.primarySefira': 'Primary sefira',
  'kabalah.secondarySefira': 'Secondary sefira',
  'kabalah.path': 'Path',
  'kabalah.malchutAction': 'Malchut action',
  'kabalah.treeOfLife': 'Tree of Life',
  'kabalah.yourReading': 'Your reading — how to work with Kabbalah',
};

export const astrologyDictionaries: Record<Language, Dict> = { sk, en };
