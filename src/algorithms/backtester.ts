import type { BacktestResult, HistoricalRound } from '../types/lotto';
import { HISTORICAL_ROUNDS } from '../data/winningHistory';


// 사용자가 뽑은 6개 번호의 과거 역대 당첨 백테스팅
export function runBacktest(userNumbers: number[], rounds: HistoricalRound[] = HISTORICAL_ROUNDS): BacktestResult {
  let rank1 = 0;
  let rank2 = 0;
  let rank3 = 0;
  let rank4 = 0;
  let rank5 = 0;
  let totalWon = 0;

  let bestRound: BacktestResult['bestRound'] = undefined;
  let highestPrize = 0;

  const userSet = new Set(userNumbers);

  rounds.forEach((round) => {
    let matchedCount = 0;
    round.numbers.forEach((num) => {
      if (userSet.has(num)) matchedCount++;
    });

    const hasBonus = userSet.has(round.bonus);
    let roundPrize = 0;
    let rank = 0;

    if (matchedCount === 6) {
      rank = 1;
      roundPrize = round.firstPrize || 2000000000;
      rank1++;
    } else if (matchedCount === 5 && hasBonus) {
      rank = 2;
      roundPrize = 50000000; // 평균 5천만원
      rank2++;
    } else if (matchedCount === 5) {
      rank = 3;
      roundPrize = 1500000; // 150만원
      rank3++;
    } else if (matchedCount === 4) {
      rank = 4;
      roundPrize = 50000; // 5만원
      rank4++;
    } else if (matchedCount === 3) {
      rank = 5;
      roundPrize = 5000; // 5천원
      rank5++;
    }

    if (roundPrize > 0) {
      totalWon += roundPrize;
      if (roundPrize > highestPrize) {
        highestPrize = roundPrize;
        bestRound = {
          round: round.round,
          date: round.date,
          matchedCount,
          hasBonus,
          rank,
          prize: roundPrize,
        };
      }
    }
  });

  const totalSpent = rounds.length * 1000; // 회차당 1,000원 구매 가정
  const roi = totalSpent > 0 ? ((totalWon - totalSpent) / totalSpent) * 100 : 0;

  return {
    totalRoundsTested: rounds.length,
    rank1,
    rank2,
    rank3,
    rank4,
    rank5,
    totalSpent,
    totalWon,
    roi: Math.round(roi * 100) / 100,
    bestRound,
  };
}

// 몬테카를로 1등 시뮬레이션 (최대 100,000회 가상 추첨 시뮬레이션)
export function runMonteCarlo(targetNumbers: number[], maxTrials: number = 100000): {
  trialsRun: number;
  hitRank1: boolean;
  bestRank: number;
  rankCounts: Record<number, number>;
} {
  const targetSet = new Set(targetNumbers);
  const rankCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 0: 0 };
  let bestRank = 99;

  for (let i = 1; i <= maxTrials; i++) {
    // 1~45 무작위 6개 + 보너스 1개 생성
    const picked = new Set<number>();
    while (picked.size < 7) {
      picked.add(Math.floor(Math.random() * 45) + 1);
    }
    const pickedArray = Array.from(picked);
    const winning6 = pickedArray.slice(0, 6);
    const bonus = pickedArray[6];

    let match = 0;
    winning6.forEach((n) => {
      if (targetSet.has(n)) match++;
    });

    const hasBonus = targetSet.has(bonus);

    let rank = 0;
    if (match === 6) rank = 1;
    else if (match === 5 && hasBonus) rank = 2;
    else if (match === 5) rank = 3;
    else if (match === 4) rank = 4;
    else if (match === 3) rank = 5;

    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    if (rank > 0 && rank < bestRank) {
      bestRank = rank;
    }

    if (rank === 1) {
      return {
        trialsRun: i,
        hitRank1: true,
        bestRank: 1,
        rankCounts,
      };
    }
  }

  return {
    trialsRun: maxTrials,
    hitRank1: false,
    bestRank: bestRank === 99 ? 0 : bestRank,
    rankCounts,
  };
}
