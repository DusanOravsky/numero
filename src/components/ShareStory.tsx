import type { Language } from '../store/useStore';

const W = 1080;
const H = 1920;
const APP_URL = 'dusanoravsky.github.io/numero';

interface DailyStoryParams {
  odvNumber: number;
  affirmation: string;
  crystal: string;
  isDark: boolean;
  language: Language;
}

interface ProfileCardParams {
  name: string;
  lifePathNumber: number;
  hdType: string;
  hdProfile: string;
  element: string;
  sunSign: string;
  enneagramType: number;
  isDark: boolean;
  language: Language;
}

function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function drawBackground(ctx: CanvasRenderingContext2D, isDark: boolean) {
  if (isDark) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0f0b2e');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#fefce8');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, W, H);
}

function drawDivider(ctx: CanvasRenderingContext2D, y: number, isDark: boolean) {
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, y);
  ctx.lineTo(W - 140, y);
  ctx.stroke();
}

function drawFooter(ctx: CanvasRenderingContext2D, isDark: boolean, text: string) {
  const fg = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  ctx.fillStyle = fg;
  ctx.font = '32px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, H - 120);
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillText(APP_URL, W / 2, H - 70);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export async function generateDailyStory(params: DailyStoryParams): Promise<Blob> {
  const { odvNumber, affirmation, crystal, isDark, language } = params;
  const [canvas, ctx] = createCanvas();
  const fg = isDark ? '#ffffff' : '#1e1b4b';

  drawBackground(ctx, isDark);

  // Header
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,27,75,0.6)';
  ctx.font = '40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'sk' ? '✦ Tvoja energia dnes' : '✦ Your energy today',
    W / 2, 200
  );

  // Large ODV number
  ctx.fillStyle = fg;
  ctx.font = 'bold 220px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(odvNumber), W / 2, 580);

  // ODV label
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(30,27,75,0.5)';
  ctx.font = '36px system-ui, sans-serif';
  ctx.fillText('ODV', W / 2, 650);

  // Affirmation
  ctx.fillStyle = fg;
  ctx.font = 'italic 42px system-ui, sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, `"${affirmation}"`, W / 2, 800, W - 200, 58);

  // Crystal
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,27,75,0.7)';
  ctx.font = '36px system-ui, sans-serif';
  ctx.fillText(
    language === 'sk' ? `💎 Kryštál dňa: ${crystal}` : `💎 Crystal of the day: ${crystal}`,
    W / 2, 1050
  );

  drawDivider(ctx, 1200, isDark);
  drawFooter(ctx, isDark, language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being');

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function generateProfileCard(params: ProfileCardParams): Promise<Blob> {
  const { name, lifePathNumber, hdType, hdProfile, element, sunSign, enneagramType, isDark, language } = params;
  const [canvas, ctx] = createCanvas();
  const fg = isDark ? '#ffffff' : '#1e1b4b';
  const fgSub = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,27,75,0.7)';

  drawBackground(ctx, isDark);

  // Header
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,27,75,0.6)';
  ctx.font = '40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'sk' ? '✦ Môj profil' : '✦ My profile',
    W / 2, 200
  );

  // Name
  ctx.fillStyle = fg;
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.fillText(name, W / 2, 360);

  // Profile items
  const items: string[] = [];
  items.push(language === 'sk' ? `✨ Životné číslo: ${lifePathNumber}` : `✨ Life Path: ${lifePathNumber}`);
  items.push(language === 'sk' ? `◎ HD: ${hdType} ${hdProfile}` : `◎ HD: ${hdType} ${hdProfile}`);
  items.push(language === 'sk' ? `❖ Element: ${element}` : `❖ Element: ${element}`);
  items.push(language === 'sk' ? `☆ Slnko: ${sunSign}` : `☆ Sun: ${sunSign}`);
  items.push(language === 'sk' ? `❁ Enneagram: ${enneagramType}` : `❁ Enneagram: ${enneagramType}`);

  ctx.font = '48px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = fgSub;
  let y = 520;
  for (const item of items) {
    ctx.fillText(item, W / 2, y);
    y += 100;
  }

  drawDivider(ctx, 1100, isDark);

  // Footer with CTA
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,27,75,0.6)';
  ctx.font = '34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    language === 'sk' ? 'Zisti svoj profil:' : 'Discover your profile:',
    W / 2, 1250
  );
  drawFooter(ctx, isDark, language === 'sk' ? 'Integrálna mapa bytia' : 'Integral Map of Being');

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function shareOrDownload(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
