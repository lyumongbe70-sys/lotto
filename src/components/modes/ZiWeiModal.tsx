import React, { useState } from 'react';
import { Sparkles, Clock, MapPin, ArrowRight, Play, Award } from 'lucide-react';
import { calculateZiWeiFortune } from '../../algorithms/ziweiEngine';

import type { ZiWeiResult, LottoGame } from '../../types/lotto';
import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface ZiWeiModalProps {
  onLoadIntoSphere: (numbers: number[]) => void;
  onApplyGames: (games: LottoGame[]) => void;
}

export const ZiWeiModal: React.FC<ZiWeiModalProps> = ({ onLoadIntoSphere, onApplyGames }) => {
  const [birthDate, setBirthDate] = useState('1990-05-18');
  const [birthHour, setBirthHour] = useState('09:00');
  const [isLunar, setIsLunar] = useState(false);
  const [result, setResult] = useState<ZiWeiResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    soundEngine.playClick();
    setIsCalculating(true);

    setTimeout(() => {
      const res = calculateZiWeiFortune(birthDate, birthHour, isLunar);
      setResult(res);
      setIsCalculating(false);
      soundEngine.playFanfare();
    }, 700);
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 text-stone-100">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-black font-black text-sm">
              紫
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-wider">
              자미두수(紫微斗数) 12궁 명반 & 재백궁(财帛宫) 분석기
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
              동양 점성학 최고봉
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            황제들의 제왕학이자 은밀한 천기누설 비법. 귀하의 명반을 세워 대재(大财), 소재(小财), 재위(财位)를 정밀 산출합니다.
          </p>
        </div>
      </div>

      {/* 생년월일시 입력 폼 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">생년월일 (阳历/阴历)</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">출생 시간 (时辰)</label>
          <select
            value={birthHour}
            onChange={(e) => setBirthHour(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:border-amber-400 focus:outline-none"
          >
            <option value="00:00">자시 (子时 23:00~01:00)</option>
            <option value="02:00">축시 (丑时 01:00~03:00)</option>
            <option value="04:00">인시 (寅时 03:00~05:00)</option>
            <option value="06:00">묘시 (卯时 05:00~07:00)</option>
            <option value="08:00">진시 (辰时 07:00~09:00)</option>
            <option value="10:00">사시 (巳时 09:00~11:00)</option>
            <option value="12:00">오시 (午时 11:00~13:00)</option>
            <option value="14:00">미시 (未时 13:00~15:00)</option>
            <option value="16:00">신시 (申时 15:00~17:00)</option>
            <option value="18:00">유시 (酉时 17:00~19:00)</option>
            <option value="20:00">술시 (戌时 19:00~21:00)</option>
            <option value="22:00">해시 (亥时 21:00~23:00)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">음양력 구분</label>
          <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800">
            <button
              onClick={() => setIsLunar(false)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                !isLunar ? 'bg-amber-400 text-stone-950' : 'text-stone-400'
              }`}
            >
              양력 (Solar)
            </button>
            <button
              onClick={() => setIsLunar(true)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                isLunar ? 'bg-amber-400 text-stone-950' : 'text-stone-400'
              }`}
            >
              음력 (Lunar)
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={isCalculating}
        className="w-full py-3.5 rounded-2xl gold-button flex items-center justify-center gap-2 font-black text-sm cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
      >
        {isCalculating ? (
          <>
            <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            <span>자미두수 12궁 명반 및 천기누설 기운 정밀 포국 중...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>자미두수 명반 포국 & 재백궁 대재·소재 산출</span>
          </>
        )}
      </button>

      {/* 포국 결과 */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 핵심 지표 3종: 대재 지수, 소재 지수, 재위(방위) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 대재(大财) 지수 */}
            <div className="bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-950 border border-amber-500/40 p-4 rounded-2xl">
              <span className="text-[11px] text-amber-300 font-bold block mb-1">
                대재(大财) 잭팟 대운 지수
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">{result.bigWealthScore}</span>
                <span className="text-xs text-stone-400">/ 100점 (극상 횡재운)</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full mt-2 overflow-hidden border border-stone-800">
                <div
                  style={{ width: `${result.bigWealthScore}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1.5 block">
                * 일생일대의 1등 횡재가 폭발하는 잠재력
              </span>
            </div>

            {/* 2. 소재(小财) 지수 */}
            <div className="bg-gradient-to-br from-red-950/40 via-stone-950 to-stone-950 border border-red-500/40 p-4 rounded-2xl">
              <span className="text-[11px] text-red-300 font-bold block mb-1">
                소재(小财) 이번 주 당첨 기운
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-red-400">{result.smallWealthScore}</span>
                <span className="text-xs text-stone-400">/ 100점 (상승 기류)</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full mt-2 overflow-hidden border border-stone-800">
                <div
                  style={{ width: `${result.smallWealthScore}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-rose-400"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1.5 block">
                * 이번 주 실전 구매 시 적중 모멘텀
              </span>
            </div>

            {/* 3. 길한 방위 (财位) & 구매 시간 */}
            <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-stone-400 font-bold flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>오늘의 길한 재위(财位)</span>
                </span>
                <span className="text-xs font-bold text-amber-300 leading-snug block">
                  {result.wealthDirection}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-800/80">
                <span className="text-[11px] text-stone-400 font-bold flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>황금 구매 시진 (黄金时辰)</span>
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  {result.goldenHour}
                </span>
              </div>
            </div>
          </div>

          {/* 천기누설 신비학 총평 리포트 */}
          <div className="bg-stone-950/90 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
              <Award className="w-4 h-4" />
              <span>재백궁 주성 해설 및 천기누설 (天机泄露)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-sans whitespace-pre-line bg-stone-900/50 p-4 rounded-xl border border-stone-800">
              {result.prophecyText}
            </p>
          </div>

          {/* 자미두수 황금 6개 번호 트레이 */}
          <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-amber-400 block mb-2 text-center">
              재백궁(财帛宫)과 록존(禄存)이 공명하는 황금 6대수
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
              {result.luckyNumbers.map((n) => (
                <NumberBall key={`ziwei-num-${n}`} number={n} size="md" />
              ))}
            </div>

            {/* 3D 추첨기에 장전 및 골드 티켓 담기 버튼 2종 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  soundEngine.playFanfare();
                  onLoadIntoSphere(result.luckyNumbers);
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
