import React, { useState } from 'react';
import { SlidersHorizontal, ShieldCheck, Flame, Snowflake, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { FilterSettings } from '../../types/lotto';

import { calculateFrequencyStats } from '../../data/winningHistory';
import { soundEngine } from '../../utils/soundEffects';

interface FilterControlProps {
  settings: FilterSettings;
  onChange: (settings: FilterSettings) => void;
}

export const FilterControl: React.FC<FilterControlProps> = ({ settings, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fixed' | 'excluded' | 'pattern'>('pattern');
  const { hotNumbers, coldNumbers } = calculateFrequencyStats();

  const toggleNumber = (num: number, type: 'fixed' | 'excluded') => {
    soundEngine.playClick();
    if (type === 'fixed') {
      const isAlready = settings.fixedNumbers.includes(num);
      let updated: number[];
      if (isAlready) {
        updated = settings.fixedNumbers.filter((n) => n !== num);
      } else {
        if (settings.fixedNumbers.length >= 5) {
          alert('고정수는 최대 5개까지만 선택 가능합니다.');
          return;
        }
        updated = [...settings.fixedNumbers, num].sort((a, b) => a - b);
        // 제외수에서 제거
        const updatedExcluded = settings.excludedNumbers.filter((n) => n !== num);
        onChange({ ...settings, fixedNumbers: updated, excludedNumbers: updatedExcluded });
        return;
      }
      onChange({ ...settings, fixedNumbers: updated });
    } else {
      const isAlready = settings.excludedNumbers.includes(num);
      let updated: number[];
      if (isAlready) {
        updated = settings.excludedNumbers.filter((n) => n !== num);
      } else {
        if (settings.excludedNumbers.length >= 39) {
          alert('제외수는 최대 39개까지 선택 가능합니다.');
          return;
        }
        updated = [...settings.excludedNumbers, num].sort((a, b) => a - b);
        // 고정수에서 제거
        const updatedFixed = settings.fixedNumbers.filter((n) => n !== num);
        onChange({ ...settings, excludedNumbers: updated, fixedNumbers: updatedFixed });
        return;
      }
      onChange({ ...settings, excludedNumbers: updated });
    }
  };

  const resetFilters = () => {
    soundEngine.playClick();
    onChange({
      fixedNumbers: [],
      excludedNumbers: [],
      minSum: 100,
      maxSum: 175,
      oddEvenRatio: 'all',
      highLowRatio: 'all',
      preventConsecutive3: true,
      preferHotNumbers: true,
      preferColdNumbers: false,
    });
  };

  return (
    <div className="w-full bg-stone-900/80 border border-amber-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl transition-all">
      {/* 아코디언 헤더 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                VIP 정밀 통계 필터링 조건
              </h3>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                100만원급 알고리즘
              </span>
            </div>
            <p className="text-xs text-stone-400">
              고정수 {settings.fixedNumbers.length}개 / 제외수 {settings.excludedNumbers.length}개 / 총합 {settings.minSum}~{settings.maxSum} / 홀짝 {settings.oddEvenRatio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetFilters();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
            title="기본값 리셋"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isOpen ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
        </div>
      </div>

      {/* 펼쳐졌을 때 세부 설정 */}
      {isOpen && (
        <div className="mt-5 pt-4 border-t border-stone-800/80 space-y-5 animate-in fade-in duration-300">
          {/* 서브 탭 */}
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => setActiveTab('pattern')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'pattern'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              수학 통계 패턴
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'fixed'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              고정수 ({settings.fixedNumbers.length}/5)
            </button>
            <button
              onClick={() => setActiveTab('excluded')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'excluded'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              제외수 ({settings.excludedNumbers.length})
            </button>
          </div>

          {/* 1. 패턴 탭 */}
          {activeTab === 'pattern' && (
            <div className="space-y-4">
              {/* 총합 구간 슬라이더 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-stone-300 font-medium">당첨번호 총합 범위 (역대 82% 집중구간: 100~175)</span>
                  <span className="text-amber-400 font-bold">{settings.minSum} ~ {settings.maxSum}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="80"
                    max="140"
                    value={settings.minSum}
                    onChange={(e) => onChange({ ...settings, minSum: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="145"
                    max="220"
                    value={settings.maxSum}
                    onChange={(e) => onChange({ ...settings, maxSum: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* 비율 제어 (홀짝비, 고저비) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">홀짝 비율 (Odd:Even)</span>
                  <div className="flex gap-1">
                    {(['all', '3:3', '2:4', '4:2'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => onChange({ ...settings, oddEvenRatio: ratio })}
                        className={`flex-1 py-1 text-xs rounded-lg border transition-all ${
                          settings.oddEvenRatio === ratio
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {ratio === 'all' ? '전체' : ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">고저 비율 (1~22 : 23~45)</span>
                  <div className="flex gap-1">
                    {(['all', '3:3', '2:4', '4:2'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => onChange({ ...settings, highLowRatio: ratio })}
                        className={`flex-1 py-1 text-xs rounded-lg border transition-all ${
                          settings.highLowRatio === ratio
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {ratio === 'all' ? '전체' : ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 가중치 & 연번 토글 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onChange({ ...settings, preventConsecutive3: !settings.preventConsecutive3 })}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    settings.preventConsecutive3
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                      : 'bg-stone-950/40 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3연속 번호 방지</span>
                  </div>
                  <span className="text-[10px] font-bold">{settings.preventConsecutive3 ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => onChange({ ...settings, preferHotNumbers: !settings.preferHotNumbers })}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    settings.preferHotNumbers
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/40 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>핫넘버(다빈도) 가중치</span>
                  </div>
                  <span className="text-[10px] font-bold">{settings.preferHotNumbers ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => onChange({ ...settings, preferColdNumbers: !settings.preferColdNumbers })}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    settings.preferColdNumbers
                      ? 'bg-sky-950/40 border-sky-500/40 text-sky-300 font-medium'
                      : 'bg-stone-950/40 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Snowflake className="w-4 h-4 text-sky-400" />
                    <span>콜드넘버(미출현) 가중치</span>
                  </div>
                  <span className="text-[10px] font-bold">{settings.preferColdNumbers ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. 고정수 탭 */}
          {activeTab === 'fixed' && (
            <div>
              <p className="text-xs text-stone-400 mb-3">
                반드시 번호에 포함하고 싶은 번호를 선택하세요. (최대 5개까지 지정 가능)
              </p>
              <div className="grid grid-cols-9 gap-1.5">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
                  const isFixed = settings.fixedNumbers.includes(n);
                  const isExcluded = settings.excludedNumbers.includes(n);
                  const isHot = hotNumbers.includes(n);

                  return (
                    <button
                      key={`fix-${n}`}
                      onClick={() => toggleNumber(n, 'fixed')}
                      disabled={isExcluded}
                      className={`h-8 rounded-lg text-xs font-bold transition-all relative ${
                        isFixed
                          ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-200'
                          : isExcluded
                          ? 'opacity-20 cursor-not-allowed bg-stone-900 text-stone-600'
                          : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      {n}
                      {isHot && !isFixed && (
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. 제외수 탭 */}
          {activeTab === 'excluded' && (
            <div>
              <p className="text-xs text-stone-400 mb-3">
                추첨 조합에서 완전히 배제하고 싶은 번호를 선택하세요. (빨간색으로 표시됨)
              </p>
              <div className="grid grid-cols-9 gap-1.5">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
                  const isFixed = settings.fixedNumbers.includes(n);
                  const isExcluded = settings.excludedNumbers.includes(n);
                  const isCold = coldNumbers.includes(n);

                  return (
                    <button
                      key={`ex-${n}`}
                      onClick={() => toggleNumber(n, 'excluded')}
                      disabled={isFixed}
                      className={`h-8 rounded-lg text-xs font-bold transition-all relative ${
                        isExcluded
                          ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                          : isFixed
                          ? 'opacity-20 cursor-not-allowed bg-stone-900 text-stone-600'
                          : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      {n}
                      {isCold && !isExcluded && (
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
