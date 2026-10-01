import React, { useState } from 'react';
import { Sparkles, Play, ArrowRight } from 'lucide-react';
import { calculateBaGuaHexagram } from '../../algorithms/baguaEngine';
import type { LottoGame } from '../../types/lotto';
import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface BaGuaModeProps {
  onLoadIntoSphere: (numbers: number[]) => void;
  onApplyGames: (games: LottoGame[]) => void;
}

export const BaGuaMode: React.FC<BaGuaModeProps> = ({ onLoadIntoSphere, onApplyGames }) => {
  const [result, setResult] = useState<ReturnType<typeof calculateBaGuaHexagram> | null>(null);
  const [isCasting, setIsCasting] = useState(false);

  const handleCastHexagram = () => {
    soundEngine.playClick();
    setIsCasting(true);

    setTimeout(() => {
      const res = calculateBaGuaHexagram();
      setResult(res);
      setIsCasting(false);
      soundEngine.playFanfare();
    }, 600);
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-black font-black text-sm">
              卦
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-wider">
              주역 오행팔괘 (五行八卦) 64괘 재물 괘상기
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
              3천년 동양 역학의 정수
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            건(乾)·태(兌)·이(離)·진(震)·손(巽)·감(坎)·간(艮)·곤(坤) 8괘의 음양 상생을 통해 오늘 일진의 황금 괘상을 도출합니다.
          </p>
        </div>
      </div>

      {/* 태극 음양 팔괘 상징 심볼 비주얼 */}
      <div className="flex flex-col items-center justify-center py-6 bg-stone-950/70 rounded-2xl border border-stone-800 relative">
        <div className="w-24 h-24 rounded-full border-2 border-amber-400/60 flex items-center justify-center relative shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <span className="text-4xl select-none animate-pulse">☯</span>
        </div>
        <span className="text-xs font-mono text-stone-400 mt-3 tracking-widest uppercase">
          YIN-YANG EIGHT TRIGRAMS QUANT
        </span>

        <button
          onClick={handleCastHexagram}
          disabled={isCasting}
          className="mt-5 px-8 py-3 rounded-2xl gold-button flex items-center justify-center gap-2 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isCasting ? (
            <>
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              <span>주역 64괘 산목 치는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>오늘의 주역 재물 대길괘 산출</span>
            </>
          )}
        </button>
      </div>

      {/* 괘상 결과 패널 */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-stone-950 border border-amber-500/40 p-5 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-3">
              <div>
                <span className="text-xs text-stone-400 font-mono">제 {result.hexagram.id}괘</span>
                <h4 className="text-lg font-black text-amber-300">
                  {result.hexagram.name}
                </h4>
              </div>
              <div className="bg-amber-500/20 border border-amber-400/50 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                {result.hexagram.fortuneGrade}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-xs font-mono">
              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="text-stone-500 block text-[10px]">상괘 (上卦)</span>
                <span className="text-amber-400 font-bold">{result.hexagram.upperTrigram}</span>
              </div>
              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="text-stone-500 block text-[10px]">하괘 (下卦)</span>
                <span className="text-amber-400 font-bold">{result.hexagram.lowerTrigram}</span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/40 p-3 rounded-xl border border-stone-800/80 mb-4">
              {result.hexagram.meaning}
            </p>

            {/* 괘상 추천 번호 */}
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-2 text-center">
                {result.hexagram.chineseName} 괘상 배속 6대 황금수
              </span>
              <div className="flex items-center justify-center gap-2 py-2">
                {result.hexagram.recommendedNumbers.map((n) => (
                  <NumberBall key={`bagua-${n}`} number={n} size="md" />
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  onLoadIntoSphere(result.hexagram.recommendedNumbers);
                }}
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-400 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>3D 구체 추첨기에 이 번호 장전하기</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  onApplyGames(result.games);
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
