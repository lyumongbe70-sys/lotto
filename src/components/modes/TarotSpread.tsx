import React, { useState } from 'react';
import { Sparkles, Play, ArrowRight, RotateCw } from 'lucide-react';
import { drawTarotSpread, generateTarotGames } from '../../algorithms/tarotEngine';
import type { TarotSpreadResult, LottoGame } from '../../types/lotto';
import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface TarotSpreadProps {
  onLoadIntoSphere: (numbers: number[]) => void;
  onApplyGames: (games: LottoGame[]) => void;
}

export const TarotSpread: React.FC<TarotSpreadProps> = ({ onLoadIntoSphere, onApplyGames }) => {
  const [spread, setSpread] = useState<TarotSpreadResult | null>(null);

  const handleStartDraw = () => {
    soundEngine.playClick();
    const newSpread = drawTarotSpread();
    setSpread(newSpread);
    soundEngine.playFanfare();
  };

  const handleReset = () => {
    soundEngine.playClick();
    setSpread(null);
  };


  return (
    <div className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-black font-black text-sm">
              塔
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-wider">
              서양 신비학 황금 타로 (塔罗牌) 3카드 스프레드
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
              대아르카나 횡재학
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            과거의 재물 복덕, 현재의 횡재 파동, 미래의 잭팟 계시를 3장의 아르카나 카드로 점치고 신비수를 조합합니다.
          </p>
        </div>

        {spread && (
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
            title="다시 뽑기"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 타로 카드 3장 디스플레이 영역 */}
      {!spread ? (
        <div className="flex flex-col items-center justify-center py-10 bg-stone-950/70 rounded-2xl border border-stone-800">
          <div className="flex gap-4 mb-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-24 sm:w-28 h-36 sm:h-44 rounded-2xl bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border-2 border-amber-500/40 flex items-center justify-center shadow-xl relative overflow-hidden"
              >
                <div className="w-16 h-28 rounded-xl border border-amber-400/30 flex items-center justify-center">
                  <span className="text-2xl text-amber-400 select-none">✨</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartDraw}
            className="px-8 py-3.5 rounded-2xl gold-button flex items-center justify-center gap-2 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>황금 타로 3카드 셔플 및 펼치기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 3장 카드 디스플레이 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 과거 카드 */}
            <div className="bg-stone-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center text-center">
              <span className="text-[10px] text-stone-500 font-mono mb-1">[1] 과거의 재물 복덕</span>
              <div className="w-24 h-36 rounded-xl bg-gradient-to-b from-amber-500/10 to-stone-900 border border-amber-400/40 flex flex-col items-center justify-center my-2 shadow-inner">
                <span className="text-3xl mb-1">{spread.pastCard.imageSymbol}</span>
                <span className="text-xs font-bold text-amber-300">{spread.pastCard.nameKo}</span>
                <span className="text-[9px] text-stone-500">{spread.pastCard.nameZh}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
                {spread.pastCard.wealthMeaning}
              </p>
            </div>

            {/* 2. 현재 카드 (하이라이트) */}
            <div className="bg-gradient-to-b from-amber-950/30 to-stone-950 border-2 border-amber-400/60 rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="text-[10px] text-amber-400 font-bold font-mono mb-1">
                ★ [2] 현재의 횡재 파동 (핵심)
              </span>
              <div className="w-24 h-36 rounded-xl bg-gradient-to-b from-amber-400/20 to-stone-900 border border-amber-300 flex flex-col items-center justify-center my-2 shadow-inner">
                <span className="text-3xl mb-1">{spread.presentCard.imageSymbol}</span>
                <span className="text-xs font-black text-amber-200">{spread.presentCard.nameKo}</span>
                <span className="text-[9px] text-stone-400">{spread.presentCard.nameZh}</span>
              </div>
              <p className="text-[11px] text-stone-300 mt-2 leading-relaxed font-semibold">
                {spread.presentCard.wealthMeaning}
              </p>
            </div>

            {/* 3. 미래 카드 */}
            <div className="bg-stone-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center text-center">
              <span className="text-[10px] text-stone-500 font-mono mb-1">[3] 미래의 잭팟 계시</span>
              <div className="w-24 h-36 rounded-xl bg-gradient-to-b from-amber-500/10 to-stone-900 border border-amber-400/40 flex flex-col items-center justify-center my-2 shadow-inner">
                <span className="text-3xl mb-1">{spread.futureCard.imageSymbol}</span>
                <span className="text-xs font-bold text-amber-300">{spread.futureCard.nameKo}</span>
                <span className="text-[9px] text-stone-500">{spread.futureCard.nameZh}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
                {spread.futureCard.wealthMeaning}
              </p>
            </div>
          </div>

          {/* 총평 */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs font-bold text-amber-400 block mb-1">
              타로 3대 아르카나 횡재 총평
            </span>
            <p className="text-xs text-stone-300 leading-relaxed">
              {spread.overallFortune}
            </p>
          </div>

          {/* 최종 6개 번호 */}
          <div className="bg-stone-950 border border-amber-500/30 p-4 rounded-2xl">
            <span className="text-xs font-bold text-amber-400 block mb-2 text-center">
              타로 3카드가 공명하는 황금 6대수
            </span>
            <div className="flex items-center justify-center gap-2 py-2">
              {spread.finalNumbers.map((n) => (
                <NumberBall key={`tarot-${n}`} number={n} size="md" />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  onLoadIntoSphere(spread.finalNumbers);
                }}
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-400 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>3D 구체 추첨기에 이 번호 장전하기</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  const games = generateTarotGames(spread);
                  onApplyGames(games);
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>5게임 골드 티켓에 즉시 담기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
