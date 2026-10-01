import type { TarotCard, TarotSpreadResult, LottoGame } from '../types/lotto';
import { calculateSum, calculateOddEven } from './statisticalEngine';

export const MAJOR_TAROT_CARDS: TarotCard[] = [
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameKo: '운명의 수레바퀴',
    nameZh: '命运之轮',
    arcana: 'Major',
    imageSymbol: '🎡',
    keywords: ['인생역전', '필연적 행운', '운명의 순환', '잭팟'],
    wealthMeaning: '하늘의 거대한 섭리가 당신의 편으로 회전했습니다. 상상치 못한 횡재가 쏟아지는 최고의 복권 카드입니다.',
    luckyNumbers: [7, 10, 21, 28, 35, 42],
  },
  {
    id: 19,
    name: 'The Sun',
    nameKo: '태양',
    nameZh: '太阳',
    arcana: 'Major',
    imageSymbol: '☀️',
    keywords: ['황금빛 번영', '성공', '명쾌한 결실', '대길'],
    wealthMeaning: '먹구름이 완전히 걷히고 황금빛 햇살이 쏟아집니다. 의심 없는 거액의 당첨 에너지가 충만합니다.',
    luckyNumbers: [1, 9, 19, 27, 33, 44],
  },
  {
    id: 4,
    name: 'The Emperor',
    nameKo: '황제',
    nameZh: '皇帝',
    arcana: 'Major',
    imageSymbol: '👑',
    keywords: ['지존의 권위', '막대한 재정', '흔들리지 않는 부', '지배력'],
    wealthMeaning: '황금 보좌에 앉아 막대한 왕국의 금고를 호령하는 격. 1등 당첨자의 당당한 위엄이 깃듭니다.',
    luckyNumbers: [4, 14, 22, 31, 38, 45],
  },
  {
    id: 1,
    name: 'The Magician',
    nameKo: '마법사',
    nameZh: '魔术师',
    arcana: 'Major',
    imageSymbol: '🪄',
    keywords: ['무에서 유 창조', '천재적 직관', '무한한 가능성', '신통력'],
    wealthMeaning: '4대 원소를 자유자재로 다루며 불가능을 가능으로 바꾸는 손길. 꿈꾸던 번호가 현실로 구현됩니다.',
    luckyNumbers: [3, 8, 15, 24, 32, 40],
  },
  {
    id: 3,
    name: 'The Empress',
    nameKo: '여황제',
    nameZh: '皇后',
    arcana: 'Major',
    imageSymbol: '👸',
    keywords: ['풍요와 결실', '모태의 번영', '재물의 비옥함', '수확'],
    wealthMeaning: '씨앗 하나가 황금 이삭 수만 개로 자라나는 대지의 축복. 소액의 투자가 거대한 결실로 돌아옵니다.',
    luckyNumbers: [5, 12, 20, 26, 36, 43],
  },
  {
    id: 17,
    name: 'The Star',
    nameKo: '별',
    nameZh: '星星',
    arcana: 'Major',
    imageSymbol: '⭐',
    keywords: ['희망의 서광', '영감의 계시', '치유와 번영', '기적'],
    wealthMeaning: '칠흑 같은 어둠 속에서 오직 당신만을 비추는 북극성. 계시처럼 뇌리에 스치는 번호가 잭팟을 만듭니다.',
    luckyNumbers: [2, 11, 17, 25, 34, 41],
  },
  {
    id: 21,
    name: 'The World',
    nameKo: '세계',
    nameZh: '世界',
    arcana: 'Major',
    imageSymbol: '🌍',
    keywords: ['완전한 성취', '원대한 성공', '새로운 지평', '대단원'],
    wealthMeaning: '모든 주기와 여정이 완벽한 승리로 귀결되는 대통합의 카드. 일생일대의 재정적 자유를 암시합니다.',
    luckyNumbers: [6, 13, 18, 29, 37, 45],
  },
];

// 타로 3카드 스프레드(과거, 현재, 미래) 생성
export function drawTarotSpread(): TarotSpreadResult {
  const shuffled = [...MAJOR_TAROT_CARDS].sort(() => Math.random() - 0.5);
  const pastCard = shuffled[0];
  const presentCard = shuffled[1];
  const futureCard = shuffled[2];

  // 3장의 카드에서 고유 6개 번호 조합 도출
  const combinedSet = new Set<number>();
  combinedSet.add(pastCard.luckyNumbers[0]);
  combinedSet.add(pastCard.luckyNumbers[1]);
  combinedSet.add(presentCard.luckyNumbers[0]);
  combinedSet.add(presentCard.luckyNumbers[1]);
  combinedSet.add(futureCard.luckyNumbers[0]);
  combinedSet.add(futureCard.luckyNumbers[1]);

  while (combinedSet.size < 6) {
    combinedSet.add(Math.floor(Math.random() * 45) + 1);
  }

  const finalNumbers = Array.from(combinedSet).sort((a, b) => a - b);

  const overallFortune = `
과거의 [${pastCard.nameKo}] 카드가 쌓아 올린 끈기 있는 복덕이, 현재 [${presentCard.nameKo}]의 파동을 만나 폭발적인 횡재의 불꽃을 당겼습니다.
다가올 미래에는 [${futureCard.nameKo}] 카드의 찬란한 결실이 예고되어 있으니, 이 3대 아르카나가 공명하는 6개의 황금 상징수를 주목하십시오.
  `.trim();

  return {
    pastCard,
    presentCard,
    futureCard,
    overallFortune,
    finalNumbers,
  };
}

// 타로 5게임 티켓 세트 생성
export function generateTarotGames(spread: TarotSpreadResult): LottoGame[] {
  const now = new Date().toISOString();
  const games: LottoGame[] = [];

  for (let i = 0; i < 5; i++) {
    const set = new Set<number>();
    // 타로 대표 번호 우선 배치
    set.add(spread.finalNumbers[i % spread.finalNumbers.length]);
    set.add(spread.finalNumbers[(i + 3) % spread.finalNumbers.length]);

    while (set.size < 6) {
      set.add(Math.floor(Math.random() * 45) + 1);
    }

    const numbers = Array.from(set).sort((a, b) => a - b);
    games.push({
      id: `tarot-${Date.now()}-${i}`,
      numbers,
      createdAt: now,
      mode: 'tarot',
      meta: {
        tarotCard: `${spread.presentCard.nameKo}`,
        sum: calculateSum(numbers),
        oddEven: calculateOddEven(numbers),
      },
    });
  }

  return games;
}
