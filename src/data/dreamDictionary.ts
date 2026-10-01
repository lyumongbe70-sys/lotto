import type { DreamInterpretation } from '../types/lotto';


// 한국 전통 민속 및 복권 당첨자들의 실제 꿈 사례 기반 꿈해몽 상징 사전
export const DREAM_DATABASE: DreamInterpretation[] = [
  {
    keyword: '돼지',
    symbols: ['황금돼지', '새끼돼지', '돼지떼', '흑돼지', '집으로 들어오는 돼지'],
    recommendedNumbers: [3, 8, 12, 17, 26, 38],
    fortuneMeaning: '재물과 횡재수를 상징하는 최고의 길몽. 큰 금전이 뜻밖의 통로로 쏟아져 들어옴을 예고합니다.'
  },
  {
    keyword: '용',
    symbols: ['청룡', '황룡', '하늘로 승천하는 용', '여의주', '용이 바다에서 솟구침'],
    recommendedNumbers: [7, 10, 19, 21, 33, 44],
    fortuneMeaning: '대권과 명예, 일생일대의 대운을 상징하는 황제몽. 최고의 영예와 큰 재물이 성취될 징조입니다.'
  },
  {
    keyword: '조상',
    symbols: ['돌아가신 할아버지', '할머니', '부모님', '조상님이 돈을 쥐어줌', '웃으시는 조상님'],
    recommendedNumbers: [1, 9, 14, 25, 36, 42],
    fortuneMeaning: '로또 1등 당첨자의 단골 꿈! 조상님이 은덕을 베풀어 후손에게 일생일대의 행운의 번호를 암시합니다.'
  },
  {
    keyword: '불',
    symbols: ['온 세상이 불바다', '화재 진압', '산불', '공장이 활활 타는 꿈', '불꽃놀이'],
    recommendedNumbers: [2, 11, 23, 27, 34, 45],
    fortuneMeaning: '불길처럼 활활 타오르는 폭발적인 재물 번창. 정체되었던 막힘이 순식간에 뚫리는 격정의 대운입니다.'
  },
  {
    keyword: '똥',
    symbols: ['똥통에 빠짐', '황금 똥', '똥을 온몸에 뒤집어씀', '길가에 가득 찬 대변'],
    recommendedNumbers: [4, 15, 18, 22, 31, 40],
    fortuneMeaning: '온몸으로 재물을 뒤집어쓰는 극상의 횡재몽. 현실에서 뜻밖의 일확천금을 거머쥘 대길몽입니다.'
  },
  {
    keyword: '뱀',
    symbols: ['백사', '구렁이', '거대한 뱀이 몸을 감쌈', '뱀이 용으로 변함'],
    recommendedNumbers: [5, 13, 20, 29, 35, 41],
    fortuneMeaning: '영물과의 만남으로 지혜와 거대한 부를 쟁취함을 뜻합니다. 숨겨진 잭팟의 기운이 솟아납니다.'
  },
  {
    keyword: '돈',
    symbols: ['지폐 다발', '금괴', '돈벼락', '가방에 가득 찬 만원권', '은행 금고'],
    recommendedNumbers: [6, 16, 24, 30, 37, 43],
    fortuneMeaning: '재화의 기운이 직접적으로 심상에 투영된 꿈. 금전적 결실이 즉시 실체화되는 강렬한 운세입니다.'
  },
  {
    keyword: '물',
    symbols: ['맑은 폭포', '집에 맑은 물이 넘침', '바다 수영', '홍수', '강물이 거세게 흐름'],
    recommendedNumbers: [8, 14, 21, 28, 39, 44],
    fortuneMeaning: '끝없이 밀려드는 재화와 번영의 파도. 막대한 유동성과 재복이 샘솟듯 찾아옵니다.'
  },
  {
    keyword: '대통령',
    symbols: ['대통령과 악수', 'VIP 영접', '훈장 수여', '국가원수와 식사'],
    recommendedNumbers: [1, 7, 18, 26, 35, 42],
    fortuneMeaning: '사회적 지위의 급상승과 권위 있는 행운. 귀인의 도움으로 큰 부를 축적할 명품 길몽입니다.'
  },
  {
    keyword: '물고기',
    symbols: ['잉어', '황금 붕어', '거대한 고래', '그물에 가득 잡힌 물고기'],
    recommendedNumbers: [3, 11, 20, 27, 33, 41],
    fortuneMeaning: '다산과 풍요의 상징. 노력 이상의 막대한 잉여 재물과 결실이 수확될 징조입니다.'
  },
  {
    keyword: '보석',
    symbols: ['다이아몬드', '루비', '반짝이는 금반지', '에메랄드', '보물 상자'],
    recommendedNumbers: [9, 17, 23, 32, 38, 45],
    fortuneMeaning: '영원히 빛나는 고귀한 보물이 내 손에 쥐어지는 영광. 인생 역전의 황금빛 계기가 마련됩니다.'
  }
];

// 키워드 검색 또는 유사도 매칭
export function searchDream(query: string): DreamInterpretation {
  const clean = query.trim().toLowerCase();
  
  // 정확한 키워드 매칭
  const directMatch = DREAM_DATABASE.find((item) => 
    clean.includes(item.keyword) || item.symbols.some((s) => clean.includes(s))
  );
  if (directMatch) return directMatch;

  // 매칭되지 않을 경우 해시 기반으로 고유 행운 번호와 해몽 생성
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // 1~45 중 6개 고유 숫자 추출
  const numbersSet = new Set<number>();
  let seed = positiveHash || 42;
  while (numbersSet.size < 6) {
    seed = (seed * 9301 + 49297) % 233280;
    const num = (Math.abs(seed) % 45) + 1;
    numbersSet.add(num);
  }

  const generatedNumbers = Array.from(numbersSet).sort((a, b) => a - b);

  return {
    keyword: query || '신비로운 예지몽',
    symbols: [query, '무의식의 영감', '천기누설의 계시'],
    recommendedNumbers: generatedNumbers,
    fortuneMeaning: `입력하신 꿈 [${query}] 속에 담긴 무의식의 직관과 우주의 영적 에너지가 결합되어, 이번 회차에 강력한 공명 주파수를 형성하는 6개의 황금 번호가 추출되었습니다.`
  };
}
