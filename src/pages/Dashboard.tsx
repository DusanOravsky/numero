import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { VibrationCard } from '../components/VibrationCard';
import { calculateORV, calculateOMV, calculateODV, reduceToSingle } from '../engine/numerologyEngine';
import { orvDescriptions } from '../data/orvDescriptions';

export function Dashboard() {
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useStore();
  const profile = profiles.find(p => p.id === activeProfileId);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  let orv = 0, omv = 0, odv = 0;
  if (profile) {
    orv = calculateORV(profile.birthDay, profile.birthMonth, currentYear, currentMonth, currentDay);
    omv = calculateOMV(orv, currentMonth);
    odv = calculateODV(orv, currentDay, currentMonth);
  }

  const universalDay = reduceToSingle(currentDay + currentMonth + currentYear);

  const affirmations: Record<number, string> = {
    1: 'Dnes začínam s odvahou a jasnosťou.',
    2: 'Dnes som otvorený/á hlbokému prepojeniu.',
    3: 'Dnes tvorím a vyjadrujem svoju pravdu.',
    4: 'Dnes budujem s trpezlivosťou a láskou.',
    5: 'Dnes vítam nové s dôverou.',
    6: 'Dnes milujem bezpodmienečne.',
    7: 'Dnes počúvam svoju vnútornú múdrosť.',
    8: 'Dnes manifestujem svoju víziu.',
    9: 'Dnes púšťam staré a vytváram priestor.',
  };

  if (!profile) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Número
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Váš osobný duchovno-analytický sprievodca. Offline. Súkromný. Profesionálny.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow"
          >
            Začať cestu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">
            Vitajte, {profile.name}
          </h1>
          <p className="text-slate-400 mt-1">
            {today.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Univerzálny deň</p>
          <p className="text-2xl font-serif font-bold text-indigo-400">{universalDay}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VibrationCard
          title="ORV – Ročná vibrácia"
          value={orv}
          subtitle="Osobná ročná vibrácia"
          icon="✦"
          color="indigo"
          delay={0.1}
          formula={profile ? `D(${profile.birthDay}) + M(${profile.birthMonth}) + R(${currentMonth < profile.birthMonth || (currentMonth === profile.birthMonth && currentDay < profile.birthDay) ? currentYear - 1 : currentYear}) → ${orv}` : ''}
          description="ORV ukazuje energiu celého roka od narodenín do narodenín. Určuje hlavné témy a úlohy, na ktoré sa v danom roku zameriavate. Počíta sa z dňa a mesiaca narodenia + aktuálny rok (od posledných narodenín)."
        />
        <VibrationCard
          title="OMV – Mesačná vibrácia"
          value={omv}
          subtitle="Osobná mesačná vibrácia"
          icon="☽"
          color="purple"
          delay={0.2}
          formula={`M(${currentMonth}) + ORV(${orv}) = ${currentMonth + orv} → ${omv}`}
          description="OMV špecifikuje energiu aktuálneho mesiaca vo vašom osobnom roku. Ukazuje, aké úlohy a témy sú pre vás dôležité práve tento mesiac."
        />
        <VibrationCard
          title="ODV – Denná vibrácia"
          value={odv}
          subtitle="Osobná denná vibrácia"
          icon="☀"
          color="gold"
          delay={0.3}
          formula={`D(${currentDay}) + M(${currentMonth}) + ORV(${orv}) = ${currentDay + currentMonth + orv} → ${odv}`}
          description="ODV je charakteristická energia dnešného dňa. Určuje úlohu a tému konkrétneho dňa – čomu by ste mali venovať pozornosť a aké aktivity sú podporované."
        />
      </div>

      {orvDescriptions[orv] && (
        <GlassCard delay={0.35}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl font-serif font-bold text-white">
              {orv}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Váš rok: {orvDescriptions[orv].title}</h3>
              <p className="text-xs text-indigo-300 mb-1">{orvDescriptions[orv].theme}</p>
              <p className="text-sm text-slate-400">{orvDescriptions[orv].advice}</p>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard glow delay={0.4}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">Dnešná afirmácia</h3>
            <p className="text-slate-300 font-serif text-lg italic">
              "{affirmations[odv] || affirmations[1]}"
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { path: '/numerology', label: 'Numerológia', icon: '✦', color: 'from-indigo-500/10 to-violet-500/10' },
          { path: '/astrology', label: 'Astrológia', icon: '☆', color: 'from-cyan-500/10 to-blue-500/10' },
          { path: '/human-design', label: 'Human Design', icon: '◎', color: 'from-purple-500/10 to-fuchsia-500/10' },
          { path: '/chakras', label: 'Čakry', icon: '◈', color: 'from-green-500/10 to-emerald-500/10' },
          { path: '/relationships', label: 'Vzťahy', icon: '♡', color: 'from-rose-500/10 to-pink-500/10' },
          { path: '/kabalah', label: 'Kabala', icon: '⚘', color: 'from-amber-500/10 to-yellow-500/10' },
          { path: '/theta-healing', label: 'Theta Healing', icon: '∞', color: 'from-teal-500/10 to-cyan-500/10' },
          { path: '/settings', label: 'Nastavenia', icon: '⚙', color: 'from-slate-500/10 to-gray-500/10' },
        ].map((item, idx) => (
          <motion.button
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.05 }}
            onClick={() => navigate(item.path)}
            className={`bg-gradient-to-br ${item.color} border border-white/5 rounded-2xl p-4 text-left hover:scale-105 transition-transform`}
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-medium text-white mt-2">{item.label}</p>
          </motion.button>
        ))}
      </div>

      <GlassCard delay={0.7}>
        <h3 className="font-medium text-white mb-3">Energetický prehľad</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Energia dňa</span>
            <div className="flex gap-1">
              {Array.from({ length: odv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
              ))}
              {Array.from({ length: 9 - odv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-slate-700/50" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Energia mesiaca</span>
            <div className="flex gap-1">
              {Array.from({ length: omv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
              ))}
              {Array.from({ length: 9 - omv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-slate-700/50" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Energia roka</span>
            <div className="flex gap-1">
              {Array.from({ length: orv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" />
              ))}
              {Array.from({ length: 9 - orv }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-slate-700/50" />
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
