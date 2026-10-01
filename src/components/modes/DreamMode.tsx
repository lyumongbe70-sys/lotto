import React, { useState } from 'react';
import { Moon, Sparkles, Search, ArrowRight } from 'lucide-react';
import { searchDream, DREAM_DATABASE } from '../../data/dreamDictionary';
import type { LottoGame } from '../../types/lotto';

import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface DreamModeProps {
  onApplyGames: (games: LottoGame[]) => void;
}

export const DreamMode: React.FC<DreamModeProps> = ({ onApplyGames }) => {
  const [keyword, setKeyword] = useState('');
  const [activeResult, setActiveResult] = useState<ReturnType<typeof searchDream> | null>(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    soundEngine.playClick();
    const result = searchDream(query);
    setActiveResult(result);
  };

  const handleCreate5Games = () => {
    if (!activeResult) return;
    soundEngine.playFanfare();

    const dreamLucky = activeResult.recommendedNumbers;
    const now = new Date().toISOString();
    const games: LottoGame[] = [];

    for (let i = 0; i < 5; i++) {
      const picked = new Set<number>();
      // 1~3개의 꿈 번호 보장
      const shuffledDream = [...dreamLucky].sort(() => Math.random() - 0.5);
      const guaranteedCount = i === 0 ? 6 : Math.floor(Math.random() * 2) + 2;

      for (let d = 0; d < guaranteedCount && d < shuffledDream.length; d++) {
        picked.add(shuffledDream[d]);
      }

      while (picked.size < 6) {
        picked.add(Math.floor(Math.random() * 45) + 1);
      }

      games.push({
        id: `dream-${Date.now()}-${i}`,
        numbers: Array.from(picked).sort((a, b) => a - b),
        createdAt: now,
        mode: 'dream',
        meta: {
          dreamKeyword: activeResult.keyword,
        },
      });
    }

    onApplyGames(games);
  };

  return (
    <div className="w-full bg-stone-900/80 border border-amber-500/25 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Moon className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white tracking-wide">
          AI 꿈해몽 & 길몽 상징 번호 추출 엔진
        </h3>
      </div>
      <p className="text-xs text-stone-400 mb-6">
        로또 1등 당첨자들의 실제 꿈 사례와 전통 해몽 상징학을 결합하여, 어젯밤 꿈의 계시를 6개의 당첨 번호로 치환합니다.
      </p>

      {/* 검색 바 */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(keyword)}
            placeholder="예: 황금 돼지가 품에 안기는 꿈, 불이 활활 타는 꿈, 조상님 등..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-4 pr-10 py-3 text-sm text-stone-200 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
          />
          <button
            onClick={() => handleSearch(keyword)}
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 인기 길몽 칩 */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <span className="text-[11px] text-stone-500 py-1 mr-1">추천 길몽:</span>
        {DREAM_DATABASE.slice(0, 8).map((item) => (
          <button
            key={item.keyword}
            onClick={() => {
              setKeyword(item.keyword);
              handleSearch(item.keyword);
            }}
            className="px-2.5 py-1 rounded-full bg-stone-950 border border-stone-800 text-stone-300 hover:border-amber-400 hover:text-amber-300 text-xs transition-all cursor-pointer"
          >
            #{item.keyword}
          </button>
        ))}
      </div>

      {/* 해몽 결과 패널 */}
      {activeResult && (
        <div className="bg-stone-950/80 border border-amber-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-300">
                [{activeResult.keyword}] 해몽 결과 및 길조
              </h4>
            </div>
            <div className="flex gap-1">
              {activeResult.symbols.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-300 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            {activeResult.fortuneMeaning}
          </p>

          <div>
            <span className="text-xs font-bold text-amber-400 block mb-2">
              꿈에서 계시된 핵심 6대 황금 상징수
            </span>
            <div className="flex items-center gap-2 p-3 bg-stone-900/90 rounded-xl border border-stone-800 justify-center">
              {activeResult.recommendedNumbers.map((n) => (
                <NumberBall key={n} number={n} size="md" />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate5Games}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>이 꿈 번호를 바탕으로 5게임 티켓 생성 & 저장</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
