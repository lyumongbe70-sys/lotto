import React from 'react';
import { Sparkles, Compass, Moon, BarChart2, QrCode } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

export type NavTab = 'draw' | 'fortune' | 'dream' | 'stats' | 'qr';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'draw', label: '3D VIP 추첨기', icon: Sparkles, badge: '메인' },
    { id: 'fortune', label: '사주·오행 분석', icon: Compass, badge: '인기' },
    { id: 'dream', label: 'AI 꿈해몽', icon: Moon, badge: '신규' },
    { id: 'stats', label: '역대 통계 랩', icon: BarChart2, badge: '빅데이터' },
    { id: 'qr', label: 'QR 복권 조회', icon: QrCode, badge: '실시간' },
  ] as const;

  return (
    <nav className="w-full max-w-4xl mx-auto px-4 my-6">
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-stone-950/90 border border-amber-500/25 backdrop-blur-xl shadow-2xl overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                onTabChange(tab.id);
              }}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2.5 px-3 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold transition-all relative cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>

              {tab.badge && !isActive && (
                <span className="hidden md:inline-block text-[9px] bg-stone-800 text-amber-300/80 px-1.5 py-0.2 rounded-full border border-stone-700 ml-1">
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
