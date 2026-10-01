// Lotto Royal VIP 2.0 Types

export interface LottoGame {
  id: string;
  numbers: number[]; // sorted 6 numbers (1~45)
  bonus?: number;
  createdAt: string;
  mode: 'vip-stats' | 'fortune' | 'dream' | 'custom' | 'fast' | 'ziwei' | 'bagua' | 'tarot' | 'hts';
  meta?: {
    sajuElement?: string;
    dreamKeyword?: string;
    ziweiStar?: string;
    baguaName?: string;
    tarotCard?: string;
    sum?: number;
    oddEven?: string;
    hotColdScore?: number;
  };
}

export interface HistoricalRound {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  firstPrize: number; // in KRW
  firstWinners: number;
}

export interface FilterSettings {
  fixedNumbers: number[];    // must include (max 5)
  excludedNumbers: number[]; // must exclude (max 39)
  minSum: number;            // default 100
  maxSum: number;            // default 175
  oddEvenRatio: 'all' | '3:3' | '2:4' | '4:2' | '1:5' | '5:1';
  highLowRatio: 'all' | '3:3' | '2:4' | '4:2'; // low: 1~22, high: 23~45
  preventConsecutive3: boolean; // avoid 3 consecutive numbers like 14, 15, 16
  preferHotNumbers: boolean;    // weight numbers that appeared frequently in last 10 rounds
  preferColdNumbers: boolean;   // weight overdue numbers
}

export interface SajuFortuneInput {
  birthDate: string; // YYYY-MM-DD
  birthHour?: string;
  isLunar: boolean;
  name?: string;
  gender: 'male' | 'female';
}

export interface DreamInterpretation {
  keyword: string;
  symbols: string[];
  recommendedNumbers: number[];
  fortuneMeaning: string;
}

export interface BacktestResult {
  totalRoundsTested: number;
  rank1: number;
  rank2: number;
  rank3: number;
  rank4: number;
  rank5: number;
  totalSpent: number; // KRW
  totalWon: number;   // KRW
  roi: number;        // percentage
  bestRound?: {
    round: number;
    date: string;
    matchedCount: number;
    hasBonus: boolean;
    rank: number;
    prize: number;
  };
}

// ========== 자미두수 (紫微斗数) 관련 타입 ==========
export interface ZiWeiPalace {
  name: string;        // 명궁(命宫), 재백궁(财帛宫), 관록궁(官禄宫) 등
  branch: string;      // 자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해
  majorStars: string[];// 자미, 천부, 무곡, 태음, 탐랑 등
  minorStars: string[];// 록존, 문창, 천괴 등
  transformation?: '화록(化禄)' | '화권(化权)' | '화과(化科)' | '화기(化忌)';
  isWealthPalace: boolean; // 재백궁 여부
}

export interface ZiWeiResult {
  palaces: ZiWeiPalace[];
  wealthPalace: ZiWeiPalace;
  bigWealthScore: number;   // 대재(大财) 지수: 0~100 (1등 잭팟 대운)
  smallWealthScore: number; // 소재(小财) 지수: 0~100 (실전 당첨운)
  wealthDirection: string;  // 재위(财位): 예: '동남(东南)방', '정북(正北)방'
  goldenHour: string;       // 황금 구매 시간: 예: '진시(辰时 07~09시)'
  masterStarsSummary: string; // 주성 해설
  prophecyText: string;     // 신비주의 천기누설 총평
  luckyNumbers: number[];   // 자미두수 6개 황금 번호
  games: LottoGame[];       // 5게임 풀 세트
}

// ========== 주역 오행팔괘 (五行八卦) 관련 타입 ==========
export interface BaGuaHexagram {
  id: number;
  name: string;        // 예: '화천대유(火天大有)'
  chineseName: string; // 火天大有
  upperTrigram: string;// 이(離, 火)
  lowerTrigram: string;// 건(乾, 天)
  meaning: string;     // 대유(大有): 천하의 재물이 한 몸에 모이는 지극한 길괘
  fortuneGrade: '대길(大吉)' | '중길(中吉)' | '소길(小吉)';
  recommendedNumbers: number[];
}

// ========== 타로 (塔罗牌) 관련 타입 ==========
export interface TarotCard {
  id: number;
  name: string;
  nameKo: string;
  nameZh: string;
  arcana: 'Major';
  imageSymbol: string;
  keywords: string[];
  wealthMeaning: string;
  luckyNumbers: number[];
}

export interface TarotSpreadResult {
  pastCard: TarotCard;
  presentCard: TarotCard;
  futureCard: TarotCard;
  overallFortune: string;
  finalNumbers: number[];
}

// ========== HTS 캔들 차트 관련 타입 ==========
export type HtsTimeframe = 'W' | 'M' | 'Y'; // 주봉, 월봉, 연봉

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5?: number;
  ma20?: number;
  ma60?: number;
  upperBand?: number;
  lowerBand?: number;
  indicatorValue?: number; // 재백 모멘텀 / RSI
}
