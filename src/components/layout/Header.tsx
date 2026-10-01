import React, { useState } from 'react';
import { Crown, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';


interface HeaderProps {
  brandTitle: string;
  onOpenCommercial: () => void;
}

export const Header: React.FC<HeaderProps> = ({ brandTitle, onOpenCommercial }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick();
    }
  };

  return (
    <header className="w-full border-b border-amber-500/20 bg-stone-950/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* 좌측 브랜드 로고 */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-200/60 transform hover:rotate-6 transition-transform">
              <Crown className="w-7 h-7 text-stone-950 fill-stone-950" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
                {brandTitle || 'LOTTO ROYALE VIP'}
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                100만원 상용 패키지
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              최고급 VIP 6/45 복권 분석 & AI 번호 생성 플랫폼
            </p>
          </div>
        </div>

        {/* 우측 컨트롤 (사운드 토글 & 상용 라이선스 버튼) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 사운드 토글 */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
            }`}
            title={isMuted ? '사운드 켜기' : '사운드 끄기 (음소거)'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
          </button>

          {/* 100만원 라이선스 / 상용 관리자 버튼 */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenCommercial();
            }}
            className="px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:border-amber-400 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">100만원 상용 패키지 설정</span>
            <span className="md:hidden">상용 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
