// Sostituisce IndexDisplay3D direttamente nella homepage
// Incolla questo nel blocco loading/index di page.jsx

// TROVA questo blocco in page.jsx:
// ) : index ? (
//     <div className="flex flex-col items-center">
//       <IndexDisplay3D index={index.index} breakdown={index.breakdown} />
//       <AutoTweetButton indexData={index} />
//     </div>

// SOSTITUISCI CON:
// ) : index ? (
//     <IndexInlineDisplay index={index} />

// ---- COMPONENTE ----
// Aggiungi questo come componente nella stessa pagina
// oppure crea src/components/IndexInlineDisplay.jsx

'use client';
import { motion } from 'framer-motion';
import AutoTweetButton from '@/components/AutoTweetButton';

const LEVEL_CONFIG = {
  'EXTREME FEAR': { color: '#22c55e', bg: 'from-green-900/40 to-green-950/60', border: 'border-green-500/30', emoji: '😱', label: 'EXTREME FEAR' },
  'FEAR':         { color: '#3b82f6', bg: 'from-blue-900/40 to-blue-950/60',  border: 'border-blue-500/30',  emoji: '😟', label: 'FEAR' },
  'NEUTRAL':      { color: '#eab308', bg: 'from-yellow-900/40 to-yellow-950/60', border: 'border-yellow-500/30', emoji: '😐', label: 'NEUTRAL' },
  'GREED':        { color: '#f97316', bg: 'from-orange-900/40 to-orange-950/60', border: 'border-orange-500/30', emoji: '🤑', label: 'GREED' },
  'EXTREME GREED':{ color: '#ef4444', bg: 'from-red-900/40 to-red-950/60',   border: 'border-red-500/30',   emoji: '🔥', label: 'EXTREME GREED' },
};

export default function IndexInlineDisplay({ index: indexData }) {
  if (!indexData) return null;

  const val = indexData.index || 0;
  const level = indexData.level || 'NEUTRAL';
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG['NEUTRAL'];
  const breakdown = indexData.breakdown || {};

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (val / 100) * circumference;

  const BREAKDOWN_LABELS = [
    { key: 'sentiment',  label: 'Fear & Greed', icon: '😱' },
    { key: 'volatility', label: 'Volatility',   icon: '📉' },
    { key: 'fomo',       label: 'FOMO',         icon: '🚀' },
    { key: 'meme',       label: 'Meme Intensity', icon: '🐸' },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto mb-4">
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full p-8 rounded-3xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} shadow-2xl mb-6`}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              {/* Background ring */}
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1e1b4b" strokeWidth="12" />
              {/* Progress ring */}
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke={cfg.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black" style={{ color: cfg.color }}>{val}</span>
              <span className="text-lg">{cfg.emoji}</span>
            </div>
          </div>

          {/* Level + breakdown */}
          <div className="text-center md:text-left flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Pepeline Index</p>
            <h2 className="text-4xl font-black mb-1" style={{ color: cfg.color }}>
              {cfg.label}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              The market is showing signs of <span style={{ color: cfg.color }}>{cfg.label.toLowerCase()}</span>
            </p>

            {/* Breakdown bars */}
            <div className="space-y-2">
              {BREAKDOWN_LABELS.map(({ key, label, icon }) => {
                const bval = typeof breakdown[key] === 'number' ? breakdown[key] : 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-sm w-4">{icon}</span>
                    <span className="text-xs text-gray-400 w-24">{label}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(bval, 100)}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: cfg.color }}>
                      {typeof bval === 'number' ? bval.toFixed(0) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scale bar */}
      <div className="w-full max-w-md flex items-center gap-2 mb-6 px-4">
        <span className="text-xs text-green-400">Extreme Fear</span>
        <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-500 via-blue-500 via-yellow-500 via-orange-500 to-red-500" />
        <span className="text-xs text-red-400">Extreme Greed</span>
      </div>

      {/* Tweet button */}
      {/* <AutoTweetButton indexData={indexData} /> */}
    </div>
  );
}
