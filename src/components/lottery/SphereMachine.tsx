import React, { useEffect, useRef, useState } from 'react';
import { Play, Sparkles, Zap, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NumberBall } from './NumberBall';
import { soundEngine } from '../../utils/soundEffects';

interface BallPhysics {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  number: number;
  color: string;
}

interface SphereMachineProps {
  onDrawComplete: (numbers: number[]) => void;
  targetNumbers?: number[];
  disabled?: boolean;
}

export const SphereMachine: React.FC<SphereMachineProps> = ({
  onDrawComplete,
  targetNumbers,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [fastMode, setFastMode] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const ballsRef = useRef<BallPhysics[]>([]);

  // 캔버스 볼 물리 시뮬레이션 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const sphereRadius = width * 0.44;

    const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#94a3b8', '#10b981'];

    // 구체 내부 36개의 볼 초기화
    const balls: BallPhysics[] = [];
    for (let i = 1; i <= 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (sphereRadius - 25);
      const colorIndex = Math.floor((i - 1) / 9);
      balls.push({
        id: i,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 11,
        number: i,
        color: colors[colorIndex % colors.length],
      });
    }
    ballsRef.current = balls;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // 1. 유리 구체 외부 금박 테두리 및 앰비언트 글로우
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, sphereRadius);
      bgGrad.addColorStop(0, 'rgba(30, 41, 59, 0.4)');
      bgGrad.addColorStop(0.85, 'rgba(15, 23, 42, 0.85)');
      bgGrad.addColorStop(1, 'rgba(212, 175, 55, 0.35)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // 황금 메탈릭 림
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#d4af37';
      ctx.stroke();

      // 2. 내부 볼 물리 업데이트 & 렌더링
      const speedMultiplier = isDrawing ? 2.8 : 0.8;

      ballsRef.current.forEach((ball) => {
        // 공기 터뷸런스
        ball.vx += (Math.random() - 0.5) * 0.8 * speedMultiplier;
        ball.vy += (Math.random() - 0.5) * 0.8 * speedMultiplier + 0.15; // 약한 중력

        ball.x += ball.vx * speedMultiplier;
        ball.y += ball.vy * speedMultiplier;

        // 원형 벽면 충돌 계산
        const dx = ball.x - centerX;
        const dy = ball.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist + ball.radius > sphereRadius - 2) {
          const normalX = dx / dist;
          const normalY = dy / dist;
          const dot = ball.vx * normalX + ball.vy * normalY;

          ball.vx = (ball.vx - 2 * dot * normalX) * 0.85;
          ball.vy = (ball.vy - 2 * dot * normalY) * 0.85;

          ball.x = centerX + normalX * (sphereRadius - ball.radius - 3);
          ball.y = centerY + normalY * (sphereRadius - ball.radius - 3);
        }

        // 볼 렌더링
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.stroke();

        // 볼 번호 텍스트
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(ball.number), ball.x, ball.y);
      });

      // 3. 유리 구체 하이라이트 글레어
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX - sphereRadius * 0.35, centerY - sphereRadius * 0.35, sphereRadius * 0.28, sphereRadius * 0.14, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fill();
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDrawing]);

  // 추첨 실행 로직
  const handleStartDraw = () => {
    if (isDrawing || disabled) return;

    soundEngine.playClick();
    setIsDrawing(true);
    setDrawnBalls([]);

    // 6개 번호 결정 (부모 컴포넌트 지정 또는 즉석 생성)
    const finalNumbers = targetNumbers && targetNumbers.length === 6
      ? [...targetNumbers].sort((a, b) => a - b)
      : (() => {
          const s = new Set<number>();
          while (s.size < 6) s.add(Math.floor(Math.random() * 45) + 1);
          return Array.from(s).sort((a, b) => a - b);
        })();

    if (fastMode) {
      // 고속 모드: 0.3초 만에 완료
      setTimeout(() => {
        setDrawnBalls(finalNumbers);
        setIsDrawing(false);
        soundEngine.playFanfare();
        onDrawComplete(finalNumbers);
      }, 350);
      return;
    }

    // VIP 시네마틱 추첨: 0.8초 간격으로 하나씩 추출
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount < 6) {
        soundEngine.playBallRoll();
        soundEngine.playBallDrop(currentCount);

        const currentPicked = finalNumbers.slice(0, currentCount + 1);
        setDrawnBalls(currentPicked);
        currentCount++;
      } else {
        clearInterval(interval);
        setIsDrawing(false);
        soundEngine.playFanfare();

        // 잭팟 황금 꽃가루 효과
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#d4af37', '#ffffff', '#e6ca65'],
        });

        onDrawComplete(finalNumbers);
      }
    }, 750);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setDrawnBalls([]);
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-900/90 to-stone-950/95 border border-amber-500/25 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* 럭셔리 배경 앰비언트 글로우 */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 & 모드 전환 */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            ROYAL 3D SPHERE SIMULATOR
          </span>
        </div>

        <button
          onClick={() => setFastMode(!fastMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all border ${
            fastMode
              ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-md shadow-amber-500/30'
              : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-amber-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {fastMode ? '고속 즉시 모드 ON' : '시네마틱 3D 추첨'}
        </button>
      </div>

      {/* 3D 로또 볼 회전 캔버스 영역 */}
      <div className="relative my-2 flex items-center justify-center">
        {/* 황금 스탠드 베이스 */}
        <div className="absolute -bottom-3 w-48 h-4 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 rounded-full shadow-lg z-0" />

        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] rounded-full"
        />

        {/* 볼 추출 시 중앙 팝업 플래시 */}
        {isDrawing && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 blur-xl animate-ping" />
          </div>
        )}
      </div>

      {/* 추출된 6개 로또 볼 진열대 (VIP 트레이) */}
      <div className="w-full max-w-md my-4 p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 shadow-inner flex items-center justify-center gap-2 sm:gap-3 min-h-[76px]">
        {drawnBalls.length === 0 ? (
          <p className="text-xs sm:text-sm text-stone-500 font-medium tracking-wide animate-pulse">
            [추첨 시작] 버튼을 누르면 황금 볼이 추출됩니다.
          </p>
        ) : (
          drawnBalls.map((num, idx) => (
            <NumberBall
              key={`ball-${num}-${idx}`}
              number={num}
              size="lg"
              animate={idx === drawnBalls.length - 1 && isDrawing}
              className="transform transition-all"
            />
          ))
        )}
      </div>

      {/* 조작 버튼 컨트롤러 */}
      <div className="flex items-center gap-3 mt-2 w-full max-w-md">
        <button
          onClick={handleStartDraw}
          disabled={isDrawing || disabled}
          className="flex-1 py-3.5 px-6 rounded-2xl gold-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base font-extrabold tracking-wide"
        >
          {isDrawing ? (
            <>
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
              <span>추첨 진행 중...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-stone-950" />
              <span>VIP 로또 번호 추첨</span>
            </>
          )}
        </button>

        {drawnBalls.length > 0 && !isDrawing && (
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-stone-300 hover:text-amber-300 hover:border-amber-400 transition-all cursor-pointer"
            title="초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
