import React, { useState } from 'react';
import { X, Award, History } from 'lucide-react';
import { runBacktest, runMonteCarlo } from '../../algorithms/backtester';

import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface BacktestModalProps {
  numbers: number[];
  onClose: () => void;
}

export const BacktestModal: React.FC<BacktestModalProps> = ({ numbers, onClose }) => {
  const [activeTab, setActiveTab] = useState<'historical' | 'monte-carlo'>('historical');
  const [monteResult, setMonteResult] = useState<ReturnType<typeof runMonteCarlo> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // 과거 역대 백테스팅 결과
  const result = runBacktest(numbers);

  // 10만 회 몬테카를로 시뮬레이션 실행
  const handleRunMonteCarlo = (trials: number) => {
    soundEngine.playClick();
    setIsSimulating(true);

    setTimeout(() => {
      const res = runMonteCarlo(numbers, trials);
      setMonteResult(res);
      setIsSimulating(false);
      if (res.hitRank1) {
        soundEngine.playFanfare();
      } else {
        soundEngine.playBallDrop();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        {/* 닫기 버튼 */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 타이틀 및 검증 대상 번호 */}
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            20년 역대 백테스팅 & 10만 회 몬테카를로 검증기
          </h3>
        </div>

        {/* 검증 대상 번호 표시 */}
        <div className="flex items-center gap-2 p-3 bg-stone-950/80 rounded-2xl border border-stone-800 mb-5 justify-between">
          <span className="text-xs text-stone-400 font-medium">검증 대상 조합:</span>
          <div className="flex gap-1.5 sm:gap-2">
            {numbers.map((n) => (
              <NumberBall key={n} number={n} size="sm" />
            ))}
          </div>
        </div>

        {/* 탭 전환 */}
        <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 mb-5">
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'historical'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            과거 20년 실제 회차 대조 결과
          </button>
          <button
            onClick={() => setActiveTab('monte-carlo')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'monte-carlo'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            10만 회 가상 몬테카를로 시뮬레이션
          </button>
        </div>

        {/* 1. 역대 회차 백테스팅 패널 */}
        {activeTab === 'historical' && (
          <div className="space-y-4">
            {/* 핵심 지표 3개 카드 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-2xl text-center">
                <span className="text-[11px] text-stone-400 block mb-1">검증된 회차 수</span>
                <span className="text-lg font-black text-white">{result.totalRoundsTested}회</span>
                <span className="text-[10px] text-stone-500 block">매주 1천원 구매 기준</span>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-2xl text-center">
                <span className="text-[11px] text-stone-400 block mb-1">총 누적 당첨금</span>
                <span className="text-lg font-black text-amber-400">
                  {result.totalWon > 0 ? `${(result.totalWon / 10000).toLocaleString()}만원` : '0원'}
                </span>
                <span className="text-[10px] text-stone-500 block">투자금 {(result.totalSpent / 10000).toLocaleString()}만원</span>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-2xl text-center">
                <span className="text-[11px] text-stone-400 block mb-1">투자 수익률 (ROI)</span>
                <span
                  className={`text-lg font-black ${
                    result.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.roi > 0 ? `+${result.roi}%` : `${result.roi}%`}
                </span>
                <span className="text-[10px] text-stone-500 block">역대 누적 손익</span>
              </div>
            </div>

            {/* 등수별 당첨 횟수 현황 */}
            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-stone-300 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>역대 등수별 실제 적중 횟수</span>
              </h4>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] text-amber-300 block font-bold">1등 (6개)</span>
                  <span className="text-base font-extrabold text-white">{result.rank1}회</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">2등 (5개+B)</span>
                  <span className="text-base font-extrabold text-white">{result.rank2}회</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">3등 (5개)</span>
                  <span className="text-base font-extrabold text-white">{result.rank3}회</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">4등 (4개)</span>
                  <span className="text-base font-extrabold text-white">{result.rank4}회</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">5등 (3개)</span>
                  <span className="text-base font-extrabold text-white">{result.rank5}회</span>
                </div>
              </div>
            </div>

            {/* 최고 당첨 기록 카드 */}
            {result.bestRound && (
              <div className="bg-gradient-to-r from-amber-950/30 to-stone-950 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    역대 최고 당첨 회차 기록
                  </span>
                  <span className="text-sm font-bold text-white">
                    제 {result.bestRound.round}회 ({result.bestRound.date})
                  </span>
                  <p className="text-xs text-stone-400">
                    일치 개수 {result.bestRound.matchedCount}개 {result.bestRound.hasBonus ? '+ 보너스' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-amber-300 font-bold block">
                    {result.bestRound.rank}등 적중
                  </span>
                  <span className="text-base font-extrabold text-amber-400">
                    {(result.bestRound.prize / 10000).toLocaleString()}만원
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. 10만 회 몬테카를로 시뮬레이션 패널 */}
        {activeTab === 'monte-carlo' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-400">
              이 번호가 1등(1/8,145,060)에 도달할 때까지 가상 추첨기를 초고속으로 반복 회전시킵니다.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleRunMonteCarlo(10000)}
                disabled={isSimulating}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-200 hover:text-amber-300 hover:bg-stone-700 text-xs font-bold transition-all disabled:opacity-50"
              >
                1만 회 가상 추첨
              </button>
              <button
                onClick={() => handleRunMonteCarlo(50000)}
                disabled={isSimulating}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-200 hover:text-amber-300 hover:bg-stone-700 text-xs font-bold transition-all disabled:opacity-50"
              >
                5만 회 가상 추첨
              </button>
              <button
                onClick={() => handleRunMonteCarlo(100000)}
                disabled={isSimulating}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-extrabold transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
              >
                10만 회 풀 시뮬레이션
              </button>
            </div>

            {isSimulating && (
              <div className="p-8 text-center bg-stone-950/60 rounded-2xl border border-stone-800">
                <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span className="text-xs text-amber-300 font-bold">
                  몬테카를로 알고리즘 계산 진행 중...
                </span>
              </div>
            )}

            {monteResult && !isSimulating && (
              <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs text-stone-400">시뮬레이션 실행 횟수</span>
                  <span className="text-xs font-bold text-amber-300">
                    {monteResult.trialsRun.toLocaleString()}회
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">3등 (5개)</span>
                    <span className="text-sm font-bold text-white">
                      {monteResult.rankCounts[3].toLocaleString()}회
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">4등 (4개)</span>
                    <span className="text-sm font-bold text-white">
                      {monteResult.rankCounts[4].toLocaleString()}회
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">5등 (3개)</span>
                    <span className="text-sm font-bold text-white">
                      {monteResult.rankCounts[5].toLocaleString()}회
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block font-bold">최고 기록</span>
                    <span className="text-sm font-extrabold text-amber-400">
                      {monteResult.bestRank === 0 ? '미당첨' : `${monteResult.bestRank}등`}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 text-center pt-2">
                  * 몬테카를로 분석을 통해 해당 번호의 장기 통계적 기댓값과 분산이 균일함을 증명합니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
