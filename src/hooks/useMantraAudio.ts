import { useState, useRef, useCallback, useEffect } from 'react';

const MANTRA_FILES: Record<string, string> = {
  LAM: 'lam.mp3',
  VAM: 'vam.mp3',
  RAM: 'ram.mp3',
  YAM: 'yam.mp3',
  HAM: 'ham.mp3',
  OM: 'om.mp3',
  AUM: 'aum.mp3',
};

export function useMantraAudio() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback((mantra: string) => {
    const key = mantra.toUpperCase();

    if (playing === key) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlaying(null);
      return;
    }

    audioRef.current?.pause();

    const file = MANTRA_FILES[key];
    if (!file) return;

    const audio = new Audio(`${import.meta.env.BASE_URL}audio/mantras/${file}`);
    audio.loop = true;
    audio.play().catch(() => {});
    audio.addEventListener('error', () => setPlaying(null));
    audioRef.current = audio;
    setPlaying(key);
  }, [playing]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
  }, []);

  // Zastaviť looping audio pri unmount (napr. navigácia preč zo stránky čakier),
  // inak by mantra hrala ďalej donekonečna bez možnosti zastavenia.
  useEffect(() => () => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  return { playing, toggle, stop };
}
