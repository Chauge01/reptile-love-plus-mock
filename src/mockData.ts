export type PetProfile = {
  id: string
  name: string
  avatar: string
  species: string
  tag: string
  status: string
  age: string
  careDays: number
  currentWeight: number
  latestFeedDate: string
  latestEvent: string
  aiLastLine: string
  color: string
  weightSeries: { date: string; value: number }[]
  feedFrequency: { week: string; count: number }[]
  humiditySeries: { date: string; value: number }[]
  timeline: { date: string; title: string; detail: string }[]
  records: { date: string; type: string; detail: string; abnormal?: boolean; withPhoto?: boolean }[]
  photos: string[]
}

export type CalendarEvent = {
  id: string
  date: string
  petId: string
  petName: string
  type: 'feeding' | 'soak' | 'water' | 'observe' | 'supplement' | 'weight'
  title: string
  detail: string
  time: string
  done: boolean
}

export type DiscussionPost = {
  id: string
  title: string
  summary: string
  author: string
  date: string
  likes: number
  replies: number
  coverLabel: string
  category: string
  images: string[]
  content: string[]
  isMine?: boolean
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  badge: string
  stock: number
  desc: string
  specs: string[]
  shipping: string
}

const mockImages = {
  ballPython: '/mock-images/ball-python.jpg',
  cornSnake: '/mock-images/corn-snake.jpg',
  grassSnakeTerrarium: '/mock-images/grass-snake-terrarium.jpg',
  beardedDragonTerrarium: '/mock-images/bearded-dragon-terrarium.jpg',
  beardedDragonBasking: '/mock-images/bearded-dragon-basking.jpg',
  crestedGecko: '/mock-images/crested-gecko.jpg',
  leopardGecko: '/mock-images/leopard-gecko-side.jpg',
  leopardGeckoTerrarium: '/mock-images/leopard-gecko-terrarium-1.jpg',
  tortoiseFeeding1: '/mock-images/tortoise-feeding-1.jpg',
  tortoiseFeeding2: '/mock-images/tortoise-feeding-2.jpg',
  tortoiseDrinking: '/mock-images/tortoise-drinking-water.jpg',
  bioactiveCleanup: '/mock-images/bioactive-cleanup-crew.jpg',
  snakeShedCleanup: '/mock-images/snake-shed-cleanup.jpg',
  zooTerrarium1: '/mock-images/zoo-terrarium-1.jpg',
  zooTerrarium2: '/mock-images/zoo-terrarium-2.jpg',
}

export const pets: PetProfile[] = [
  {
    id: 'cream',
    name: '奶油',
    avatar: mockImages.cornSnake,
    species: '玉米蛇',
    tag: 'Snow Tessera',
    status: '活躍照護中',
    age: '1 歲 3 個月',
    careDays: 312,
    currentWeight: 182,
    latestFeedDate: '2026/04/18',
    latestEvent: '今晚 20:00 餵食 2 隻乳鼠',
    aiLastLine: '今晚餵食完先不要立刻打擾，明早再觀察活動與排泄。',
    color: 'from-orange-100 via-amber-50 to-white',
    weightSeries: [
      { date: '03/24', value: 170 },
      { date: '03/31', value: 173 },
      { date: '04/07', value: 176 },
      { date: '04/14', value: 179 },
      { date: '04/19', value: 182 },
    ],
    feedFrequency: [
      { week: 'W1', count: 2 },
      { week: 'W2', count: 1 },
      { week: 'W3', count: 2 },
      { week: 'W4', count: 1 },
    ],
    humiditySeries: [
      { date: '03/24', value: 58 },
      { date: '03/31', value: 60 },
      { date: '04/07', value: 62 },
      { date: '04/14', value: 59 },
      { date: '04/19', value: 61 },
    ],
    timeline: [
      { date: '04/19', title: '餵食待辦', detail: '今晚 20:00 餵食 2 隻乳鼠' },
      { date: '04/18', title: '排泄正常', detail: '紀錄 1 次，型態正常' },
      { date: '04/14', title: '體重更新', detail: '179g → 182g' },
      { date: '04/10', title: '蛻皮完成', detail: '整體狀況穩定' },
    ],
    records: [
      { date: '2026/04/18', type: '餵食', detail: '2 隻乳鼠', withPhoto: true },
      { date: '2026/04/18', type: '排泄', detail: '正常', withPhoto: false },
      { date: '2026/04/14', type: '體重', detail: '182g', withPhoto: false },
      { date: '2026/04/10', type: '蛻皮', detail: '完整蛻皮', withPhoto: true },
      { date: '2026/04/04', type: '觀察', detail: '活動正常', withPhoto: false },
    ],
    photos: [mockImages.cornSnake, mockImages.ballPython, mockImages.snakeShedCleanup],
  },
  {
    id: 'ada',
    name: '阿達',
    avatar: mockImages.tortoiseFeeding1,
    species: '蘇卡達陸龜',
    tag: 'Juvenile',
    status: '活躍照護中',
    age: '10 個月',
    careDays: 228,
    currentWeight: 624,
    latestFeedDate: '2026/04/19',
    latestEvent: '今晚 21:00 泡水 15 分鐘',
    aiLastLine: '今晚泡水後可以順便記錄排酸與活動力，這筆很有價值。',
    color: 'from-lime-100 via-emerald-50 to-white',
    weightSeries: [
      { date: '03/24', value: 590 },
      { date: '03/31', value: 598 },
      { date: '04/07', value: 606 },
      { date: '04/14', value: 615 },
      { date: '04/19', value: 624 },
    ],
    feedFrequency: [
      { week: 'W1', count: 6 },
      { week: 'W2', count: 6 },
      { week: 'W3', count: 7 },
      { week: 'W4', count: 6 },
    ],
    humiditySeries: [
      { date: '03/24', value: 52 },
      { date: '03/31', value: 55 },
      { date: '04/07', value: 57 },
      { date: '04/14', value: 54 },
      { date: '04/19', value: 56 },
    ],
    timeline: [
      { date: '04/19', title: '泡水待辦', detail: '今晚 21:00 泡水 15 分鐘' },
      { date: '04/18', title: '餵食葉菜', detail: '桑葉 + 牧草' },
      { date: '04/14', title: '量體重', detail: '615g → 624g' },
      { date: '04/12', title: '排酸正常', detail: '型態正常' },
    ],
    records: [
      { date: '2026/04/19', type: '泡水', detail: '15 分鐘', withPhoto: true },
      { date: '2026/04/18', type: '餵食', detail: '桑葉 + 牧草', withPhoto: false },
      { date: '2026/04/14', type: '體重', detail: '624g', withPhoto: false },
      { date: '2026/04/12', type: '排酸', detail: '正常', withPhoto: false },
    ],
    photos: [mockImages.tortoiseFeeding1, mockImages.tortoiseFeeding2, mockImages.tortoiseDrinking],
  },
  {
    id: 'gecko',
    name: '小守宮',
    avatar: mockImages.leopardGecko,
    species: '豹紋守宮',
    tag: 'Tangerine',
    status: '需觀察',
    age: '1 歲 1 個月',
    careDays: 401,
    currentWeight: 58,
    latestFeedDate: '2026/04/17',
    latestEvent: '卡皮觀察中',
    aiLastLine: '先維持濕度與觀察尾尖，不要一次做太激烈的處理。',
    color: 'from-rose-100 via-orange-50 to-white',
    weightSeries: [
      { date: '03/24', value: 56 },
      { date: '03/31', value: 56 },
      { date: '04/07', value: 57 },
      { date: '04/14', value: 57 },
      { date: '04/19', value: 58 },
    ],
    feedFrequency: [
      { week: 'W1', count: 3 },
      { week: 'W2', count: 2 },
      { week: 'W3', count: 2 },
      { week: 'W4', count: 3 },
    ],
    humiditySeries: [
      { date: '03/24', value: 64 },
      { date: '03/31', value: 66 },
      { date: '04/07', value: 69 },
      { date: '04/14', value: 70 },
      { date: '04/19', value: 68 },
    ],
    timeline: [
      { date: '04/19', title: '卡皮觀察', detail: '尾尖仍需觀察' },
      { date: '04/17', title: '餵食紀錄', detail: '杜比亞 + 鈣粉' },
      { date: '04/11', title: '脫皮', detail: '局部卡皮' },
      { date: '04/05', title: '排泄', detail: '正常' },
    ],
    records: [
      { date: '2026/04/19', type: '觀察', detail: '尾尖卡皮', abnormal: true, withPhoto: true },
      { date: '2026/04/17', type: '餵食', detail: '杜比亞 + 鈣粉', withPhoto: false },
      { date: '2026/04/11', type: '脫皮', detail: '局部卡皮', abnormal: true, withPhoto: true },
      { date: '2026/04/05', type: '排泄', detail: '正常', withPhoto: false },
    ],
    photos: [mockImages.leopardGecko, mockImages.leopardGeckoTerrarium, mockImages.crestedGecko],
  },
  {
    id: 'froggy',
    name: '小箭毒',
    avatar: mockImages.bioactiveCleanup,
    species: '箭毒蛙',
    tag: 'Azureus',
    status: '活躍照護中',
    age: '8 個月',
    careDays: 188,
    currentWeight: 12,
    latestFeedDate: '2026/04/19',
    latestEvent: '今日已補餌',
    aiLastLine: '兩棲類重點是活餌大小與環境濕度一起看。',
    color: 'from-cyan-100 via-sky-50 to-white',
    weightSeries: [
      { date: '03/24', value: 10 },
      { date: '03/31', value: 10 },
      { date: '04/07', value: 11 },
      { date: '04/14', value: 11 },
      { date: '04/19', value: 12 },
    ],
    feedFrequency: [
      { week: 'W1', count: 4 },
      { week: 'W2', count: 4 },
      { week: 'W3', count: 5 },
      { week: 'W4', count: 4 },
    ],
    humiditySeries: [
      { date: '03/24', value: 78 },
      { date: '03/31', value: 80 },
      { date: '04/07', value: 81 },
      { date: '04/14', value: 79 },
      { date: '04/19', value: 82 },
    ],
    timeline: [
      { date: '04/19', title: '餵食完成', detail: '果蠅 + 小型活餌' },
      { date: '04/18', title: '噴霧補水', detail: '濕度回升至 82%' },
    ],
    records: [
      { date: '2026/04/19', type: '餵食', detail: '果蠅 + 小型活餌', withPhoto: true },
      { date: '2026/04/18', type: '環境', detail: '補噴霧', withPhoto: false },
    ],
    photos: [mockImages.bioactiveCleanup, mockImages.zooTerrarium1, mockImages.zooTerrarium2],
  },
  {
    id: 'spider',
    name: '黑寶',
    avatar: mockImages.grassSnakeTerrarium,
    species: '紅玫瑰捕鳥蛛',
    tag: 'Grammostola',
    status: '活躍照護中',
    age: '1 歲 6 個月',
    careDays: 522,
    currentWeight: 35,
    latestFeedDate: '2026/04/18',
    latestEvent: '進食完成',
    aiLastLine: '節肢類重點是餌體大小與進食後腹部狀態。',
    color: 'from-stone-200 via-orange-50 to-white',
    weightSeries: [
      { date: '03/24', value: 33 },
      { date: '03/31', value: 34 },
      { date: '04/07', value: 34 },
      { date: '04/14', value: 35 },
      { date: '04/19', value: 35 },
    ],
    feedFrequency: [
      { week: 'W1', count: 1 },
      { week: 'W2', count: 1 },
      { week: 'W3', count: 0 },
      { week: 'W4', count: 1 },
    ],
    humiditySeries: [
      { date: '03/24', value: 64 },
      { date: '03/31', value: 63 },
      { date: '04/07', value: 65 },
      { date: '04/14', value: 64 },
      { date: '04/19', value: 66 },
    ],
    timeline: [
      { date: '04/18', title: '餵食完成', detail: '杜比亞 1 隻' },
      { date: '04/12', title: '整理環境', detail: '移除殘餌' },
    ],
    records: [
      { date: '2026/04/18', type: '餵食', detail: '杜比亞 1 隻', withPhoto: true },
      { date: '2026/04/12', type: '整理', detail: '移除殘餌', withPhoto: false },
    ],
    photos: [mockImages.grassSnakeTerrarium, mockImages.zooTerrarium2, mockImages.bioactiveCleanup],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', date: '2026-04-02', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '2 隻乳鼠', time: '20:00', done: true },
  { id: 'e2', date: '2026-04-03', petId: 'ada', petName: '阿達', type: 'soak', title: '阿達泡水', detail: '15 分鐘', time: '21:00', done: true },
  { id: 'e3', date: '2026-04-05', petId: 'gecko', petName: '小守宮', type: 'supplement', title: '小守宮補鈣', detail: '含 D3 鈣粉', time: '19:30', done: true },
  { id: 'e4', date: '2026-04-08', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '2 隻乳鼠', time: '20:00', done: true },
  { id: 'e5', date: '2026-04-10', petId: 'gecko', petName: '小守宮', type: 'observe', title: '小守宮觀察', detail: '卡皮追蹤', time: '22:00', done: true },
  { id: 'e6', date: '2026-04-12', petId: 'ada', petName: '阿達', type: 'weight', title: '阿達量體重', detail: '624g', time: '18:00', done: true },
  { id: 'e7', date: '2026-04-14', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '2 隻乳鼠', time: '20:00', done: true },
  { id: 'e8', date: '2026-04-16', petId: 'ada', petName: '阿達', type: 'water', title: '阿達換水', detail: '200cc', time: '10:00', done: true },
  { id: 'e9', date: '2026-04-19', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '2 隻乳鼠', time: '20:00', done: false },
  { id: 'e10', date: '2026-04-19', petId: 'ada', petName: '阿達', type: 'soak', title: '阿達泡水', detail: '15 分鐘', time: '21:00', done: false },
  { id: 'e11', date: '2026-04-19', petId: 'gecko', petName: '小守宮', type: 'observe', title: '小守宮觀察', detail: '卡皮追蹤', time: '22:00', done: false },
  { id: 'e12', date: '2026-04-21', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '1 隻小鼠', time: '20:00', done: false },
  { id: 'e13', date: '2026-04-22', petId: 'ada', petName: '阿達', type: 'soak', title: '阿達泡水', detail: '15 分鐘', time: '21:00', done: false },
  { id: 'e14', date: '2026-04-23', petId: 'gecko', petName: '小守宮', type: 'supplement', title: '小守宮補鈣', detail: '無 D3 鈣粉', time: '19:30', done: false },
  { id: 'e15', date: '2026-04-25', petId: 'ada', petName: '阿達', type: 'water', title: '阿達換水', detail: '200cc', time: '09:00', done: false },
  { id: 'e16', date: '2026-04-27', petId: 'cream', petName: '奶油', type: 'feeding', title: '奶油餵食', detail: '2 隻乳鼠', time: '20:00', done: false },
]

export const discussionPosts: DiscussionPost[] = [
  {
    id: 'post-1',
    title: '玉米蛇吐食後，隔多久再開餵比較穩？',
    summary: '家裡這隻昨晚吐食，想問大家通常會停餵幾天，再從什麼尺寸重新開始。',
    author: 'MilkSnakeMom',
    date: '2026/04/19',
    likes: 28,
    replies: 14,
    coverLabel: '吐食後重新餵食觀察',
    category: '拒食求助',
    images: [mockImages.cornSnake, mockImages.ballPython],
    content: [
      '昨晚 11 點左右吐食，今天精神看起來還可以。',
      '想問大家通常會停餵幾天，再從什麼尺寸重新開始會比較穩。',
      '目前有先維持安靜環境，沒有再抓出來。',
    ],
  },
  {
    id: 'post-2',
    title: '守宮卡皮時，局部處理還是先觀察？',
    summary: '尾尖一直卡著一點點，不確定要不要先再加濕，還是直接局部協助。',
    author: 'GeckoBao',
    date: '2026/04/18',
    likes: 19,
    replies: 9,
    coverLabel: '卡皮照護經驗',
    category: '蛻皮／健康觀察',
    images: [mockImages.leopardGeckoTerrarium, mockImages.leopardGecko],
    isMine: true,
    content: [
      '目前卡在尾尖跟腳趾邊緣。',
      '有先提高濕度，但還在觀察要不要局部處理。',
    ],
  },
  {
    id: 'post-3',
    title: '蘇卡達泡水頻率怎麼抓比較剛好？',
    summary: '最近天氣變熱，想調整泡水頻率，大家都怎麼抓週期跟時間？',
    author: 'TortoiseDaily',
    date: '2026/04/18',
    likes: 34,
    replies: 17,
    coverLabel: '泡水日常分享',
    category: '環境設備',
    images: [mockImages.tortoiseDrinking, mockImages.tortoiseFeeding2],
    content: [
      '最近室溫上升，感覺泡水頻率可以調整。',
      '想聽大家目前怎麼安排一週節奏。',
    ],
  },
]

export const postComments: Record<string, { author: string; text: string; date: string }[]> = {
  'post-1': [
    { author: 'SnakeCare日常', text: '我自己通常會先停餵 7 天，再從比較小尺寸重新開始。', date: '2026/04/19 13:20' },
    { author: 'Bao', text: '我也在觀察是不是要從小鼠降回乳鼠。', date: '2026/04/19 13:42' },
  ],
  'post-2': [
    { author: 'GeckoCareLab', text: '尾尖如果只是薄薄一層，先加濕觀察通常比較穩。', date: '2026/04/18 20:11' },
    { author: 'Bao', text: '我目前也是先不直接硬處理。', date: '2026/04/18 20:40' },
  ],
  'post-3': [
    { author: 'TortoiseTaiwan', text: '最近變熱後，我大概一週會多加 1 次短泡。', date: '2026/04/18 18:05' },
  ],
}

export const products: Product[] = [
  {
    id: 'product-1',
    name: '冷凍乳鼠 30 入',
    category: '餌料',
    price: 280,
    image: mockImages.ballPython,
    badge: '熱賣',
    stock: 18,
    desc: '適合玉米蛇等中小型蛇類的基礎餌料。',
    specs: ['30 入', '冷凍真空包裝'],
    shipping: '付款後 2 個工作天內出貨',
  },
  {
    id: 'product-2',
    name: '鈣粉（含 D3）',
    category: '補充品',
    price: 220,
    image: mockImages.bioactiveCleanup,
    badge: '平台自營',
    stock: 42,
    desc: '守宮與蜥蜴常用補充品。',
    specs: ['50g', '含 D3'],
    shipping: '付款後 2 個工作天內出貨',
  },
  {
    id: 'product-3',
    name: '溫濕度計',
    category: '器材',
    price: 490,
    image: mockImages.zooTerrarium1,
    badge: '新品',
    stock: 12,
    desc: '爬缸常用電子溫濕度計。',
    specs: ['電子顯示', '附背膠'],
    shipping: '付款後 2 個工作天內出貨',
  },
  {
    id: 'product-4',
    name: '守宮躲避屋',
    category: '周邊',
    price: 360,
    image: mockImages.beardedDragonTerrarium,
    badge: '精選',
    stock: 8,
    desc: '適合豹紋守宮的躲避空間。',
    specs: ['樹脂材質', '中型'],
    shipping: '付款後 2 個工作天內出貨',
  },
]

export const memberProfile = {
  name: 'Bao',
  email: 'bao@example.com',
  year: '1998',
  gender: '未設定',
  notifications: ['餵食提醒', '泡水提醒', '討論互動提醒', '訂單提醒'],
}

export const mockUploadImages = Object.values(mockImages)

export const aiConversations: Record<string, { role: 'assistant' | 'user'; text: string }[]> = {
  cream: [
    { role: 'user', text: '奶油今晚餵食後需要注意什麼？' },
    { role: 'assistant', text: '先讓牠安靜消化，明早再看活動狀態與排泄。' },
    { role: 'assistant', text: '今晚餵食完先不要立刻打擾，明早再觀察活動與排泄。' },
  ],
  ada: [
    { role: 'user', text: '阿達最近泡水頻率這樣可以嗎？' },
    { role: 'assistant', text: '目前節奏可以，今晚泡水後可以補一筆排酸與活動力紀錄。' },
    { role: 'assistant', text: '今晚泡水後可以順便記錄排酸與活動力，這筆很有價值。' },
  ],
  gecko: [
    { role: 'user', text: '小守宮卡皮現在要不要處理？' },
    { role: 'assistant', text: '先不要過度處理，先看尾尖和腳趾是否持續卡住。' },
    { role: 'assistant', text: '先維持濕度與觀察尾尖，不要一次做太激烈的處理。' },
  ],
}
