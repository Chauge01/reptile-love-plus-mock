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
    name: 'Cream',
    avatar: mockImages.cornSnake,
    species: 'Corn Snake',
    tag: 'Snow Tessera',
    status: 'Active Care',
    age: '1 year 3 months',
    careDays: 312,
    currentWeight: 182,
    latestFeedDate: '2026/04/18',
    latestEvent: 'Feed 2 pinky mice tonight at 20:00',
    aiLastLine: 'After feeding tonight, avoid disturbance and check activity and excretion tomorrow morning.',
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
      { date: '04/19', title: 'Feeding Task', detail: 'Feed 2 pinky mice tonight at 20:00' },
      { date: '04/18', title: 'Normal Excretion', detail: 'Recorded once, normal form' },
      { date: '04/14', title: 'Weight Updated', detail: '179g → 182g' },
      { date: '04/10', title: 'Shed Complete', detail: 'Overall condition stable' },
    ],
    records: [
      { date: '2026/04/18', type: 'Feeding', detail: '2 pinky mice', withPhoto: true },
      { date: '2026/04/18', type: 'Excretion', detail: 'Normal', withPhoto: false },
      { date: '2026/04/14', type: 'Weight', detail: '182g', withPhoto: false },
      { date: '2026/04/10', type: 'Shed', detail: 'Complete shed', withPhoto: true },
      { date: '2026/04/04', type: 'Observation', detail: 'Normal activity', withPhoto: false },
    ],
    photos: [mockImages.cornSnake, mockImages.ballPython, mockImages.snakeShedCleanup],
  },
  {
    id: 'ada',
    name: 'Ada',
    avatar: mockImages.tortoiseFeeding1,
    species: 'Sulcata Tortoise',
    tag: 'Juvenile',
    status: 'Active Care',
    age: '10 months',
    careDays: 228,
    currentWeight: 624,
    latestFeedDate: '2026/04/19',
    latestEvent: 'Soak for 15 minutes tonight at 21:00',
    aiLastLine: 'After soaking tonight, record urate and activity. This will be valuable.',
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
      { date: '04/19', title: 'Soaking Task', detail: 'Soak for 15 minutes tonight at 21:00' },
      { date: '04/18', title: 'Feed Leafy Greens', detail: 'Mulberry leaves + hay' },
      { date: '04/14', title: 'Weighing', detail: '615g → 624g' },
      { date: '04/12', title: 'Normal Urate', detail: 'Normal form' },
    ],
    records: [
      { date: '2026/04/19', type: 'Soaking', detail: '15 minutes', withPhoto: true },
      { date: '2026/04/18', type: 'Feeding', detail: 'Mulberry leaves + hay', withPhoto: false },
      { date: '2026/04/14', type: 'Weight', detail: '624g', withPhoto: false },
      { date: '2026/04/12', type: 'Urate', detail: 'Normal', withPhoto: false },
    ],
    photos: [mockImages.tortoiseFeeding1, mockImages.tortoiseFeeding2, mockImages.tortoiseDrinking],
  },
  {
    id: 'gecko',
    name: 'Little Gecko',
    avatar: mockImages.leopardGecko,
    species: 'Leopard Gecko',
    tag: 'Tangerine',
    status: 'Needs Observation',
    age: '1 year 1 months',
    careDays: 401,
    currentWeight: 58,
    latestFeedDate: '2026/04/17',
    latestEvent: 'Monitoring stuck shed',
    aiLastLine: 'Maintain humidity and observe the tail tip first. Avoid aggressive handling at once.',
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
      { date: '04/19', title: 'Stuck Shed Observation', detail: 'Tail tip still needs observation' },
      { date: '04/17', title: 'Feeding Record', detail: 'Dubia + calcium powder' },
      { date: '04/11', title: 'Shed', detail: 'Partial stuck shed' },
      { date: '04/05', title: 'Excretion', detail: 'Normal' },
    ],
    records: [
      { date: '2026/04/19', type: 'Observation', detail: 'Stuck shed on tail tip', abnormal: true, withPhoto: true },
      { date: '2026/04/17', type: 'Feeding', detail: 'Dubia + calcium powder', withPhoto: false },
      { date: '2026/04/11', type: 'Shed', detail: 'Partial stuck shed', abnormal: true, withPhoto: true },
      { date: '2026/04/05', type: 'Excretion', detail: 'Normal', withPhoto: false },
    ],
    photos: [mockImages.leopardGecko, mockImages.leopardGeckoTerrarium, mockImages.crestedGecko],
  },
  {
    id: 'froggy',
    name: 'Little Dart',
    avatar: mockImages.bioactiveCleanup,
    species: 'Dart Frog',
    tag: 'Azureus',
    status: 'Active Care',
    age: '8 months',
    careDays: 188,
    currentWeight: 12,
    latestFeedDate: '2026/04/19',
    latestEvent: 'Fed today',
    aiLastLine: 'For amphibians, review live prey size together with environmental humidity.',
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
      { date: '04/19', title: 'Feeding Complete', detail: 'Fruit Flies + Small Live Prey' },
      { date: '04/18', title: 'Mist and hydrate', detail: 'Humidity recovered to 82%' },
    ],
    records: [
      { date: '2026/04/19', type: 'Feeding', detail: 'Fruit Flies + Small Live Prey', withPhoto: true },
      { date: '2026/04/18', type: 'Environment', detail: 'Extra misting', withPhoto: false },
    ],
    photos: [mockImages.bioactiveCleanup, mockImages.zooTerrarium1, mockImages.zooTerrarium2],
  },
  {
    id: 'spider',
    name: 'Black Gem',
    avatar: mockImages.grassSnakeTerrarium,
    species: 'Chilean Rose Tarantula',
    tag: 'Grammostola',
    status: 'Active Care',
    age: '1 year 6 months',
    careDays: 522,
    currentWeight: 35,
    latestFeedDate: '2026/04/18',
    latestEvent: 'Feeding finished',
    aiLastLine: 'For arthropods, watch prey size and abdomen status after feeding.',
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
      { date: '04/18', title: 'Feeding Complete', detail: '1 Dubia roach' },
      { date: '04/12', title: 'Clean Habitat', detail: 'Removed leftovers' },
    ],
    records: [
      { date: '2026/04/18', type: 'Feeding', detail: '1 Dubia roach', withPhoto: true },
      { date: '2026/04/12', type: 'Cleanup', detail: 'Removed leftovers', withPhoto: false },
    ],
    photos: [mockImages.grassSnakeTerrarium, mockImages.zooTerrarium2, mockImages.bioactiveCleanup],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', date: '2026-04-02', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '2 pinky mice', time: '20:00', done: true },
  { id: 'e2', date: '2026-04-03', petId: 'ada', petName: 'Ada', type: 'soak', title: 'AdaSoaking', detail: '15 minutes', time: '21:00', done: true },
  { id: 'e3', date: '2026-04-05', petId: 'gecko', petName: 'Little Gecko', type: 'supplement', title: 'Little Gecko Calcium', detail: 'Calcium powder with D3', time: '19:30', done: true },
  { id: 'e4', date: '2026-04-08', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '2 pinky mice', time: '20:00', done: true },
  { id: 'e5', date: '2026-04-10', petId: 'gecko', petName: 'Little Gecko', type: 'observe', title: 'Little GeckoObservation', detail: 'Stuck shed follow-up', time: '22:00', done: true },
  { id: 'e6', date: '2026-04-12', petId: 'ada', petName: 'Ada', type: 'weight', title: 'AdaWeighing', detail: '624g', time: '18:00', done: true },
  { id: 'e7', date: '2026-04-14', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '2 pinky mice', time: '20:00', done: true },
  { id: 'e8', date: '2026-04-16', petId: 'ada', petName: 'Ada', type: 'water', title: 'AdaWater Change', detail: '200cc', time: '10:00', done: true },
  { id: 'e9', date: '2026-04-19', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '2 pinky mice', time: '20:00', done: false },
  { id: 'e10', date: '2026-04-19', petId: 'ada', petName: 'Ada', type: 'soak', title: 'AdaSoaking', detail: '15 minutes', time: '21:00', done: false },
  { id: 'e11', date: '2026-04-19', petId: 'gecko', petName: 'Little Gecko', type: 'observe', title: 'Little GeckoObservation', detail: 'Stuck shed follow-up', time: '22:00', done: false },
  { id: 'e12', date: '2026-04-21', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '1 small mouse', time: '20:00', done: false },
  { id: 'e13', date: '2026-04-22', petId: 'ada', petName: 'Ada', type: 'soak', title: 'AdaSoaking', detail: '15 minutes', time: '21:00', done: false },
  { id: 'e14', date: '2026-04-23', petId: 'gecko', petName: 'Little Gecko', type: 'supplement', title: 'Little Gecko Calcium', detail: 'Calcium powder without D3', time: '19:30', done: false },
  { id: 'e15', date: '2026-04-25', petId: 'ada', petName: 'Ada', type: 'water', title: 'AdaWater Change', detail: '200cc', time: '09:00', done: false },
  { id: 'e16', date: '2026-04-27', petId: 'cream', petName: 'Cream', type: 'feeding', title: 'CreamFeeding', detail: '2 pinky mice', time: '20:00', done: false },
]

export const discussionPosts: DiscussionPost[] = [
  {
    id: 'post-1',
    title: 'After a corn snake regurgitates, how long should I wait before feeding again?',
    summary: 'My snake regurgitated last night. How many days do you usually pause feeding, and what size do you restart with?',
    author: 'MilkSnakeMom',
    date: '2026/04/19',
    likes: 28,
    replies: 14,
    coverLabel: 'Observation after regurgitation before restarting feeding',
    category: 'Food Refusal Help',
    images: [mockImages.cornSnake, mockImages.ballPython],
    content: [
      'It regurgitated around 11 PM last night and looks okay today.',
      'How many days do you usually pause feeding, and what size is safer to restart with?',
      'I am keeping the environment quiet and have not handled it again.',
    ],
  },
  {
    id: 'post-2',
    title: 'For stuck shed on a gecko, handle locally or observe first?',
    summary: 'The tail tip still has a small stuck area. Should I increase humidity first or assist locally?',
    author: 'GeckoBao',
    date: '2026/04/18',
    likes: 19,
    replies: 9,
    coverLabel: 'Stuck Shed Care Experience',
    category: 'Shed / Health Observation',
    images: [mockImages.leopardGeckoTerrarium, mockImages.leopardGecko],
    isMine: true,
    content: [
      'It is currently stuck around the tail tip and toe edges.',
      'I increased humidity first and am still deciding whether to handle locally.',
    ],
  },
  {
    id: 'post-3',
    title: 'How should I set soaking frequency for a Sulcata?',
    summary: 'The weather is getting hotter, so I want to adjust soaking frequency. How do you set interval and duration?',
    author: 'TortoiseDaily',
    date: '2026/04/18',
    likes: 34,
    replies: 17,
    coverLabel: 'Soaking Routine Sharing',
    category: 'Environment / Equipment',
    images: [mockImages.tortoiseDrinking, mockImages.tortoiseFeeding2],
    content: [
      'Room temperature has risen recently, so soaking frequency may need adjustment.',
      'I would like to hear how everyone arranges the weekly routine.',
    ],
  },
]

export const postComments: Record<string, { author: string; text: string; date: string }[]> = {
  'post-1': [
    { author: 'SnakeCareDaily Care', text: 'I usually pause feeding for 7 days, then restart with a smaller size.', date: '2026/04/19 13:20' },
    { author: 'Bao', text: 'I am also considering dropping from small mice back to pinky mice.', date: '2026/04/19 13:42' },
  ],
  'post-2': [
    { author: 'GeckoCareLab', text: 'If the tail tip only has a thin layer, increasing humidity and observing is usually safer.', date: '2026/04/18 20:11' },
    { author: 'Bao', text: 'I am also avoiding direct forceful handling for now.', date: '2026/04/18 20:40' },
  ],
  'post-3': [
    { author: 'TortoiseTaiwan', text: 'Since it got warmer, I add one short soak per week.', date: '2026/04/18 18:05' },
  ],
}

export const products: Product[] = [
  {
    id: 'product-1',
    name: 'Frozen Pinky Mice 30-Pack',
    category: 'Food',
    price: 280,
    image: mockImages.ballPython,
    badge: 'Hot Seller',
    stock: 18,
    desc: 'Basic feeder food for corn snakes and other small to medium snakes.',
    specs: ['30-pack', 'Frozen vacuum packaging'],
    shipping: 'Ships within 2 business days after payment',
  },
  {
    id: 'product-2',
    name: 'Calcium Powder (With D3)',
    category: 'Supplements',
    price: 220,
    image: mockImages.bioactiveCleanup,
    badge: 'Platform-owned',
    stock: 42,
    desc: 'Common supplement for geckos and lizards.',
    specs: ['50g', 'With D3'],
    shipping: 'Ships within 2 business days after payment',
  },
  {
    id: 'product-3',
    name: 'Thermo-Hygrometer',
    category: 'Equipment',
    price: 490,
    image: mockImages.zooTerrarium1,
    badge: 'New',
    stock: 12,
    desc: 'Electronic thermo-hygrometer for reptile enclosures.',
    specs: ['Digital display', 'Adhesive backing included'],
    shipping: 'Ships within 2 business days after payment',
  },
  {
    id: 'product-4',
    name: 'Gecko Hide',
    category: 'Accessories',
    price: 360,
    image: mockImages.beardedDragonTerrarium,
    badge: 'Featured',
    stock: 8,
    desc: 'Hide space for leopard geckos.',
    specs: ['Resin material', 'Medium'],
    shipping: 'Ships within 2 business days after payment',
  },
]

export const memberProfile = {
  name: 'Bao',
  email: 'bao@example.com',
  year: '1998',
  gender: 'Not Set',
  notifications: ['Feeding Reminder', 'Soaking Reminder', 'Discussion Interaction Reminder', 'Order Reminder'],
}

export const mockUploadImages = Object.values(mockImages)

export const aiConversations: Record<string, { role: 'assistant' | 'user'; text: string }[]> = {
  cream: [
    { role: 'user', text: 'What should I watch after feeding Cream tonight?' },
    { role: 'assistant', text: 'Let it digest quietly first, then check activity and excretion tomorrow morning.' },
    { role: 'assistant', text: 'After feeding tonight, avoid disturbance and check activity and excretion tomorrow morning.' },
  ],
  ada: [
    { role: 'user', text: 'Is Ada current soaking frequency okay?' },
    { role: 'assistant', text: 'The current rhythm is fine. After soaking tonight, add a urate and activity record.' },
    { role: 'assistant', text: 'After soaking tonight, record urate and activity. This will be valuable.' },
  ],
  gecko: [
    { role: 'user', text: 'Should I handle Little Gecko stuck shed now?' },
    { role: 'assistant', text: 'Do not over-handle yet. First check whether the tail tip and toes remain stuck.' },
    { role: 'assistant', text: 'Maintain humidity and observe the tail tip first. Avoid aggressive handling at once.' },
  ],
}




