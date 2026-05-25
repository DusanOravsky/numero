export interface BiorhythmResult {
  physical: number;
  emotional: number;
  intellectual: number;
  physicalPhase: 'high' | 'low' | 'critical';
  emotionalPhase: 'high' | 'low' | 'critical';
  intellectualPhase: 'high' | 'low' | 'critical';
}

function daysSinceBirth(birthDay: number, birthMonth: number, birthYear: number, date: Date = new Date()): number {
  const birthUTC = Date.UTC(birthYear, birthMonth - 1, birthDay);
  const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((dateUTC - birthUTC) / 86400000);
}

function getPhase(value: number): 'high' | 'low' | 'critical' {
  if (Math.abs(value) < 10) return 'critical';
  return value > 0 ? 'high' : 'low';
}

export function calculateBiorhythm(
  birthDay: number, birthMonth: number, birthYear: number, date: Date = new Date()
): BiorhythmResult {
  const days = daysSinceBirth(birthDay, birthMonth, birthYear, date);
  const physical = Math.round(Math.sin((2 * Math.PI * days) / 23) * 100);
  const emotional = Math.round(Math.sin((2 * Math.PI * days) / 28) * 100);
  const intellectual = Math.round(Math.sin((2 * Math.PI * days) / 33) * 100);

  return {
    physical,
    emotional,
    intellectual,
    physicalPhase: getPhase(physical),
    emotionalPhase: getPhase(emotional),
    intellectualPhase: getPhase(intellectual),
  };
}

export function getBiorhythmForDays(
  birthDay: number, birthMonth: number, birthYear: number, days: number = 30
): { date: Date; physical: number; emotional: number; intellectual: number }[] {
  const today = new Date();
  const result = [];
  for (let i = -7; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const br = calculateBiorhythm(birthDay, birthMonth, birthYear, d);
    result.push({ date: d, physical: br.physical, emotional: br.emotional, intellectual: br.intellectual });
  }
  return result;
}
