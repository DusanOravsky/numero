// Mantra a citáty pre denné použitie podľa ODV (1-9).
// Mantra = krátka, opakovateľná veta na vyladenie energie dňa.
// Citát = inšpiratívna myšlienka, ktorá rezonuje s témou daného čísla.

export const MANTRAS_BY_ODV: Record<number, string[]> = {
  1: [
    'Začínam s odvahou a jasným úmyslom.',
    'Som pripravený/á viesť svoj život.',
    'Moja sila iniciácie ma posúva vpred.',
  ],
  2: [
    'Otváram sa hlbokej spolupráci.',
    'Trpezlivosť je moja sila.',
    'Vo vzťahoch nachádzam pravdu.',
  ],
  3: [
    'Vyjadrujem sa s radosťou a ľahkosťou.',
    'Moja kreativita je dar svetu.',
    'Tvorím každý deň znova.',
  ],
  4: [
    'S disciplínou budujem pevné základy.',
    'Práca je moja modlitba.',
    'Krok za krokom sa stávam silnejším/silnejšou.',
  ],
  5: [
    'Vítam zmenu ako brata.',
    'Sloboda žije vo mne.',
    'Dnes objavujem nové dimenzie života.',
  ],
  6: [
    'Milujem bezpodmienečne.',
    'Vytváram harmóniu okolo seba.',
    'Som prijatý/á taký, aký som.',
  ],
  7: [
    'Počúvam svoj vnútorný hlas.',
    'Pravda mi prichádza v tichu.',
    'Som múdrosťou, ktorá sa rozvíja.',
  ],
  8: [
    'Manifestujem svoj potenciál.',
    'Hojnosť je moje právo.',
    'Vediem cez silu a integritu.',
  ],
  9: [
    'Púšťam staré, otváram priestor novému.',
    'Som hlboko spojený/á so všetkým.',
    'Súcit je mojou pravou silou.',
  ],
};

export const QUOTES_BY_ODV: Record<number, { quote: string; author: string }[]> = {
  1: [
    { quote: 'Cesta tisíc míľ začína prvým krokom.', author: 'Lao-c\'' },
    { quote: 'Len ten, kto sa odváži ísť za svoje hranice, zistí, ako ďaleko môže ísť.', author: 'T. S. Eliot' },
    { quote: 'Buď zmenou, ktorú chceš vidieť vo svete.', author: 'Mahátma Gándhí' },
  ],
  2: [
    { quote: 'Nikto z nás nie je tak múdry ako my všetci spolu.', author: 'Ken Blanchard' },
    { quote: 'Trpezlivosť je horká, ale jej plody sú sladké.', author: 'Aristoteles' },
    { quote: 'V rozhovore začni počúvaním.', author: 'arabské príslovie' },
  ],
  3: [
    { quote: 'Kreativita je inteligencia, ktorá sa zabáva.', author: 'Albert Einstein' },
    { quote: 'Tvorba je činnosť duše.', author: 'Carl Jung' },
    { quote: 'Najlepší spôsob ako predpovedať budúcnosť, je tvoriť ju.', author: 'Peter Drucker' },
  ],
  4: [
    { quote: 'Disciplína je most medzi cieľmi a úspechmi.', author: 'Jim Rohn' },
    { quote: 'Štruktúra slúži slobode, nie naopak.', author: 'James Clear' },
    { quote: 'Nikdy neopustím to, čo som začal/a.', author: 'Marc Aurelius' },
  ],
  5: [
    { quote: 'Život začína na konci komfortnej zóny.', author: 'Neale Donald Walsch' },
    { quote: 'Sloboda nie je nedostatok obmedzení, ale schopnosť žiť plne v rámci nich.', author: 'Søren Kierkegaard' },
    { quote: 'Ak nezvládneš zmenu, nezvládneš nič.', author: 'Eckhart Tolle' },
  ],
  6: [
    { quote: 'Domov nie je miesto. Je to pocit.', author: 'Cecelia Ahern' },
    { quote: 'Kde je láska, tam je život.', author: 'Mahátma Gándhí' },
    { quote: 'Milovať znamená byť zraniteľný/á.', author: 'C. S. Lewis' },
  ],
  7: [
    { quote: 'Nepreskúmaný život nestojí za to, aby sa žil.', author: 'Sokrates' },
    { quote: 'V tichu nájdeš všetky odpovede.', author: 'Rumi' },
    { quote: 'Múdrosť začína v rešpekte.', author: 'Søren Kierkegaard' },
  ],
  8: [
    { quote: 'Úspech je vedľajší produkt vytrvalosti.', author: 'Daniel Kahneman' },
    { quote: 'Sila pochádza z vnútra, nie z toho, čo môžeš urobiť.', author: 'Mahátma Gándhí' },
    { quote: 'Hojnosť nie je v tom, čo máš, ale v tom, čo dávaš.', author: 'Wayne Dyer' },
  ],
  9: [
    { quote: 'Koniec je vždy začiatok niečoho nového.', author: 'Lao-c\'' },
    { quote: 'Súcit je univerzálny jazyk.', author: 'Tibet, anonymné' },
    { quote: 'Odpustenie je dar, ktorý dávaš sám/sama sebe.', author: 'Maya Angelou' },
  ],
};

/**
 * Vyber dnešnú mantru / citát na základe ODV a aktuálneho dátumu —
 * varianty rotujú každý deň.
 */
export function getDailyMantra(odv: number, date: Date = new Date()): string {
  const list = MANTRAS_BY_ODV[odv] || MANTRAS_BY_ODV[1];
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  return list[dayOfYear % list.length];
}

export function getDailyQuote(odv: number, date: Date = new Date()): { quote: string; author: string } {
  const list = QUOTES_BY_ODV[odv] || QUOTES_BY_ODV[1];
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  return list[dayOfYear % list.length];
}
