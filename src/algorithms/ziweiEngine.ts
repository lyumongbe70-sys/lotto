import type { ZiWeiResult, ZiWeiPalace, LottoGame } from '../types/lotto';
import { calculateSum, calculateOddEven } from './statisticalEngine';

// 자미두수 12궁 명칭
const PALACE_NAMES = [
  '명궁(命宫)',
  '형제궁(兄弟宫)',
  '부처궁(夫妻宫)',
  '자녀궁(子女宫)',
  '재백궁(财帛宫)',
  '질액궁(疾厄宫)',
  '천이궁(迁移宫)',
  '노복궁(奴仆宫)',
  '관록궁(官禄宫)',
  '전택궁(田宅宫)',
  '복덕궁(福德宫)',
  '부모궁(父母宫)',
];

const EARTHLY_BRANCHES = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];

const MAJOR_STARS = [
  ['자미(紫微)', '천부(天府)'],
  ['무곡(武曲)', '칠살(七杀)'],
  ['태양(太阳)', '거문(巨门)'],
  ['천기(天机)', '태음(太阴)'],
  ['탐랑(贪狼)', '화록(化禄)'], // 횡재성
  ['천동(天同)', '천량(天梁)'],
  ['염정(廉贞)', '파군(破军)'],
  ['천상(天相)', '록존(禄存)'],
];

const WEALTH_DIRECTIONS = [
  '동남(东南)방 (목화통명(木火通明)의 대길 방위, 집 기준 동남쪽 복권방 추천)',
  '서북(西北)방 (건천(乾天)의 황금 기운이 서린 방위, 대로변 번화가 매장 추천)',
  '정남(正南)방 (화생토(火生土)의 강렬한 횡재수, 양지바른 출입문 매장 추천)',
  '동북(东北)방 (간토(艮土)의 산택통기, 언덕이나 고지대 인근 복권방 추천)',
  '서남(西南)방 (곤모(坤母)의 대지 포용 기운, 대형 마트 인근 복권방 추천)',
  '정동(正东)방 (진목(震木)의 우레와 번개, 첫 번째 진열대 매장 추천)',
];

const GOLDEN_HOURS = [
  '진시 (辰时 07:00 ~ 09:00 - 용이 여의주를 물고 승천하는 시간)',
  '사시 (巳时 09:00 ~ 11:00 - 태양이 천중을 향해 뻗어가는 상승 시간)',
  '신시 (申时 15:00 ~ 17:00 - 금기운(金)이 성숙하여 결실을 맺는 시간)',
  '유시 (酉时 17:00 ~ 19:00 - 황금이 금고에 봉인되는 수확의 시간)',
  '자시 (子时 23:00 ~ 01:00 - 음양이 교차하며 새로운 천운이 태동하는 시간)',
];

// 자미두수 명반 및 재백궁 정밀 해석 계산기
export function calculateZiWeiFortune(birthDate: string, birthHour: string = '12:00', isLunar: boolean = false): ZiWeiResult {
  const parts = birthDate.split('-').map(Number);
  const year = parts[0] || 1990;
  const month = parts[1] || 1;
  const day = parts[2] || 1;
  const hourNum = parseInt(birthHour.split(':')[0] || '12', 10);

  // 음양오행 및 생년월일 해시 시드
  const seed = (year * 365 + month * 31 + day * 7 + hourNum * 13) ^ (isLunar ? 0xbeef : 0xcafe);
  const absSeed = Math.abs(seed);

  // 12궁 배치
  const palaces: ZiWeiPalace[] = [];
  let wealthPalaceIndex = 4; // 기본 재백궁 위치

  for (let i = 0; i < 12; i++) {
    const palaceName = PALACE_NAMES[i];
    const branch = EARTHLY_BRANCHES[(i + absSeed) % 12];
    const starPair = MAJOR_STARS[(i + Math.floor(absSeed / 3)) % MAJOR_STARS.length];
    const isWealth = palaceName.includes('재백궁');

    let transformation: ZiWeiPalace['transformation'] = undefined;
    if (i === 4 || i === 0) {
      const transList: ('화록(化禄)' | '화권(化权)' | '화과(化科)' | '화기(化忌)')[ ] = ['화록(化禄)', '화권(化权)', '화과(化科)'];
      transformation = transList[absSeed % transList.length];
    }

    if (isWealth) {
      wealthPalaceIndex = i;
    }

    palaces.push({
      name: palaceName,
      branch,
      majorStars: starPair,
      minorStars: ['좌보(左辅)', '우필(右弼)', '천괴(天魁)'],
      transformation,
      isWealthPalace: isWealth,
    });
  }

  const wealthPalace = palaces[wealthPalaceIndex] || palaces[4];

  // 대재(大财)와 소재(小财) 지수 산출 (80~99 사이의 강력한 신비 지수)
  const bigWealthScore = 85 + (absSeed % 14); // 85 ~ 98점
  const smallWealthScore = 78 + ((absSeed * 3) % 20); // 78 ~ 97점

  // 재위(방위) 및 황금 시간대
  const wealthDirection = WEALTH_DIRECTIONS[absSeed % WEALTH_DIRECTIONS.length];
  const goldenHour = GOLDEN_HOURS[(absSeed + month) % GOLDEN_HOURS.length];

  // 신비주의 천기누설 총평 (神乎其神)
  const mainStar1 = wealthPalace.majorStars[0] || '무곡(武曲)';
  const mainStar2 = wealthPalace.majorStars[1] || '탐랑(贪狼)';
  const transName = wealthPalace.transformation || '화록(化禄)';

  const masterStarsSummary = `귀하의 재백궁(财帛宫)에는 재물의 총사령관인 [${mainStar1}]과 횡재수를 관장하는 [${mainStar2}]이 동궁(同宫)하고 있으며, 여기에 [${transName}]의 천운이 가탁되어 있습니다.`;

  const prophecyText = `
천기누설(天机泄露): 귀하의 자미두수 명반상 재백궁(财帛宫)은 현재 10년 대운과 올해 유년(流年)의 기운이 맞물려 [무곡탐랑격(武曲贪狼格)]의 거대한 횡재운이 폭발하는 임계점에 도달해 있습니다.
${wealthPalace.branch}방(方)에 자리 잡은 재백궁으로 천을귀인(天乙贵人)과 록존(禄存)의 서광이 비추고 있어, 이번 회차는 소소한 당첨을 넘어 인생의 궤도를 바꿀 만한 강력한 대재(大财)의 기운이 요동치고 있습니다.
반드시 [${wealthDirection}]에 위치한 매장에서, [${goldenHour}]에 맞춰 경건한 마음으로 번호를 수령하십시오.
  `.trim();

  // 자미두수 황금 6개 번호 추출 (해시 기반 고유 수열)
  const luckyNumbersSet = new Set<number>();
  let numSeed = absSeed;
  while (luckyNumbersSet.size < 6) {
    numSeed = (numSeed * 1103515245 + 12345) & 0x7fffffff;
    const n = (numSeed % 45) + 1;
    luckyNumbersSet.add(n);
  }
  const luckyNumbers = Array.from(luckyNumbersSet).sort((a, b) => a - b);

  // 5게임 풀 세트 생성
  const now = new Date().toISOString();
  const games: LottoGame[] = [];
  for (let g = 0; g < 5; g++) {
    const gameSet = new Set<number>();
    // 자미 대표 행운수 2개 이상 보장
    gameSet.add(luckyNumbers[g % luckyNumbers.length]);
    gameSet.add(luckyNumbers[(g + 2) % luckyNumbers.length]);

    let subSeed = absSeed + g * 997;
    while (gameSet.size < 6) {
      subSeed = (subSeed * 9301 + 49297) % 233280;
      const val = (Math.abs(subSeed) % 45) + 1;
      gameSet.add(val);
    }

    const sorted = Array.from(gameSet).sort((a, b) => a - b);
    games.push({
      id: `ziwei-${Date.now()}-${g}`,
      numbers: sorted,
      createdAt: now,
      mode: 'ziwei',
      meta: {
        ziweiStar: `${mainStar1} 财帛`,
        sum: calculateSum(sorted),
        oddEven: calculateOddEven(sorted),
      },
    });
  }

  return {
    palaces,
    wealthPalace,
    bigWealthScore,
    smallWealthScore,
    wealthDirection,
    goldenHour,
    masterStarsSummary,
    prophecyText,
    luckyNumbers,
    games,
  };
}
