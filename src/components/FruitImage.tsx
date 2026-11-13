import { useState } from 'react';
import { FruitItem } from '../types';

interface FruitImageProps {
  fruit: FruitItem;
  className?: string;
  alt?: string;
}

function FallbackFruitSvg({ fruit }: { fruit: FruitItem }) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-4 ${fruit.surfaceTint}`}
      aria-label={fruit.english}
    >
      <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-sm">
        <circle cx="50" cy="54" r="34" fill={fruit.accentHex} opacity="0.9" />
        <ellipse cx="40" cy="42" rx="10" ry="6" fill="#FFFFFF" opacity="0.28" transform="rotate(-25 40 42)" />
        <path d="M50 20 Q56 8 68 14 Q60 24 50 20 Z" fill="#16A34A" />
        <circle cx="40" cy="54" r="3.5" fill="#1E293B" />
        <circle cx="60" cy="54" r="3.5" fill="#1E293B" />
        <path d="M43 64 Q50 70 57 64" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <span className="mt-1 font-display text-sm font-semibold text-slate-700">{fruit.english}</span>
    </div>
  );
}

export function FruitImage({ fruit, className = 'w-full h-full', alt }: FruitImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`overflow-hidden bg-white ${className}`}>
        <FallbackFruitSvg fruit={fruit} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-white flex items-center justify-center ${className}`}>
      <img
        src={fruit.image}
        alt={alt || `${fruit.english} (${fruit.indonesian})`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
