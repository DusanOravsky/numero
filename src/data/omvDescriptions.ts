import type { Language } from '../store/useStore';

export interface OmvDescription {
  title: string;
  theme: string;
  description: string;
  advice: string;
  keywords: string[];
}

const sk: Record<number, OmvDescription> = {
  1: {
    title: 'Mesiac iniciatívy',
    theme: 'Štart, rozhodnutia, nová energia',
    description: 'Tento mesiac vášho osobného roka prináša energiu začiatkov. Je čas pustiť sa do nových vecí, urobiť prvý krok a prevziať iniciatívu. Neodkladajte rozhodnutia — energia podporuje akciu.',
    advice: 'Urobte ten prvý krok, o ktorom ste premýšľali. Napíšte ten email, zavolajte, začnite projekt. Tento mesiac vám dáva odvahu a odhodlanie.',
    keywords: ['iniciatíva', 'rozhodnutia', 'prvý krok', 'odvaha', 'akcia'],
  },
  2: {
    title: 'Mesiac spolupráce',
    theme: 'Vzťahy, trpezlivosť, detaily',
    description: 'Mesiac 2 spomaľuje tempo a prenáša pozornosť na vzťahy a spoluprácu. Nie je čas na veľké sólo akcie — skôr na ladenie detailov, budovanie spojení a počúvanie druhých.',
    advice: 'Venujte sa vzťahom a spojenectvám. Buďte trpezliví — veci dozrievajú. Všímajte si detaily, ktoré ste prehliadali. Počúvajte viac než hovoríte.',
    keywords: ['spolupráca', 'trpezlivosť', 'partnerstvo', 'detaily', 'intuícia'],
  },
  3: {
    title: 'Mesiac tvorivosti',
    theme: 'Komunikácia, radosť, sebavyjadrenie',
    description: 'Energia tohto mesiaca podporuje tvorivosť, komunikáciu a spoločenský život. Je čas zdieľať nápady, tvoriť a vyjadrovať sa. Ľahkosť a optimizmus sú vašimi spojencami.',
    advice: 'Tvorte bez autocenzúry — písanie, kreslenie, hovorenie. Choďte medzi ľudí, zdieľajte nápady. Nedržte radosť pre seba — šírte ju.',
    keywords: ['kreativita', 'komunikácia', 'optimizmus', 'zdieľanie', 'radosť'],
  },
  4: {
    title: 'Mesiac budovania',
    theme: 'Disciplína, práca, poriadok',
    description: 'Praktický mesiac, kedy energia žiada konkrétne výsledky. Poriadok v papieroch, disciplína v rutine, dokončenie rozrobených vecí. Nie je to vzrušujúce, ale je to nevyhnutné.',
    advice: 'Dokončite rozrobené projekty. Upratajte priestor — fyzický aj mentálny. Vytvorte si rutinu, ktorá vám slúži. Malé kroky každý deň.',
    keywords: ['disciplína', 'dokončenie', 'poriadok', 'rutina', 'výsledky'],
  },
  5: {
    title: 'Mesiac zmien',
    theme: 'Flexibilita, nečakané príležitosti, pohyb',
    description: 'Dynamický mesiac plný prekvapení a zmien. Plány sa môžu zmeniť — a to je v poriadku. Energia podporuje adaptabilitu, cestovanie a nové skúsenosti.',
    advice: 'Neodporujte zmenám — sú príležitosťou. Skúste niečo nové. Povedzte áno na pozvanie, ktoré by ste normálne odmietli. Buďte flexibilní.',
    keywords: ['zmena', 'flexibilita', 'dobrodružstvo', 'nové skúsenosti', 'adaptabilita'],
  },
  6: {
    title: 'Mesiac harmónie',
    theme: 'Domov, vzťahy, krása, zodpovednosť',
    description: 'Mesiac orientovaný na domov, rodinu a vzťahy. Energia podporuje vytváranie krásy a harmónie vo vašom okolí. Možno prídu dôležité rozhodnutia vo vzťahoch.',
    advice: 'Venujte sa blízkym vzťahom. Skrášlite si priestor. Prijmite zodpovednosť s láskou. Ak cítite, že niečo vo vzťahu treba povedať — teraz je čas.',
    keywords: ['harmónia', 'rodina', 'krása', 'vzťahy', 'starostlivosť'],
  },
  7: {
    title: 'Mesiac introspekcie',
    theme: 'Ticho, štúdium, vnútorný rast',
    description: 'Mesiac stiahnutia sa dovnútra. Energia nepodporuje vonkajšiu expanziu — skôr reflexiu, učenie a duchovný rast. Ak sa cítite unavení zo spoločnosti, je to prirodzené.',
    advice: 'Čítajte, meditujte, študujte. Trávte čas sami so sebou. Nepodliehajte tlaku byť stále produktívni navonok — vnútorná práca je tiež práca.',
    keywords: ['introspekcia', 'ticho', 'štúdium', 'reflexia', 'duchovnosť'],
  },
  8: {
    title: 'Mesiac manifestácie',
    theme: 'Výsledky, autorita, hojnosť',
    description: 'Silný mesiac pre materiálne záležitosti. Energia podporuje finančné rozhodnutia, kariérne kroky a prejavenie osobnej moci. Čo ste v predchádzajúcich mesiacoch budovali, teraz prináša plody.',
    advice: 'Konajte s autoritou. Žiadajte o to, čo si zaslúžite. Investujte — do seba, do projektov, do budúcnosti. Nebojte sa byť viditeľní.',
    keywords: ['manifestácia', 'autorita', 'hojnosť', 'výsledky', 'odvaha'],
  },
  9: {
    title: 'Mesiac uzatvárania',
    theme: 'Dokončenie, odpustenie, príprava',
    description: 'Záverečný mesiac mini-cyklu. Čas dokončiť nedokončené, odpustiť a uvoľniť to, čo vám už neslúži. Neštartujte veľké nové projekty — nechajte priestor na dozretie a uzavretie.',
    advice: 'Pustite to, čo vás ťaží. Odpustite — sebe aj iným. Dokončite jeden rozrobený projekt. Pripravujte sa vnútorne na nový cyklus.',
    keywords: ['uzatváranie', 'odpustenie', 'dokončenie', 'uvoľnenie', 'príprava'],
  },
};

const en: Record<number, OmvDescription> = {
  1: {
    title: 'Month of Initiative',
    theme: 'New starts, decisions, fresh energy',
    description: 'This month of your personal year brings the energy of beginnings. It is time to launch new endeavors, take the first step and seize the initiative. Do not postpone decisions — the energy favors action.',
    advice: 'Take that first step you have been contemplating. Send the email, make the call, start the project. This month gives you courage and determination.',
    keywords: ['initiative', 'decisions', 'first step', 'courage', 'action'],
  },
  2: {
    title: 'Month of Cooperation',
    theme: 'Relationships, patience, details',
    description: 'Month 2 slows the pace and shifts focus to relationships and cooperation. It is not the time for bold solo moves — rather for fine-tuning details, building connections and listening to others.',
    advice: 'Nurture relationships and alliances. Be patient — things are ripening. Notice the details you have been overlooking. Listen more than you speak.',
    keywords: ['cooperation', 'patience', 'partnership', 'details', 'intuition'],
  },
  3: {
    title: 'Month of Creativity',
    theme: 'Communication, joy, self-expression',
    description: 'This month\'s energy supports creativity, communication and social life. It is time to share ideas, create and express yourself. Lightness and optimism are your allies.',
    advice: 'Create without self-censorship — writing, drawing, speaking. Go out and mingle, share your ideas. Do not keep joy to yourself — spread it.',
    keywords: ['creativity', 'communication', 'optimism', 'sharing', 'joy'],
  },
  4: {
    title: 'Month of Building',
    theme: 'Discipline, work, order',
    description: 'A practical month when the energy demands tangible results. Order in paperwork, discipline in routine, finishing unfinished tasks. It is not exciting, but it is essential.',
    advice: 'Finish open projects. Declutter your space — physical and mental. Create a routine that serves you. Small steps every day.',
    keywords: ['discipline', 'completion', 'order', 'routine', 'results'],
  },
  5: {
    title: 'Month of Change',
    theme: 'Flexibility, unexpected opportunities, movement',
    description: 'A dynamic month full of surprises and shifts. Plans may change — and that is perfectly fine. The energy supports adaptability, travel and new experiences.',
    advice: 'Do not resist changes — they are opportunities. Try something new. Say yes to an invitation you would normally decline. Stay flexible.',
    keywords: ['change', 'flexibility', 'adventure', 'new experiences', 'adaptability'],
  },
  6: {
    title: 'Month of Harmony',
    theme: 'Home, relationships, beauty, responsibility',
    description: 'A month focused on home, family and relationships. The energy supports creating beauty and harmony in your surroundings. Important relationship decisions may arise.',
    advice: 'Tend to close relationships. Beautify your space. Embrace responsibility with love. If something in a relationship needs to be said — now is the time.',
    keywords: ['harmony', 'family', 'beauty', 'relationships', 'care'],
  },
  7: {
    title: 'Month of Introspection',
    theme: 'Silence, study, inner growth',
    description: 'A month of turning inward. The energy does not support outer expansion — rather reflection, learning and spiritual growth. If you feel drained by company, it is natural.',
    advice: 'Read, meditate, study. Spend time alone with yourself. Do not yield to pressure to be constantly productive outwardly — inner work is work too.',
    keywords: ['introspection', 'silence', 'study', 'reflection', 'spirituality'],
  },
  8: {
    title: 'Month of Manifestation',
    theme: 'Results, authority, abundance',
    description: 'A powerful month for material matters. The energy supports financial decisions, career moves and expressing personal power. What you built in previous months now bears fruit.',
    advice: 'Act with authority. Ask for what you deserve. Invest — in yourself, in projects, in the future. Do not be afraid to be visible.',
    keywords: ['manifestation', 'authority', 'abundance', 'results', 'courage'],
  },
  9: {
    title: 'Month of Closure',
    theme: 'Completion, forgiveness, preparation',
    description: 'The final month of the mini-cycle. Time to finish the unfinished, forgive and release what no longer serves you. Do not start major new projects — leave space for ripening and closure.',
    advice: 'Let go of what weighs you down. Forgive — yourself and others. Complete one open project. Prepare inwardly for a new cycle.',
    keywords: ['closure', 'forgiveness', 'completion', 'release', 'preparation'],
  },
};

const dictionaries = { sk, en };

export function getOmvDescription(key: number, lang: Language = 'sk'): OmvDescription {
  return dictionaries[lang]?.[key] ?? dictionaries.sk[key];
}

// Backward compatibility
export const omvDescriptions = sk;
