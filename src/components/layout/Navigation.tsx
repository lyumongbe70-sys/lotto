import React from 'react';
import { Sparkles, Activity, Compass, Moon, BarChart2, QrCode, Crown } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

export type NavTab = 'draw' | 'hts' | 'ziwei' | 'bagua' | 'tarot' | 'fortune' | 'dream' | 'stats' | 'qr';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'draw', label: '3D VIP 추첨기', icon: Sparkles, badge: '5+1 메인' },
    { id: 'hts', label: 'HTS 퀀트 차트', icon: Activity, badge: '주·월·년선' },
    { id: 'ziwei', label: '자미두수·재백궁', icon: Crown, badge: '대재·재위' },
    { id: 'bagua', label: '주역 팔괘', icon: Compass, badge: '64괘' },
    { id: 'tarot', label: '황금 타로', icon: Sparkles, badge: '3카드' },
    { id: 'fortune', label: '사주·오행', icon: Compass, badge: '명리' },
    { id: 'dream', label: 'AI 꿈해몽', icon: Moon, badge: '해몽' },
    { id: 'stats', label: '역대 통계 랩', icon: BarChart2, badge: '빅데이터' },
    { id: 'qr', label: 'QR 복권 조회', icon: QrCode, badge: '실시간' },
  ] as const;

  return (
    <nav className="w-full max-w-6xl mx-auto px-2 sm:px-4 my-4">
      <div className="flex items-center p-1.5 rounded-2xl bg-stone-950/90 border border-amber-500/25 backdrop-blur-xl shadow-2xl overflow-x-auto gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                onTabChange(tab.id as NavTab);
              }}
              className={`flex-shrink-0 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all relative cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/25 scale-[1.02] font-black'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>

              {tab.badge && !isActive && (
                <span className="text-[9px] bg-stone-900 text-amber-300/80 px-1.5 py-0.2 rounded-full border border-stone-800 ml-0.5">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
