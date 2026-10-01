import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, ArrowRight } from 'lucide-react';
import type { SajuFortuneInput, LottoGame } from '../../types/lotto';

import { calculateSajuFortune, FIVE_ELEMENTS } from '../../algorithms/fortuneEngine';
import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface FortuneModeProps {
  onApplyGames: (games: LottoGame[]) => void;
}

export const FortuneMode: React.FC<FortuneModeProps> = ({ onApplyGames }) => {
  const [input, setInput] = useState<SajuFortuneInput>({
    birthDate: '1992-07-15',
    gender: 'male',
    isLunar: false,
    name: '',
  });

  const [result, setResult] = useState<ReturnType<typeof calculateSajuFortune> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    soundEngine.playClick();
    setIsAnalyzing(true);

    setTimeout(() => {
      const fortune = calculateSajuFortune(input);
      setResult(fortune);
      setIsAnalyzing(false);
      soundEngine.playFanfare();
    }, 600);
  };

  return (
    <div className="w-full bg-stone-900/80 border border-amber-500/25 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white tracking-wide">
          동양 사주명리학 & 오행(五行) 맞춤 번호 추출기
        </h3>
      </div>
      <p className="text-xs text-stone-400 mb-6">
        사용자의 생년월일과 오늘 날짜의 천간지지를 대조하여 부족한 기운을 채우고 대운을 부르는 6개의 숫자를 추출합니다.
      </p>

      {/* 입력 폼 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>생년월일</span>
          </label>
          <input
            type="date"
            value={input.birthDate}
            onChange={(e) => setInput({ ...input, birthDate: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            성별
          </label>
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => setInput({ ...input, gender: 'male' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                input.gender === 'male' ? 'bg-amber-400 text-stone-950 shadow-md' : 'text-stone-400'
              }`}
            >
              남성 (乾命)
            </button>
            <button
              onClick={() => setInput({ ...input, gender: 'female' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                input.gender === 'female' ? 'bg-amber-400 text-stone-950 shadow-md' : 'text-stone-400'
              }`}
            >
              여성 (坤命)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            양력 / 음력
          </label>
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => setInput({ ...input, isLunar: false })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                !input.isLunar ? 'bg-amber-400 text-stone-950 shadow-md' : 'text-stone-400'
              }`}
            >
              양력 (Solar)
            </button>
            <button
              onClick={() => setInput({ ...input, isLunar: true })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                input.isLunar ? 'bg-amber-400 text-stone-950 shadow-md' : 'text-stone-400'
              }`}
            >
              음력 (Lunar)
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full py-3 rounded-2xl gold-button flex items-center justify-center gap-2 cursor-pointer font-extrabold text-sm mb-6"
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            <span>오행 기운 분석 중...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>사주팔자 분석 및 행운 번호 추출</span>
          </>
        )}
      </button>

      {/* 분석 결과 카드 */}
      {result && (
        <div className="bg-stone-950/80 border border-amber-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[11px] text-stone-400">타고난 본원 기운: </span>
              <span className="text-xs font-bold text-amber-300 ml-1">
                {FIVE_ELEMENTS[result.dominantElement].name} ({FIVE_ELEMENTS[result.dominantElement].symbol})
              </span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              상생 용신: {FIVE_ELEMENTS[result.luckyElement].name}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-300 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            {result.sajuDescription}
          </p>

          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              오행 추천 5게임 세트 (1세트 5,000원 상당)
            </h4>
            <div className="space-y-2">
              {result.games.map((g, idx) => (
                <div
                  key={g.id}
                  className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-amber-300 w-6">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex gap-1.5">
                    {g.numbers.map((n) => (
                      <NumberBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">
                    {g.meta?.sajuElement}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playFanfare();
              onApplyGames(result.games);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>이 5게임을 메인 골드 티켓에 담기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
