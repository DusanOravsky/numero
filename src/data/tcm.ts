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
  },
};
