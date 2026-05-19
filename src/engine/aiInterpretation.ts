// AI interpretácia profilu cez Anthropic Claude API.
// Kľúč sa ukladá len lokálne v localStorage (žiaden backend).
// Volanie ide priamo z prehliadača na api.anthropic.com.
//
// Použité modely (v poradí preferencie):
// - claude-haiku-4-5-20251001 (rýchly, lacný — default)
// - claude-sonnet-4-6 (kvalitnejší)
// - claude-opus-4-7 (najsilnejší)
//
// Bezpečnosť: API kľúč sa nikam neposiela okrem Anthropic. Ak používateľ
// vyčistí storage / odinštaluje appku, kľúč zmizne.
//
// Anthropic API podporuje CORS pre browser volania od marca 2024 cez
// header `anthropic-dangerous-direct-browser-access: true`. Pre seriózny
// produkčný setup s mnohými používateľmi treba backend proxy.

import type { NumerologyResult } from './numerologyEngine';
import type { AstrologyResult } from './astrologyEngine';
import type { HumanDesignResult } from './humanDesignEngine';
import type { KabalahResult } from './kabalahEngine';
import type { ThetaHealingResult } from './thetaHealingEngine';
import type { DevelopmentalNumerologyResult } from './developmentalNumerologyEngine';

const ANTHROPIC_API_KEY_STORAGE = 'anthropic-api-key';
const ANTHROPIC_MODEL_STORAGE = 'anthropic-model';
const ANTHROPIC_LENS_STORAGE = 'anthropic-lens';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_VERSION = '2023-06-01';

export type ClaudeModel =
  | 'claude-haiku-4-5-20251001'
  | 'claude-sonnet-4-6'
  | 'claude-opus-4-7';

export const CLAUDE_MODELS: Array<{ id: ClaudeModel; label: string; cost: string }> = [
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rýchly, lacný)', cost: '~$0.003 / výklad' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (kvalitný — odporúčaný)', cost: '~$0.04 / výklad' },
  { id: 'claude-opus-4-7', label: 'Claude Opus 4.7 (najlepší, drahší)', cost: '~$0.20 / výklad' },
];

export function getApiKey(): string {
  return localStorage.getItem(ANTHROPIC_API_KEY_STORAGE) || '';
}

export function setApiKey(key: string) {
  if (key) localStorage.setItem(ANTHROPIC_API_KEY_STORAGE, key);
  else localStorage.removeItem(ANTHROPIC_API_KEY_STORAGE);
}

export function getModel(): ClaudeModel {
  return (localStorage.getItem(ANTHROPIC_MODEL_STORAGE) as ClaudeModel) || 'claude-sonnet-4-6';
}

export function setModel(m: ClaudeModel) {
  localStorage.setItem(ANTHROPIC_MODEL_STORAGE, m);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

// =====================================================================
// Interpretation lens — štýl výkladu (rozšírenie SYSTEM_PROMPT)
// =====================================================================

export type InterpretationLens =
  | 'default'         // integratívny ezoterický (Steinová + Mičková + HD + astro)
  | 'logical-levels'  // Diltsove logické úrovne (NLP)
  | 'etikoterapia'    // Vogeltanz/Bezděk — etická príčina + cnosť
  | 'coaching';       // GROW koučing model — otázky a kroky

export const INTERPRETATION_LENSES: Array<{ id: InterpretationLens; label: string; description: string }> = [
  {
    id: 'default',
    label: 'Integratívny ezoterický',
    description: 'Spája všetky systémy (numerológia, astrológia, HD, kabala) do duchovného výkladu.',
  },
  {
    id: 'logical-levels',
    label: 'Logické úrovne (NLP — Dilts)',
    description: 'Štruktúruje výklad cez 6 vrstiev: prostredie → správanie → schopnosti → hodnoty → identita → poslanie.',
  },
  {
    id: 'etikoterapia',
    label: 'Etikoterapia (Vogeltanz, Bezděk)',
    description: 'Mapuje témy na etické príčiny (cnosti / neresti) a praktickú prácu so srdcom a svedomím.',
  },
  {
    id: 'coaching',
    label: 'Koučing (GROW model)',
    description: 'Vedie cez otázky: Goal → Reality → Options → Will. Menej výkladu, viac práce.',
  },
];

export function getLens(): InterpretationLens {
  const v = localStorage.getItem(ANTHROPIC_LENS_STORAGE) as InterpretationLens | null;
  return v && INTERPRETATION_LENSES.some(l => l.id === v) ? v : 'default';
}

export function setLens(l: InterpretationLens) {
  localStorage.setItem(ANTHROPIC_LENS_STORAGE, l);
}

export interface ProfileContext {
  name: string;
  gender?: 'male' | 'female';
  birth: { day: number; month: number; year: number; hour?: number; minute?: number; place?: string };
  numerology: NumerologyResult;
  developmental?: DevelopmentalNumerologyResult;
  astrology?: AstrologyResult;
  humanDesign?: HumanDesignResult;
  kabalah?: KabalahResult;
  theta?: ThetaHealingResult;
}

/**
 * Zostaví štruktúrovaný textový prompt z profile dát.
 * Podáva LLM "raw" dáta (čísla, znamenia, brány) bez interpretácie —
 * tú má vyrobiť LLM.
 */
export function summarizeProfile(ctx: ProfileContext): string {
  const lines: string[] = [];
  lines.push(`Meno: ${sanitizeForPrompt(ctx.name)}`);
  if (ctx.gender) lines.push(`Pohlavie: ${ctx.gender === 'male' ? 'muž' : 'žena'}`);
  lines.push(`Dátum narodenia: ${ctx.birth.day}.${ctx.birth.month}.${ctx.birth.year}` +
    (ctx.birth.hour !== undefined ? ` ${ctx.birth.hour}:${String(ctx.birth.minute || 0).padStart(2, '0')}` : ''));
  if (ctx.birth.place) lines.push(`Miesto: ${sanitizeForPrompt(ctx.birth.place, 100)}`);
  lines.push('');

  // Numerológia
  lines.push('=== NUMEROLÓGIA (Charakterová mriežka, R. Steinová) ===');
  lines.push(`Životné číslo: ${ctx.numerology.lifePathNumber} z ${ctx.numerology.lifePathFrom}${ctx.numerology.isMasterNumber ? ' (Master Number)' : ''}`);
  lines.push(`Plné roviny: ${ctx.numerology.fullPlanes.join(', ') || 'žiadne'}`);
  lines.push(`Prázdne roviny: ${ctx.numerology.emptyPlanes.join(', ') || 'žiadne'}`);
  if (ctx.numerology.isolatedNumbers.length > 0)
    lines.push(`Izolované čísla: ${ctx.numerology.isolatedNumbers.join(', ')}`);
  lines.push(`ORV (osobná ročná vibrácia tento rok): ${ctx.numerology.orv}`);
  lines.push(`OMV (mesačná): ${ctx.numerology.omv}, ODV (denná): ${ctx.numerology.odv}`);
  lines.push(`VDD (vek duchovnej dospelosti): ${ctx.numerology.vdd} rokov`);
  lines.push(`ΣT (suma tarotu): ${ctx.numerology.sigmaT} → ${ctx.numerology.age === 'aquarius' ? 'Vek Vodnára' : 'Vek Rýb'}`);
  lines.push(`Top 3 jazyky lásky: ${ctx.numerology.loveLanguages.slice(0, 3).map(l => `${l.language} (${l.score})`).join(', ')}`);
  if (ctx.numerology.karmicDebts && ctx.numerology.karmicDebts.length > 0) {
    lines.push(`Karmické dlhy: ${ctx.numerology.karmicDebts.map(d => `${d.number} (${d.theme})`).join('; ')}`);
  }
  lines.push(`Maturity number: ${ctx.numerology.maturityNumber}, Birthday: ${ctx.numerology.birthdayNumber}`);
  lines.push('');

  // Vývojová
  if (ctx.developmental) {
    lines.push('=== VÝVOJOVÁ MRIEŽKA (Lívia Mičková) ===');
    lines.push(`D+M = ${ctx.developmental.dayMonthSum}, R = ${ctx.developmental.yearSum}`);
    lines.push(`Karmické cykly: K1=${ctx.developmental.circled[0].value} (psych. stabilita), K2=${ctx.developmental.circled[1].value} (mat. stabilita), K3=${ctx.developmental.circled[2].value} (poslanie ★), K4=${ctx.developmental.circled[3].value} (det. sny)`);
    if (ctx.developmental.oneCount > 0)
      lines.push(`Polarita ega: ${ctx.developmental.egoPolarity === 'masculine' ? 'mužské' : ctx.developmental.egoPolarity === 'feminine' ? 'ženské' : 'žiadne'} (${ctx.developmental.oneCount}× číslo 1)`);
    lines.push('');
  }

  // Astrológia
  if (ctx.astrology) {
    lines.push('=== ASTROLÓGIA ===');
    const sun = ctx.astrology.planets.find(p => p.name === 'Slnko');
    const moon = ctx.astrology.planets.find(p => p.name === 'Mesiac');
    if (sun) lines.push(`Slnko: ${sun.sign.name} ${sun.degree.toFixed(0)}° (${sun.sign.element})`);
    if (moon) lines.push(`Mesiac: ${moon.sign.name} ${moon.degree.toFixed(0)}° (${moon.sign.element})`);
    lines.push(`Ascendent: ${ctx.astrology.ascendant.name}`);
    lines.push(`Dominantný živel: ${ctx.astrology.dominantElement}, kvalita: ${ctx.astrology.dominantQuality}, planéta: ${ctx.astrology.dominantPlanet}`);
    lines.push(`Mesačná fáza pri narodení: ${ctx.astrology.moonPhase}`);
    lines.push(`Severný uzol: ${ctx.astrology.northNode.name} (kam smeruje duša)`);
    lines.push(`Južný uzol: ${ctx.astrology.southNode.name} (komfortná zóna z minulých životov)`);
    lines.push('');
  }

  // Human Design
  if (ctx.humanDesign) {
    lines.push('=== HUMAN DESIGN ===');
    lines.push(`Typ: ${ctx.humanDesign.type}`);
    lines.push(`Stratégia: ${ctx.humanDesign.strategy}`);
    lines.push(`Autorita: ${ctx.humanDesign.authority}`);
    lines.push(`Profil: ${ctx.humanDesign.profile.line1}/${ctx.humanDesign.profile.line2} (${ctx.humanDesign.profile.name})`);
    lines.push(`Definícia: ${ctx.humanDesign.definition}`);
    lines.push(`Definované centrá: ${ctx.humanDesign.definedCenters.join(', ')}`);
    lines.push(`Otvorené centrá: ${ctx.humanDesign.openCenters.join(', ')}`);
    lines.push(`Inkarnačný kríž: ${ctx.humanDesign.incarnationCross}`);
    lines.push('');
  }

  // Kabala
  if (ctx.kabalah) {
    lines.push('=== KABALA ===');
    lines.push(`Primárna sefira: ${ctx.kabalah.primarySefira.name} (${ctx.kabalah.primarySefira.meaning}), pilier ${ctx.kabalah.primarySefira.pillar}`);
    lines.push(`Sekundárna: ${ctx.kabalah.secondarySefira.name} (${ctx.kabalah.secondarySefira.meaning})`);
    lines.push('');
  }

  // Theta
  if (ctx.theta && ctx.theta.primaryBeliefs.length > 0) {
    lines.push('=== THETA HEALING - limitujúce presvedčenia ===');
    ctx.theta.primaryBeliefs.slice(0, 3).forEach(b => {
      lines.push(`- "${b.belief}" (úroveň: ${b.level}, emócia: ${b.emotion})`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

const SYSTEM_PROMPT_BASE = `Si skúsený duchovný sprievodca a integrátor 6 ezoterických systémov: numerológie (Charakterová Robin Steinová + Vývojová Lívia Mičková), astrológie, Human Designu, Kabaly a Theta Healingu.

Spoločné pravidlá:
- Píš v slovenčine, oslovuj VYKANÍM (ty/vy), tón priateľský, profesionálny a s rešpektom.
- Spájaj systémy navzájom — ak má klient ŽČ 7 a HD typ Projektor, oboje hovorí o pozorovateľskej múdrosti. Ukáž tieto rezonancie.
- Pri diskrepancii (napr. silné ego v numerológii + otvorené G centrum v HD) ju pomenuj — napätie je informácia.
- Cituj zdroje keď je to relevantné: Robin Steinová pre Charakterovú, Lívia Mičková pre Vývojovú.
- Vyhýbaj sa povrchným frázam ("ste jedinečná duša"). Buď konkrétny.
- Nehovoríš nič mimo poskytnutých dát. Pri otázkach o budúcnosti — kvalitatívne, nie predpoveď.
- Pri odpovedi použi markdown ## ### nadpisy a odseky pre čitateľnosť.`;

const LENS_PROMPTS: Record<InterpretationLens, string> = {
  default: `Pri prvej odpovedi v rozhovore (kde je v kontexte plný profil) urob štruktúrovaný integratívny výklad:
1. Hlavná životná téma (1-2 odseky)
2. Silné stránky / dary
3. Tiene a výzvy
4. Aktuálne obdobie (ORV)
5. Praktické odporúčanie pre najbližší týždeň-mesiac

Pri následných otázkach odpovedaj cielene, prepojuj späť na profil.`,

  'logical-levels': `Použi rámec **Logických úrovní** (Robert Dilts, vychádza z Batesona) — štruktúruj prvý výklad cez 6 vrstiev zhora nadol:

1. **Poslanie / duchovno** (k čomu väčšiemu klient patrí — z ŽČ, K3, kabala, sefíry)
2. **Identita** (kto som — z HD typu, Slnka, ŽČ archetypu)
3. **Hodnoty a presvedčenia** (čo je dôležité a čo verím — z plných/prázdnych rovín, Theta beliefs)
4. **Schopnosti** (čo viem — dary z mriežky, definované HD centrá, planétne sily)
5. **Správanie** (čo robím — ORV/OMV, HD stratégia, autorita)
6. **Prostredie** (kde a s kým — Mesiac, sakrálna čakra, jazyky lásky)

**Princíp:** zmena na vyššej úrovni mení všetky nižšie, ale obrátene to neplatí. Pri probléme identifikuj na ktorej úrovni je. Pri následných otázkach pomôž klientovi rozpoznať na ktorej úrovni je jeho otázka — a navrhni prácu na adekvátnej úrovni.`,

  etikoterapia: `Použi rámec **etikoterapie** (Vladimír Vogeltanz, Ctibor Bezděk) — slovensko-českej tradície ktorá mapuje životné témy a fyzické symptómy na **etické príčiny**: nezvládnuté emócie, neresti, popreté cnosti.

Pri prvom výklade postupuj:
1. **Životná téma cez etiku** — aký vnútorný konflikt cnosti vs neresti je v profile najsilnejší (z ŽČ, prázdnych rovín, izolovaných čísel, blokovaných čakier).
2. **Etické darčeky** (cnosti ktoré klient prirodzene nesie z plných rovín a darov)
3. **Etické úlohy** (cnosti ktoré sa učí — z prázdnych rovín, karmických dlhov, izolovaných čísel)
4. **Praktická cesta** — konkrétne reflexné otázky a denné cvičenia (nie všeobecné rady).

**Etikoterapeutický slovník (používaj):** cnosti — pokora, dôvera, pravdivosť, odpustenie, čistota srdca, statočnosť, vernosť, štedrosť, miernosť. Neresti — pýcha, závisť, hnev, lakomstvo, smilstvo (ako popretie radosti), obžerstvo (kompenzácia), lenivosť (ako útek pred životom).

**KRITICKÉ:** etikoterapia nie je moralizmus. Cnosť nie je o "byť dobrý"; je o vnútornej slobode. Nikdy nehovor klientovi že je "zlý". Pomáhaš mu rozpoznať vzorec, nie odsúdiť.

Pri následných otázkach sa pýtaj na svedomie, vzťahy, neodpustenie — to sú etikoterapeutické vstupy.`,

  coaching: `Použi rámec **GROW koučingu** (John Whitmore) — štruktúruj rozhovor cez 4 fázy:

1. **Goal (cieľ)** — čo klient skutočne chce. Pomôž mu sformulovať konkrétny, merateľný cieľ vychádzajúci z jeho ORV/OMV/K3.
2. **Reality (realita)** — kde je teraz. Použi profil ako mapu: čo má (dary, definované HD centrá), čo ho brzdí (prázdne roviny, izolované čísla, blokované čakry).
3. **Options (možnosti)** — aké cesty sú dostupné. Nedávaj jednu radu, ponúkni 3-5 možností opretých o profil.
4. **Will (vôľa / kroky)** — čo konkrétne urobí v najbližšom týždni. SMART akčné kroky.

**Princíp:** kouč nedáva odpovede, kladie otázky ktoré klient sám odpovedá. Takže pri prvom výklade NEROBÍŠ jednorázový integrálny popis profilu, ale **otváraš rozhovor** otázkou: "Čo by ste chceli aby z dnešnej práce vzniklo?" — a dáš 2-3 hypotézy zo svojho čítania profilu ako možné východiská.

Pri následných otázkach sa drž GROW: kde je klient v procese? Aká otázka ho posunie ďalej? Vyhýbaj sa "mali by ste" — používaj "čo ak by..."`,
};

function buildSystemPrompt(): string {
  const lens = getLens();
  return `${SYSTEM_PROMPT_BASE}\n\n${LENS_PROMPTS[lens]}`;
}

// =====================================================================
// Single-shot interpretation (pre jednorázový integrálny výklad)
// =====================================================================

export interface AICallResult {
  text: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Pošle dáta na Claude API a vráti naratívny výklad.
 * Throws Error ak chýba kľúč alebo API zlyhá.
 */
export async function generateAIInterpretation(ctx: ProfileContext): Promise<AICallResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Anthropic API kľúč nie je nastavený. Pridaj ho v Nastaveniach.');

  const model = getModel();
  const summary = summarizeProfile(ctx);

  const userPrompt = `Tu sú dáta z môjho profilu. Vypracuj integratívny duchovný výklad.

${summary}

Pripomienka:
- Spájaj systémy navzájom.
- Buď konkrétny.
- Štruktúra: nadpisy + odseky.
- Dĺžka 400-700 slov.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_API_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: buildSystemPrompt(),
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Anthropic API chyba (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error?.message) errMsg += `: ${errJson.error.message}`;
    } catch {
      errMsg += `: ${errText.slice(0, 200)}`;
    }
    throw new Error(errMsg);
  }

  const data = await response.json();
  const text = (data.content?.[0]?.text as string) || '';

  return {
    text,
    model: data.model || model,
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
  };
}

// =====================================================================
// Streaming chat (pre multi-turn rozhovor)
// =====================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamChunk {
  type: 'text' | 'done' | 'error';
  delta?: string;
  inputTokens?: number;
  outputTokens?: number;
  error?: string;
}

/**
 * Pošle správu do Claude API so streamingom.
 * Volajúci dostane delty cez `onChunk` callback.
 *
 * Volajúci si drží históriu sám v `messages`.
 * `systemContext` je summarizeProfile(ctx) — vkladá sa do system promptu
 * len pri PRVOM volaní v konverzácii (ďalšie volania to už nepotrebujú,
 * Claude má históriu v messages).
 */
export async function streamChat(
  messages: ChatMessage[],
  systemContext: string,
  onChunk: (chunk: StreamChunk) => void,
  abortSignal?: AbortSignal
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Anthropic API kľúč nie je nastavený.');
  const model = getModel();

  const fullSystem = `${buildSystemPrompt()}

# Profil klienta (kontext rozhovoru)

${systemContext}`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    signal: abortSignal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_API_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      stream: true,
      system: fullSystem,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Anthropic API chyba (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error?.message) errMsg += `: ${errJson.error.message}`;
    } catch {
      errMsg += `: ${errText.slice(0, 200)}`;
    }
    onChunk({ type: 'error', error: errMsg });
    return;
  }

  if (!response.body) {
    onChunk({ type: 'error', error: 'API nevrátilo stream.' });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Splittujeme na riadky aj pri \r\n (niektoré CDN/proxy posielajú CRLF).
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            onChunk({ type: 'text', delta: event.delta.text });
          } else if (event.type === 'message_start' && event.message?.usage) {
            inputTokens = event.message.usage.input_tokens || 0;
          } else if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens || 0;
          } else if (event.type === 'error') {
            // Anthropic 'error' frame (rate_limit_error, overloaded_error...)
            const msg = event.error?.message || event.error?.type || 'Anthropic API error';
            onChunk({ type: 'error', error: msg });
            return;
          }
        } catch {
          // ignore parse errors on partial chunks (boundary-split JSON)
        }
      }
    }
    onChunk({ type: 'done', inputTokens, outputTokens });
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      onChunk({ type: 'done', inputTokens, outputTokens });
    } else {
      onChunk({ type: 'error', error: (e as Error).message });
    }
  }
}

/**
 * Sanitize textových polí pred ich vložením do system promptu.
 * Bráni prompt-injection cez maliciózne mená klientov / miesta narodenia.
 */
function sanitizeForPrompt(text: string, maxLen: number = 80): string {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')           // odstrániť whitespace control chars
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, '')      // sanitizácia control chars z user input
    .replace(/={3,}|---{3,}|#{2,}/g, '')   // sentinel patterns (===, ---, ##)
    .slice(0, maxLen)
    .trim();
}

/**
 * Skús API kľúč krátkou žiadosťou na zistenie či funguje.
 */
export async function testApiKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return { ok: false, message: 'Kľúč musí začínať na "sk-ant-".' };
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_API_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }],
      }),
    });
    if (response.ok) return { ok: true, message: 'Kľúč funguje.' };
    if (response.status === 401) return { ok: false, message: 'Neplatný kľúč.' };
    const errText = await response.text();
    return { ok: false, message: `Chyba API (${response.status}): ${errText.slice(0, 150)}` };
  } catch (e) {
    return { ok: false, message: `Sieťová chyba: ${(e as Error).message}` };
  }
}
