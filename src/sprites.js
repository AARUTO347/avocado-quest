export const PAL = {
  '.': null,
  k: '#33301c', // outline
  B: '#dbe37a', // body
  b: '#b9c94f', // body shade
  S: '#8a5a33', // seed
  s: '#6b4223', // seed dark
  e: '#33301c', // eye
  w: '#ffffff', // shine
  p: '#f2a0b4', // blush
  L: '#5aa332', // leaf
  l: '#7ec850', // leaf light
  P: '#f7b6c8', // petal
  y: '#ffe066', // yellow / gold
  Y: '#fff3b0'  // gold light
};

const BODY = [
  '.....kkkkkk.....',
  '....kBBBBBBk....',
  '...kBBBBBBBBk...',
  '...kBBBBBBBBk...',
  '..kBBweBBweBBk..',
  '..kBBeeBBeeBBk..',
  '.kBpBBkkBBBpBBk.',
  '.kBBBkSSSSkBBBk.',
  'kBBBkSSSSSSkBBBk',
  'kBBBkSSssSSkBBBk',
  'kBBBkSSssSSkBBBk',
  'kBBBkSSSSSSkBBBk',
  '.kBBBkSSSSkBBBk.',
  '..kBBBkkkkBBBk..',
  '...kkBBBBBBkk...',
  '....kkkkkkkk....'
];

export const STAGES = [
  {
    name: 'SEEDLING', minLv: 1,
    rows: [
      '.....ll.....',
      '....lLLl....',
      '.....kk.....',
      '....kkkk....',
      '...kBBBBk...',
      '..kBBBBBBk..',
      '..kweBewBk..',
      '..kBBBBBBk..',
      '...kSSSSk...',
      '...kSssSk...',
      '...kSSSSk...',
      '....kkkk....'
    ]
  },
  {
    name: 'SPROUT', minLv: 3,
    rows: [
      '.....l....l.....',
      '....lLl..lLl....',
      '....lLllllLl....',
      '.....llLLll.....',
      '......kLLk......',
      '.......kk.......',
      ...BODY
    ]
  },
  {
    name: 'BLOSSOM', minLv: 5,
    rows: [
      '.......PP.......',
      '......PyYP......',
      '.......PP.......',
      '.....l....l.....',
      '....lLl..lLl....',
      '....lLllllLl....',
      '.....llLLll.....',
      '......kLLk......',
      '.......kk.......',
      ...BODY
    ]
  },
  {
    name: 'ORCHARD', minLv: 8,
    rows: [
      '....PP....PP....',
      '...PyYP..PyYP...',
      '....PP....PP....',
      '....l......l....',
      '...lLl....lLl...',
      '...lLllllllLl...',
      '....llLLLLll....',
      '.....kLLLLk.....',
      '......kkkk......',
      ...BODY
    ]
  },
  {
    name: 'GOLDEN KING', minLv: 10,
    pal: { B: '#ffd75e', b: '#e0a93e', p: '#ff8fb1' },
    rows: [
      '......y.y.y.....',
      '......yyyyy.....',
      '......yYyYy.....',
      '.......kk.......',
      ...BODY
    ]
  }
];

export function stageFor(level) {
  let s = STAGES[0];
  for (const st of STAGES) if (level >= st.minLv) s = st;
  return s;
}
