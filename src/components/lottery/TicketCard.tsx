import React, { useRef, useState } from 'react';
import { Crown, Download, BarChart3, QrCode, Sparkles, Trash2, Check, Copy } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { LottoGame } from '../../types/lotto';

import { NumberBall } from './NumberBall';
import { calculateAC, calculateSum, calculateOddEven } from '../../algorithms/statisticalEngine';
import { soundEngine } from '../../utils/soundEffects';

interface TicketCardProps {
  games: LottoGame[];
  onBacktestGame: (numbers: number[]) => void;
  onClearGames?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  games,
  onBacktestGame,
  onClearGames,
}) => {
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 로또 추첨일 계산 (다가오는 토요일)
  const getNextDrawDate = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = (6 - day + 7) % 7;
    const nextSat = new Date(today);
    nextSat.setDate(today.getDate() + (diff === 0 && today.getHours() >= 20 ? 7 : diff));
    const y = nextSat.getFullYear();
    const m = String(nextSat.getMonth() + 1).padStart(2, '0');
    const d = String(nextSat.getDate()).padStart(2, '0');
    return `${y}.${m}.${d} (토) 20:35 추첨`;
  };

  // 이미지 다운로드
  const handleDownloadTicket = async () => {
    if (!ticketRef.current || games.length === 0) return;
    soundEngine.playClick();
    setIsExporting(true);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `LOTTO-ROYALE-VIP-TICKET-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export ticket image', err);
      alert('티켓 이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // 번호 텍스트 클립보드 복사
  const handleCopyNumbers = (game: LottoGame) => {
    soundEngine.playClick();
    const text = game.numbers.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedId(game.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (games.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-stone-800 rounded-3xl text-center bg-stone-950/40">
        <Crown className="w-10 h-10 text-stone-700 mx-auto mb-3" />
        <p className="text-stone-400 font-medium text-sm">보관 중인 VIP 로또 조합이 없습니다.</p>
        <p className="text-stone-600 text-xs mt-1">상단의 3D 추첨기나 모드별 생성기로 황금 조합을 추출해보세요.</p>
      </div>
    );
  }

  const rowLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* 액션 바 */}
      <div className="w-full max-w-lg flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 tracking-wider">
            발급된 VIP 골드 티켓 ({games.length}게임)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onClearGames && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onClearGames();
              }}
              className="text-xs text-stone-500 hover:text-rose-400 p-1 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 비우기</span>
            </button>
          )}

          <button
            onClick={handleDownloadTicket}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? '인증서 인쇄 중...' : '골드 티켓 고화질 저장'}</span>
          </button>
        </div>
      </div>

      {/* 실물 골드 티켓 컴포넌트 (html-to-image 캡처 대상) */}
      <div
        ref={ticketRef}
        className="w-full max-w-lg bg-gradient-to-b from-[#121620] via-[#0d1017] to-[#080a0e] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-stone-200"
      >
        {/* 상단 금박 워터마크 및 배경 인장 */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* 티켓 상단 공식 로고 헤더 */}
        <div className="border-b border-amber-500/20 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-200/50">
              <Crown className="w-6 h-6 text-stone-950 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base sm:text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                  LOTTO 6/45 ROYALE VIP
                </h4>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded font-extrabold">
                  100만 원 에디션
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                동행복권 공식 통계·사주 인공지능 보증
              </p>
            </div>
          </div>

          <div className="text-right">
            <QrCode className="w-8 h-8 text-amber-400/80 ml-auto" />
            <span className="text-[9px] text-stone-500 font-mono">VIP AUTH #777</span>
          </div>
        </div>

        {/* 추첨일 & 발급 정보 바 */}
        <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl px-3 py-2 mb-4 flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <div>
            <span className="text-stone-500">발행: </span>
            <span>{new Date().toLocaleDateString('ko-KR')}</span>
          </div>
          <div>
            <span className="text-amber-400 font-semibold">{getNextDrawDate()}</span>
          </div>
        </div>

        {/* 로또 조합 A~E 행 리스트 */}
        <div className="space-y-3 mb-5">
          {games.slice(0, 5).map((game, index) => {
            const sum = game.meta?.sum || calculateSum(game.numbers);
            const oddEven = game.meta?.oddEven || calculateOddEven(game.numbers);
            const ac = calculateAC(game.numbers);

            return (
              <div
                key={game.id}
                className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between hover:border-amber-500/40 transition-all group"
              >
                {/* 좌측 슬롯 번호 및 모드 */}
                <div className="flex items-center gap-2 mr-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black text-xs">
                    {rowLabels[index] || index + 1}
                  </span>
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-stone-500 font-bold block">
                      {game.mode === 'fortune' ? '사주운세' : game.mode === 'dream' ? '꿈해몽' : 'VIP통계'}
                    </span>
                  </div>
                </div>

                {/* 6개 로또 볼 렌더링 */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {game.numbers.map((n) => (
                    <NumberBall key={`${game.id}-${n}`} number={n} size="sm" className="sm:w-8 sm:h-8" />
                  ))}
                </div>

                {/* 우측 수치 지표 및 액션 */}
                <div className="flex items-center gap-1.5 ml-2">
                  <div className="hidden md:flex flex-col items-end text-[10px] text-stone-400 font-mono">
                    <span>합:{sum} / {oddEven}</span>
                    <span className="text-amber-400/90 font-semibold">AC:{ac}</span>
                  </div>

                  {/* 백테스트 버튼 */}
                  <button
                    onClick={() => onBacktestGame(game.numbers)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-700 transition-colors"
                    title="20년 역대 당첨 백테스트"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                  </button>

                  {/* 복사 버튼 */}
                  <button
                    onClick={() => handleCopyNumbers(game)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-700 transition-colors"
                    title="번호 복사"
                  >
                    {copiedId === game.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 바코드 및 럭셔리 인장 */}
        <div className="border-t border-amber-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="font-mono text-[9px] text-stone-500 tracking-widest">
            {/* 가상 바코드 패턴 */}
            <div className="h-6 flex items-center justify-center sm:justify-start gap-[2px] opacity-75">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 3, 2, 4, 1, 2].map((w, idx) => (
                <div
                  key={`bar-${idx}`}
                  style={{ width: `${w * 1.5}px` }}
                  className="h-full bg-stone-400"
                />
              ))}
            </div>
            <span className="block mt-1">ROYALE-VIP-645-0988-1162</span>
          </div>

          <div className="text-[10px] text-amber-300/80 font-serif italic flex items-center gap-1.5">
            <span>Supreme Fortune Guarantee</span>
            <div className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center text-[8px] font-bold">
              ★
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
