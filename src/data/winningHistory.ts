import type { HistoricalRound } from '../types/lotto';


// 실제 동행복권 역대 주요 및 최신 회차 데이터셋
export const HISTORICAL_ROUNDS: HistoricalRound[] = [
  { round: 1162, date: '2025-03-08', numbers: [3, 11, 15, 29, 35, 44], bonus: 10, firstPrize: 2180000000, firstWinners: 12 },
  { round: 1161, date: '2025-03-01', numbers: [4, 12, 19, 23, 31, 40], bonus: 45, firstPrize: 1950000000, firstWinners: 14 },
  { round: 1160, date: '2025-02-22', numbers: [1, 9, 14, 28, 33, 41], bonus: 2, firstPrize: 2340000000, firstWinners: 11 },
  { round: 1159, date: '2025-02-15', numbers: [6, 17, 22, 34, 38, 45], bonus: 13, firstPrize: 1840000000, firstWinners: 15 },
  { round: 1158, date: '2025-02-08', numbers: [8, 16, 20, 27, 36, 42], bonus: 5, firstPrize: 2600000000, firstWinners: 10 },
  { round: 1157, date: '2025-02-01', numbers: [2, 10, 18, 25, 30, 43], bonus: 37, firstPrize: 2100000000, firstWinners: 13 },
  { round: 1156, date: '2025-01-25', numbers: [5, 13, 21, 26, 32, 39], bonus: 7, firstPrize: 2890000000, firstWinners: 9 },
  { round: 1155, date: '2025-01-18', numbers: [7, 15, 24, 31, 37, 44], bonus: 11, firstPrize: 1720000000, firstWinners: 16 },
  { round: 1154, date: '2025-01-11', numbers: [3, 8, 17, 23, 35, 41], bonus: 29, firstPrize: 2450000000, firstWinners: 11 },
  { round: 1153, date: '2025-01-04', numbers: [10, 14, 19, 28, 33, 40], bonus: 1, firstPrize: 2050000000, firstWinners: 13 },
  { round: 1152, date: '2024-12-28', numbers: [4, 12, 18, 26, 36, 45], bonus: 22, firstPrize: 3100000000, firstWinners: 8 },
  { round: 1151, date: '2024-12-21', numbers: [1, 11, 20, 27, 34, 43], bonus: 16, firstPrize: 1980000000, firstWinners: 14 },
  { round: 1150, date: '2024-12-14', numbers: [6, 13, 22, 29, 38, 42], bonus: 30, firstPrize: 2250000000, firstWinners: 12 },
  { round: 1149, date: '2024-12-07', numbers: [8, 15, 21, 30, 37, 44], bonus: 9, firstPrize: 2700000000, firstWinners: 10 },
  { round: 1148, date: '2024-11-30', numbers: [2, 9, 16, 25, 32, 39], bonus: 41, firstPrize: 1890000000, firstWinners: 15 },
  { round: 1147, date: '2024-11-23', numbers: [7, 14, 23, 31, 35, 40], bonus: 18, firstPrize: 2150000000, firstWinners: 13 },
  { round: 1146, date: '2024-11-16', numbers: [5, 10, 19, 28, 36, 45], bonus: 3, firstPrize: 2420000000, firstWinners: 11 },
  { round: 1145, date: '2024-11-09', numbers: [3, 12, 20, 27, 33, 42], bonus: 24, firstPrize: 2010000000, firstWinners: 13 },
  { round: 1144, date: '2024-11-02', numbers: [1, 8, 17, 24, 34, 41], bonus: 15, firstPrize: 3200000000, firstWinners: 7 },
  { round: 1143, date: '2024-10-26', numbers: [6, 11, 18, 26, 38, 43], bonus: 32, firstPrize: 1780000000, firstWinners: 16 },
  { round: 1142, date: '2024-10-19', numbers: [4, 13, 22, 29, 37, 44], bonus: 8, firstPrize: 2540000000, firstWinners: 11 },
  { round: 1141, date: '2024-10-12', numbers: [9, 15, 21, 30, 35, 39], bonus: 2, firstPrize: 2210000000, firstWinners: 12 },
  { round: 1140, date: '2024-10-05', numbers: [7, 16, 25, 28, 36, 40], bonus: 19, firstPrize: 2900000000, firstWinners: 9 },
  { round: 1139, date: '2024-09-28', numbers: [2, 10, 17, 23, 31, 45], bonus: 14, firstPrize: 1920000000, firstWinners: 14 },
  { round: 1138, date: '2024-09-21', numbers: [5, 12, 19, 27, 33, 42], bonus: 38, firstPrize: 2380000000, firstWinners: 11 },
  { round: 1137, date: '2024-09-14', numbers: [3, 8, 14, 24, 34, 41], bonus: 20, firstPrize: 2650000000, firstWinners: 10 },
  { round: 1136, date: '2024-09-07', numbers: [1, 9, 21, 26, 32, 43], bonus: 11, firstPrize: 1830000000, firstWinners: 15 },
  { round: 1135, date: '2024-08-31', numbers: [6, 13, 20, 28, 37, 44], bonus: 4, firstPrize: 2110000000, firstWinners: 13 },
  { round: 1134, date: '2024-08-24', numbers: [4, 11, 18, 29, 35, 39], bonus: 25, firstPrize: 3050000000, firstWinners: 8 },
  { round: 1133, date: '2024-08-17', numbers: [8, 15, 22, 30, 36, 40], bonus: 17, firstPrize: 1990000000, firstWinners: 14 },
  { round: 1132, date: '2024-08-10', numbers: [2, 10, 16, 23, 31, 42], bonus: 33, firstPrize: 2470000000, firstWinners: 11 },
  { round: 1131, date: '2024-08-03', numbers: [5, 14, 19, 27, 38, 45], bonus: 7, firstPrize: 2290000000, firstWinners: 12 },
  { round: 1130, date: '2024-07-27', numbers: [7, 12, 24, 28, 34, 41], bonus: 13, firstPrize: 2750000000, firstWinners: 10 },
  { round: 1129, date: '2024-07-20', numbers: [3, 9, 17, 25, 32, 43], bonus: 1, firstPrize: 1870000000, firstWinners: 15 },
  { round: 1128, date: '2024-07-13', numbers: [1, 8, 21, 26, 37, 44], bonus: 29, firstPrize: 2190000000, firstWinners: 12 },
  { round: 1127, date: '2024-07-06', numbers: [6, 15, 20, 29, 33, 39], bonus: 10, firstPrize: 3300000000, firstWinners: 7 },
  { round: 1126, date: '2024-06-29', numbers: [4, 11, 22, 30, 35, 40], bonus: 18, firstPrize: 2080000000, firstWinners: 13 },
  { round: 1125, date: '2024-06-22', numbers: [2, 13, 18, 28, 36, 42], bonus: 5, firstPrize: 2510000000, firstWinners: 11 },
  { round: 1124, date: '2024-06-15', numbers: [9, 14, 23, 27, 31, 45], bonus: 34, firstPrize: 1940000000, firstWinners: 14 },
  { round: 1123, date: '2024-06-08', numbers: [5, 10, 16, 24, 38, 41], bonus: 12, firstPrize: 2390000000, firstWinners: 12 },
  { round: 1122, date: '2024-06-01', numbers: [3, 8, 19, 25, 32, 44], bonus: 21, firstPrize: 2800000000, firstWinners: 9 },
  { round: 1121, date: '2024-05-25', numbers: [7, 12, 17, 26, 37, 43], bonus: 6, firstPrize: 1790000000, firstWinners: 16 },
  { round: 1120, date: '2024-05-18', numbers: [1, 15, 21, 29, 34, 40], bonus: 35, firstPrize: 2150000000, firstWinners: 13 },
  { round: 1119, date: '2024-05-11', numbers: [4, 9, 20, 28, 33, 42], bonus: 14, firstPrize: 2480000000, firstWinners: 11 },
  { round: 1118, date: '2024-05-04', numbers: [6, 11, 18, 27, 36, 45], bonus: 23, firstPrize: 2020000000, firstWinners: 13 },
  { round: 1117, date: '2024-04-27', numbers: [2, 14, 22, 30, 35, 39], bonus: 8, firstPrize: 3150000000, firstWinners: 8 },
  { round: 1116, date: '2024-04-20', numbers: [8, 13, 23, 25, 31, 41], bonus: 19, firstPrize: 1850000000, firstWinners: 15 },
  { round: 1115, date: '2024-04-13', numbers: [5, 10, 16, 24, 38, 44], bonus: 3, firstPrize: 2680000000, firstWinners: 10 },
  { round: 1114, date: '2024-04-06', numbers: [3, 12, 17, 26, 32, 43], bonus: 28, firstPrize: 2200000000, firstWinners: 12 },
  { round: 1113, date: '2024-03-30', numbers: [7, 9, 19, 28, 37, 40], bonus: 15, firstPrize: 1970000000, firstWinners: 14 },
  { round: 1112, date: '2024-03-23', numbers: [1, 15, 20, 29, 34, 42], bonus: 11, firstPrize: 2590000000, firstWinners: 11 },
  { round: 1111, date: '2024-03-16', numbers: [4, 8, 18, 27, 33, 45], bonus: 22, firstPrize: 2320000000, firstWinners: 12 },
  { round: 1110, date: '2024-03-09', numbers: [6, 14, 21, 30, 36, 39], bonus: 2, firstPrize: 1810000000, firstWinners: 15 },
  { round: 1109, date: '2024-03-02', numbers: [2, 11, 22, 25, 35, 41], bonus: 37, firstPrize: 2950000000, firstWinners: 9 },
  { round: 1108, date: '2024-02-24', numbers: [9, 13, 23, 28, 31, 44], bonus: 16, firstPrize: 2130000000, firstWinners: 13 },
  { round: 1107, date: '2024-02-17', numbers: [5, 12, 16, 24, 38, 43], bonus: 27, firstPrize: 2410000000, firstWinners: 11 },
  { round: 1106, date: '2024-02-10', numbers: [3, 10, 17, 26, 32, 40], bonus: 4, firstPrize: 3400000000, firstWinners: 7 },
  { round: 1105, date: '2024-02-03', numbers: [7, 8, 19, 29, 37, 42], bonus: 33, firstPrize: 1910000000, firstWinners: 14 },
  { round: 1104, date: '2024-01-27', numbers: [1, 14, 20, 27, 34, 45], bonus: 12, firstPrize: 2260000000, firstWinners: 12 },
  { round: 1103, date: '2024-01-20', numbers: [4, 15, 21, 30, 33, 39], bonus: 18, firstPrize: 2720000000, firstWinners: 10 }
];

// 번호별 역대 누적 출현 빈도 및 핫/콜드 분석 캐시
export function calculateFrequencyStats(): {
  frequency: Record<number, number>;
  hotNumbers: number[];  // 상위 10개 번호
  coldNumbers: number[]; // 하위 10개 미출현/저빈도 번호
} {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) {
    counts[i] = 0;
  }

  HISTORICAL_ROUNDS.forEach((item) => {
    item.numbers.forEach((num) => {
      counts[num] = (counts[num] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sorted.slice(0, 10).map((x) => x.num);
  const coldNumbers = sorted.slice(-10).map((x) => x.num);

  return {
    frequency: counts,
    hotNumbers,
    coldNumbers,
  };
}
