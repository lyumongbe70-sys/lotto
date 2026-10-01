import type { BaGuaHexagram, LottoGame } from '../types/lotto';
import { calculateSum, calculateOddEven } from './statisticalEngine';

// 주역 64괘 중 대표 재물·횡재 대길괘 데이터베이스
export const BAGUA_HEXAGRAMS: BaGuaHexagram[] = [
  {
    id: 14,
    name: '화천대유(火天大有)',
    chineseName: '火天大有',
    upperTrigram: '이(離, 火)',
    lowerTrigram: '건(乾, 天)',
    meaning: '태양이 하늘 높이 솟아 온 천하를 비추듯, 뜻밖의 막대한 재화가 내 품으로 쏟아져 들어오는 지극한 대길괘입니다.',
    fortuneGrade: '대길(大吉)',
    recommendedNumbers: [1, 7, 14, 28, 35, 42],
  },
  {
    id: 11,
    name: '지천태(地天泰)',
    chineseName: '地天泰',
    upperTrigram: '곤(坤, 地)',
    lowerTrigram: '건(乾, 天)',
    meaning: '하늘과 땅이 감응하여 만물이 번창하고 막혔던 재물운이 봄날 눈 녹듯 폭발하는 대화합의 상입니다.',
    fortuneGrade: '대길(大吉)',
    recommendedNumbers: [2, 11, 20, 26, 33, 44],
  },
  {
    id: 42,
    name: '풍뢰익(风雷益)',
    chineseName: '风雷益',
    upperTrigram: '손(巽, 风)',
    lowerTrigram: '진(震, 雷)',
    meaning: '바람이 불고 우레가 치며 끊임없이 재화가 증식되는 형국. 투자와 복권에서 기적 같은 결실을 예고합니다.',
    fortuneGrade: '대길(大吉)',
    recommendedNumbers: [5, 12, 19, 27, 36, 40],
  },
  {
    id: 55,
    name: '뇌화풍(雷火丰)',
    chineseName: '雷火丰',
    upperTrigram: '진(震, 雷)',
    lowerTrigram: '이(離, 火)',
    meaning: '풍요와 극성(極盛)을 상징하는 왕의 괘. 일확천금의 기회가 눈앞에 도래하였으니 주저 없이 거머쥐십시오.',
    fortuneGrade: '대길(大吉)',
    recommendedNumbers: [3, 9, 18, 25, 34, 45],
  },
  {
    id: 26,
    name: '산천대축(山天大畜)',
    chineseName: '山天大畜',
    upperTrigram: '간(艮, 山)',
    lowerTrigram: '건(乾, 天)',
    meaning: '거대한 산이 하늘의 보물을 가득 품은 형상. 오랜 세월 축적된 복덕이 일시에 잭팟으로 분출됩니다.',
    fortuneGrade: '대길(大吉)',
    recommendedNumbers: [4, 13, 21, 30, 38, 41],
  },
];

// 오늘 날짜 및 시각 기반 주역 괘상 도출
export function calculateBaGuaHexagram(customSeed?: number): {
  hexagram: BaGuaHexagram;
  yinYangRatio: string;
  fiveElementScore: number;
  games: LottoGame[];
} {
  const now = new Date();
  const seed = customSeed !== undefined
    ? customSeed
    : now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate() + now.getHours();

  const index = Math.abs(seed) % BAGUA_HEXAGRAMS.length;
  const hexagram = BAGUA_HEXAGRAMS[index];

  const nowIso = now.toISOString();
  const games: LottoGame[] = [];

  for (let g = 0; g < 5; g++) {
    const set = new Set<number>();
    // 괘상 대표 번호 최소 3개 포함
    const shuffled = [...hexagram.recommendedNumbers].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
      set.add(shuffled[i]);
    }
    while (set.size < 6) {
      set.add(Math.floor(Math.random() * 45) + 1);
    }
    const numbers = Array.from(set).sort((a, b) => a - b);
    games.push({
      id: `bagua-${Date.now()}-${g}`,
      numbers,
      createdAt: nowIso,
      mode: 'bagua',
      meta: {
        baguaName: hexagram.chineseName,
        sum: calculateSum(numbers),
        oddEven: calculateOddEven(numbers),
      },
    });
  }

  return {
    hexagram,
    yinYangRatio: '음(陰) 3 : 양(陽) 3 (태극 균형)',
    fiveElementScore: 96,
    games,
  };
}
