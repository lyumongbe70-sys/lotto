import React, { useState, useEffect, useRef } from 'react';
import { Activity, Eye } from 'lucide-react';
import type { HtsTimeframe, CandleData } from '../../types/lotto';
import { generateHtsCandles } from '../../algorithms/htsEngine';
import { soundEngine } from '../../utils/soundEffects';

export const HtsCandleChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<HtsTimeframe>('W');
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const data = generateHtsCandles(timeframe);
    setCandles(data);
    setHoveredIndex(data.length - 1);
  }, [timeframe]);

  // 캔버스 차트 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 차트 레이아웃 분할: 상단 70% 캔들스틱 + 하단 30% 보조지표(재백 모멘텀)
    const mainHeight = height * 0.68;
    const subTop = height * 0.74;
    const subHeight = height * 0.22;

    // 표시할 최근 N개 캔들 슬라이스 (주봉은 최근 35개)
    const displayCount = timeframe === 'W' ? 32 : timeframe === 'M' ? 24 : 10;
    const slice = candles.slice(-displayCount);
    if (slice.length === 0) return;

    const minVal = Math.min(...slice.map((c) => c.low)) - 10;
    const maxVal = Math.max(...slice.map((c) => c.high)) + 10;
    const valRange = maxVal - minVal || 1;

    const candleWidth = (width - 60) / slice.length;

    // 1. 그리드 배경선
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < mainHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 30, y);
      ctx.stroke();
    }

    // 2. 캔들스틱 렌더링
    slice.forEach((c, i) => {
      const x = 40 + i * candleWidth + candleWidth / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? '#ef4444' : '#3b82f6'; // 한국/동양 HTS 표준: 상승=빨강(红), 하락=파랑(蓝)

      const yOpen = mainHeight - ((c.open - minVal) / valRange) * (mainHeight - 40) - 20;
      const yClose = mainHeight - ((c.close - minVal) / valRange) * (mainHeight - 40) - 20;
      const yHigh = mainHeight - ((c.high - minVal) / valRange) * (mainHeight - 40) - 20;
      const yLow = mainHeight - ((c.low - minVal) / valRange) * (mainHeight - 40) - 20;

      // 꼬리선 (High-Low Wick)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // 몸통 (Body)
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 3);
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth * 0.35, bodyTop, candleWidth * 0.7, bodyHeight);

      // 하단 보조지표: 재백 모멘텀 오실레이터
      if (c.indicatorValue !== undefined) {
        const indZero = subTop + subHeight / 2;
        const indH = (c.indicatorValue / 40) * (subHeight / 2);
        ctx.fillStyle = c.indicatorValue >= 0 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(59, 130, 246, 0.75)';
        ctx.fillRect(x - candleWidth * 0.3, indZero, candleWidth * 0.6, -indH);
      }
    });

    // 3. 이동평균선(MA5, MA20) 곡선 렌더링
    const drawMaLine = (key: 'ma5' | 'ma20', strokeStyle: string) => {
      ctx.beginPath();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 2;
      let started = false;

      slice.forEach((c, i) => {
        const val = c[key];
        if (val !== undefined) {
          const x = 40 + i * candleWidth + candleWidth / 2;
          const y = mainHeight - ((val - minVal) / valRange) * (mainHeight - 40) - 20;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    };

    drawMaLine('ma5', '#eab308'); // MA5: 황금색
    drawMaLine('ma20', '#a855f7'); // MA20: 보라색

    // 4. 호버 십자선 (Crosshair)
    if (hoveredIndex !== null && hoveredIndex >= candles.length - slice.length) {
      const localIdx = hoveredIndex - (candles.length - slice.length);
      const hX = 40 + localIdx * candleWidth + candleWidth / 2;

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hX, 20);
      ctx.lineTo(hX, height - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [candles, hoveredIndex, timeframe]);

  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] ? candles[hoveredIndex] : candles[candles.length - 1];

  return (
    <div className="w-full bg-stone-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative">
      {/* HTS 차트 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wider">
                동행 6/45 퀀트 HTS 캔들 차트
              </h3>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                REAL-TIME QUANT
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">
              역대 당첨번호 총합(Sum)과 상금 흐름을 주식형 캔들로 추적
            </p>
          </div>
        </div>

        {/* 주봉, 월봉, 연봉 타임프레임 스위처 */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
          {(['W', 'M', 'Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                soundEngine.playClick();
                setTimeframe(tf);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {tf === 'W' ? '주봉 (週線)' : tf === 'M' ? '월봉 (月線)' : '년봉 (年線)'}
            </button>
          ))}
        </div>
      </div>

      {/* 현재 선택 캔들 시세 바 (주식 호가/시세 표시줄) */}
      {activeCandle && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="text-stone-300 font-bold">
            <span className="text-amber-400 mr-1.5">[{activeCandle.time}]</span>
            총합 종가: <span className="text-white font-black text-sm">{activeCandle.close}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>시가(O): <strong className="text-stone-300">{activeCandle.open}</strong></span>
            <span>고가(H): <strong className="text-red-400">{activeCandle.high}</strong></span>
            <span>저가(L): <strong className="text-blue-400">{activeCandle.low}</strong></span>
            <span className="text-amber-300">MA5: <strong>{activeCandle.ma5 || '-'}</strong></span>
            <span className="text-purple-400">MA20: <strong>{activeCandle.ma20 || '-'}</strong></span>
            <span className="text-emerald-400 font-bold">1등 상금풀: <strong>{activeCandle.volume}억</strong></span>
          </div>
        </div>
      )}

      {/* 캔버스 차트 본체 */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          className="w-full h-[340px] sm:h-[380px] cursor-crosshair block"
        />

        {/* 좌측 상단 지표 범례 */}
        <div className="absolute top-3 left-4 flex items-center gap-3 text-[10px] font-mono bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800 pointer-events-none">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> MA5(5주)
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-2.5 h-0.5 bg-purple-400 inline-block" /> MA20(20주)
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <span className="w-2 h-2 bg-red-500 inline-block" /> 상승(红)
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <span className="w-2 h-2 bg-blue-500 inline-block" /> 하락(蓝)
          </span>
        </div>

        {/* 하단 보조지표 라벨 */}
        <div className="absolute bottom-3 left-4 text-[10px] font-mono text-stone-500 flex items-center gap-1">
          <Eye className="w-3 h-3 text-amber-400" />
          <span>보조지표: 재백궁 횡재 모멘텀 오실레이터 (ZiWei Momentum)</span>
        </div>
      </div>
    </div>
  );
};
