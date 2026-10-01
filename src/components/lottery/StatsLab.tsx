import React, { useState } from 'react';
import { BarChart2, Flame, Snowflake, Award } from 'lucide-react';

import { calculateFrequencyStats, HISTORICAL_ROUNDS } from '../../data/winningHistory';
import { NumberBall } from './NumberBall';
import { soundEngine } from '../../utils/soundEffects';

export const StatsLab: React.FC = () => {
  const { frequency, hotNumbers, coldNumbers } = calculateFrequencyStats();
  const [selectedBall, setSelectedBall] = useState<number | null>(null);

  // 최고 출현 횟수 계산 (차트 높이 기준)
  const maxFreq = Math.max(...Object.values(frequency));

  return (
    <div className="w-full bg-stone-900/80 border border-amber-500/25 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              동행복권 역대 1등 데이터베이스 & 심층 통계 랩
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            실제 역대 당첨 번호 출현 빈도와 핫·콜드 가중치를 실시간으로 분석합니다.
          </p>
        </div>
      </div>

      {/* 핫넘버 & 콜드넘버 요약 배너 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 핫넘버 */}
        <div className="bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>최다 출현 핫넘버 (HOT NUMBERS)</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              상승세
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotNumbers.slice(0, 7).map((n) => (
              <NumberBall
                key={`hot-${n}`}
                number={n}
                size="sm"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedBall(n);
                }}
              />
            ))}
          </div>
        </div>

        {/* 콜드넘버 */}
        <div className="bg-gradient-to-r from-sky-950/40 to-stone-950 border border-sky-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
              <Snowflake className="w-4 h-4 text-sky-400" />
              <span>최저 출현 콜드넘버 (COLD NUMBERS)</span>
            </div>
            <span className="text-[10px] bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
              출현 임박
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {coldNumbers.slice(0, 7).map((n) => (
              <NumberBall
                key={`cold-${n}`}
                number={n}
                size="sm"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedBall(n);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 1~45 번호별 출현 빈도 히스토그램 차트 */}
      <div className="bg-stone-950/80 border border-stone-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            1번 ~ 45번 전수 누적 출현 빈도 그래프
          </h4>
          {selectedBall && (
            <span className="text-xs text-amber-400 font-bold">
              선택: {selectedBall}번 ({frequency[selectedBall]}회 출현)
            </span>
          )}
        </div>

        <div className="h-44 flex items-end gap-1 overflow-x-auto pb-2 pt-4">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const count = frequency[num] || 0;
            const heightPercent = maxFreq > 0 ? (count / maxFreq) * 100 : 10;
            const isSelected = selectedBall === num;
            const isHot = hotNumbers.includes(num);

            return (
              <div
                key={`bar-${num}`}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedBall(num);
                }}
                className="flex-1 min-w-[12px] flex flex-col items-center gap-1 group cursor-pointer"
                title={`${num}번: ${count}회`}
              >
                <div
                  style={{ height: `${Math.max(heightPercent, 12)}%` }}
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-300 shadow-[0_0_10px_#fde047]'
                      : isHot
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-125'
                      : 'bg-stone-700 group-hover:bg-stone-500'
                  }`}
                />
                <span className={`text-[8px] font-mono ${isSelected ? 'text-amber-300 font-black' : 'text-stone-500'}`}>
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 회차 당첨 결과 테이블 */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 overflow-hidden">
        <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>동행복권 최근 회차 실제 당첨 번호 및 1등 당첨금</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 font-semibold">
                <th className="pb-2">회차</th>
                <th className="pb-2">추첨일자</th>
                <th className="pb-2">당첨번호 6개</th>
                <th className="pb-2">보너스</th>
                <th className="pb-2 text-right">1등 당첨금 (1인당)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {HISTORICAL_ROUNDS.slice(0, 6).map((r) => (
                <tr key={r.round} className="hover:bg-stone-900/50 transition-colors">
                  <td className="py-2.5 font-bold text-amber-300">제 {r.round}회</td>
                  <td className="py-2.5 text-stone-400 font-mono">{r.date}</td>
                  <td className="py-2.5">
                    <div className="flex gap-1">
                      {r.numbers.map((n) => (
                        <NumberBall key={n} number={n} size="sm" />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5">
                    <NumberBall number={r.bonus} size="sm" isBonus />
                  </td>
                  <td className="py-2.5 text-right font-black text-amber-400">
                    {(r.firstPrize / 100000000).toFixed(1)}억 원
                    <span className="text-[10px] text-stone-500 font-normal ml-1 block">
                      ({r.firstWinners}명 당첨)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
