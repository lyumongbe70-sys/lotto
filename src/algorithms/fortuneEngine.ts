import type { LottoGame, SajuFortuneInput } from '../types/lotto';
import { calculateSum, calculateOddEven } from './statisticalEngine';

// 오행 (Five Elements) 상징 및 배속 숫자
export const FIVE_ELEMENTS = {
  WOOD: { name: '목(木)', symbol: '나무와 번창', numbers: [3, 8, 13, 18, 23, 28, 33, 38, 43], color: '#10b981' },
  FIRE: { name: '화(火)', symbol: '불과 정열', numbers: [2, 7, 12, 17, 22, 27, 32, 37, 42], color: '#ef4444' },
  EARTH: { name: '토(土)', symbol: '대지와 포용', numbers: [5, 10, 15, 20, 25, 30, 35, 40, 45], color: '#f59e0b' },
  METAL: { name: '금(金)', symbol: '황금과 결단', numbers: [4, 9, 14, 19, 24, 29, 34, 39, 44], color: '#e2e8f0' },
  WATER: { name: '수(水)', symbol: '지혜와 유동', numbers: [1, 6, 11, 16, 21, 26, 31, 36, 41], color: '#3b82f6' }
};

// 생년월일 기반 오행 및 행운의 번호 추출
export function calculateSajuFortune(input: SajuFortuneInput): {
  dominantElement: keyof typeof FIVE_ELEMENTS;
  luckyElement: keyof typeof FIVE_ELEMENTS;
  sajuDescription: string;
  games: LottoGame[];
} {
  const parts = input.birthDate.split('-').map(Number);
  const year = parts[0] || 1990;
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  // 천간지지 및 월령/일주 오행 종합 계산
  const sajuSeed = (year - 4) * 3 + month * 5 + day * 7;
  const elementsList: (keyof typeof FIVE_ELEMENTS)[] = ['WOOD', 'WOOD', 'FIRE', 'FIRE', 'EARTH', 'EARTH', 'METAL', 'METAL', 'WATER', 'WATER'];
  const dominantElement = elementsList[Math.abs(sajuSeed) % elementsList.length];


  // 상생 관계에 따른 보완 오행(용신)
  const complementMap: Record<keyof typeof FIVE_ELEMENTS, keyof typeof FIVE_ELEMENTS> = {
    WOOD: 'FIRE',   // 목생화
    FIRE: 'EARTH',  // 화생토
    EARTH: 'METAL', // 토생금
    METAL: 'WATER', // 금생수
    WATER: 'WOOD'   // 수생목
  };
  const luckyElement = complementMap[dominantElement];

  const luckyPool = [...FIVE_ELEMENTS[luckyElement].numbers, ...FIVE_ELEMENTS[dominantElement].numbers];
  const now = new Date().toISOString();

  // 5게임 생성
  const games: LottoGame[] = [];
  for (let g = 0; g < 5; g++) {
    const pickedSet = new Set<number>();

    // 용신 오행에서 최소 3개 우선 선발
    const shuffledLucky = [...luckyPool].sort(() => Math.random() - 0.5);
    for (const num of shuffledLucky) {
      if (pickedSet.size < 3) {
        pickedSet.add(num);
      }
    }

    // 나머지 번호는 1~45 중 화합을 이루는 번호로 보충
    while (pickedSet.size < 6) {
      const rand = Math.floor(Math.random() * 45) + 1;
      pickedSet.add(rand);
    }

    const sortedNumbers = Array.from(pickedSet).sort((a, b) => a - b);
    games.push({
      id: `saju-${Date.now()}-${g}`,
      numbers: sortedNumbers,
      createdAt: now,
      mode: 'fortune',
      meta: {
        sajuElement: `${FIVE_ELEMENTS[luckyElement].name} 기운`,
        sum: calculateSum(sortedNumbers),
        oddEven: calculateOddEven(sortedNumbers)
      }
    });
  }

  const sajuDescription = `귀하의 사주 원국은 [${FIVE_ELEMENTS[dominantElement].name}]의 본원을 타고나셨으며, 이번 주 복권 운에서는 이를 생(生)하여 폭발적인 재물운을 개화시키는 [${FIVE_ELEMENTS[luckyElement].name}]의 황금 기운이 강력하게 작용합니다.`;

  return {
    dominantElement,
    luckyElement,
    sajuDescription,
    games
  };
}
