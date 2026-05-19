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
  lines.push(`Meno: ${ctx.name}`);
  if (ctx.gender) lines.push(`Pohlavie: ${ctx.gender === 'male' ? 'muž' : 'žena'}`);
  lines.push(`Dátum narodenia: ${ctx.birth.day}.${ctx.birth.month}.${ctx.birth.year}` +
    (ctx.birth.hour !== undefined ? ` ${ctx.birth.hour}:${String(ctx.birth.minute || 0).padStart(2, '0')}` : ''));
  if (ctx.birth.place) lines.push(`Miesto: ${ctx.birth.place}`);
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

const SYSTEM_PROMPT = `Si skúsený duchovný sprievodca a integrátor 6 ezoterických systémov: numerológie (Charakterová Robin Steinová + Vývojová Lívia Mičková), astrológie, Human Designu, Kabaly a Theta Healingu.

Tvoja úloha:
- Píš v slovenčine, oslovuj VYKANÍM (ty/vy), tón priateľský, profesionálny a s rešpektom.
- Spájaj systémy navzájom — ak má klient ŽČ 7 a HD typ Projektor, oboje hovorí o pozorovateľskej múdrosti. Ukáž tieto rezonancie.
- Pri diskrepancii (napr. silné ego v numerológii + otvorené G centrum v HD) ju pomenuj — napätie je informácia.
- Cituj zdroje keď je to relevantné: Robin Steinová pre Charakterovú, Lívia Mičková pre Vývojovú.
- Vyhýbaj sa povrchným frázam ("ste jedinečná duša"). Buď konkrétny.
- Nehovoríš nič mimo poskytnutých dát. Pri otázkach o budúcnosti — kvalitatívne, nie predpoveď.
- Pri odpovedi použi markdown ## ### nadpisy a odseky pre čitateľnosť.

Pri prvej odpovedi v rozhovore (kde je v kontexte plný profil) urob štruktúrovaný integratívny výklad:
1. Hlavná životná téma (1-2 odseky)
2. Silné stránky / dary
3. Tiene a výzvy
4. Aktuálne obdobie (ORV)
5. Praktické odporúčanie pre najbližší týždeň-mesiac

Pri následných otázkach odpovedaj cielene, prepojuj späť na profil.`;

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
      system: SYSTEM_PROMPT,
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

  const fullSystem = `${SYSTEM_PROMPT}

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

      const lines = buffer.split('\n');
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
          }
        } catch {
          // ignore parse errors on partial chunks
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
