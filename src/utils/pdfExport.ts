import type { jsPDF as JsPdfType } from 'jspdf';

/**
 * Lazy-load jsPDF + Roboto font v jednom kroku. Vracia hotový jsPDF doc s nastavenými
 * fontami (normal/bold) — komponenty nemusia replikovať bootstrap.
 */
export async function loadPdf(): Promise<JsPdfType> {
  const [{ jsPDF }, fontModule] = await Promise.all([
    import('jspdf'),
    import('../assets/fonts/robotoFont'),
  ]);
  const doc = new jsPDF();
  doc.addFileToVFS('Roboto-Regular.ttf', fontModule.ROBOTO_REGULAR);
  doc.addFileToVFS('Roboto-Bold.ttf', fontModule.ROBOTO_BOLD);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  return doc;
}

export const PDF_SECTION_COLORS: Record<string, [number, number, number]> = {
  indigo: [79, 70, 229],
  cyan: [8, 145, 178],
  purple: [124, 58, 237],
  green: [22, 163, 74],
  amber: [180, 83, 9],
  rose: [225, 29, 72],
  slate: [100, 116, 139],
  teal: [13, 148, 136],
};
