import React, { useState } from 'react';
import { Flame, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { calculateColdHotMatrix } from '../../algorithms/htsEngine';

import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface ColdHotMatrixProps {
  onSelectNumber?: (num: number) => void;
}

export const ColdHotMatrix: React.FC<ColdHotMatrixProps> = ({ onSelectNumber }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'HOT' | 'COLD'>('ALL');
  const items = calculateColdHotMatrix();

  const filteredItems = items.filter((item) => {
    if (filterType === 'HOT') return item.status === 'HOT';
    if (filterType === 'COLD') return item.status === 'COLD';
    return true;
  });

  const hotCount = items.filter((i) => i.status === 'HOT').length;
  const coldCount = items.filter((i) => i.status === 'COLD').length;

  return (
    <div className="w-full bg-stone-950 border border-amber-500/25 rounded-3xl p-5 shadow-2xl">
      {/* 헤더 & 필터 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-wider flex items-center gap-1.5">
              <span>1~45 냉열수 (冷热数) 호가 매트릭스</span>
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold">
              홍·람 (红·蓝) 시세판
            </span>
          </div>
          <p className="text-[11px] text-stone-400 font-mono mt-0.5">
            과열 핫넘버는 <span className="text-red-400 font-bold">빨강(红)</span>, 침체 콜드넘버는 <span className="text-blue-400 font-bold">파랑(蓝)</span>으로 실시간 호가 분류
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setFilterType('ALL');
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            전체 (45)
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setFilterType('HOT');
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterType === 'HOT' ? 'bg-red-500 text-white font-black' : 'text-red-400 hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>과열 홍수 (红 {hotCount})</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setFilterType('COLD');
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterType === 'COLD' ? 'bg-blue-600 text-white font-black' : 'text-blue-400 hover:bg-stone-800'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>침체 람수 (蓝 {coldCount})</span>
          </button>
        </div>
      </div>

      {/* 45개 번호 그리드 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {filteredItems.map((item) => {
          const isHot = item.status === 'HOT';
          const isCold = item.status === 'COLD';

          return (
            <div
              key={`matrix-${item.number}`}
              onClick={() => {
                soundEngine.playClick();
                if (onSelectNumber) onSelectNumber(item.number);
              }}
              className={`p-2 rounded-2xl border transition-all cursor-pointer select-none flex flex-col items-center justify-between text-center relative group ${
                isHot
                  ? 'bg-gradient-to-b from-red-950/40 to-stone-950 border-red-500/50 hover:border-red-400 hover:scale-105 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : isCold
                  ? 'bg-gradient-to-b from-blue-950/40 to-stone-950 border-blue-500/50 hover:border-blue-400 hover:scale-105 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                  : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-600 hover:bg-stone-800/60'
              }`}
            >
              {/* 상단 뱃지 */}
              <div className="w-full flex items-center justify-between mb-1 px-1 text-[9px] font-mono">
                {isHot ? (
                  <span className="text-red-400 font-bold flex items-center">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+{item.momentumPercent}%</span>
                  </span>
                ) : isCold ? (
                  <span className="text-blue-400 font-bold flex items-center">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{item.overdueWeeks}주 미출</span>
                  </span>
                ) : (
                  <span className="text-stone-500">평균</span>
                )}
                <span className="text-stone-400 text-[8px]">{item.recentCount}회</span>
              </div>

              {/* 볼 렌더링 */}
              <NumberBall number={item.number} size="sm" className="my-1" />

              {/* 상태 텍스트 */}
              <span
                className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                  isHot
                    ? 'bg-red-500/20 text-red-300'
                    : isCold
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'text-stone-500'
                }`}
              >
                {isHot ? '과열(红)' : isCold ? '반등(蓝)' : '중립'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
