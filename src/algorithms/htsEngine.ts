import type { CandleData, HtsTimeframe } from '../types/lotto';
import { HISTORICAL_ROUNDS } from '../data/winningHistory';
import { calculateSum } from './statisticalEngine';

export interface ColdHotItem {
  number: number;
  status: 'HOT' | 'COLD' | 'NEUTRAL';
  recentCount: number;  // 최근 15회차 중 출현 횟수
  overdueWeeks: number; // 마지막 출현 이후 경과 주수
  totalCount: number;
  momentumPercent: number; // 상승/하강 모멘텀 (%)
}

// 1~45 냉열수 (冷热数) 매트릭스 계산기 (주식 호가창 및 히트맵)
export function calculateColdHotMatrix(): ColdHotItem[] {
  const items: ColdHotItem[] = [];

  for (let n = 1; n <= 45; n++) {
    // 1. 최근 15회차 출현 횟수
    const recent15 = HISTORICAL_ROUNDS.slice(0, 15);
    const recentCount = recent15.filter((r) => r.numbers.includes(n)).length;

    // 2. 미출현 주수 (Overdue)
    let overdue = 0;
    for (let i = 0; i < HISTORICAL_ROUNDS.length; i++) {
      if (HISTORICAL_ROUNDS[i].numbers.includes(n)) {
        overdue = i;
        break;
      }
    }

    // 3. 총 누적 출현
    const totalCount = HISTORICAL_ROUNDS.filter((r) => r.numbers.includes(n)).length;

    // 모멘텀 비율 계산
    const expected = (15 * 6) / 45; // 평균 2.0회
    const momentumPercent = Math.round(((recentCount - expected) / expected) * 100);

    let status: 'HOT' | 'COLD' | 'NEUTRAL' = 'NEUTRAL';
    if (recentCount >= 3 || momentumPercent >= 40) {
      status = 'HOT'; // 과열 / 상승 모멘텀 (빨강 红)
    } else if (overdue >= 5 || recentCount <= 0) {
      status = 'COLD'; // 침체 / 반등 임박 (파랑 蓝)
    }

    items.push({
      number: n,
      status,
      recentCount,
      overdueWeeks: overdue,
      totalCount,
      momentumPercent,
    });
  }

  return items;
}

// HTS 캔들스틱 및 이동평균선(MA5, MA20, MA60) 데이터 생성기
export function generateHtsCandles(timeframe: HtsTimeframe): CandleData[] {
  // 회차 데이터는 최신순이므로 역순(오래된 순 -> 최신순)으로 정렬하여 시계열 구성
  const chronological = [...HISTORICAL_ROUNDS].reverse();
  const rawCandles: CandleData[] = [];

  if (timeframe === 'W') {
    // 주봉: 1회차 = 1캔들
    chronological.forEach((round, idx) => {
      const sum = calculateSum(round.numbers);
      const prevClose = idx > 0 ? calculateSum(chronological[idx - 1].numbers) : sum - 5;
      const high = Math.max(sum, prevClose) + (round.numbers[5] - round.numbers[0]);
      const low = Math.min(sum, prevClose) - Math.floor(round.numbers[0] / 2);

      rawCandles.push({
        time: `${round.round}회 (${round.date.slice(5)})`,
        open: prevClose,
        high,
        low,
        close: sum,
        volume: Math.round((round.firstPrize || 2000000000) / 100000000), // 억 원 단위
      });
    });
  } else if (timeframe === 'M') {
    // 월봉: 4회차씩 묶어서 1캔들
    for (let i = 0; i < chronological.length; i += 4) {
      const chunk = chronological.slice(i, i + 4);
      if (chunk.length === 0) continue;

      const sums = chunk.map((c) => calculateSum(c.numbers));
      const open = sums[0];
      const close = sums[sums.length - 1];
      const high = Math.max(...sums) + 12;
      const low = Math.min(...sums) - 8;
      const volume = chunk.reduce((acc, c) => acc + Math.round((c.firstPrize || 2000000000) / 100000000), 0);

      rawCandles.push({
        time: `${chunk[0].date.slice(0, 7)}`,
        open,
        high,
        low,
        close,
        volume,
      });
    }
  } else {
    // 연봉: 연도별 묶음
    const yearMap = new Map<string, typeof HISTORICAL_ROUNDS>();
    chronological.forEach((round) => {
      const year = round.date.slice(0, 4);
      if (!yearMap.has(year)) yearMap.set(year, []);
      yearMap.get(year)!.push(round);
    });

    yearMap.forEach((rounds, year) => {
      const sums = rounds.map((c) => calculateSum(c.numbers));
      const open = sums[0];
      const close = sums[sums.length - 1];
      const high = Math.max(...sums) + 20;
      const low = Math.min(...sums) - 15;
      const volume = rounds.reduce((acc, c) => acc + Math.round((c.firstPrize || 2000000000) / 100000000), 0);

      rawCandles.push({
        time: `${year}년`,
        open,
        high,
        low,
        close,
        volume,
      });
    });
  }

  // 이동평균선(MA5, MA20, MA60) 및 볼린저 밴드 계산
  for (let i = 0; i < rawCandles.length; i++) {
    // MA5
    if (i >= 4) {
      const slice5 = rawCandles.slice(i - 4, i + 1);
      rawCandles[i].ma5 = Math.round(slice5.reduce((sum, c) => sum + c.close, 0) / 5);
    }
    // MA20
    if (i >= 19) {
      const slice20 = rawCandles.slice(i - 19, i + 1);
      const mean20 = slice20.reduce((sum, c) => sum + c.close, 0) / 20;
      rawCandles[i].ma20 = Math.round(mean20);

      // 표준편차 & 볼린저 밴드
      const variance = slice20.reduce((sum, c) => sum + Math.pow(c.close - mean20, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      rawCandles[i].upperBand = Math.round(mean20 + stdDev * 2);
      rawCandles[i].lowerBand = Math.round(mean20 - stdDev * 2);
    }
    // MA60
    if (i >= 59) {
      const slice60 = rawCandles.slice(i - 59, i + 1);
      rawCandles[i].ma60 = Math.round(slice60.reduce((sum, c) => sum + c.close, 0) / 60);
    }

    // 보조지표: 재백 모멘텀 지수 (Oscillator: -50 ~ +50)
    const base = rawCandles[i].ma5 || rawCandles[i].close;
    rawCandles[i].indicatorValue = Math.round((rawCandles[i].close - base) * 1.8);
  }

  return rawCandles;
}
