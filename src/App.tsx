import React, { useState, useEffect } from 'react';
import { Crown, Zap } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { NavTab } from './components/layout/Navigation';
import { SphereMachine } from './components/lottery/SphereMachine';
import { FilterControl } from './components/lottery/FilterControl';
import { TicketCard } from './components/lottery/TicketCard';
import { FortuneMode } from './components/modes/FortuneMode';
import { DreamMode } from './components/modes/DreamMode';
import { StatsLab } from './components/lottery/StatsLab';
import { BacktestModal } from './components/modes/BacktestModal';
import { QrScannerModal } from './components/modes/QrScannerModal';
import { CommercialModal } from './components/admin/CommercialModal';
import type { FilterSettings, LottoGame } from './types/lotto';
import { generateVipGameSet, generateVipNumbers, calculateSum, calculateOddEven } from './algorithms/statisticalEngine';
import { soundEngine } from './utils/soundEffects';


export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('draw');
  const [brandTitle, setBrandTitle] = useState('LOTTO ROYALE VIP');
  const [showCommercialModal, setShowCommercialModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [backtestNumbers, setBacktestNumbers] = useState<number[] | null>(null);

  // VIP 필터 기본 설정 (역대 1등 집중 분포값)
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    fixedNumbers: [],
    excludedNumbers: [],
    minSum: 100,
    maxSum: 175,
    oddEvenRatio: 'all',
    highLowRatio: 'all',
    preventConsecutive3: true,
    preferHotNumbers: true,
    preferColdNumbers: false,
  });

  // 보관된 발급 게임 리스트 (최대 5게임 한 세트)
  const [savedGames, setSavedGames] = useState<LottoGame[]>([]);

  // 초기 로컬 스토리지 데이터 로드
  useEffect(() => {
    const savedBrand = localStorage.getItem('lotto_brand_title');
    if (savedBrand) setBrandTitle(savedBrand);

    const savedGamesData = localStorage.getItem('lotto_saved_games');
    if (savedGamesData) {
      try {
        setSavedGames(JSON.parse(savedGamesData));
      } catch {
        // Ignore JSON error
      }
    } else {
      // 초기 1세트(5게임) 자동 추천 생성
      const initialGames = generateVipGameSet(5, filterSettings);
      setSavedGames(initialGames);
    }
  }, []);

  // 저장될 때마다 로컬 스토리지에 동기화
  useEffect(() => {
    if (savedGames.length > 0) {
      localStorage.setItem('lotto_saved_games', JSON.stringify(savedGames));
    }
  }, [savedGames]);

  // 3D 추첨기에서 6개 볼이 모두 뽑혔을 때
  const handleDrawComplete = (numbers: number[]) => {
    const newGame: LottoGame = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      numbers,
      createdAt: new Date().toISOString(),
      mode: 'vip-stats',
      meta: {
        sum: calculateSum(numbers),
        oddEven: calculateOddEven(numbers),
      },
    };

    setSavedGames((prev) => {
      // 5개 초과 시 첫 번째 항목 제거하고 추가
      const updated = prev.length >= 5 ? [...prev.slice(1), newGame] : [...prev, newGame];
      return updated;
    });
  };

  // 원클릭 VIP 5게임(1세트) 즉시 일괄 발행
  const handleQuickBatchGenerate = () => {
    soundEngine.playFanfare();
    const newGames = generateVipGameSet(5, filterSettings);
    setSavedGames(newGames);
  };

  // 모드별(사주/꿈해몽) 5게임 적용
  const handleApplyExternalGames = (games: LottoGame[]) => {
    setSavedGames(games);
    setActiveTab('draw'); // 티켓 뷰가 있는 메인 탭으로 이동
  };

  // 전체 티켓 비우기
  const handleClearGames = () => {
    setSavedGames([]);
    localStorage.removeItem('lotto_saved_games');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. 상단 럭셔리 헤더 */}
      <Header
        brandTitle={brandTitle}
        onOpenCommercial={() => setShowCommercialModal(true)}
      />

      {/* 2. 네비게이션 탭 바 */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'qr') {
            setShowQrModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* 3. 메인 콘텐츠 뷰 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16">
        {/* TAB 1: 3D VIP 추첨기 (메인 뷰) */}
        {activeTab === 'draw' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 상단 액션 및 퀵 원클릭 버튼 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-stone-900/60 border border-amber-500/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    동행복권 6/45 VIP 1등 알고리즘 생성기
                  </h2>
                  <p className="text-xs text-stone-400">
                    실제 역대 1,162회 통계와 AC값 7+ 조건을 결합한 무결점 조합
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleQuickBatchGenerate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl gold-button text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>원클릭 5게임(1세트) 즉시 발급</span>
                </button>
              </div>
            </div>

            {/* 그리드 레이아웃: 좌측(3D 추첨기 + 필터) / 우측(골드 티켓 인쇄소) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 좌측 영역 (7 컬럼) */}
              <div className="lg:col-span-7 space-y-6">
                <SphereMachine
                  onDrawComplete={handleDrawComplete}
                  targetNumbers={generateVipNumbers(filterSettings)}
                />
                <FilterControl
                  settings={filterSettings}
                  onChange={setFilterSettings}
                />
              </div>

              {/* 우측 영역: 발급된 VIP 티켓 카드 (5 컬럼) */}
              <div className="lg:col-span-5 sticky top-24">
                <TicketCard
                  games={savedGames}
                  onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
                  onClearGames={handleClearGames}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 동양 사주명리학 & 오행 모드 */}
        {activeTab === 'fortune' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            <FortuneMode onApplyGames={handleApplyExternalGames} />
            <TicketCard
              games={savedGames}
              onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
              onClearGames={handleClearGames}
            />
          </div>
        )}

        {/* TAB 3: AI 꿈해몽 상징수 모드 */}
        {activeTab === 'dream' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            <DreamMode onApplyGames={handleApplyExternalGames} />
            <TicketCard
              games={savedGames}
              onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
              onClearGames={handleClearGames}
            />
          </div>
        )}

        {/* TAB 4: 역대 통계 랩 */}
        {activeTab === 'stats' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <StatsLab />
          </div>
        )}
      </main>

      {/* 4. 팝업 모달들 */}
      {/* 20년 백테스팅 & 몬테카를로 모달 */}
      {backtestNumbers && (
        <BacktestModal
          numbers={backtestNumbers}
          onClose={() => setBacktestNumbers(null)}
        />
      )}

      {/* QR 코드 당첨 스캐너 모달 */}
      {showQrModal && (
        <QrScannerModal onClose={() => setShowQrModal(false)} />
      )}

      {/* 100만원 상용 패키지 관리자 모달 */}
      {showCommercialModal && (
        <CommercialModal
          brandTitle={brandTitle}
          onUpdateBrandTitle={setBrandTitle}
          onClose={() => setShowCommercialModal(false)}
        />
      )}

      {/* 5. 럭셔리 푸터 */}
      <footer className="w-full border-t border-amber-500/20 bg-stone-950/90 py-8 px-4 sm:px-6 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold">
            <Crown className="w-4 h-4" />
            <span>{brandTitle} 100만 원 엔터프라이즈 정품 상용 솔루션</span>
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            본 시스템은 대한민국 동행복권 6/45의 과거 실제 통계 데이터와 수학적 확률 모델, 동양 오행학을 결합한 프리미엄 번호 분석기입니다. 복권은 건전한 소액 오락으로 즐겨주시기 바라며, 만 19세 미만 청소년은 복권을 구매할 수 없습니다.
          </p>
          <div className="pt-2 text-stone-600 text-[10px] font-mono">
            COPYRIGHT © 2025 LOTTO ROYALE ENTERPRISE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
