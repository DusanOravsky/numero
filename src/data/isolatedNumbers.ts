import type { Language } from '../store/useStore';

export interface IsolatedNumberInfo {
  type: string;
  effect: string;
  description: string;
  theme: string;
  shadow: string;
  recommendation: string;
  body: string;
}

const sk: Record<string, IsolatedNumberInfo> = {
  "1": {
    type: "nepárne",
    effect: "napätie, agresivita",
    description: "Izolovaná jednotka vytvára vnútorné napätie v oblasti identity a nezávislosti. Človek môže pociťovať tlak byť silný sám za seba, ale bez podpory okolia.",
    theme: "Osamelý vodca",
    shadow: "Agresívna nezávislosť, neschopnosť požiadať o pomoc, vnútorný hnev",
    recommendation: "Vedome budujte prepojenie s blízkymi. Vaša sila nie je v izolácii, ale v autentickej komunikácii. Krok: Požiadajte dnes niekoho o pomoc – aj malú.",
    body: "Hlava, čelo – napäťové bolesti hlavy"
  },
  "2": {
    type: "párne",
    effect: "pasivita, utiahnutosť",
    description: "Izolovaná dvojka vytvára hlbokú vnútornú citlivosť bez ventilu. Emócie sa hromadia, ale nemajú kam ísť. Človek sa sťahuje do seba.",
    theme: "Tichý citlivec",
    shadow: "Emocionálna izolácia, neschopnosť vyjadriť pocity, depresia",
    recommendation: "Hľadajte bezpečné priestory pre vyjadrenie emócií. Písanie, umenie, dôverný rozhovor. Krok: Napíšte si dnes 3 vety o tom, čo cítite.",
    body: "Obličky, dolná časť chrbta – zadržiavanie emócií"
  },
  "3": {
    type: "nepárne",
    effect: "napätie, agresivita",
    description: "Izolovaná trojka vytvára blokáciu kreatívneho vyjadrenia. Vnútorná tvorivosť nemá cez čo vyjsť von, čo spôsobuje frustráciu a mentálne napätie.",
    theme: "Potlačený tvorca",
    shadow: "Mentálna prepracovanosť, cynizmus, klamanie seba aj iných",
    recommendation: "Nájdite si kreatívny outlet – čokoľvek, kde tvoríte bez posudzovania. Krok: 10 minút voľného písania alebo kreslenia bez cieľa.",
    body: "Solárny plexus, dýchanie – povrchné dýchanie, úzkosť"
  },
  "4": {
    type: "párne",
    effect: "pasivita, utiahnutosť",
    description: "Izolovaná štvorka vytvára pocit nestability a neistoty. Chýba vnútorný základ, človek sa cíti bez opory a bezpečia.",
    theme: "Bez koreňov",
    shadow: "Nedôvera, strach z budúcnosti, materiálna úzkosť, rigidita ako obrana",
    recommendation: "Budujte rituály stability – pravidelný režim, malé ciele. Krok: Vytvorte si jeden pevný denný rituál (ranné cvičenie, večerné čítanie).",
    body: "Kĺby, kolená – rigidita, strach z pohybu vpred"
  },
  "5": {
    type: "nepárne",
    effect: "napätie, agresivita",
    description: "Izolovaná päťka vytvára vnútornú nervozitu a neschopnosť nájsť smer. Energia zmeny nemá kam tiecť, čo vedie k nepokoju a impulzívnosti.",
    theme: "Nepokojný duch",
    shadow: "Nervozita, neschopnosť zaviazať sa, prehnaná prísnosť alebo chaos",
    recommendation: "Nájdite zdravú zmenu v rámci štruktúry. Krok: Urobte dnes jednu vec inak – ale vedome, nie impulzívne.",
    body: "Nervový systém, ruky – vnútorný nepokoj, nespavosť"
  },
  "6": {
    type: "párne",
    effect: "pasivita, utiahnutosť",
    description: "Izolovaná šestka vytvára odtrhnutie od lásky a rodiny. Človek túži po harmónii, ale cíti sa od nej vzdialený.",
    theme: "Osamelé srdce",
    shadow: "Naivita v láske alebo naopak uzavretosť, perfekcionizmus vo vzťahoch",
    recommendation: "Začnite u seba – sebaláska nie je sebeckosť. Krok: Urobte dnes jednu vec čisto len pre seba, bez pocitu viny.",
    body: "Srdce, hrudník – pocit ťažoby, túžby po blízkosti"
  },
  "7": {
    type: "nepárne",
    effect: "napätie, agresivita",
    description: "Izolovaná sedmička vytvára hlbokú vnútornú samotu a nedôveru. Človek sa sťahuje do intelektu a odrezáva od emócií aj od iných.",
    theme: "Osamelý mudrc",
    shadow: "Cynizmus, paranoja, sklony k nehodám, vnútorné krivdy",
    recommendation: "Zdieľajte svoju múdrosť – izolácia nie je ochrana, je väzenie. Krok: Povedzte dnes niekomu niečo osobné.",
    body: "Končatiny, nehody – signál odpojenia od tela"
  },
  "8": {
    type: "párne",
    effect: "pasivita, utiahnutosť",
    description: "Izolovaná osmička vytvára odpojenie od vlastnej sily a hojnosti. Človek sa bojí moci alebo sa jej zrieka.",
    theme: "Odmietnutá sila",
    shadow: "Pomstychtivosť, chamtivosť, alebo naopak úplné odmietanie materiálna",
    recommendation: "Prijmite svoju silu ako dar pre službu. Krok: Rozhodnite sa dnes o jednej veci, ktorú ste odkladali.",
    body: "Tráviaci systém, pečeň – blokácia toku energie"
  },
  "9": {
    type: "nepárne",
    effect: "napätie, agresivita",
    description: "Izolovaná deviatka vytvára pocit nadradennosti alebo odpojenia od sveta. Múdrosť bez prepojenia sa mení na aroganciu alebo rezignáciu.",
    theme: "Odpojený mudrc",
    shadow: "Diktátorstvo, nadradenosť, chaos, neschopnosť pustiť kontrolu",
    recommendation: "Slúžte bez podmienok. Krok: Urobte dnes jeden skutok pre niekoho bez toho, aby ste čakali vďačnosť.",
    body: "Imunitný systém, chronická únava – vyčerpanie z držania všetkého"
  }
};

const en: Record<string, IsolatedNumberInfo> = {
  "1": {
    type: "odd",
    effect: "tension, aggression",
    description: "An isolated one creates inner tension in the area of identity and independence. The person may feel pressure to be strong on their own, but without support from surroundings.",
    theme: "The Lonely Leader",
    shadow: "Aggressive independence, inability to ask for help, inner anger",
    recommendation: "Consciously build connections with close ones. Your strength is not in isolation but in authentic communication. Step: Ask someone for help today — even something small.",
    body: "Head, forehead — tension headaches"
  },
  "2": {
    type: "even",
    effect: "passivity, withdrawal",
    description: "An isolated two creates deep inner sensitivity without an outlet. Emotions accumulate but have nowhere to go. The person withdraws into themselves.",
    theme: "The Quiet Sensitive",
    shadow: "Emotional isolation, inability to express feelings, depression",
    recommendation: "Seek safe spaces for expressing emotions. Writing, art, a trusted conversation. Step: Write 3 sentences today about what you feel.",
    body: "Kidneys, lower back — retention of emotions"
  },
  "3": {
    type: "odd",
    effect: "tension, aggression",
    description: "An isolated three creates a blockage of creative expression. Inner creativity has no way to come out, causing frustration and mental tension.",
    theme: "The Suppressed Creator",
    shadow: "Mental overwork, cynicism, deceiving self and others",
    recommendation: "Find a creative outlet — anything where you create without judgment. Step: 10 minutes of free writing or drawing without a goal.",
    body: "Solar plexus, breathing — shallow breathing, anxiety"
  },
  "4": {
    type: "even",
    effect: "passivity, withdrawal",
    description: "An isolated four creates a feeling of instability and insecurity. The inner foundation is missing, the person feels without support and safety.",
    theme: "Without Roots",
    shadow: "Distrust, fear of the future, material anxiety, rigidity as defense",
    recommendation: "Build rituals of stability — regular routine, small goals. Step: Create one fixed daily ritual (morning exercise, evening reading).",
    body: "Joints, knees — rigidity, fear of moving forward"
  },
  "5": {
    type: "odd",
    effect: "tension, aggression",
    description: "An isolated five creates inner nervousness and inability to find direction. The energy of change has nowhere to flow, leading to restlessness and impulsivity.",
    theme: "The Restless Spirit",
    shadow: "Nervousness, inability to commit, excessive strictness or chaos",
    recommendation: "Find healthy change within structure. Step: Do one thing differently today — but consciously, not impulsively.",
    body: "Nervous system, hands — inner restlessness, insomnia"
  },
  "6": {
    type: "even",
    effect: "passivity, withdrawal",
    description: "An isolated six creates disconnection from love and family. The person yearns for harmony but feels distant from it.",
    theme: "The Lonely Heart",
    shadow: "Naivety in love or conversely closedness, perfectionism in relationships",
    recommendation: "Start with yourself — self-love is not selfishness. Step: Do one thing purely for yourself today, without guilt.",
    body: "Heart, chest — feeling of heaviness, longing for closeness"
  },
  "7": {
    type: "odd",
    effect: "tension, aggression",
    description: "An isolated seven creates deep inner loneliness and distrust. The person retreats into intellect and cuts off from emotions and others.",
    theme: "The Lonely Sage",
    shadow: "Cynicism, paranoia, accident-proneness, inner grievances",
    recommendation: "Share your wisdom — isolation is not protection, it is a prison. Step: Tell someone something personal today.",
    body: "Limbs, accidents — a signal of disconnection from the body"
  },
  "8": {
    type: "even",
    effect: "passivity, withdrawal",
    description: "An isolated eight creates disconnection from one's own strength and abundance. The person fears power or renounces it.",
    theme: "The Rejected Strength",
    shadow: "Vindictiveness, greed, or conversely complete rejection of the material",
    recommendation: "Accept your strength as a gift for service. Step: Make a decision today about one thing you have been postponing.",
    body: "Digestive system, liver — blockage of energy flow"
  },
  "9": {
    type: "odd",
    effect: "tension, aggression",
    description: "An isolated nine creates a feeling of superiority or disconnection from the world. Wisdom without connection turns into arrogance or resignation.",
    theme: "The Disconnected Sage",
    shadow: "Dictatorship, superiority, chaos, inability to release control",
    recommendation: "Serve without conditions. Step: Do one act for someone today without expecting gratitude.",
    body: "Immune system, chronic fatigue — exhaustion from holding everything"
  }
};

export function getIsolatedNumber(key: string, lang: Language = 'sk'): IsolatedNumberInfo | undefined {
  const dicts = { sk, en };
  return dicts[lang]?.[key] ?? dicts.sk[key];
}

// Backward compat
const isolatedNumbers = sk;
export default isolatedNumbers;
