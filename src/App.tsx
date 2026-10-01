import React, { useState, useEffect } from 'react';
import { Crown, Zap } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { NavTab } from './components/layout/Navigation';
import { SphereMachine } from './components/lottery/SphereMachine';
import { FilterControl } from './components/lottery/FilterControl';
import { TicketCard } from './components/lottery/TicketCard';
import { HtsCandleChart } from './components/hts/HtsCandleChart';
import { ColdHotMatrix } from './components/hts/ColdHotMatrix';
import { ZiWeiModal } from './components/modes/ZiWeiModal';
import { BaGuaMode } from './components/modes/BaGuaMode';
import { TarotSpread } from './components/modes/TarotSpread';
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
  const [brandTitle, setBrandTitle] = useState('LOTTO ROYALE VIP 2.0');
  const [showCommercialModal, setShowCommercialModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [backtestNumbers, setBacktestNumbers] = useState<number[] | null>(null);

  // 3D 추첨기에 장전된 타겟 번호 (자미두수/타로/주역에서 전송)
  const [targetDrawNumbers, setTargetDrawNumbers] = useState<number[] | null>(null);

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
      const updated = prev.length >= 5 ? [...prev.slice(1), newGame] : [...prev, newGame];
      return updated;
    });

    // 장전 번호 리셋
    setTargetDrawNumbers(null);
  };

  // 원클릭 VIP 5게임(1세트) 즉시 일괄 발행
  const handleQuickBatchGenerate = () => {
    soundEngine.playFanfare();
    const newGames = generateVipGameSet(5, filterSettings);
    setSavedGames(newGames);
  };

  // 모드별 번호를 3D 구체 추첨기에 장전하고 즉시 메인 추첨 탭으로 이동
  const handleLoadIntoSphere = (numbers: number[]) => {
    setTargetDrawNumbers(numbers);
    setActiveTab('draw');
  };

  // 모드별 5게임을 골드 티켓에 적용하고 메인 탭으로 이동
  const handleApplyExternalGames = (games: LottoGame[]) => {
    setSavedGames(games);
    setActiveTab('draw');
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

      {/* 2. 네비게이션 탭 바 (HTS, 자미두수, 주역, 타로 포함) */}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pb-16">
        {/* TAB 1: 3D VIP 추첨기 (메인 5+1 추첨기 - 100% 완전 보존!) */}
        {activeTab === 'draw' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 상단 안내 바 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-stone-900/60 border border-amber-500/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-wide">
                      동행 6/45 3D 물리 구체 추첨기 & 5+1 볼 시스템
                    </h2>
                    {targetDrawNumbers && (
                      <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                        신비수 장전완료!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400">
                    {targetDrawNumbers
                      ? '자미두수/타로/주역에서 전송된 황금 조합이 구체 추첨기에 장전되었습니다. [추첨 시작]을 누르세요!'
                      : '실제 역대 1,162회 통계와 AC값 7+ 조건을 결합한 무결점 3D 추첨'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleQuickBatchGenerate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl gold-button text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>원클릭 5게임 즉시 발급</span>
                </button>
              </div>
            </div>

            {/* 그리드 레이아웃: 좌측(3D 추첨기 + 필터) / 우측(골드 티켓 인쇄소) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <SphereMachine
                  onDrawComplete={handleDrawComplete}
                  targetNumbers={targetDrawNumbers || generateVipNumbers(filterSettings)}
                />
                <FilterControl
                  settings={filterSettings}
                  onChange={setFilterSettings}
                />
              </div>

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

        {/* TAB 2: HTS 퀀트 캔들 차트 (주선·월선·년선 & 냉열수 홍/람 호가창) */}
        {activeTab === 'hts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <HtsCandleChart />
            <ColdHotMatrix
              onSelectNumber={(num) => {
                // 번호 선택 시 고정수에 토글
                const isAlready = filterSettings.fixedNumbers.includes(num);
                const updated = isAlready
                  ? filterSettings.fixedNumbers.filter((n) => n !== num)
                  : [...filterSettings.fixedNumbers, num].slice(0, 5);
                setFilterSettings({ ...filterSettings, fixedNumbers: updated });
              }}
            />
          </div>
        )}

        {/* TAB 3: 자미두수(紫微斗数) 12궁 명반 & 재백궁 대재/소재/재위 */}
        {activeTab === 'ziwei' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <ZiWeiModal
              onLoadIntoSphere={handleLoadIntoSphere}
              onApplyGames={handleApplyExternalGames}
            />
            <TicketCard
              games={savedGames}
              onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
              onClearGames={handleClearGames}
            />
          </div>
        )}

        {/* TAB 4: 주역 오행팔괘 (五行八卦) 64괘 재물 괘상 */}
        {activeTab === 'bagua' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            <BaGuaMode
              onLoadIntoSphere={handleLoadIntoSphere}
              onApplyGames={handleApplyExternalGames}
            />
            <TicketCard
              games={savedGames}
              onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
              onClearGames={handleClearGames}
            />
          </div>
        )}

        {/* TAB 5: 서양 신비학 황금 타로 (塔罗牌) 3카드 스프레드 */}
        {activeTab === 'tarot' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <TarotSpread
              onLoadIntoSphere={handleLoadIntoSphere}
              onApplyGames={handleApplyExternalGames}
            />
            <TicketCard
              games={savedGames}
              onBacktestGame={(numbers) => setBacktestNumbers(numbers)}
              onClearGames={handleClearGames}
            />
          </div>
        )}

        {/* TAB 6: 사주명리학 & 오행 모드 */}
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

        {/* TAB 7: AI 꿈해몽 길몽 상징수 모드 */}
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

        {/* TAB 8: 역대 통계 랩 */}
        {activeTab === 'stats' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <StatsLab />
          </div>
        )}
      </main>

      {/* 4. 팝업 모달들 */}
      {backtestNumbers && (
        <BacktestModal
          numbers={backtestNumbers}
          onClose={() => setBacktestNumbers(null)}
        />
      )}

      {showQrModal && (
        <QrScannerModal onClose={() => setShowQrModal(false)} />
      )}

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
            본 시스템은 대한민국 동행복권 6/45의 과거 실제 통계 데이터와 수학적 HTS 퀀트 모델, 동양 자미두수·주역팔괘, 서양 타로를 결합한 프리미엄 번호 분석기입니다. 복권은 건전한 소액 오락으로 즐겨주시기 바랍니다.
          </p>
          <div className="pt-2 text-stone-600 text-[10px] font-mono">
            COPYRIGHT © 2025 LOTTO ROYALE ENTERPRISE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
