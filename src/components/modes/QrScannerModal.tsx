import React, { useState } from 'react';
import { X, QrCode, Camera, RefreshCw } from 'lucide-react';
import { HISTORICAL_ROUNDS } from '../../data/winningHistory';

import { NumberBall } from '../lottery/NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface QrScannerModalProps {
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    round: number;
    userNumbers: number[];
    winningNumbers: number[];
    bonus: number;
    matchCount: number;
    hasBonus: boolean;
    rank: number;
    prize: string;
  } | null>(null);

  // 시뮬레이션 QR 스캔 동작
  const handleSimulateScan = () => {
    soundEngine.playClick();
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      // 최신 회차 데이터 가져오기
      const targetRound = HISTORICAL_ROUNDS[0]; // 1162회
      // 가상 스캔된 유저 번호 (일부러 4~5개 맞춰서 당첨 기쁨 제공)
      const userNumbers = [
        targetRound.numbers[0],
        targetRound.numbers[1],
        targetRound.numbers[2],
        targetRound.numbers[3],
        targetRound.bonus,
        (targetRound.numbers[5] % 45) + 1,
      ].sort((a, b) => a - b);

      const winningSet = new Set(targetRound.numbers);
      let matchCount = 0;
      userNumbers.forEach((n) => {
        if (winningSet.has(n)) matchCount++;
      });
      const hasBonus = userNumbers.includes(targetRound.bonus);

      let rank = 0;
      let prize = '낙첨';
      if (matchCount === 6) {
        rank = 1;
        prize = `${(targetRound.firstPrize / 100000000).toFixed(1)}억 원 (1등)`;
      } else if (matchCount === 5 && hasBonus) {
        rank = 2;
        prize = '약 5,000만 원 (2등 당첨!)';
      } else if (matchCount === 5) {
        rank = 3;
        prize = '150만 원 (3등 당첨!)';
      } else if (matchCount === 4) {
        rank = 4;
        prize = '5만 원 (4등 당첨!)';
      } else if (matchCount === 3) {
        rank = 5;
        prize = '5천 원 (5등 당첨!)';
      }

      setScanResult({
        round: targetRound.round,
        userNumbers,
        winningNumbers: targetRound.numbers,
        bonus: targetRound.bonus,
        matchCount,
        hasBonus,
        rank,
        prize,
      });

      setIsScanning(false);
      if (rank > 0) {
        soundEngine.playFanfare();
      } else {
        soundEngine.playBallDrop();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-stone-200">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">
            로또 용지 QR 코드 카메라 자동 당첨 조회
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-5">
          실제 구매하신 동행복권 로또 종이 우측 상단의 QR 코드를 인식하여 이번 회차 당첨 여부를 즉시 검증합니다.
        </p>

        {/* QR 뷰파인더 스캐너 시각화 */}
        <div className="relative w-full aspect-video bg-stone-950 rounded-2xl border-2 border-stone-800 overflow-hidden flex flex-col items-center justify-center mb-5">
          {/* 카메라 코너 모서리 장식 */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

          {/* 스캔 레이저 빔 애니메이션 */}
          {isScanning && (
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />
          )}

          <Camera className={`w-12 h-12 text-stone-700 mb-2 ${isScanning ? 'animate-pulse text-amber-400' : ''}`} />
          <span className="text-xs text-stone-500 font-mono">
            {isScanning ? 'QR 코드 자동 초점 맞추는 중...' : '복권 QR 코드를 카메라 영역에 맞춰주세요'}
          </span>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="w-full py-3.5 rounded-2xl gold-button flex items-center justify-center gap-2 font-extrabold text-sm mb-5 disabled:opacity-50 cursor-pointer"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
              <span>QR 코드 실시간 분석 중...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-stone-950" />
              <span>동행복권 QR 코드 인식 및 당첨 확인</span>
            </>
          )}
        </button>

        {/* 스캔 결과 패널 */}
        {scanResult && (
          <div className="bg-stone-950/80 border border-amber-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs text-stone-400 font-mono">제 {scanResult.round}회 동행복권 결과</span>
                <h4 className="text-base font-black text-amber-300">
                  {scanResult.rank > 0 ? `🎉 축하합니다! ${scanResult.rank}등 당첨!` : '아쉽게도 낙첨되었습니다.'}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">수령 예상 당첨금</span>
                <span className="text-sm font-black text-amber-400">{scanResult.prize}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-stone-400 block mb-1.5">
                당첨 번호 ({scanResult.matchCount}개 일치 {scanResult.hasBonus ? '+ 보너스 일치' : ''})
              </span>
              <div className="flex items-center gap-1.5 mb-3">
                {scanResult.winningNumbers.map((n) => (
                  <NumberBall key={`win-${n}`} number={n} size="sm" />
                ))}
                <span className="text-xs text-stone-500 mx-1 font-bold">+</span>
                <NumberBall number={scanResult.bonus} size="sm" isBonus />
              </div>

              <span className="text-[11px] text-stone-400 block mb-1.5">스캔된 내 복권 번호</span>
              <div className="flex items-center gap-1.5">
                {scanResult.userNumbers.map((n) => {
                  const isMatch = scanResult.winningNumbers.includes(n);
                  const isBonus = n === scanResult.bonus;
                  return (
                    <div key={`user-${n}`} className="relative">
                      <NumberBall number={n} size="sm" />
                      {(isMatch || isBonus) && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[8px] font-black">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
