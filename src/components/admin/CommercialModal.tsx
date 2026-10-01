import React, { useState, useEffect } from 'react';
import { X, DollarSign, Award, Settings, Check, Key } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';


interface CommercialModalProps {
  onClose: () => void;
  brandTitle: string;
  onUpdateBrandTitle: (newTitle: string) => void;
}

export const CommercialModal: React.FC<CommercialModalProps> = ({
  onClose,
  brandTitle,
  onUpdateBrandTitle,
}) => {
  const [titleInput, setTitleInput] = useState(brandTitle);
  const [operatorContact, setOperatorContact] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedContact = localStorage.getItem('lotto_operator_contact') || '010-0000-0000 (VIP 고객센터)';
    const savedKey = localStorage.getItem('lotto_license_key') || 'ROYALE-VIP-100M-ENTERPRISE-PRO';
    setOperatorContact(savedContact);
    setLicenseKey(savedKey);
  }, []);

  const handleSave = () => {
    soundEngine.playClick();
    onUpdateBrandTitle(titleInput);
    localStorage.setItem('lotto_brand_title', titleInput);
    localStorage.setItem('lotto_operator_contact', operatorContact);
    localStorage.setItem('lotto_license_key', licenseKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-stone-200">
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
          <Award className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-black text-white">
            100만 원 상용 판매 & 화이트라벨 라이선스 패키지
          </h3>
        </div>
        <p className="text-xs text-stone-400 mb-6">
          구매자(복권방 사장님, VIP 멤버십 운영자, 투자 정보 인플루언서)에게 100만 원에 완제품으로 납품하거나 직접 수익화할 수 있는 상용화 설정입니다.
        </p>

        {/* 100만원 상용 가치 포인트 요약 */}
        <div className="bg-stone-950/80 border border-amber-500/20 p-4 rounded-2xl mb-6 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <DollarSign className="w-4 h-4" />
            <span>이 앱이 100만 원 이상의 가치를 창출하는 이유</span>
          </div>
          <ul className="text-[11px] text-stone-300 space-y-1.5 list-disc pl-5">
            <li><strong>초고화질 3D 추첨 물리 엔진</strong>: 시중 무료 앱과 비교 불가능한 카지노 VIP 감성</li>
            <li><strong>동행복권 실데이터 통계 알고리즘</strong>: 핫/콜드, AC값, 총합/홀짝/연번 정밀 필터링</li>
            <li><strong>감성 스토리텔링 2종</strong>: 동양 사주명리학(오행) 분석기 + AI 꿈해몽 상징수 추출</li>
            <li><strong>20년 백테스팅 & 몬테카를로</strong>: 고객의 신뢰를 1초 만에 얻는 시뮬레이터</li>
            <li><strong>SNS 바이럴용 골드 티켓</strong>: 고객에게 발송 및 공유 가능한 고해상도 영수증 카드 생성</li>
          </ul>
        </div>

        {/* 화이트라벨 커스터마이징 폼 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>서비스 브랜드 명칭 (상단 헤더 표시)</span>
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="예: ROYALE VIP, 골드 로또 클럽 등"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              운영자 / VIP 상담 연락처 (티켓 및 안내 표시)
            </label>
            <input
              type="text"
              value={operatorContact}
              onChange={(e) => setOperatorContact(e.target.value)}
              placeholder="예: 010-XXXX-XXXX / 카카오톡 ID"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>정품 엔터프라이즈 라이선스 인증키</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={licenseKey}
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono select-all focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">
              * 본 솔루션은 100만 원 상용 라이선스가 발급된 인증 상태입니다.
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl gold-button flex items-center justify-center gap-2 font-extrabold text-sm cursor-pointer shadow-lg shadow-amber-500/30"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-stone-950" />
              <span>설정이 완벽하게 적용되었습니다!</span>
            </>
          ) : (
            <span>화이트라벨 브랜드 설정 저장하기</span>
          )}
        </button>
      </div>
    </div>
  );
};
