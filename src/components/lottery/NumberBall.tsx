import React from 'react';

interface NumberBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBonus?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
}

export const NumberBall: React.FC<NumberBallProps> = ({
  number,
  size = 'md',
  isBonus = false,
  selected = false,
  onClick,
  className = '',
  animate = false,
}) => {
  // 로또 공식 색상 그룹 매핑 (1~10 노랑, 11~20 파랑, 21~30 빨강, 31~40 회색, 41~45 녹색)
  const getBallStyle = (num: number) => {
    if (num <= 10) {
      return {
        bg: 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700',
        border: 'border-amber-200/60',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        text: 'text-stone-950 font-black',
      };
    }
    if (num <= 20) {
      return {
        bg: 'bg-gradient-to-br from-sky-400 via-blue-600 to-blue-800',
        border: 'border-sky-300/60',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        text: 'text-white font-black',
      };
    }
    if (num <= 30) {
      return {
        bg: 'bg-gradient-to-br from-rose-400 via-red-600 to-red-800',
        border: 'border-rose-300/60',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        text: 'text-white font-black',
      };
    }
    if (num <= 40) {
      return {
        bg: 'bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700',
        border: 'border-slate-200/60',
        glow: 'shadow-[0_0_15px_rgba(148,163,184,0.4)]',
        text: 'text-white font-black',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800',
      border: 'border-emerald-300/60',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      text: 'text-white font-black',
    };
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-13 h-13 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const style = getBallStyle(number);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full select-none cursor-pointer transition-all duration-300
        ${sizeClasses[size]}
        ${style.bg}
        ${style.glow}
        ${style.text}
        border ${style.border}
        ${selected ? 'ring-3 ring-amber-300 scale-110 z-10' : 'hover:scale-105 active:scale-95'}
        ${animate ? 'animate-bounce' : ''}
        ${className}
      `}
    >
      {/* 3D 상단 반사광 하이라이트 */}
      <span className="absolute top-[8%] left-[18%] w-[45%] h-[28%] rounded-full bg-white/45 blur-[0.6px] pointer-events-none transform -rotate-25" />

      {/* 볼 번호 */}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {number}
      </span>

      {/* 보너스 볼 인디케이터 */}
      {isBonus && (
        <span className="absolute -top-1 -right-1 text-[9px] bg-amber-400 text-black px-1 rounded-full font-bold shadow-md">
          +B
        </span>
      )}
    </div>
  );
};
