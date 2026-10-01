// Lotto Royal VIP Types

export interface LottoGame {
  id: string;
  numbers: number[]; // sorted 6 numbers (1~45)
  bonus?: number;
  createdAt: string;
  mode: 'vip-stats' | 'fortune' | 'dream' | 'custom' | 'fast';
  meta?: {
    sajuElement?: string;
    dreamKeyword?: string;
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
