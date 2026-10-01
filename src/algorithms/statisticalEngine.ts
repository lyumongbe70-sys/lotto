import type { FilterSettings, LottoGame } from '../types/lotto';
import { calculateFrequencyStats } from '../data/winningHistory';


// 산술적 복잡도 (AC값, Arithmetic Complexity) 계산
export function calculateAC(numbers: number[]): number {
  if (numbers.length < 6) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const diffs = new Set<number>();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      diffs.add(Math.abs(sorted[j] - sorted[i]));
    }
  }
  return diffs.size - (numbers.length - 1);
}

// 3연속 이상 번호 존재 여부 확인 (예: 11, 12, 13)
export function hasConsecutive3(numbers: number[]): boolean {
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i + 1] === sorted[i] + 1 && sorted[i + 2] === sorted[i] + 2) {
      return true;
    }
  }
  return false;
}

// 번호별 총합 계산
export function calculateSum(numbers: number[]): number {
  return numbers.reduce((acc, cur) => acc + cur, 0);
}

// 홀짝 비율 계산 (예: "3:3", "4:2")
export function calculateOddEven(numbers: number[]): string {
  const oddCount = numbers.filter((n) => n % 2 !== 0).length;
  const evenCount = numbers.length - oddCount;
  return `${oddCount}:${evenCount}`;
}

// 고저 비율 계산 (1~22 저, 23~45 고)
export function calculateHighLow(numbers: number[]): string {
  const lowCount = numbers.filter((n) => n <= 22).length;
  const highCount = numbers.length - lowCount;
  return `${lowCount}:${highCount}`;
}

// VIP 정밀 가중치 및 필터 기반 번호 생성기
export function generateVipNumbers(settings: FilterSettings): number[] {
  const { hotNumbers, coldNumbers } = calculateFrequencyStats();
  const maxAttempts = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const selected = new Set<number>(settings.fixedNumbers);

    // 제외수 필터 풀 생성
    const excludedSet = new Set<number>(settings.excludedNumbers);
    const pool: number[] = [];

    for (let i = 1; i <= 45; i++) {
      if (excludedSet.has(i) || selected.has(i)) continue;

      // 가중치 적용
      let weight = 1;
      if (settings.preferHotNumbers && hotNumbers.includes(i)) {
        weight += 3;
      }
      if (settings.preferColdNumbers && coldNumbers.includes(i)) {
        weight += 3;
      }

      for (let w = 0; w < weight; w++) {
        pool.push(i);
      }
    }

    // 풀에서 6개가 될 때까지 무작위 추출
    while (selected.size < 6 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const picked = pool[randomIndex];
      selected.add(picked);
      // 추출된 번호는 풀에서 모두 제거
      for (let p = pool.length - 1; p >= 0; p--) {
        if (pool[p] === picked) {
          pool.splice(p, 1);
        }
      }
    }

    if (selected.size < 6) {
      // 만약 고정수/제외수 충돌로 풀이 고갈되면 임의의 번호로 채움
      for (let i = 1; i <= 45; i++) {
        if (!selected.has(i) && !excludedSet.has(i)) {
          selected.add(i);
          if (selected.size === 6) break;
        }
      }
    }

    const candidate = Array.from(selected).sort((a, b) => a - b);

    // 1. 총합 구간 검사
    const sum = calculateSum(candidate);
    if (sum < settings.minSum || sum > settings.maxSum) {
      continue;
    }

    // 2. 홀짝 비율 검사
    if (settings.oddEvenRatio !== 'all') {
      const oddEven = calculateOddEven(candidate);
      if (oddEven !== settings.oddEvenRatio) {
        continue;
      }
    }

    // 3. 고저 비율 검사
    if (settings.highLowRatio !== 'all') {
      const highLow = calculateHighLow(candidate);
      if (highLow !== settings.highLowRatio) {
        continue;
      }
    }

    // 4. 3연속 번호 방지 검사
    if (settings.preventConsecutive3 && hasConsecutive3(candidate)) {
      continue;
    }

    // 5. AC값 검사 (보통 7 이상 권장)
    const ac = calculateAC(candidate);
    if (ac < 6 && attempt < 1500) {
      continue;
    }

    return candidate;
  }

  // 필터가 너무 빡빡할 경우 기본 난수 반환
  const fallback = new Set<number>(settings.fixedNumbers);
  while (fallback.size < 6) {
    fallback.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(fallback).sort((a, b) => a - b);
}

// 5게임(1세트) 일괄 생성
export function generateVipGameSet(count: number = 5, settings: FilterSettings): LottoGame[] {
  const games: LottoGame[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < count; i++) {
    const numbers = generateVipNumbers(settings);
    const sum = calculateSum(numbers);
    const oddEven = calculateOddEven(numbers);
    const { hotNumbers } = calculateFrequencyStats();
    const hotCount = numbers.filter((n) => hotNumbers.includes(n)).length;

    games.push({
      id: `game-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      numbers,
      createdAt: now,
      mode: 'vip-stats',
      meta: {
        sum,
        oddEven,
        hotColdScore: hotCount,
      },
    });
  }

  return games;
}
