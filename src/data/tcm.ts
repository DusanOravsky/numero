export interface TCMElement {
  name: string;
  season: string;
  organ: string;
  emotion: string;
  virtue: string;
  color: string;
  taste: string;
  strengthSign: string;
  weaknessSign: string;
  balanceTip: string;
  foods: { nourishing: string; weakening: string };
  meridianHours: string;
  meridianNote: string;
  generates: string;
  controls: string;
  generatedBy: string;
  controlledBy: string;
  chakra: number;
  seasonalAdvice: string;
}

export const TCM_ELEMENTS: Record<string, TCMElement> = {
  drevo: {
    name: 'Drevo',
    season: 'Jar',
    organ: 'Pečeň / Žlčník',
    emotion: 'Hnev',
    virtue: 'Láskavosť a veľkorysosť',
    color: 'Zelená',
    taste: 'Kyslá',
    strengthSign: 'Rozhodnosť, vízia, plánovanie, rast, flexibilita',
    weaknessSign: 'Frustrácia, potlačený hnev, stuhnutosť, problémy s očami',
    balanceTip: 'Pohyb a strečing, zelená strava, kreatívne vyjadrenie hnevu, prechádzky v lese',
    foods: { nourishing: 'Zelená listová zelenina, klíčky, citróny, uhorky, avokádo, mäta, kurkuma', weakening: 'Alkohol, mastné vyprážané jedlá, príliš pikantné, prejedanie sa neskoro večer' },
    meridianHours: '1:00 – 3:00 (Pečeň), 23:00 – 1:00 (Žlčník)',
    meridianNote: 'Ak sa pravidelne budíš medzi 1-3 ráno, tvoja pečeň volá po pozornosti — potlačený hnev alebo toxická záťaž.',
    generates: 'Oheň',
    controls: 'Zem',
    generatedBy: 'Voda',
    controlledBy: 'Kov',
    chakra: 3,
    seasonalAdvice: 'Na jar sa prebúdzaj skoro, jedz kyslé a zelené, hýb sa ráno, vyjadruj emócie — pečeň potrebuje voľný tok.',
  },
  ohen: {
    name: 'Oheň',
    season: 'Leto',
    organ: 'Srdce / Tenké črevo',
    emotion: 'Radosť',
    virtue: 'Poriadok a úcta',
    color: 'Červená',
    taste: 'Horká',
    strengthSign: 'Vášeň, charizma, radosť, komunikatívnosť, intuícia',
    weaknessSign: 'Úzkosť, nepokoj, nespavosť, nadmerné vzrušenie, problémy so srdcom',
    balanceTip: 'Meditácia, zmierňovanie stimulácie, horké byliny, radostné vzťahy bez závislosti',
    foods: { nourishing: 'Horké byliny (žihľava, pampeliška), červené ovocie, tmavá čokoláda, zelený čaj, ružový čaj', weakening: 'Kofeín vo veľkom, energetické nápoje, príliš pikantné, alkohol' },
    meridianHours: '11:00 – 13:00 (Srdce), 13:00 – 15:00 (Tenké črevo)',
    meridianNote: 'Poobedná únava alebo palpitácie okolo poludnia — srdce potrebuje pokoj. Ideálny čas na krátku meditáciu.',
    generates: 'Zem',
    controls: 'Kov',
    generatedBy: 'Drevo',
    controlledBy: 'Voda',
    chakra: 4,
    seasonalAdvice: 'V lete sa raduj, ale bez excesov. Chráň srdce pred prehriatím — jedz chladivé horké potraviny, medituj napoludnie.',
  },
  zem: {
    name: 'Zem',
    season: 'Neskoré leto / Prechody',
    organ: 'Slezina / Žalúdok',
    emotion: 'Starosť',
    virtue: 'Viera a dôvera',
    color: 'Žltá',
    taste: 'Sladká',
    strengthSign: 'Starostlivosť, výživa, stabilita, empatia, spoľahlivosť',
    weaknessSign: 'Prílišné premýšľanie, starostlivosť o iných na úkor seba, tráviace problémy',
    balanceTip: 'Pravidelné stravovanie, uzemnenie, spev, obmedzenie vlhkých a sladkých jedál',
    foods: { nourishing: 'Teplé polievky, koreňová zelenina (mrkva, sladké zemiaky), ryža, ovos, tekvica, med', weakening: 'Surová studená strava, mliečne výrobky vo veľkom, rafinovaný cukor, zmrzlina' },
    meridianHours: '7:00 – 9:00 (Žalúdok), 9:00 – 11:00 (Slezina)',
    meridianNote: 'Raňajky sú pre teba kľúčové — žalúdok je ráno najaktívnejší. Preskočenie raňajok oslabuje slezinu.',
    generates: 'Kov',
    controls: 'Voda',
    generatedBy: 'Oheň',
    controlledBy: 'Drevo',
    chakra: 3,
    seasonalAdvice: 'Pri prechodoch sezón (equinox) jedz teplé, varené, uzemnené jedlá. Starosť lieč spevom a rytmom.',
  },
  kov: {
    name: 'Kov',
    season: 'Jeseň',
    organ: 'Pľúca / Hrubé črevo',
    emotion: 'Smútok',
    virtue: 'Spravodlivosť a odvaha',
    color: 'Biela',
    taste: 'Štipľavá',
    strengthSign: 'Disciplína, poriadok, jasnosť, schopnosť pustiť, kvalita',
    weaknessSign: 'Smútok, rigidita, dýchacie problémy, kožné problémy, izolácia',
    balanceTip: 'Dychové cvičenia (prānāyāma), spracovanie straty, pikantné jedlá, decluttering',
    foods: { nourishing: 'Biela zelenina (cesnak, cibuľa, reďkovka), hrušky, ryža, koreň lotosu, pikantné korenia', weakening: 'Mliečne výrobky (tvoria hlien), studené nápoje, príliš sladké' },
    meridianHours: '3:00 – 5:00 (Pľúca), 5:00 – 7:00 (Hrubé črevo)',
    meridianNote: 'Budenie sa medzi 3-5 ráno = pľúca spracúvajú smútok. Ideálny čas na dychové cvičenia ak si hore.',
    generates: 'Voda',
    controls: 'Drevo',
    generatedBy: 'Zem',
    controlledBy: 'Oheň',
    chakra: 5,
    seasonalAdvice: 'Na jeseň púšťaj — veci, vzťahy, návyky. Jedz bielu zeleninu, cvič prānāyāmu, upratuj priestor.',
  },
  voda: {
    name: 'Voda',
    season: 'Zima',
    organ: 'Obličky / Močový mechúr',
    emotion: 'Strach',
    virtue: 'Múdrosť a vôľa',
    color: 'Čierna / Tmavomodrá',
    taste: 'Slaná',
    strengthSign: 'Múdrosť, vôľa, vytrvalosť, hĺbka, pokora',
    weaknessSign: 'Strach, vyčerpanie, problémy s kosťami a kĺbmi, studené nohy, slabá vôľa',
    balanceTip: 'Dostatok odpočinku, teplé jedlá, chi-kung, čierne potraviny (sezam, fazuľa), obmedzenie strachu',
    foods: { nourishing: 'Čierne potraviny (sezam, čierna fazuľa, čierne ríbezle), vlašské orechy, morské riasy, kostné vývary', weakening: 'Káva vo veľkom, studené surové jedlá v zime, presolené, energia drinky' },
    meridianHours: '15:00 – 17:00 (Močový mechúr), 17:00 – 19:00 (Obličky)',
    meridianNote: 'Poobedná únava okolo 15-17h = močový mechúr. Podvečerná slabosť = obličky volajú po teple a odpočinku.',
    generates: 'Drevo',
    controls: 'Oheň',
    generatedBy: 'Kov',
    controlledBy: 'Zem',
    chakra: 1,
    seasonalAdvice: 'V zime spomaľ, šetri energiu, jedz teplé a slané, spi viac, chi-kung namiesto výkonového športu.',
  },
};
