import { useMemo, useRef, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Heart,
  House,
  MessageCircle,
  MessageCircleMore,
  PawPrint,
  ShoppingBag,
  TriangleAlert,
  UserRound,
  UtensilsCrossed,
  Weight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { aiConversations, calendarEvents, discussionPosts, memberProfile, mockUploadImages, pets, postComments, products, type CalendarEvent, type DiscussionPost, type PetProfile, type Product } from '@/mockData'

type MainTab = 'petHub' | 'discussion' | 'home' | 'shop' | 'member'
type ScreenKey = MainTab | 'pets' | 'addPet' | 'editPet' | 'profile' | 'record' | 'plan' | 'article' | 'editor' | 'product' | 'cart' | 'checkout' | 'calendar' | 'login' | 'ai' | 'album' | 'history' | 'construction'

type CartLine = { productId: string; qty: number }

type RecordPresetKey = 'snake' | 'gecko' | 'tortoise' | 'turtle' | 'amphibian' | 'arthropod'

const recordPresets: Record<RecordPresetKey, { label: string; foods: readonly string[]; extrasTitle: string; extras: readonly string[]; events: readonly string[]; risk: string }> = {
  snake: {
    label: '蛇類',
    foods: ['乳鼠', '小鼠', '成鼠', '其他'],
    extrasTitle: '餵食方式',
    extras: ['冷凍退冰', '活體'],
    events: ['預備蛻皮', '蛻皮完成', '吐食', '拒食', '排泄', '異常狀態'],
    risk: '吐食視為高危險事件，儲存後需顯示追蹤提醒。',
  },
  gecko: {
    label: '守宮／蜥蜴',
    foods: ['杜比亞', '蟋蟀', '麵包蟲', '果泥', 'CGD', '葉菜', '人工飼料', '其他'],
    extrasTitle: '補充快捷',
    extras: ['鈣粉（無 D3）', '鈣粉（含 D3）', '維他命'],
    events: ['脫皮', '卡皮', '排泄', '拒食', '活動下降', '產蛋', '斷尾'],
    risk: '卡皮與拒食需快速標示成後續觀察。',
  },
  tortoise: {
    label: '陸龜',
    foods: ['牧草', '葉菜', '野草', '龜糧', '其他'],
    extrasTitle: '常見事件',
    extras: ['泡水', '曬背', '量體重', '量甲長'],
    events: ['排泄', '食慾差', '眼睛異常', '甲殼異常', '隆背／錯甲'],
    risk: '眼睛異常與甲殼異常需高關注。',
  },
  turtle: {
    label: '水龜',
    foods: ['水龜飼料', '葉菜', '水草', '昆蟲／蝦／魚類蛋白', '其他'],
    extrasTitle: '常見事件',
    extras: ['換水', '曬背', '量體重'],
    events: ['排泄', '食慾差', '眼睛異常', '甲殼異常'],
    risk: '換水與曬背屬高頻紀錄。',
  },
  amphibian: {
    label: '兩棲',
    foods: ['蟋蟀', '果蠅', '蚯蚓', '小型活餌', '飼料', '其他'],
    extrasTitle: '常見事件',
    extras: ['換水', '噴霧／加濕', '脫皮'],
    events: ['拒食', '皮膚異常', '活動下降'],
    risk: '皮膚異常建議搭配照片。',
  },
  arthropod: {
    label: '節肢',
    foods: ['蟋蟀', '杜比亞', '麵包蟲', '其他'],
    extrasTitle: '常見事件',
    extras: ['拒食', '靜置', '築網／封網'],
    events: ['脫皮成功', '脫皮失敗', '外觀異常'],
    risk: '脫皮失敗需立即追蹤。',
  },
}

const customRecordTags: Record<RecordPresetKey, { foods: string[]; events: string[]; stools: string[] }> = {
  snake: { foods: [], events: [], stools: [] },
  gecko: { foods: [], events: [], stools: [] },
  tortoise: { foods: [], events: [], stools: [] },
  turtle: { foods: [], events: [], stools: [] },
  amphibian: { foods: [], events: [], stools: [] },
  arthropod: { foods: [], events: [], stools: [] },
}
const customPlanTypes: string[] = []

const monthDays = Array.from({ length: 30 }, (_, index) => index + 1)

function refreshPetAiLine(pet: PetProfile) {
  const nextPending = calendarEvents
    .filter((event) => event.petId === pet.id && !event.done)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0]

  pet.aiLastLine = nextPending
    ? `最新狀態是「${pet.latestEvent}」，下一個待辦是 ${nextPending.date.replace('2026-', '')} ${nextPending.time} 的 ${nextPending.title}。`
    : `最新狀態是「${pet.latestEvent}」，目前沒有新的待辦壓在後面，可以先觀察。`
}

function App() {
  const [screen, setScreen] = useState<ScreenKey>('home')
  const [, setBackStack] = useState<ScreenKey[]>([])
  const [selectedPetId, setSelectedPetId] = useState(pets[0].id)
  const [selectedPostId, setSelectedPostId] = useState(discussionPosts[0].id)
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [selectedDate, setSelectedDate] = useState('2026-04-19')
  const [cart, setCart] = useState<CartLine[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftCoverImage, setDraftCoverImage] = useState<string>(mockUploadImages[0])
  const [draftImages, setDraftImages] = useState<string[]>(mockUploadImages.slice(0, 2))
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [likedPostIds, setLikedPostIds] = useState<string[]>([])
  const [aiBackTarget, setAiBackTarget] = useState<ScreenKey>('home')

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? pets[0], [selectedPetId, dataVersion])
  const selectedPost = useMemo(() => discussionPosts.find((post) => post.id === selectedPostId) ?? discussionPosts[0], [selectedPostId, dataVersion])
  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) ?? products[0], [selectedProductId, dataVersion])
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const navigateTo = (next: ScreenKey) => {
    setBackStack((current) => (current[current.length - 1] === screen && next === screen ? current : [...current, screen]))
    setScreen(next)
  }

  const goBack = (fallback: ScreenKey = 'home') => {
    setBackStack((current) => {
      const next = current[current.length - 1] ?? fallback
      setScreen(next)
      return current.slice(0, -1)
    })
  }

  const goTab = (tab: MainTab) => {
    setBackStack([])
    setScreen(tab)
  }

  const addToCart = (productId: string) => {
    setCart((current) => {
      const found = current.find((item) => item.productId === productId)
      if (found) {
        return current.map((item) => (item.productId === productId ? { ...item, qty: item.qty + 1 } : item))
      }
      return [...current, { productId, qty: 1 }]
    })
  }

  const openProfile = (petId: string) => {
    setSelectedPetId(petId)
    navigateTo('profile')
  }

  const openAI = (backTarget: ScreenKey) => {
    setAiBackTarget(backTarget)
    navigateTo('ai')
  }

  const savePet = (pet: PetProfile) => {
    refreshPetAiLine(pet)
    pets.unshift(pet)
    setDataVersion((value) => value + 1)
    setSelectedPetId(pet.id)
    window.alert('完成儲存')
    goBack('pets')
  }

  const updatePet = (updatedPet: PetProfile) => {
    refreshPetAiLine(updatedPet)
    const index = pets.findIndex((pet) => pet.id === updatedPet.id)
    if (index >= 0) pets[index] = updatedPet
    setDataVersion((value) => value + 1)
    setSelectedPetId(updatedPet.id)
    window.alert('完成儲存')
    goBack('profile')
  }

  const saveRecord = (petId: string, record: { date: string; type: string; detail: string; abnormal?: boolean; withPhoto?: boolean }) => {
    const target = pets.find((pet) => pet.id === petId)
    if (!target) return
    target.records.unshift(record)
    target.timeline.unshift({ date: record.date.replaceAll('/', '-').slice(5), title: record.type, detail: record.detail })
    target.latestEvent = `${record.type} · ${record.detail}`
    if (record.type === '餵食') target.latestFeedDate = record.date
    const linkedPlan = calendarEvents.find((event) => event.petId === petId && !event.done && (event.type === 'feeding' || event.type === 'soak' || event.type === 'observe'))
    if (linkedPlan) linkedPlan.done = true
    refreshPetAiLine(target)
    setDataVersion((value) => value + 1)
    setSelectedPetId(petId)
    window.alert('吃飽飽囉')
    goBack('profile')
  }

  const createPlan = (payload: { petId: string; type: string; frequency: string; date: string; dates?: string[]; time: string }) => {
    const pet = pets.find((item) => item.id === payload.petId)
    if (!pet) return
    const scheduledDates = payload.dates?.length ? payload.dates : [payload.date]
    scheduledDates.forEach((date, index) => {
      calendarEvents.push({
        id: `e-${Date.now()}-${index}`,
        date,
        petId: pet.id,
        petName: pet.name,
        type: payload.type === '泡水' ? 'soak' : payload.type === '換水' ? 'water' : 'feeding',
        title: `${pet.name}${payload.type}`,
        detail: payload.frequency,
        time: payload.time,
        done: false,
      })
    })
    refreshPetAiLine(pet)
    setDataVersion((value) => value + 1)
    window.alert('計畫已儲存')
  }

  const updatePlan = (payload: { eventId: string; petId: string; type: string; frequency: string; date: string; time: string }) => {
    const target = calendarEvents.find((event) => event.id === payload.eventId)
    const pet = pets.find((item) => item.id === payload.petId)
    if (!target || !pet) return
    target.petId = pet.id
    target.petName = pet.name
    target.type = payload.type === '泡水' ? 'soak' : payload.type === '換水' ? 'water' : 'feeding'
    target.title = `${pet.name}${payload.type}`
    target.detail = payload.frequency
    target.date = payload.date
    target.time = payload.time
    refreshPetAiLine(pet)
    setDataVersion((value) => value + 1)
    window.alert('計畫已更新')
  }

  const likePost = (postId: string) => {
    if (likedPostIds.includes(postId)) {
      window.alert('這篇文章已經按過愛心了')
      return
    }
    const target = discussionPosts.find((post) => post.id === postId)
    if (!target) return
    target.likes += 1
    setLikedPostIds((current) => [...current, postId])
    setDataVersion((value) => value + 1)
  }

  const addComment = (postId: string, text: string) => {
    const content = text.trim()
    if (!content) {
      window.alert('請先輸入留言')
      return false
    }
    const target = discussionPosts.find((post) => post.id === postId)
    if (!target) return false
    postComments[postId] = [{ author: 'Bao', text: content, date: '2026/04/20' }, ...(postComments[postId] ?? [])]
    target.replies = (postComments[postId] ?? []).length
    setDataVersion((value) => value + 1)
    return true
  }

  const publishPost = () => {
    if (!draftTitle.trim() || !draftBody.trim()) {
      window.alert('請先輸入標題與內容')
      return
    }

    const paragraphs = draftBody.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)

    if (editingPostId) {
      const target = discussionPosts.find((post) => post.id === editingPostId)
      if (target) {
        target.title = draftTitle
        target.summary = draftBody.slice(0, 48)
        target.content = paragraphs.length ? paragraphs : [draftBody]
        target.coverLabel = draftTitle
        target.images = [draftCoverImage, ...draftImages]
      }
      setDataVersion((value) => value + 1)
      window.alert('文章更新完成')
      setSelectedPostId(editingPostId)
      setEditingPostId(null)
      setDraftTitle('')
      setDraftBody('')
      setDraftCoverImage(mockUploadImages[0])
      setDraftImages(mockUploadImages.slice(0, 2))
      navigateTo('article')
      return
    }

    const id = `post-${Date.now()}`
    const newPost: DiscussionPost = {
      id,
      title: draftTitle,
      summary: draftBody.slice(0, 48),
      author: 'Bao',
      date: '2026/04/19',
      likes: 0,
      replies: 0,
      coverLabel: draftTitle,
      category: '新手發問',
      images: [draftCoverImage, ...draftImages],
      content: paragraphs.length ? paragraphs : [draftBody],
      isMine: true,
    }
    discussionPosts.unshift(newPost)
    postComments[id] = []
    setDataVersion((value) => value + 1)
    window.alert('文章發布完成')
    setSelectedPostId(id)
    setDraftTitle('')
    setDraftBody('')
    setDraftCoverImage(mockUploadImages[0])
    setDraftImages(mockUploadImages.slice(0, 2))
    navigateTo('article')
  }

  return (
    <main className="min-h-screen px-4 py-8 text-stone-800">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[440px_1fr]">
        <div className="mx-auto w-full max-w-[440px] rounded-[56px] bg-[#131315] p-[10px] shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
          <section className="relative flex h-[780px] w-full flex-col overflow-hidden rounded-[46px] border border-black/30 bg-[#fffaf5]">
            <div className="absolute left-1/2 top-3 z-30 h-8 w-36 -translate-x-1/2 rounded-full bg-black" />
            <TopBar />

            <div className="flex-1 overflow-y-auto px-4 pb-28 pt-3">
              {screen === 'home' && (
                <HomeScreen
                  onOpenPets={() => navigateTo('pets')}
                  onOpenRecord={() => navigateTo('record')}
                  onOpenPlan={() => navigateTo('plan')}
                  onOpenDiscussion={() => goTab('discussion')}
                  onOpenShop={() => goTab('shop')}
                  onOpenCalendar={() => navigateTo('calendar')}
                  onOpenArticle={(id) => {
                    setSelectedPostId(id)
                    navigateTo('article')
                  }}
                  onOpenProduct={(id) => {
                    setSelectedProductId(id)
                    navigateTo('product')
                  }}
                  onOpenAI={() => openAI('home')}
                  onOpenTask={(petId) => openProfile(petId)}
                  onOpenConstruction={() => navigateTo('construction')}
                  onSelectDate={setSelectedDate}
                />
              )}

              {screen === 'petHub' && (
                <PetHubScreen
                  onOpenPets={() => navigateTo('pets')}
                  onOpenRecord={() => navigateTo('record')}
                  onOpenPlan={() => navigateTo('plan')}
                  onOpenProfile={(id) => {
                    setSelectedPetId(id)
                    navigateTo('profile')
                  }}
                />
              )}

              {screen === 'pets' && (
                <PetsScreen
                  onBack={() => goBack()}
                  onOpenProfile={openProfile}
                />
              )}

              {screen === 'addPet' && <AddPetScreen onBack={() => goBack()} onSave={savePet} />}
              {screen === 'editPet' && <AddPetScreen onBack={() => goBack()} onSave={updatePet} initialPet={selectedPet} mode="edit" />}
              {screen === 'profile' && <PetProfileScreen pet={selectedPet} onBack={() => goBack()} onEdit={() => navigateTo('editPet')} onOpenRecord={() => navigateTo('record')} onOpenPlan={() => navigateTo('plan')} onOpenAI={() => openAI('profile')} onOpenAlbum={() => navigateTo('album')} onOpenHistory={() => navigateTo('history')} />}
              {screen === 'record' && <RecordScreen onBack={() => goBack()} onSubmitRecord={saveRecord} />}
              {screen === 'plan' && <PlanScreen onBack={() => goBack()} onOpenProfile={openProfile} onCreatePlan={createPlan} onUpdatePlan={updatePlan} onOpenCalendar={() => navigateTo('calendar')} />}
              {screen === 'calendar' && <CalendarScreen selectedDate={selectedDate} onSelectDate={setSelectedDate} onBack={() => goBack()} onOpenProfile={openProfile} onOpenRecord={() => navigateTo('record')} />}
              {screen === 'discussion' && (
                <DiscussionScreen
                  onOpenArticle={(id) => {
                    setSelectedPostId(id)
                    navigateTo('article')
                  }}
                />
              )}
              {screen === 'article' && <ArticleScreen post={selectedPost} liked={likedPostIds.includes(selectedPost.id)} onBack={() => goBack()} onLike={() => likePost(selectedPost.id)} onSubmitComment={addComment} onEdit={() => { setEditingPostId(selectedPost.id); setDraftTitle(selectedPost.title); setDraftBody(selectedPost.content.join('\n\n')); setDraftCoverImage(selectedPost.images[0] ?? mockUploadImages[0]); setDraftImages(selectedPost.images.slice(1, 6)); navigateTo('editor') }} />}
              {screen === 'editor' && (
                <EditorScreen
                  title={draftTitle}
                  body={draftBody}
                  onTitleChange={setDraftTitle}
                  onBodyChange={setDraftBody}
                  onBack={() => goBack()}
                  onPublish={publishPost}
                  coverImage={draftCoverImage}
                  onCoverImageChange={setDraftCoverImage}
                  images={draftImages}
                  onImagesChange={setDraftImages}
                />
              )}
              {screen === 'shop' && (
                <ShopScreen
                  onOpenProduct={(id) => {
                    setSelectedProductId(id)
                    navigateTo('product')
                  }}
                  onAddToCart={(id) => addToCart(id)}
                />
              )}
              {screen === 'product' && (
                <ProductScreen
                  product={selectedProduct}
                  onAddToCart={() => { addToCart(selectedProduct.id); window.alert('已加入購物車') }}
                  onBuyNow={() => { addToCart(selectedProduct.id); navigateTo('checkout') }}
                  onBack={() => goBack()}
                />
              )}
              {screen === 'cart' && <CartScreen cart={cart} onBack={() => goBack()} onCheckout={() => navigateTo('checkout')} />}
              {screen === 'checkout' && <CheckoutScreen cart={cart} onBack={() => goBack()} />}
              {screen === 'member' && <MemberScreen isLoggedIn={isLoggedIn} onOpenLogin={() => navigateTo('login')} />}
              {screen === 'login' && <LoginScreen onBack={() => goBack()} onLogin={() => { setIsLoggedIn(true); goBack('member') }} />}
              {screen === 'ai' && <AIScreen selectedPetId={selectedPetId} onChangePet={setSelectedPetId} onBack={() => goBack(aiBackTarget)} />}
              {screen === 'album' && <AlbumScreen pet={selectedPet} onBack={() => goBack()} />}
              {screen === 'history' && <HistoryScreen pet={selectedPet} onBack={() => goBack()} />}
              {screen === 'construction' && <ConstructionScreen onBack={() => goBack()} />}
            </div>

            {screen === 'discussion' && <FloatingActionButton label="發文" icon={<CirclePlus className="size-4" />} onClick={() => navigateTo('editor')} />}
            {screen === 'shop' && <FloatingActionButton label={cartCount > 0 ? `購物車 (${cartCount})` : '購物車'} icon={<ShoppingBag className="size-4" />} onClick={() => navigateTo('cart')} />}
            {screen === 'pets' && <FloatingActionButton label="新增寵物" icon={<CirclePlus className="size-4" />} onClick={() => navigateTo('addPet')} />}
            {screen === 'profile' && <FloatingActionButton label="寵AI+" icon={<MessageCircleMore className="size-4" />} onClick={() => openAI('profile')} />}

            <BottomNav current={screen} onChange={goTab} />
          </section>
        </div>

        <aside className="rounded-[32px] border border-orange-200/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(236,108,55,0.08)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-500">文檔 + mock 同步版</p>
              <h1 className="mt-2 text-3xl font-bold text-stone-900">爬蟲寵愛+ Product Mock</h1>
            </div>
            <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">v0.5</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="這輪已完成"
              items={[
                '首頁月曆 block 改成整月點點視覺',
                '完整日曆點日後可看內容細節',
                '4/19 當日事件改成本週待辦',
                '討論發文浮動按鈕可點進發文頁',
                '商店加入購物車 + 結帳頁可走通',
                '爬寵圖表改成真圖表 + 拆成多塊',
                '會員登入 mock 已補',
              ]}
            />
            <InfoCard
              title="資料來源"
              items={[
                'Desktop 檔案 6：一個月使用者樣本',
                'src/mockData.ts 實際灌入頁面',
                '3 隻寵物、1 個月事件、討論文、商品、會員資料',
              ]}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}

function TopBar() {
  return (
    <header className="border-b border-orange-100/80 bg-white/80 px-4 pb-4 pt-12 backdrop-blur">
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.24em] text-orange-400">REPTILE CARE</p>
        <h2 className="mt-1 text-lg font-bold text-stone-900">爬蟲寵愛+</h2>
      </div>
    </header>
  )
}

function HomeScreen({
  onOpenPets,
  onOpenRecord,
  onOpenPlan,
  onOpenDiscussion,
  onOpenShop,
  onOpenCalendar,
  onOpenArticle,
  onOpenProduct,
  onOpenAI,
  onOpenTask,
  onOpenConstruction,
  onSelectDate,
}: {
  onOpenPets: () => void
  onOpenRecord: () => void
  onOpenPlan: () => void
  onOpenDiscussion: () => void
  onOpenShop: () => void
  onOpenCalendar: () => void
  onOpenArticle: (id: string) => void
  onOpenProduct: (id: string) => void
  onOpenAI: () => void
  onOpenTask: (petId: string) => void
  onOpenConstruction: () => void
  onSelectDate: (date: string) => void
}) {
  const todayTasks = eventsByDate('2026-04-19')
  const firstRow = [
    { label: '我的爬寵', action: onOpenPets },
    { label: '餵食／紀錄', action: onOpenRecord },
  ]
  const secondRow = [
    { label: '餵食計畫', action: onOpenPlan },
    { label: '繁孕紀錄', action: onOpenConstruction },
    { label: '爬寵相簿', action: onOpenPets },
  ]

  return (
    <div className="space-y-4 pb-12">
      <section className="rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 via-rose-50 to-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">Today Widget</p>
            <h3 className="text-lg font-bold text-stone-900">今天要照顧什麼</h3>
          </div>
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700">{new Set(todayTasks.map((task) => task.petId)).size} 隻愛寵</div>
        </div>

        <div className="max-h-[150px] space-y-2 overflow-y-auto pr-1">
          {todayTasks.map((task) => (
            <button key={task.id} onClick={() => onOpenTask(task.petId)} className="flex w-full items-center gap-3 rounded-2xl bg-white/90 px-3 py-3 text-left shadow-sm">
              <MediaThumb src={petById(task.petId)?.avatar ?? '📷'} alt={task.petName} className="size-11 rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-orange-100" fallbackTextClassName="text-xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-stone-900">{task.petName}</p>
                  <span className="text-xs font-semibold text-orange-600">{task.time}</span>
                </div>
                <p className="text-sm text-stone-700">{task.title} · {task.detail}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${task.done ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{task.done ? '已完成' : '待處理'}</span>
            </button>
          ))}
        </div>

        <div className="mt-3">
          <Button variant="secondary" className="h-11 w-full rounded-[18px] border-stone-300 bg-white text-base font-semibold" onClick={onOpenAI}>寵 AI+ 助手</Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {firstRow.map((shortcut) => (
          <button key={shortcut.label} onClick={shortcut.action} className="rounded-[20px] border border-stone-900 bg-white px-3 py-3 text-center text-sm font-bold text-stone-900 shadow-sm">
            {shortcut.label}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-3">
        {secondRow.map((shortcut) => (
          <button key={shortcut.label} onClick={shortcut.action} className="rounded-[20px] border border-stone-900 bg-white px-2 py-3 text-center text-xs font-bold text-stone-900 shadow-sm">
            {shortcut.label}
          </button>
        ))}
      </section>

      <BentoBlock title="日曆" icon={<CalendarDays className="size-5 text-orange-500" />}>
        <MonthDotsCalendar compact onSelectDate={(date) => { onSelectDate(date); onOpenCalendar() }} />
      </BentoBlock>

      <BentoBlock title="討論" icon={<MessageCircleMore className="size-5 text-orange-500" />}>
        <div className="min-h-56 max-h-64 space-y-3 overflow-y-auto pr-1">
          {discussionPosts.slice(0, 3).map((post) => (
            <button key={post.id} onClick={() => onOpenArticle(post.id)} className="w-full rounded-2xl bg-stone-50 p-3 text-left">
              <div className="flex gap-3">
                <MediaThumb src={post.images[0] ?? post.coverLabel} alt={post.title} className="h-16 w-16 shrink-0 rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100 px-2 text-center" fallbackTextClassName="text-[11px] font-semibold text-stone-700" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-stone-900">{post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-600">{post.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-stone-500">
                    <span>{post.date}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {(postComments[post.id] ?? []).length}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          <Button variant="secondary" className="w-full rounded-full" onClick={onOpenDiscussion}>進入討論區</Button>
        </div>
      </BentoBlock>

      <BentoBlock title="商店" icon={<ShoppingBag className="size-5 text-orange-500" />}>
        <div className="rounded-2xl bg-gradient-to-r from-orange-300 via-rose-300 to-pink-300 px-4 py-3 text-sm font-semibold text-white">本週精選 Banner</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {products.slice(0, 2).map((product) => (
            <button key={product.id} onClick={() => onOpenProduct(product.id)} className="rounded-2xl bg-orange-50 p-3 text-left">
              <MediaThumb src={product.image} alt={product.name} className="h-24 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-white" fallbackTextClassName="text-4xl" />
              <p className="mt-2 text-xs font-semibold text-orange-500">{product.category}</p>
              <p className="text-sm font-bold text-stone-900">{product.name}</p>
              <p className="text-sm text-orange-600">NT$ {product.price}</p>
            </button>
          ))}
        </div>
        <Button variant="secondary" className="mt-3 w-full rounded-full" onClick={onOpenShop}>進入商店</Button>
      </BentoBlock>
    </div>
  )
}

function PetHubScreen({ onOpenPets, onOpenRecord, onOpenPlan, onOpenProfile }: { onOpenPets: () => void; onOpenRecord: () => void; onOpenPlan: () => void; onOpenProfile: (id: string) => void }) {
  return (
    <div className="space-y-4 pb-8">
      <SectionHeader eyebrow="爬寵" title="第一期核心集合頁" />
      <div className="grid gap-3">
        <HubCard title="我的爬寵" desc="每一隻寵物的個體檔案與列表" onClick={onOpenPets} />
        <HubCard title="餵食／紀錄" desc="高頻紀錄入口，先選寵物再切表單" onClick={onOpenRecord} />
        <HubCard title="餵食計畫" desc="建立固定照護排程與提醒" onClick={onOpenPlan} />
        <HubCard title="爬寵相簿" desc="照片附著在個體頁與紀錄中" onClick={() => onOpenProfile(pets[0].id)} />
      </div>
    </div>
  )
}

function PetsScreen({ onBack, onOpenProfile }: { onBack: () => void; onOpenProfile: (id: string) => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="我的爬寵" onBack={onBack} />
        <div className="grid gap-3">
          {pets.map((pet) => (
            <button key={pet.id} onClick={() => onOpenProfile(pet.id)} className={`rounded-[28px] bg-gradient-to-br ${pet.color} p-4 text-left shadow-sm ring-1 ring-white/70`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <MediaThumb src={pet.avatar} alt={pet.name} className="size-14 rounded-[20px] object-cover" fallbackClassName="flex items-center justify-center bg-white/85" fallbackTextClassName="text-3xl" />
                  <div>
                    <p className="text-lg font-bold text-stone-900">{pet.name}</p>
                    <p className="text-sm text-stone-600">{pet.species} · {pet.tag}</p>
                    <p className="mt-1 text-xs font-semibold text-orange-600">{pet.age} · 到家 {pet.careDays} 天</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-stone-500" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <StatChip label="最新體重" value={`${pet.currentWeight}g`} />
                <StatChip label="最新餵食" value={pet.latestFeedDate} />
                <StatChip label="最新事件" value={pet.latestEvent} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </SwipeBackPage>
  )
}

function PetProfileScreen({ pet, onBack, onEdit, onOpenRecord, onOpenPlan, onOpenAI, onOpenAlbum, onOpenHistory }: { pet: PetProfile; onBack: () => void; onEdit: () => void; onOpenRecord: () => void; onOpenPlan: () => void; onOpenAI: () => void; onOpenAlbum: () => void; onOpenHistory: () => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="愛寵筆記" onBack={onBack} />

        <section className={`rounded-[30px] bg-gradient-to-br ${pet.color} p-5 shadow-sm`}>
          <div className="flex items-start gap-4">
            <MediaThumb src={pet.avatar} alt={pet.name} className="size-20 rounded-[26px] object-cover" fallbackClassName="flex items-center justify-center bg-white/85" fallbackTextClassName="text-5xl" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-600">區塊 A：個體摘要</p>
              <h3 className="mt-1 text-2xl font-bold text-stone-900">{pet.name}</h3>
              <p className="text-sm text-stone-700">{pet.species} · {pet.tag}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <ProfileSummaryCard label="飼養天數" value={`${pet.careDays} 天`} />
                <ProfileSummaryCard label="年齡" value={pet.age} />
                <ProfileSummaryCard label="最新體重" value={`${pet.currentWeight}g`} />
                <ProfileSummaryCard label="最新餵食日期" value={pet.latestFeedDate} />
              </div>
              <div className="mt-2 rounded-2xl bg-white/80 px-3 py-3 text-sm text-stone-700">最新事件：{pet.latestEvent}</div>
              <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={onEdit}>編輯資料</Button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">核心功能入口</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenRecord}>餵食／紀錄</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenPlan}>餵食計畫</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenAI}>寵AI+</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenAlbum}>爬寵相簿</Button>
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 to-rose-50 p-4 shadow-sm">
          <p className="text-sm leading-7 text-stone-700">{pet.aiLastLine}</p>
        </section>

        <LineChartCard title="體重變化圖" subtitle="近 1 個月" data={pet.weightSeries} unit="g" icon={<Weight className="size-4 text-orange-500" />} />
        <BarChartCard title="餵食頻率圖" subtitle="每週餵食次數" data={pet.feedFrequency} icon={<UtensilsCrossed className="size-4 text-orange-500" />} />
        <LineChartCard title="溫濕度趨勢" subtitle="近 1 個月濕度紀錄" data={pet.humiditySeries} unit="%" icon={<CalendarDays className="size-4 text-orange-500" />} />

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="size-4 text-orange-500" />
            <h4 className="text-base font-bold text-stone-900">近期事件時間軸</h4>
          </div>
          <div className="space-y-2">
            {pet.timeline.map((item) => (
              <div key={`${item.date}-${item.title}`} className="rounded-2xl bg-stone-50 px-4 py-3">
                <p className="text-xs font-semibold text-orange-500">{item.date}</p>
                <p className="text-sm font-bold text-stone-900">{item.title}</p>
                <p className="text-sm text-stone-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-orange-500">歷史紀錄</p>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenHistory}>查看更多</Button>
          </div>
          <div className="mt-3 space-y-2">
            {pet.records.map((record) => (
              <div key={`${record.date}-${record.type}`} className="rounded-2xl bg-stone-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-stone-900">{record.type}</p>
                  <p className="text-xs text-stone-500">{record.date}</p>
                </div>
                <p className="mt-1 text-sm text-stone-600">{record.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <button onClick={onOpenAlbum} className="text-sm font-semibold text-orange-500">爬寵相簿</button>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {pet.photos.map((photo, index) => (
              <MediaThumb key={`${photo}-${index}`} src={photo} alt={`${pet.name} photo ${index + 1}`} className="h-24 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-orange-50" fallbackTextClassName="text-3xl" />
            ))}
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function AlbumScreen({ pet, onBack }: { pet: PetProfile; onBack: () => void }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="爬寵相簿" onBack={onBack} />
        <section className="grid grid-cols-3 gap-2">
          {pet.photos.map((photo, index) => (
            <button key={`${photo}-${index}`} onClick={() => setSelectedPhoto(photo)}>
              <MediaThumb src={photo} alt={`${pet.name} ${index + 1}`} className="h-24 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-orange-50" fallbackTextClassName="text-3xl" />
            </button>
          ))}
        </section>
        {selectedPhoto && <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <MediaThumb src={selectedPhoto} alt={pet.name} className="h-64 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-4xl" />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full">下載</Button>
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setSelectedPhoto(null)}>關閉放大</Button>
          </div>
        </section>}
        <FloatingActionButton label="上傳" icon={<CirclePlus className="size-4" />} onClick={() => window.alert('開啟上傳')} />
      </div>
    </SwipeBackPage>
  )
}

function HistoryScreen({ pet, onBack }: { pet: PetProfile; onBack: () => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="完整歷史紀錄" onBack={onBack} />
        <section className="space-y-2">
          {pet.records.map((record) => (
            <div key={`${record.date}-${record.type}-${record.detail}`} className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-orange-100">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-stone-900">{record.type}</p>
                <p className="text-xs text-stone-500">{record.date}</p>
              </div>
              <p className="mt-2 text-sm text-stone-700">{record.detail}</p>
            </div>
          ))}
        </section>
      </div>
    </SwipeBackPage>
  )
}

function ConstructionScreen({ onBack }: { onBack: () => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="施工中" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white px-4 py-12 text-center shadow-sm">
          <p className="text-lg font-bold text-stone-900">施工中！敬請期待</p>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function RecordScreen({ onBack, onSubmitRecord }: { onBack: () => void; onSubmitRecord: (petId: string, record: { date: string; type: string; detail: string; abnormal?: boolean; withPhoto?: boolean }) => void }) {
  const [selectedPetId, setSelectedPetId] = useState('cream')
  const [hour, setHour] = useState('16')
  const [feed, setFeed] = useState('')
  const [feedWeight, setFeedWeight] = useState('')
  const [feedQuantity, setFeedQuantity] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [eventName, setEventName] = useState('')
  const [stool, setStool] = useState('')
  const [, setTagVersion] = useState(0)
  const [otherFeed, setOtherFeed] = useState('')
  const [otherEvent, setOtherEvent] = useState('')
  const [otherStool, setOtherStool] = useState('')
  const petPresetMap: Record<string, RecordPresetKey> = { cream: 'snake', ada: 'tortoise', gecko: 'gecko' }
  const speciesPreset = petPresetMap[selectedPetId] ?? 'snake'
  const preset = recordPresets[speciesPreset]
  const speciesLabel = speciesPreset === 'snake' ? '蛇' : speciesPreset === 'tortoise' ? '陸龜' : speciesPreset === 'gecko' ? '守宮' : preset.label
  const feedOptions = [...preset.foods, ...customRecordTags[speciesPreset].foods]
  const eventOptions = [...preset.events, ...customRecordTags[speciesPreset].events, '其他']
  const stoolOptions = ['成形正常', '偏稀', '拉稀', '帶血', ...customRecordTags[speciesPreset].stools, '其他']
  const hasDanger = ['異常', '拒食', '帶血', '拉稀'].some((item) => `${eventName} ${otherEvent} ${stool} ${otherStool}`.includes(item))

  const saveCustomTag = (kind: 'foods' | 'events' | 'stools', value: string, onSaved?: () => void) => {
    const content = value.trim()
    if (!content) return
    customRecordTags[speciesPreset][kind] = [...new Set([...customRecordTags[speciesPreset][kind], content])]
    setTagVersion((current) => current + 1)
    window.alert('已加入自定義標籤')
    onSaved?.()
  }

  const submit = () => {
    const finalFeed = feed === '其他' ? otherFeed.trim() : feed
    const finalEvent = eventName === '其他' ? otherEvent.trim() : eventName
    const finalStool = stool === '其他' ? otherStool.trim() : stool

    if (feed === '其他' && otherFeed.trim()) customRecordTags[speciesPreset].foods = [...new Set([...customRecordTags[speciesPreset].foods, otherFeed.trim()])]
    if (eventName === '其他' && otherEvent.trim()) customRecordTags[speciesPreset].events = [...new Set([...customRecordTags[speciesPreset].events, otherEvent.trim()])]
    if (stool === '其他' && otherStool.trim()) customRecordTags[speciesPreset].stools = [...new Set([...customRecordTags[speciesPreset].stools, otherStool.trim()])]

    const detail = [
      finalFeed || '',
      feedWeight ? `${feedWeight}g` : '',
      feedQuantity ? `${feedQuantity}` : '',
      finalEvent ? `事件 ${finalEvent}` : '',
      finalStool ? `排泄 ${finalStool}` : '',
      hour ? `${hour}:00` : '',
    ].filter(Boolean).join(' · ')

    onSubmitRecord(selectedPetId, { date: `2026/04/19`, type: finalEvent || '餵食', detail, abnormal: finalEvent.includes('異常') || finalStool.includes('帶血'), withPhoto: true })
  }

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="餵食／紀錄" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <SelectField label="選擇寵物" value={selectedPetId} onChange={setSelectedPetId} options={pets.map((pet) => ({ label: `${pet.name} · ${pet.species}`, value: pet.id }))} />
            <SelectField label="日期時間（只調整幾點）" value={hour} onChange={setHour} options={Array.from({ length: 24 }, (_, index) => ({ label: `${String(index).padStart(2, '0')}:00`, value: String(index).padStart(2, '0') }))} />
            <SelectField label={`餵食內容（${speciesLabel}）`} value={feed} onChange={setFeed} options={[{ label: '未選擇', value: '' }, ...feedOptions.map((item) => ({ label: item, value: item }))]} />
            {feed === '其他' && <div className="rounded-2xl bg-stone-50 px-4 py-4"><InputField label="其他餵食內容" value={otherFeed} onChange={setOtherFeed} placeholder="請輸入內容，例如小鼠" />{otherFeed.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('foods', otherFeed, () => setFeed(otherFeed.trim()))}>儲存成自定義標籤</Button>}</div>}
            <div className="grid grid-cols-2 gap-2">
              <InputField label="餵食重量" value={feedWeight} onChange={setFeedWeight} placeholder="例如 10" />
              <InputField label="餵食數量" value={feedQuantity} onChange={setFeedQuantity} placeholder="例如 2 隻" />
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-orange-500">進階選項</p>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setShowAdvanced((value) => !value)}>{showAdvanced ? '收起' : '展開'}</Button>
            </div>
            {showAdvanced && <div className="mt-3 space-y-3">
              <SelectField label="事件" value={eventName} onChange={setEventName} options={[{ label: '未選擇', value: '' }, ...eventOptions.map((item) => ({ label: item, value: item }))]} />
              {eventName === '其他' && <div className="rounded-2xl bg-white px-4 py-4"><InputField label="其他事件" value={otherEvent} onChange={setOtherEvent} placeholder="請輸入事件" />{otherEvent.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('events', otherEvent, () => setEventName(otherEvent.trim()))}>儲存成自定義標籤</Button>}</div>}
              <SelectField label="排泄" value={stool} onChange={setStool} options={[{ label: '未選擇', value: '' }, ...stoolOptions.map((item) => ({ label: item, value: item }))]} />
              {stool === '其他' && <div className="rounded-2xl bg-white px-4 py-4"><InputField label="其他排泄描述" value={otherStool} onChange={setOtherStool} placeholder="請輸入描述" />{otherStool.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('stools', otherStool, () => setStool(otherStool.trim()))}>儲存成自定義標籤</Button>}</div>}
              {hasDanger && <div className="flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700"><TriangleAlert className="mt-0.5 size-4 shrink-0" /><span>偵測到高風險紀錄，建議補充觀察與照片。</span></div>}
            </div>}
          </div>

          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-500">照片上傳 / 拍照</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">上傳照片</div>
              <div className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">拍照</div>
            </div>
          </div>

          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={submit}>送出</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function AddPetScreen({ onBack, onSave, initialPet, mode = 'create' }: { onBack: () => void; onSave: (pet: PetProfile) => void; initialPet?: PetProfile; mode?: 'create' | 'edit' }) {
  const [name, setName] = useState(initialPet?.name ?? '')
  const [speciesGroup, setSpeciesGroup] = useState(initialPet?.species.includes('龜') ? '龜類' : initialPet?.species.includes('守宮') ? '蜥蜴／守宮類' : initialPet?.species.includes('兩棲') ? '兩棲類' : initialPet?.species.includes('節肢') ? '節肢類' : '蛇類')
  const [speciesName, setSpeciesName] = useState(initialPet?.species ?? '')
  const [gender, setGender] = useState(initialPet?.tag ?? '未知')
  const [weight, setWeight] = useState(String(initialPet?.currentWeight ?? 58))
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g')
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('04')
  const [day, setDay] = useState('19')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title={mode === 'edit' ? '編輯寵物' : '新增寵物'} onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="名稱" value={name} onChange={setName} placeholder="請輸入寵物名稱" />
            <SelectField label="大類種類" value={speciesGroup} onChange={setSpeciesGroup} options={[{ label: '蛇類', value: '蛇類' }, { label: '蜥蜴／守宮類', value: '蜥蜴／守宮類' }, { label: '龜類', value: '龜類' }, { label: '兩棲類', value: '兩棲類' }, { label: '節肢類', value: '節肢類' }]} />
            <InputField label="詳細品種" value={speciesName} onChange={setSpeciesName} placeholder="請輸入詳細品種，例如玉米蛇、肥尾守宮" />
            <SelectField label="性別" value={gender} onChange={setGender} options={[{ label: '公', value: '公' }, { label: '母', value: '母' }, { label: '未知', value: '未知' }]} />
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">到家日期</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 12 }, (_, index) => String(2015 + index)).map((item) => <option key={item} value={item}>{item} 年</option>)}</select>
                <select value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((item) => <option key={item} value={item}>{item} 月</option>)}</select>
                <select value={day} onChange={(event) => setDay(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0')).map((item) => <option key={item} value={item}>{item} 日</option>)}</select>
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">當前體重</p>
              <div className="mt-2 flex gap-2">
                <input value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="例如 58" className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none" />
                <select value={weightUnit} onChange={(event) => setWeightUnit(event.target.value as 'g' | 'kg')} className="w-24 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none"><option value="g">g</option><option value="kg">kg</option></select>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-500">大頭貼上傳／拍照</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">上傳照片</div>
              <div className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">拍照</div>
              <div className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">APP 相簿</div>
            </div>
          </div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={() => onSave({
            id: initialPet?.id ?? `pet-${Date.now()}`,
            name: name || '新寵物',
            avatar: initialPet?.avatar ?? '🦎',
            species: speciesName || speciesGroup,
            tag: gender,
            status: initialPet?.status ?? '新加入',
            age: initialPet?.age ?? '未填寫',
            careDays: initialPet?.careDays ?? 0,
            currentWeight: weightUnit === 'kg' ? Number(weight || 0) * 1000 : Number(weight || 0),
            latestFeedDate: `${year}/${month}/${day}`,
            latestEvent: initialPet?.latestEvent ?? '剛加入',
            aiLastLine: initialPet?.aiLastLine ?? '先補齊基本資料，之後 AI 才能更準確幫你整理。',
            color: initialPet?.color ?? 'from-orange-100 via-amber-50 to-white',
            weightSeries: initialPet?.weightSeries ?? [{ date: '04/19', value: Number(weight || 0) }],
            feedFrequency: initialPet?.feedFrequency ?? [{ week: 'W1', count: 0 }],
            humiditySeries: initialPet?.humiditySeries ?? [{ date: '04/19', value: 0 }],
            timeline: initialPet?.timeline ?? [{ date: `${year}/${month}/${day}`, title: '完成建立', detail: '新寵物已建立' }],
            records: initialPet?.records ?? [],
            photos: initialPet?.photos ?? ['📷'],
          })}>{mode === 'edit' ? '儲存修改' : '儲存寵物'}</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function PlanScreen({ onBack, onOpenProfile, onCreatePlan, onUpdatePlan, onOpenCalendar }: { onBack: () => void; onOpenProfile: (id: string) => void; onCreatePlan: (payload: { petId: string; type: string; frequency: string; date: string; dates?: string[]; time: string }) => void; onUpdatePlan: (payload: { eventId: string; petId: string; type: string; frequency: string; date: string; time: string }) => void; onOpenCalendar: () => void }) {
  const [mode, setMode] = useState<'list' | 'settings' | 'create' | 'edit'>('list')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [createPetId, setCreatePetId] = useState('cream')
  const [createType, setCreateType] = useState('餵食')
  const [otherType, setOtherType] = useState('')
  const [, setPlanTagVersion] = useState(0)
  const [scheduleMode, setScheduleMode] = useState<'interval' | 'weekly'>('interval')
  const [intervalDays, setIntervalDays] = useState('5')
  const [weeklyDays, setWeeklyDays] = useState<string[]>(['一'])
  const [hour, setHour] = useState('20')
  const [minute, setMinute] = useState('00')
  const weekDays = [
    { label: '日', date: '2026-04-19' },
    { label: '一', date: '2026-04-20' },
    { label: '二', date: '2026-04-21' },
    { label: '三', date: '2026-04-22' },
    { label: '四', date: '2026-04-23' },
    { label: '五', date: '2026-04-24' },
    { label: '六', date: '2026-04-25' },
  ]
  const planItems = calendarEvents.filter((event) => event.date >= '2026-04-19' && event.date <= '2026-04-25')
  const selectedPlan = planItems.find((item) => item.id === selectedPlanId) ?? planItems[0] ?? null
  const firstWeeklyDate = weekDays.find((item) => weeklyDays.includes(item.label))?.date ?? '2026-04-20'
  const formattedFrequency = scheduleMode === 'interval' ? `每間隔 ${intervalDays} 天` : `每週 ${weeklyDays.join('、')} ${hour}:${minute}`
  const planTypeOptions = ['餵食', '泡水', '換水', ...customPlanTypes, '其他']
  const finalType = createType === '其他' ? otherType.trim() : createType
  const scheduledDates = scheduleMode === 'interval'
    ? weekDays.filter((_, index) => index % Math.max(Number(intervalDays || 1), 1) === 0).map((item) => item.date)
    : weekDays.filter((item) => weeklyDays.includes(item.label)).map((item) => item.date)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="餵食計畫" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setMode('settings')}>設定</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={() => setMode('create')}>新增計畫</Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenCalendar}>查看日曆</Button>
          </div>
          {mode === 'settings' && <div className="mt-4 rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-700"><button onClick={() => window.alert('跳轉至 APPLE 的設定')} className="rounded-full bg-white px-3 py-2 font-semibold text-stone-700">開啟通知</button></div>}
          {(mode === 'create' || mode === 'edit') && <div className="mt-4 grid gap-3">
            <SelectField label="寵物" value={createPetId} onChange={setCreatePetId} options={pets.map((pet) => ({ label: pet.name, value: pet.id }))} />
            <SelectField label="任務類型" value={createType} onChange={setCreateType} options={planTypeOptions.map((item) => ({ label: item, value: item }))} />
            {createType === '其他' && <div className="rounded-2xl bg-stone-50 px-4 py-4"><InputField label="其他任務類型" value={otherType} onChange={setOtherType} placeholder="請輸入任務類型" />{otherType.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => { customPlanTypes.push(otherType.trim()); setPlanTagVersion((value) => value + 1); setCreateType(otherType.trim()); window.alert('已加入自定義標籤') }}>儲存成自定義標籤</Button>}</div>}
            <SelectField label="頻率" value={scheduleMode} onChange={(value) => setScheduleMode(value as 'interval' | 'weekly')} options={[{ label: '每間隔數天', value: 'interval' }, { label: '每週特定時間', value: 'weekly' }]} />
            {scheduleMode === 'interval' ? <InputField label="每間隔幾天" value={intervalDays} onChange={setIntervalDays} placeholder="例如 5" /> : <div className="rounded-2xl bg-stone-50 px-4 py-4"><p className="text-xs font-semibold text-stone-500">選擇星期</p><div className="mt-2 flex flex-wrap gap-2">{weekDays.map((item) => <button key={item.label} onClick={() => setWeeklyDays((current) => current.includes(item.label) ? current.filter((entry) => entry !== item.label) : [...current, item.label])} className={`rounded-full px-3 py-2 text-sm font-semibold ${weeklyDays.includes(item.label) ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>{item.label}</button>)}</div></div>}
            <div className="grid grid-cols-2 gap-2">
              <SelectField label="小時" value={hour} onChange={setHour} options={Array.from({ length: 24 }, (_, index) => ({ label: String(index).padStart(2, '0'), value: String(index).padStart(2, '0') }))} />
              <SelectField label="分鐘" value={minute} onChange={setMinute} options={['00', '15', '30', '45'].map((item) => ({ label: item, value: item }))} />
            </div>
            <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-stone-700">排程預覽：{formattedFrequency}</div>
            <Button className="rounded-full bg-stone-900 text-white" onClick={() => mode === 'edit' && selectedPlan ? onUpdatePlan({ eventId: selectedPlan.id, petId: createPetId, type: finalType || '餵食', frequency: formattedFrequency, date: scheduledDates[0] ?? firstWeeklyDate, time: `${hour}:${minute}` }) : onCreatePlan({ petId: createPetId, type: finalType || '餵食', frequency: formattedFrequency, date: scheduledDates[0] ?? firstWeeklyDate, dates: scheduledDates, time: `${hour}:${minute}` })}>{mode === 'edit' ? '儲存修改' : '儲存計畫'}</Button>
          </div>}
          <div className="mt-4 grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayItems = planItems.filter((item) => item.date === day.date)
              return <div key={day.date} className="rounded-2xl bg-stone-50 px-2 py-3 text-center"><p className="text-xs font-semibold text-stone-500">{day.label}</p><p className="mt-1 text-xs text-stone-600">{day.date.slice(5)}</p><p className="mt-2 text-[11px] font-semibold text-stone-800">{dayItems.length ? `${dayItems.length} 筆` : '—'}</p>{dayItems.slice(0, 2).map((item) => <p key={item.id} className="mt-1 truncate text-[10px] text-stone-500">{item.petName}</p>)}</div>
            })}
          </div>
          <div className="mt-4 space-y-2">
            {planItems.map((plan) => (
              <div key={plan.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <button onClick={() => setSelectedPlanId(plan.id)} className="text-left">
                    <p className="text-sm font-bold text-stone-900">{plan.petName} · {plan.title}</p>
                    <p className="text-sm text-stone-600">{plan.date} {plan.time} · {plan.detail}</p>
                  </button>
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => { setSelectedPlanId(plan.id); setCreatePetId(plan.petId); setCreateType(plan.type === 'soak' ? '泡水' : plan.type === 'water' ? '換水' : '餵食'); setScheduleMode(plan.detail.includes('每週') ? 'weekly' : 'interval'); setIntervalDays(plan.detail.match(/(\d+)/)?.[1] ?? '5'); setHour(plan.time.split(':')[0]); setMinute(plan.time.split(':')[1]); setMode('edit') }}>編輯計畫</Button>
                </div>
              </div>
            ))}
          </div>
          {selectedPlan && <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4">
            <p className="text-sm font-semibold text-orange-500">計畫詳情</p>
            <p className="mt-2 text-sm font-bold text-stone-900">{selectedPlan.petName} · {selectedPlan.title}</p>
            <p className="mt-1 text-sm text-stone-700">{selectedPlan.date} {selectedPlan.time} · {selectedPlan.detail}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onOpenProfile(selectedPlan.petId)}>前往寵物頁</Button>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => window.alert('跳轉至 APPLE 的設定')}>通知權限引導</Button>
            </div>
          </div>}
        </section>
      </div>
    </SwipeBackPage>
  )
}

function CalendarScreen({ selectedDate, onSelectDate, onBack, onOpenProfile, onOpenRecord }: { selectedDate: string; onSelectDate: (date: string) => void; onBack: () => void; onOpenProfile: (id: string) => void; onOpenRecord: () => void }) {
  const [petFilter, setPetFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const filteredEvents = eventsByDate(selectedDate).filter((event) => (petFilter === 'all' || event.petId === petFilter) && (typeFilter === 'all' || event.type === typeFilter))
  const [selectedEventId, setSelectedEventId] = useState<string | null>(filteredEvents[0]?.id ?? null)
  const selectedEvent = filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0] ?? null
  const weeklyTodos = calendarEvents.filter((event) => event.date >= '2026-04-19' && event.date <= '2026-04-25')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="日曆" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <SelectField label="依寵物過濾" value={petFilter} onChange={setPetFilter} options={[{ label: '全部寵物', value: 'all' }, ...pets.map((pet) => ({ label: pet.name, value: pet.id }))]} />
            <SelectField label="依事件類型過濾" value={typeFilter} onChange={setTypeFilter} options={[{ label: '全部事件', value: 'all' }, { label: '餵食', value: 'feeding' }, { label: '泡水', value: 'soak' }, { label: '換水', value: 'water' }, { label: '觀察', value: 'observe' }, { label: '補充', value: 'supplement' }, { label: '體重', value: 'weight' }]} />
          </div>
          <MonthDotsCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">{selectedDate.replace('2026-', '')} 事件內容</p>
          <div className="mt-3 space-y-2">
            {filteredEvents.map((event) => (
              <button key={event.id} onClick={() => setSelectedEventId(event.id)} className="w-full rounded-2xl bg-stone-50 px-4 py-3 text-left">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-stone-900">{event.petName} · {event.title}</p>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${event.done ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{event.time}</span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{event.detail}</p>
              </button>
            ))}
          </div>
          {selectedEvent && <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4">
            <p className="text-sm font-semibold text-orange-500">事件詳情</p>
            <p className="mt-2 text-sm font-bold text-stone-900">{selectedEvent.petName} · {selectedEvent.title}</p>
            <p className="mt-1 text-sm text-stone-700">{selectedEvent.date} {selectedEvent.time} · {selectedEvent.detail}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onOpenProfile(selectedEvent.petId)}>前往寵物頁</Button>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenRecord}>前往紀錄頁</Button>
            </div>
          </div>}
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">7 天內待辦</p>
          <div className="mt-3 space-y-2">
            {weeklyTodos.map((event) => (
              <div key={event.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                <p className="text-sm font-bold text-stone-900">{event.date.replace('2026-', '')} · {event.petName}</p>
                <p className="text-sm text-stone-600">{event.title} · {event.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function DiscussionScreen({ onOpenArticle }: { onOpenArticle: (id: string) => void }) {
  return (
    <div className="relative space-y-4 pb-24">
      <SectionHeader eyebrow="討論" title="可上傳圖片的異寵論壇" />
      <div className="space-y-3">
        {discussionPosts.map((post) => (
          <button key={post.id} onClick={() => onOpenArticle(post.id)} className="flex w-full gap-3 rounded-[26px] bg-white p-3 text-left shadow-sm ring-1 ring-orange-100">
            <MediaThumb src={post.images[0] ?? post.coverLabel} alt={post.title} className="h-24 w-24 shrink-0 rounded-[20px] object-cover" fallbackClassName="flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100 px-3 text-center" fallbackTextClassName="text-xs font-semibold text-stone-700" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold text-stone-900">{post.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">{post.summary}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span className="inline-flex items-center gap-1"><Heart className="size-3.5" /> {post.likes}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {(postComments[post.id] ?? []).length}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function EditorScreen({ title, body, onTitleChange, onBodyChange, onBack, onPublish, coverImage, onCoverImageChange, images, onImagesChange }: { title: string; body: string; onTitleChange: (value: string) => void; onBodyChange: (value: string) => void; onBack: () => void; onPublish: () => void; coverImage: string; onCoverImageChange: (value: string) => void; images: string[]; onImagesChange: (value: string[]) => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="發文編輯器" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} placeholder="輸入標題" className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
            <button onClick={() => onCoverImageChange(mockUploadImages[(mockUploadImages.indexOf(coverImage) + 1) % mockUploadImages.length])} className="rounded-2xl bg-orange-50 px-3 py-4 text-center">封面圖上傳</button>
            <button onClick={() => {
              const next = mockUploadImages.find((item) => !images.includes(item) && item !== coverImage)
              if (next && images.length < 5) onImagesChange([...images, next])
            }} className="rounded-2xl bg-orange-50 px-3 py-4 text-center">文中圖片上傳 ({images.length}/5)</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MediaThumb src={coverImage} alt="cover" className="h-20 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-xs text-stone-500" />
            {images.map((image) => (
              <button key={image} onClick={() => onImagesChange(images.filter((item) => item !== image))} className="relative">
                <MediaThumb src={image} alt="body" className="h-20 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-xs text-stone-500" />
                <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">移除</span>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-stone-50 px-4 py-3 text-xs text-stone-600">mock 上傳方式：點封面圖切換素材，點文中圖片上傳可加入，點已加入圖片可移除。</div>
          <textarea value={body} onChange={(event) => onBodyChange(event.target.value)} placeholder="輸入正文內容" className="mt-3 min-h-40 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none" />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => window.alert('草稿已儲存')}>草稿儲存</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={onPublish}>發布</Button>
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function ArticleScreen({ post, liked, onBack, onLike, onSubmitComment, onEdit }: { post: DiscussionPost; liked: boolean; onBack: () => void; onLike: () => void; onSubmitComment: (postId: string, text: string) => boolean; onEdit: () => void }) {
  const [commentText, setCommentText] = useState('')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="文章內頁" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-xl font-bold text-stone-900">{post.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>{post.category}</span>
            <span className="inline-flex items-center gap-1"><Heart className="size-3.5" /> {post.likes}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {(postComments[post.id] ?? []).length}</span>
            {post.isMine && <Button variant="secondary" size="sm" className="rounded-full" onClick={onEdit}>編輯</Button>}
          </div>
          <MediaThumb src={post.images[0] ?? post.coverLabel} alt={post.title} className="mt-4 h-52 w-full rounded-[24px] object-cover" fallbackClassName="flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100" fallbackTextClassName="text-sm font-semibold text-stone-700" />
          <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-4 text-base font-semibold leading-8 text-stone-800">{post.content[0]}</p>
          <div className="mt-4 space-y-4 text-sm leading-8 text-stone-700">
            {post.content.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {post.images.length > 1 && <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {post.images.slice(1).map((image) => (
              <div key={image} className="min-w-[170px]">
                <MediaThumb src={image} alt={post.title} className="h-32 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-orange-50 px-4 py-6 text-center" fallbackTextClassName="text-sm font-semibold text-stone-700" />
              </div>
            ))}
          </div>}
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="rounded-full" onClick={onLike}><Heart className="mr-1 size-4" />{liked ? `已按愛心 ${post.likes}` : `愛心 ${post.likes}`}</Button>
            <Button variant="secondary" className="rounded-full"><MessageCircle className="mr-1 size-4" />留言 {(postComments[post.id] ?? []).length}</Button>
          </div>
        </section>
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">留言區</p>
          <div className="mt-3 space-y-2">
            {(postComments[post.id] ?? []).map((comment, index) => (
              <div key={`${comment.author}-${index}`} className="rounded-2xl bg-stone-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-stone-900">{comment.author}</p>
                  <p className="text-xs text-stone-500">{comment.date}</p>
                </div>
                <p className="mt-1 text-sm text-stone-600">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3">
            <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="輸入留言..." className="min-h-20 w-full resize-none bg-transparent text-sm outline-none" />
            <Button className="mt-2 w-full rounded-full bg-stone-900 text-white" onClick={() => { const ok = onSubmitComment(post.id, commentText); if (ok) setCommentText('') }}>送出留言</Button>
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function ShopScreen({ onOpenProduct, onAddToCart }: { onOpenProduct: (id: string) => void; onAddToCart: (id: string) => void }) {
  return (
    <div className="relative space-y-4 pb-24">
      <SectionHeader eyebrow="商店" title="平台自營商品流" />
      <section className="rounded-[28px] bg-gradient-to-r from-orange-300 via-rose-300 to-pink-300 p-4 text-white shadow-sm">
        <p className="text-sm font-semibold">平台自營精選</p>
        <h3 className="mt-1 text-xl font-bold">餌料、器材、周邊，一次買齊</h3>
      </section>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-[24px] bg-white p-3 text-left shadow-sm ring-1 ring-orange-100">
            <button onClick={() => onOpenProduct(product.id)} className="w-full text-left">
              <div className="relative">
                <MediaThumb src={product.image} alt={product.name} className="h-32 w-full rounded-[20px] object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-5xl" />
                <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">{product.badge}</span>
              </div>
              <p className="mt-3 text-xs font-semibold text-orange-500">{product.category}</p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-stone-900">{product.name}</p>
              <p className="mt-2 text-base font-bold text-orange-600">NT$ {product.price}</p>
              <p className="mt-1 text-xs text-stone-500">現貨 {product.stock}</p>
            </button>
            <Button className="mt-3 w-full rounded-full bg-stone-900 text-white" onClick={() => onAddToCart(product.id)}>加入購物車</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductScreen({ product, onAddToCart, onBuyNow, onBack }: { product: Product; onAddToCart: () => void; onBuyNow: () => void; onBack: () => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="商品詳情頁" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <MediaThumb src={product.image} alt={product.name} className="h-56 w-full rounded-[24px] object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-7xl" />
          <p className="mt-4 text-xs font-semibold text-orange-500">{product.category}</p>
          <h3 className="mt-1 text-2xl font-bold text-stone-900">{product.name}</h3>
          <p className="mt-2 text-2xl font-bold text-orange-600">NT$ {product.price}</p>
          <p className="mt-3 text-sm leading-7 text-stone-700">{product.desc}</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-700">
            <div className="rounded-2xl bg-stone-50 px-4 py-3">規格：{product.specs.join(' / ')}</div>
            <div className="rounded-2xl bg-stone-50 px-4 py-3">庫存：{product.stock}</div>
            <div className="rounded-2xl bg-stone-50 px-4 py-3">出貨資訊：{product.shipping}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={onAddToCart}>加入購物車</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={onBuyNow}>立即購買</Button>
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function CartScreen({ cart, onBack, onCheckout }: { cart: CartLine[]; onBack: () => void; onCheckout: () => void }) {
  const cartProducts = cart.map((line) => {
    const product = products.find((item) => item.id === line.productId)
    return product ? { ...product, qty: line.qty } : null
  }).filter(Boolean) as (Product & { qty: number })[]
  const total = cartProducts.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="購物車" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {cartProducts.length === 0 ? (
              <div className="rounded-2xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">目前購物車是空的</div>
            ) : (
              cartProducts.map((item) => (
                <div key={item.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                  <p className="text-sm font-bold text-stone-900">{item.name}</p>
                  <p className="text-sm text-stone-600">數量 {item.qty} · NT$ {item.price}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-stone-800">總計：NT$ {total}</div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onCheckout}>前往結帳</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function CheckoutScreen({ cart, onBack }: { cart: CartLine[]; onBack: () => void }) {
  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return sum + (product ? product.price * item.qty : 0)
  }, 0)
  const [recipient, setRecipient] = useState('Bao')
  const [phone, setPhone] = useState('09')
  const [region, setRegion] = useState('台北市')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="結帳頁" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="收件人姓名" value={recipient} onChange={setRecipient} placeholder="請輸入收件人姓名" />
            <InputField label="手機號碼" value={phone} onChange={setPhone} placeholder="請輸入手機號碼" />
            <InputField label="縣市 / 地區" value={region} onChange={setRegion} placeholder="請輸入縣市 / 地區" />
            <InputField label="地址" value={address} onChange={setAddress} placeholder="請輸入地址" />
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">備註</p>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="請輸入備註" className="mt-2 min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none" />
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-stone-800">訂單總額：NT$ {total}</div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={() => window.alert('訂單已送出')}>送出訂單</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function MemberScreen({ isLoggedIn, onOpenLogin }: { isLoggedIn: boolean; onOpenLogin: () => void }) {
  const [tab, setTab] = useState<'profile' | 'pets' | 'posts' | 'orders' | 'notifications'>('profile')
  const [memberName, setMemberName] = useState(memberProfile.name)
  const [memberEmail, setMemberEmail] = useState(memberProfile.email)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [activeOrder, setActiveOrder] = useState<'RL+1024' | 'RL+1021'>('RL+1024')

  const tabContent = {
    profile: <div className="grid gap-3">
      <InputField label="會員名稱" value={memberName} onChange={setMemberName} placeholder="請輸入會員名稱" />
      <InputField label="Email" value={memberEmail} onChange={setMemberEmail} placeholder="請輸入 Email" />
      <FieldCard label="出生年" value={memberProfile.year} />
      <FieldCard label="性別" value={memberProfile.gender} />
      <Button className="rounded-full bg-stone-900 text-white" onClick={() => window.alert('會員資料已儲存')}>儲存資料</Button>
    </div>,
    pets: <div className="space-y-2">{pets.slice(0, 3).map((pet) => <div key={pet.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{pet.name} · {pet.species} · 到家 {pet.careDays} 天</div>)}</div>,
    posts: <div className="space-y-2">{discussionPosts.filter((post) => post.isMine).map((post) => <div key={post.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{post.title}</div>)}</div>,
    orders: <div className="space-y-3"><div className="flex gap-2"><Button variant={activeOrder === 'RL+1024' ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setActiveOrder('RL+1024')}>#RL+1024</Button><Button variant={activeOrder === 'RL+1021' ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setActiveOrder('RL+1021')}>#RL+1021</Button></div><div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{activeOrder === 'RL+1024' ? '冷凍乳鼠 30 入，待出貨，預計明天到貨。' : '溫濕度計，已送達，可前往評價。'}</div></div>,
    notifications: <div className="space-y-3"><button onClick={() => { setNotificationsEnabled((value) => !value); window.alert('跳轉至 APPLE 的設定') }} className="flex w-full items-center justify-between rounded-2xl bg-stone-50 px-4 py-4 text-left text-sm font-semibold text-stone-700"><span>開啟通知</span><span className={`rounded-full px-3 py-1 text-xs ${notificationsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>{notificationsEnabled ? '已開啟' : '未開啟'}</span></button></div>,
  } satisfies Record<string, React.ReactNode>

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader eyebrow="會員" title="會員系統" />
      {!isLoggedIn ? (
        <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
          <p className="text-base font-bold text-stone-900">尚未登入</p>
          <p className="mt-2 text-sm leading-7 text-stone-600">請先登入，才能查看我的資料、我的訂單與通知設定。</p>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onOpenLogin}>前往登入</Button>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-base font-bold text-stone-900">{memberProfile.name}</p>
            <p className="text-sm text-stone-600">{memberProfile.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['profile', '我的資料'],
              ['pets', '我的爬寵摘要'],
              ['posts', '我的文章'],
              ['orders', '我的訂單'],
              ['notifications', '通知設定'],
            ].map(([key, label]) => (
              <Button key={key} variant={tab === key ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setTab(key as typeof tab)}>{label}</Button>
            ))}
          </div>
          <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-orange-100">
            {tabContent[tab]}
          </div>
        </section>
      )}
    </div>
  )
}

function LoginScreen({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="登入 / 註冊" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="Email" value={email} onChange={setEmail} placeholder="請輸入 Email" />
            <InputField label="密碼" value={password} onChange={setPassword} placeholder="請輸入密碼" />
            <InputField label="暱稱（註冊）" value={nickname} onChange={setNickname} placeholder="請輸入暱稱" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full">Google</Button>
            <Button variant="secondary" className="flex-1 rounded-full">Apple</Button>
          </div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onLogin}>登入</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function isImagePath(value: string) {
  return value.startsWith('/mock-images/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(value)
}

function MediaThumb({ src, alt, className, fallbackClassName = '', fallbackTextClassName = '' }: { src: string; alt: string; className: string; fallbackClassName?: string; fallbackTextClassName?: string }) {
  if (isImagePath(src)) {
    return <img src={src} alt={alt} className={className} />
  }

  return <div className={`${className} ${fallbackClassName} ${fallbackTextClassName}`}>{src}</div>
}

function FloatingActionButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute bottom-24 right-4 z-20 flex items-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      {icon}
      {label}
    </button>
  )
}

function BottomNav({ current, onChange }: { current: ScreenKey; onChange: (next: MainTab) => void }) {
  const activeTab: MainTab =
    current === 'pets' || current === 'addPet' || current === 'editPet' || current === 'profile' || current === 'record' || current === 'plan' || current === 'album' || current === 'history' || current === 'construction'
      ? 'petHub'
      : current === 'article' || current === 'editor'
        ? 'discussion'
        : current === 'product' || current === 'cart' || current === 'checkout'
          ? 'shop'
          : current === 'calendar' || current === 'ai'
            ? 'home'
            : current === 'login'
              ? 'member'
              : current

  const items: { key: MainTab; label: string; icon: React.ReactNode }[] = [
    { key: 'petHub', label: '爬寵', icon: <PawPrint className="size-4" /> },
    { key: 'discussion', label: '討論', icon: <MessageCircleMore className="size-4" /> },
    { key: 'home', label: '首頁', icon: <House className="size-4" /> },
    { key: 'shop', label: '商店', icon: <ShoppingBag className="size-4" /> },
    { key: 'member', label: '會員', icon: <UserRound className="size-4" /> },
  ]

  return (
    <nav className="absolute inset-x-0 bottom-0 border-t border-orange-100 bg-white/95 px-3 py-3 backdrop-blur">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const active = activeTab === item.key
          return (
            <button key={item.key} onClick={() => onChange(item.key)} className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${active ? 'text-orange-600' : 'text-stone-500'}`}>
              <div className={`flex size-10 items-center justify-center rounded-full ${active ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-500'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-orange-500">{eyebrow}</p>
      <h3 className="text-2xl font-bold text-stone-900">{title}</h3>
    </div>
  )
}

function SubPageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-start gap-3">
      <Button variant="secondary" className="mt-1 rounded-full" onClick={onBack}>
        <ChevronLeft className="size-4" />
      </Button>
      <div>
        <p className="text-sm font-semibold text-orange-500">子頁面</p>
        <h3 className="text-2xl font-bold text-stone-900">{title}</h3>
      </div>
    </div>
  )
}

function SwipeBackPage({ onBack, children }: { onBack: () => void; children: React.ReactNode }) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const handleStart = (x: number, y: number) => {
    startX.current = x
    startY.current = y
  }

  const handleEnd = (x: number, y: number) => {
    if (startX.current === null || startY.current === null) return
    const dx = x - startX.current
    const dy = Math.abs(y - startY.current)
    if (startX.current < 80 && dx > 120 && dy < 100) onBack()
    startX.current = null
    startY.current = null
  }

  return (
    <div
      onTouchStart={(event) => handleStart(event.changedTouches[0]?.clientX ?? 0, event.changedTouches[0]?.clientY ?? 0)}
      onTouchEnd={(event) => handleEnd(event.changedTouches[0]?.clientX ?? 0, event.changedTouches[0]?.clientY ?? 0)}
      onPointerDown={(event) => handleStart(event.clientX, event.clientY)}
      onPointerUp={(event) => handleEnd(event.clientX, event.clientY)}
    >
      {children}
    </div>
  )
}

function AIScreen({ selectedPetId, onChangePet, onBack }: { selectedPetId: string; onChangePet: (id: string) => void; onBack: () => void }) {
  const conversation = aiConversations[selectedPetId] ?? []
  const pet = petById(selectedPetId)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="flex h-[620px] flex-col gap-3 pb-2">
        <SubPageHeader title="寵 AI+ 助手" onBack={onBack} />
        <section className="rounded-[24px] border border-orange-100 bg-white p-3 shadow-sm">
          <select value={selectedPetId} onChange={(event) => onChangePet(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none">
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name} · {pet.species}</option>
            ))}
          </select>
          {pet && <div className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-stone-700">最新狀態：{pet.latestEvent}<br />AI 建議：{pet.aiLastLine}</div>}
        </section>
        <section className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-orange-100 bg-white p-3 shadow-sm">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {conversation.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`rounded-[20px] px-4 py-3 text-sm leading-7 ${item.role === 'assistant' ? 'mr-8 bg-stone-50 text-stone-800' : 'ml-8 bg-orange-100 text-stone-900'}`}>
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-[20px] border border-stone-200 bg-stone-50 px-2 py-2">
            <div className="flex items-end gap-2">
              <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm">📷</button>
              <textarea defaultValue="" placeholder="輸入訊息..." rows={1} className="min-h-10 max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" />
              <Button className="rounded-full bg-stone-900 text-white">送出</Button>
            </div>
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function HubCard({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-[26px] bg-white px-4 py-4 text-left shadow-sm ring-1 ring-orange-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold text-stone-900">{title}</p>
          <p className="mt-1 text-sm text-stone-600">{desc}</p>
        </div>
        <ChevronRight className="size-5 text-stone-400" />
      </div>
    </button>
  )
}

function BentoBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-lg font-bold text-stone-900">{title}</h4>
        </div>
      </div>
      {children}
    </section>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 px-3 py-3">
      <p className="text-[11px] font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-xs font-semibold text-stone-800">{value}</p>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none" />
    </div>
  )
}

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-sm text-stone-700">{value}</p>
    </div>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (value: string) => void }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function ProfileSummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 px-3 py-3">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-stone-900">{value}</p>
    </div>
  )
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[24px] border border-orange-100 bg-white p-5">
      <h3 className="text-lg font-bold text-stone-900">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-stone-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-orange-50 px-3 py-2">{item}</li>
        ))}
      </ul>
    </section>
  )
}

function LineChartCard({ title, subtitle, data, unit, icon }: { title: string; subtitle: string; data: { date: string; value: number }[]; unit: string; icon: React.ReactNode }) {
  const values = data.map((item) => item.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(max - min, 1)
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${90 - ((item.value - min) / range) * 60}`).join(' ')

  return (
    <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <div>
          <h4 className="text-base font-bold text-stone-900">{title}</h4>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible rounded-2xl bg-orange-50 p-3">
        <polyline fill="none" stroke="#f97316" strokeWidth="3" points={points} />
        {data.map((item, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100
          const y = 90 - ((item.value - min) / range) * 60
          return <circle key={item.date} cx={x} cy={y} r="2.6" fill="#ea580c" />
        })}
      </svg>
      <div className="mt-3 grid grid-cols-5 gap-2 text-center text-[11px] text-stone-500">
        {data.map((item) => (
          <div key={item.date}>
            <p>{item.date}</p>
            <p className="font-semibold text-stone-700">{item.value}{unit}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BarChartCard({ title, subtitle, data, icon }: { title: string; subtitle: string; data: { week: string; count: number }[]; icon: React.ReactNode }) {
  const max = Math.max(...data.map((item) => item.count), 1)
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - (item.count / max) * 80}`).join(' ')
  return (
    <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <div>
          <h4 className="text-base font-bold text-stone-900">{title}</h4>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-orange-50 p-4">
        <svg viewBox="0 0 100 100" className="h-32 w-full overflow-visible">
          <polyline fill="none" stroke="#fb923c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={points} />
          {data.map((item, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 100
            const y = 100 - (item.count / max) * 80
            return <circle key={item.week} cx={x} cy={y} r="3.5" fill="#ea580c" />
          })}
        </svg>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-stone-600">
          {data.map((item) => (
            <div key={item.week}>
              <p>{item.week}</p>
              <p className="font-semibold text-stone-900">{item.count} 次</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MonthDotsCalendar({ compact = false, selectedDate, onSelectDate }: { compact?: boolean; selectedDate?: string; onSelectDate: (date: string) => void }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-stone-900">2026 年 4 月</p>
        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" /> 餵食</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-sky-500" /> 其他</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-stone-500">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className={`mt-3 grid grid-cols-7 gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        {monthDays.map((day) => {
          const date = `2026-04-${String(day).padStart(2, '0')}`
          const events = eventsByDate(date)
          const hasFeed = events.some((event) => event.type === 'feeding')
          const hasOther = events.some((event) => event.type !== 'feeding')
          const active = selectedDate === date
          return (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              className={`rounded-2xl border px-2 py-2 text-left ${active ? 'border-orange-300 bg-orange-50' : 'border-stone-100 bg-stone-50'}`}
            >
              <p className={`font-bold ${active ? 'text-orange-600' : 'text-stone-600'}`}>{day}</p>
              <div className="mt-2 flex gap-1">
                {hasFeed && <span className="size-2 rounded-full bg-red-500" />}
                {hasOther && <span className="size-2 rounded-full bg-sky-500" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function petById(id: string) {
  return pets.find((pet) => pet.id === id)
}

function eventsByDate(date: string): CalendarEvent[] {
  return calendarEvents.filter((event) => event.date === date)
}

export default App
