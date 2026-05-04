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
import { aiConversations, calendarEvents, discussionPosts, memberProfile, mockUploadImages, pets, postComments, products, type CalendarEvent, type DiscussionPost, type PetProfile, type Product } from '@/mockDataEng'

type MainTab = 'petHub' | 'discussion' | 'home' | 'shop' | 'member'
type ScreenKey = MainTab | 'pets' | 'addPet' | 'editPet' | 'profile' | 'record' | 'plan' | 'article' | 'editor' | 'product' | 'cart' | 'checkout' | 'calendar' | 'login' | 'ai' | 'album' | 'history' | 'construction'

type CartLine = { productId: string; qty: number }

type RecordPresetKey = 'snake' | 'gecko' | 'tortoise' | 'turtle' | 'amphibian' | 'arthropod'

const recordPresets: Record<RecordPresetKey, { label: string; foods: readonly string[]; extrasTitle: string; extras: readonly string[]; events: readonly string[]; risk: string }> = {
  snake: {
    label: 'Snakes',
    foods: ['pinky mice', 'small mice', 'adult mice', 'Other'],
    extrasTitle: 'Feeding Method',
    extras: ['Thawed Frozen', 'Live Prey'],
    events: ['Pre-shed', 'Shed Complete', 'Regurgitation', 'Food Refusal', 'Excretion', 'Abnormal Status'],
    risk: 'Regurgitation is a high-risk event. Show a follow-up reminder after saving.',
  },
  gecko: {
    label: 'Gecko / Lizard',
    foods: ['Dubia', 'Crickets', 'Mealworms', 'Fruit Puree', 'CGD', 'Leafy Greens', 'Commercial Diet', 'Other'],
    extrasTitle: 'Supplement Shortcuts',
    extras: ['Calcium Powder (No D3)', 'Calcium Powder (With D3)', 'Vitamins'],
    events: ['Shed', 'Stuck Shed', 'Excretion', 'Food Refusal', 'Lower Activity', 'Egg Laying', 'Tail Drop'],
    risk: 'Stuck shed and food refusal should be marked for follow-up quickly.',
  },
  tortoise: {
    label: 'Tortoise',
    foods: ['Hay', 'Leafy Greens', 'Wild Greens', 'Tortoise Pellets', 'Other'],
    extrasTitle: 'Common Events',
    extras: ['Soaking', 'Basking', 'Weighing', 'Shell Length'],
    events: ['Excretion', 'Poor Appetite', 'Eye Issue', 'Shell Issue', 'Pyramiding / Shell Deformity'],
    risk: 'Eye and shell issues need high attention.',
  },
  turtle: {
    label: 'Aquatic Turtle',
    foods: ['Aquatic Turtle Pellets', 'Leafy Greens', 'Aquatic Plants', 'Insects / Shrimp / Fish Protein', 'Other'],
    extrasTitle: 'Common Events',
    extras: ['Water Change', 'Basking', 'Weighing'],
    events: ['Excretion', 'Poor Appetite', 'Eye Issue', 'Shell Issue'],
    risk: 'Water changes and basking are high-frequency records.',
  },
  amphibian: {
    label: 'Amphibian',
    foods: ['Crickets', 'Fruit Flies', 'Earthworms', 'Small Live Prey', 'Feed', 'Other'],
    extrasTitle: 'Common Events',
    extras: ['Water Change', 'Misting / Humidifying', 'Shed'],
    events: ['Food Refusal', 'Skin Issue', 'Lower Activity'],
    risk: 'Skin issues should be recorded with photos.',
  },
  arthropod: {
    label: 'Arthropod',
    foods: ['Crickets', 'Dubia', 'Mealworms', 'Other'],
    extrasTitle: 'Common Events',
    extras: ['Food Refusal', 'Resting', 'Webbing / Sealing'],
    events: ['Successful Molt', 'Failed Molt', 'Appearance Issue'],
    risk: 'Failed molt needs immediate follow-up.',
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
    ? `Latest status: "${pet.latestEvent}". Next task: ${nextPending.date.replace('2026-', '')} ${nextPending.time}  - ${nextPending.title}.`
    : `Latest status: "${pet.latestEvent}」，No new pending tasks for now. Keep observing.`
}

function addPhotoToPet(petId: string, photo: string) {
  const pet = petById(petId)
  if (!pet) return
  pet.photos = [photo, ...pet.photos.filter((item) => item !== photo)]
}

function movePhotoToPet(photo: string, nextPetId: string) {
  pets.forEach((pet) => {
    pet.photos = pet.photos.filter((item) => item !== photo)
  })
  addPhotoToPet(nextPetId, photo)
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
  const [albumFilterPetId, setAlbumFilterPetId] = useState<string>('all')
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
    window.alert('Saved')
    goBack('pets')
  }

  const updatePet = (updatedPet: PetProfile) => {
    refreshPetAiLine(updatedPet)
    const index = pets.findIndex((pet) => pet.id === updatedPet.id)
    if (index >= 0) pets[index] = updatedPet
    setDataVersion((value) => value + 1)
    setSelectedPetId(updatedPet.id)
    window.alert('Saved')
    goBack('profile')
  }

  const saveRecord = (petId: string, record: { date: string; type: string; detail: string; abnormal?: boolean; withPhoto?: boolean }) => {
    const target = pets.find((pet) => pet.id === petId)
    if (!target) return
    target.records.unshift(record)
    target.timeline.unshift({ date: record.date.replaceAll('/', '-').slice(5), title: record.type, detail: record.detail })
    target.latestEvent = `${record.type} · ${record.detail}`
    if (record.withPhoto) addPhotoToPet(petId, mockUploadImages[(target.photos.length + 1) % mockUploadImages.length])
    if (record.type === 'Feeding') target.latestFeedDate = record.date
    const linkedPlan = calendarEvents.find((event) => event.petId === petId && !event.done && (event.type === 'feeding' || event.type === 'soak' || event.type === 'observe'))
    if (linkedPlan) linkedPlan.done = true
    refreshPetAiLine(target)
    setDataVersion((value) => value + 1)
    setSelectedPetId(petId)
    window.alert('Record saved')
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
        type: payload.type === 'Soaking' ? 'soak' : payload.type === 'Water Change' ? 'water' : 'feeding',
        title: `${pet.name}${payload.type}`,
        detail: payload.frequency,
        time: payload.time,
        done: false,
      })
    })
    refreshPetAiLine(pet)
    setDataVersion((value) => value + 1)
    window.alert('Plan saved')
  }

  const updatePlan = (payload: { eventId: string; petId: string; type: string; frequency: string; date: string; time: string }) => {
    const target = calendarEvents.find((event) => event.id === payload.eventId)
    const pet = pets.find((item) => item.id === payload.petId)
    if (!target || !pet) return
    target.petId = pet.id
    target.petName = pet.name
    target.type = payload.type === 'Soaking' ? 'soak' : payload.type === 'Water Change' ? 'water' : 'feeding'
    target.title = `${pet.name}${payload.type}`
    target.detail = payload.frequency
    target.date = payload.date
    target.time = payload.time
    refreshPetAiLine(pet)
    setDataVersion((value) => value + 1)
    window.alert('Plan updated')
  }

  const attachPhotoToPet = (petId: string, source: 'upload' | 'camera' | 'album') => {
    const pet = petById(petId)
    if (!pet) return
    const pool = source === 'album' ? [...pet.photos, ...mockUploadImages] : mockUploadImages
    const nextPhoto = pool.find((item) => !pet.photos.includes(item)) ?? pool[0]
    addPhotoToPet(petId, nextPhoto)
    setDataVersion((value) => value + 1)
    window.alert(`Photo added to ${pet.name}  Reptile Album`)
  }

  const likePost = (postId: string) => {
    if (likedPostIds.includes(postId)) {
      window.alert('You already liked this article.')
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
      window.alert('Please enter a comment first.')
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
      window.alert('Please enter a title and body first.')
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
      window.alert('Article updated')
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
      category: 'Beginner Question',
      images: [draftCoverImage, ...draftImages],
      content: paragraphs.length ? paragraphs : [draftBody],
      isMine: true,
    }
    discussionPosts.unshift(newPost)
    postComments[id] = []
    setDataVersion((value) => value + 1)
    window.alert('Article published')
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
                  onOpenAlbum={() => { setAlbumFilterPetId('all'); navigateTo('album') }}
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
                  onOpenAlbum={() => { setAlbumFilterPetId('all'); navigateTo('album') }}
                />
              )}

              {screen === 'pets' && (
                <PetsScreen
                  onBack={() => goBack()}
                  onOpenProfile={openProfile}
                />
              )}

              {screen === 'addPet' && <AddPetScreen onBack={() => goBack()} onSave={savePet} onAttachPhoto={attachPhotoToPet} />}
              {screen === 'editPet' && <AddPetScreen onBack={() => goBack()} onSave={updatePet} onAttachPhoto={attachPhotoToPet} initialPet={selectedPet} mode="edit" />}
              {screen === 'profile' && <PetProfileScreen pet={selectedPet} onBack={() => goBack()} onEdit={() => navigateTo('editPet')} onOpenRecord={() => navigateTo('record')} onOpenPlan={() => navigateTo('plan')} onOpenAI={() => openAI('profile')} onOpenAlbum={() => { setAlbumFilterPetId(selectedPet.id); navigateTo('album') }} onOpenHistory={() => navigateTo('history')} />}
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
                  onAddToCart={() => { addToCart(selectedProduct.id); window.alert('Added to cart') }}
                  onBuyNow={() => { addToCart(selectedProduct.id); navigateTo('checkout') }}
                  onBack={() => goBack()}
                />
              )}
              {screen === 'cart' && <CartScreen cart={cart} onBack={() => goBack()} onCheckout={() => navigateTo('checkout')} />}
              {screen === 'checkout' && <CheckoutScreen cart={cart} onBack={() => goBack()} />}
              {screen === 'member' && <MemberScreen isLoggedIn={isLoggedIn} onOpenLogin={() => navigateTo('login')} />}
              {screen === 'login' && <LoginScreen onBack={() => goBack()} onLogin={() => { setIsLoggedIn(true); goBack('member') }} />}
              {screen === 'ai' && <AIScreen selectedPetId={selectedPetId} onChangePet={setSelectedPetId} onBack={() => goBack(aiBackTarget)} />}
              {screen === 'album' && <AlbumScreen selectedPetId={albumFilterPetId} onSelectPet={setAlbumFilterPetId} onRetagPhoto={(photo, petId) => { movePhotoToPet(photo, petId); setDataVersion((value) => value + 1) }} onUploadPhoto={(petId) => { const targetPetId = petId === 'all' ? pets[0].id : petId; attachPhotoToPet(targetPetId, 'upload') }} onBack={() => goBack()} />}
              {screen === 'history' && <HistoryScreen pet={selectedPet} onBack={() => goBack()} />}
              {screen === 'construction' && <ConstructionScreen onBack={() => goBack()} />}
            </div>

            {screen === 'discussion' && <FloatingActionButton label="Post" icon={<CirclePlus className="size-4" />} onClick={() => navigateTo('editor')} />}
            {screen === 'shop' && <FloatingActionButton label={cartCount > 0 ? `Cart (${cartCount})` : 'Cart'} icon={<ShoppingBag className="size-4" />} onClick={() => navigateTo('cart')} />}
            {screen === 'pets' && <FloatingActionButton label="Add Reptile" icon={<CirclePlus className="size-4" />} onClick={() => navigateTo('addPet')} />}
            {screen === 'profile' && <FloatingActionButton label="Pet AI+" icon={<MessageCircleMore className="size-4" />} onClick={() => openAI('profile')} />}

            <BottomNav current={screen} onChange={goTab} />
          </section>
        </div>

        <aside className="rounded-[32px] border border-orange-200/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(236,108,55,0.08)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-500">Spec + mock synchronized version</p>
              <h1 className="mt-2 text-3xl font-bold text-stone-900">Reptile Love+ Product Mock</h1>
            </div>
            <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">v0.5</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Completed in this round"
              items={[
                'Home calendar block changed to a full-month dot view',
                'Full Calendar shows details after selecting a date',
                '4/19 Daily events changed to weekly tasks',
                'Discussion post FAB opens the editor',
                'Shop add-to-cart and Checkout flow work',
                'Reptile charts are real charts and split into blocks',
                'Member login mock added',
              ]}
            />
            <InfoCard
              title="Data Sources"
              items={[
                'Desktop Document 6: one-month user sample',
                'src/mockData.ts Loaded into screens',
                '3 reptiles, one month of events, posts, products, and member data',
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
        <h2 className="mt-1 text-lg font-bold text-stone-900">Reptile Love+</h2>
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
  onOpenAlbum,
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
  onOpenAlbum: () => void
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
    { label: 'My Reptiles', action: onOpenPets },
    { label: 'Feeding / Records', action: onOpenRecord },
  ]
  const secondRow = [
    { label: 'Feeding Plan', action: onOpenPlan },
    { label: 'Breeding Records', action: onOpenConstruction },
    { label: 'Reptile Album', action: onOpenAlbum },
  ]

  return (
    <div className="space-y-4 pb-12">
      <section className="rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 via-rose-50 to-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">Today Widget</p>
            <h3 className="text-lg font-bold text-stone-900">What needs care today?</h3>
          </div>
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700">{new Set(todayTasks.map((task) => task.petId)).size} reptiles</div>
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
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${task.done ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{task.done ? 'Done' : 'Pending'}</span>
            </button>
          ))}
        </div>

        <div className="mt-3">
          <Button variant="secondary" className="h-11 w-full rounded-[18px] border-stone-300 bg-white text-base font-semibold" onClick={onOpenAI}>Pet AI+ Assistant</Button>
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

      <BentoBlock title="Calendar" icon={<CalendarDays className="size-5 text-orange-500" />}>
        <MonthDotsCalendar compact onSelectDate={(date) => { onSelectDate(date); onOpenCalendar() }} />
      </BentoBlock>

      <BentoBlock title="Discussion" icon={<MessageCircleMore className="size-5 text-orange-500" />}>
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
          <Button variant="secondary" className="w-full rounded-full" onClick={onOpenDiscussion}>Open Discussion</Button>
        </div>
      </BentoBlock>

      <BentoBlock title="Shop" icon={<ShoppingBag className="size-5 text-orange-500" />}>
        <div className="rounded-2xl bg-gradient-to-r from-orange-300 via-rose-300 to-pink-300 px-4 py-3 text-sm font-semibold text-white">Weekly Picks Banner</div>
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
        <Button variant="secondary" className="mt-3 w-full rounded-full" onClick={onOpenShop}>Open Shop</Button>
      </BentoBlock>
    </div>
  )
}

function PetHubScreen({ onOpenPets, onOpenRecord, onOpenPlan, onOpenAlbum }: { onOpenPets: () => void; onOpenRecord: () => void; onOpenPlan: () => void; onOpenAlbum: () => void }) {
  return (
    <div className="space-y-4 pb-8">
      <SectionHeader eyebrow="Reptiles" title="Phase 1 core hub" />
      <div className="grid gap-3">
        <HubCard title="My Reptiles" desc="Individual profiles and list for every reptile" onClick={onOpenPets} />
        <HubCard title="Feeding / Records" desc="High-frequency record entry. Select reptile first, then switch form." onClick={onOpenRecord} />
        <HubCard title="Feeding Plan" desc="Create fixed care schedules and reminders" onClick={onOpenPlan} />
        <HubCard title="Reptile Album" desc="Photos attach to profiles and records" onClick={onOpenAlbum} />
      </div>
    </div>
  )
}

function PetsScreen({ onBack, onOpenProfile }: { onBack: () => void; onOpenProfile: (id: string) => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="My Reptiles" onBack={onBack} />
        <div className="grid gap-3">
          {pets.map((pet) => (
            <button key={pet.id} onClick={() => onOpenProfile(pet.id)} className={`rounded-[28px] bg-gradient-to-br ${pet.color} p-4 text-left shadow-sm ring-1 ring-white/70`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <MediaThumb src={pet.avatar} alt={pet.name} className="size-14 rounded-[20px] object-cover" fallbackClassName="flex items-center justify-center bg-white/85" fallbackTextClassName="text-3xl" />
                  <div>
                    <p className="text-lg font-bold text-stone-900">{pet.name}</p>
                    <p className="text-sm text-stone-600">{pet.species} · {pet.tag}</p>
                    <p className="mt-1 text-xs font-semibold text-orange-600">{pet.age} · Arrival {pet.careDays} days</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-stone-500" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <StatChip label="Latest Weight" value={`${pet.currentWeight}g`} />
                <StatChip label="Last Feeding" value={pet.latestFeedDate} />
                <StatChip label="Latest Event" value={pet.latestEvent} />
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
        <SubPageHeader title="Pet Profile" onBack={onBack} />

        <section className={`rounded-[30px] bg-gradient-to-br ${pet.color} p-5 shadow-sm`}>
          <div className="flex items-start gap-4">
            <MediaThumb src={pet.avatar} alt={pet.name} className="size-20 rounded-[26px] object-cover" fallbackClassName="flex items-center justify-center bg-white/85" fallbackTextClassName="text-5xl" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-600">Block A: Individual Summary</p>
              <h3 className="mt-1 text-2xl font-bold text-stone-900">{pet.name}</h3>
              <p className="text-sm text-stone-700">{pet.species} · {pet.tag}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <ProfileSummaryCard label="Care Days" value={`${pet.careDays} days`} />
                <ProfileSummaryCard label="Age" value={pet.age} />
                <ProfileSummaryCard label="Latest Weight" value={`${pet.currentWeight}g`} />
                <ProfileSummaryCard label="Last Feeding Date" value={pet.latestFeedDate} />
              </div>
              <div className="mt-2 rounded-2xl bg-white/80 px-3 py-3 text-sm text-stone-700">Latest Event:{pet.latestEvent}</div>
              <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={onEdit}>Edit Info</Button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">Core Feature Entries</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenRecord}>Feeding / Records</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenPlan}>Feeding Plan</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenAI}>Pet AI+</Button>
            <Button variant="secondary" className="rounded-2xl" onClick={onOpenAlbum}>Reptile Album</Button>
          </div>
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 to-rose-50 p-4 shadow-sm">
          <p className="text-sm leading-7 text-stone-700">{pet.aiLastLine}</p>
        </section>

        <LineChartCard title="Weight Trend" subtitle="Last Month" data={pet.weightSeries} unit="g" icon={<Weight className="size-4 text-orange-500" />} />
        <BarChartCard title="Feeding Frequency" subtitle="Weekly Feeding Count" data={pet.feedFrequency} icon={<UtensilsCrossed className="size-4 text-orange-500" />} />
        <LineChartCard title="Temperature / Humidity Trend" subtitle="Humidity Records in the Last Month" data={pet.humiditySeries} unit="%" icon={<CalendarDays className="size-4 text-orange-500" />} />

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="size-4 text-orange-500" />
            <h4 className="text-base font-bold text-stone-900">Recent Event Timeline</h4>
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
            <p className="text-sm font-semibold text-orange-500">History Records</p>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenHistory}>View More</Button>
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
          <button onClick={onOpenAlbum} className="text-sm font-semibold text-orange-500">Reptile Album</button>
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

function AlbumScreen({ selectedPetId, onSelectPet, onRetagPhoto, onUploadPhoto, onBack }: { selectedPetId: string; onSelectPet: (id: string) => void; onRetagPhoto: (photo: string, petId: string) => void; onUploadPhoto: (petId: string) => void; onBack: () => void }) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; petId: string } | null>(null)
  const photoItems = pets.flatMap((pet) => pet.photos.map((photo, index) => ({ src: photo, petId: pet.id, petName: pet.name, key: `${pet.id}-${index}` })))
  const filteredPhotos = selectedPetId === 'all' ? photoItems : photoItems.filter((item) => item.petId === selectedPetId)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="Reptile Album" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-500">Top-right Filter</p>
          <select value={selectedPetId} onChange={(event) => onSelectPet(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm outline-none">
            <option value="all">All Reptiles</option>
            {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species}</option>)}
          </select>
        </section>
        <section className="grid grid-cols-3 gap-2">
          {filteredPhotos.map((photo) => (
            <button key={photo.key} onClick={() => setSelectedPhoto({ src: photo.src, petId: photo.petId })}>
              <MediaThumb src={photo.src} alt={photo.petName} className="h-24 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-orange-50" fallbackTextClassName="text-3xl" />
            </button>
          ))}
        </section>
        {selectedPhoto && <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <MediaThumb src={selectedPhoto.src} alt={petById(selectedPhoto.petId)?.name ?? 'photo'} className="h-64 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-4xl" />
          <div className="mt-3 rounded-2xl bg-stone-50 px-4 py-4">
            <p className="text-xs font-semibold text-stone-500">Photo Assignment</p>
            <select value={selectedPhoto.petId} onChange={(event) => { const nextPetId = event.target.value; onRetagPhoto(selectedPhoto.src, nextPetId); setSelectedPhoto((current) => current ? { ...current, petId: nextPetId } : current) }} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">
              {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species}</option>)}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full">Download</Button>
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setSelectedPhoto(null)}>Close Preview</Button>
          </div>
        </section>}
        <FloatingActionButton label="Upload" icon={<CirclePlus className="size-4" />} onClick={() => onUploadPhoto(selectedPetId)} />
      </div>
    </SwipeBackPage>
  )
}

function HistoryScreen({ pet, onBack }: { pet: PetProfile; onBack: () => void }) {
  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="Full History Records" onBack={onBack} />
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
        <SubPageHeader title="Construction" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white px-4 py-12 text-center shadow-sm">
          <p className="text-lg font-bold text-stone-900">Under construction. Coming soon.</p>
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
  const petPresetMap: Record<string, RecordPresetKey> = { cream: 'snake', ada: 'tortoise', gecko: 'gecko', froggy: 'amphibian', spider: 'arthropod' }
  const speciesPreset = petPresetMap[selectedPetId] ?? 'snake'
  const preset = recordPresets[speciesPreset]
  const speciesLabel = speciesPreset === 'snake' ? 'Snake' : speciesPreset === 'tortoise' ? 'Tortoise' : speciesPreset === 'gecko' ? 'Gecko' : preset.label
  const feedOptions = [...preset.foods, ...customRecordTags[speciesPreset].foods]
  const eventOptions = [...preset.events, ...customRecordTags[speciesPreset].events, 'Other']
  const stoolOptions = ['Well-formed', 'Loose', 'Diarrhea', 'Blood Present', ...customRecordTags[speciesPreset].stools, 'Other']
  const hasDanger = ['Abnormal', 'Food Refusal', 'Blood Present', 'Diarrhea'].some((item) => `${eventName} ${otherEvent} ${stool} ${otherStool}`.includes(item))

  const saveCustomTag = (kind: 'foods' | 'events' | 'stools', value: string, onSaved?: () => void) => {
    const content = value.trim()
    if (!content) return
    customRecordTags[speciesPreset][kind] = [...new Set([...customRecordTags[speciesPreset][kind], content])]
    setTagVersion((current) => current + 1)
    window.alert('Custom tag added')
    onSaved?.()
  }

  const submit = () => {
    const finalFeed = feed === 'Other' ? otherFeed.trim() : feed
    const finalEvent = eventName === 'Other' ? otherEvent.trim() : eventName
    const finalStool = stool === 'Other' ? otherStool.trim() : stool

    if (feed === 'Other' && otherFeed.trim()) customRecordTags[speciesPreset].foods = [...new Set([...customRecordTags[speciesPreset].foods, otherFeed.trim()])]
    if (eventName === 'Other' && otherEvent.trim()) customRecordTags[speciesPreset].events = [...new Set([...customRecordTags[speciesPreset].events, otherEvent.trim()])]
    if (stool === 'Other' && otherStool.trim()) customRecordTags[speciesPreset].stools = [...new Set([...customRecordTags[speciesPreset].stools, otherStool.trim()])]

    const detail = [
      finalFeed || '',
      feedWeight ? `${feedWeight}g` : '',
      feedQuantity ? `${feedQuantity}` : '',
      finalEvent ? `Event ${finalEvent}` : '',
      finalStool ? `Excretion ${finalStool}` : '',
      hour ? `${hour}:00` : '',
    ].filter(Boolean).join(' · ')

    onSubmitRecord(selectedPetId, { date: `2026/04/19`, type: finalEvent || 'Feeding', detail, abnormal: finalEvent.includes('Abnormal') || finalStool.includes('Blood Present'), withPhoto: true })
  }

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="Feeding / Records" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <SelectField label="Select Reptile" value={selectedPetId} onChange={setSelectedPetId} options={pets.map((pet) => ({ label: `${pet.name} · ${pet.species}`, value: pet.id }))} />
            <SelectField label="Date / Time (hour only)" value={hour} onChange={setHour} options={Array.from({ length: 24 }, (_, index) => ({ label: `${String(index).padStart(2, '0')}:00`, value: String(index).padStart(2, '0') }))} />
            <SelectField label={`Feeding Content (${speciesLabel}）`} value={feed} onChange={setFeed} options={[{ label: 'Not Selected', value: '' }, ...feedOptions.map((item) => ({ label: item, value: item }))]} />
            {feed === 'Other' && <div className="rounded-2xl bg-stone-50 px-4 py-4"><InputField label="Other Feeding Content" value={otherFeed} onChange={setOtherFeed} placeholder="Enter content, e.g. small mouse" />{otherFeed.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('foods', otherFeed, () => setFeed(otherFeed.trim()))}>Save as Custom Tag</Button>}</div>}
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Feeding Weight" value={feedWeight} onChange={setFeedWeight} placeholder="e.g. 10" />
              <InputField label="Feeding Quantity" value={feedQuantity} onChange={setFeedQuantity} placeholder="e.g. 2" />
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-orange-500">Advanced Options</p>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setShowAdvanced((value) => !value)}>{showAdvanced ? 'Collapse' : 'Expand'}</Button>
            </div>
            {showAdvanced && <div className="mt-3 space-y-3">
              <SelectField label="Event" value={eventName} onChange={setEventName} options={[{ label: 'Not Selected', value: '' }, ...eventOptions.map((item) => ({ label: item, value: item }))]} />
              {eventName === 'Other' && <div className="rounded-2xl bg-white px-4 py-4"><InputField label="OtherEvent" value={otherEvent} onChange={setOtherEvent} placeholder="Enter event" />{otherEvent.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('events', otherEvent, () => setEventName(otherEvent.trim()))}>Save as Custom Tag</Button>}</div>}
              <SelectField label="Excretion" value={stool} onChange={setStool} options={[{ label: 'Not Selected', value: '' }, ...stoolOptions.map((item) => ({ label: item, value: item }))]} />
              {stool === 'Other' && <div className="rounded-2xl bg-white px-4 py-4"><InputField label="Other Excretion Description" value={otherStool} onChange={setOtherStool} placeholder="Enter description" />{otherStool.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => saveCustomTag('stools', otherStool, () => setStool(otherStool.trim()))}>Save as Custom Tag</Button>}</div>}
              {hasDanger && <div className="flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700"><TriangleAlert className="mt-0.5 size-4 shrink-0" /><span>High-risk record detected. Add observation notes and photos if possible.</span></div>}
            </div>}
          </div>

          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-500">Photo Upload / Camera</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => window.alert(`Mock uploaded to ${petById(selectedPetId)?.name ?? 'the selected reptile'}  album. It will be kept after submit`) } className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">Upload Photo</button>
              <button onClick={() => window.alert(`Mock camera photo added to ${petById(selectedPetId)?.name ?? 'the selected reptile'}  album. It will be kept after submit`) } className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">Camera</button>
            </div>
          </div>

          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={submit}>Submit</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function AddPetScreen({ onBack, onSave, onAttachPhoto, initialPet, mode = 'create' }: { onBack: () => void; onSave: (pet: PetProfile) => void; onAttachPhoto: (petId: string, source: 'upload' | 'camera' | 'album') => void; initialPet?: PetProfile; mode?: 'create' | 'edit' }) {
  const [name, setName] = useState(initialPet?.name ?? '')
  const [speciesGroup, setSpeciesGroup] = useState(initialPet?.species.includes('Turtle') ? 'Turtles' : initialPet?.species.includes('Gecko') ? 'Lizards / Geckos' : initialPet?.species.includes('Amphibian') ? 'Amphibians' : initialPet?.species.includes('Arthropod') ? 'Arthropods' : 'Snakes')
  const [speciesName, setSpeciesName] = useState(initialPet?.species ?? '')
  const [gender, setGender] = useState(initialPet?.tag ?? 'Unknown')
  const [weight, setWeight] = useState(String(initialPet?.currentWeight ?? 58))
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g')
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('04')
  const [day, setDay] = useState('19')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title={mode === 'edit' ? 'Edit Reptile' : 'Add Reptile'} onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="Name" value={name} onChange={setName} placeholder="Enter reptile name" />
            <SelectField label="Species Category" value={speciesGroup} onChange={setSpeciesGroup} options={[{ label: 'Snakes', value: 'Snakes' }, { label: 'Lizards / Geckos', value: 'Lizards / Geckos' }, { label: 'Turtles', value: 'Turtles' }, { label: 'Amphibians', value: 'Amphibians' }, { label: 'Arthropods', value: 'Arthropods' }]} />
            <InputField label="Detailed Morph / Breed" value={speciesName} onChange={setSpeciesName} placeholder="Enter detailed morph / breed, e.g. corn snake or fat-tailed gecko" />
            <SelectField label="Sex" value={gender} onChange={setGender} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Unknown', value: 'Unknown' }]} />
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">Arrival Date</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 12 }, (_, index) => String(2015 + index)).map((item) => <option key={item} value={item}>{item} Year</option>)}</select>
                <select value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((item) => <option key={item} value={item}>{item} Month</option>)}</select>
                <select value={day} onChange={(event) => setDay(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none">{Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0')).map((item) => <option key={item} value={item}>{item} Sun</option>)}</select>
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">Current Weight</p>
              <div className="mt-2 flex gap-2">
                <input value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="e.g. 58" className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none" />
                <select value={weightUnit} onChange={(event) => setWeightUnit(event.target.value as 'g' | 'kg')} className="w-24 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none"><option value="g">g</option><option value="kg">kg</option></select>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-500">Avatar Upload / Camera</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => initialPet?.id && onAttachPhoto(initialPet.id, 'upload')} className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">Upload Photo</button>
              <button onClick={() => initialPet?.id && onAttachPhoto(initialPet.id, 'camera')} className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">Camera</button>
              <button onClick={() => initialPet?.id && onAttachPhoto(initialPet.id, 'album')} className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-stone-700">App Album</button>
            </div>
          </div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={() => onSave({
            id: initialPet?.id ?? `pet-${Date.now()}`,
            name: name || 'New Reptile',
            avatar: initialPet?.avatar ?? '🦎',
            species: speciesName || speciesGroup,
            tag: gender,
            status: initialPet?.status ?? 'New',
            age: initialPet?.age ?? 'Not Filled',
            careDays: initialPet?.careDays ?? 0,
            currentWeight: weightUnit === 'kg' ? Number(weight || 0) * 1000 : Number(weight || 0),
            latestFeedDate: `${year}/${month}/${day}`,
            latestEvent: initialPet?.latestEvent ?? 'Just Added',
            aiLastLine: initialPet?.aiLastLine ?? 'Fill in the basics first so AI can organize records more accurately later.',
            color: initialPet?.color ?? 'from-orange-100 via-amber-50 to-white',
            weightSeries: initialPet?.weightSeries ?? [{ date: '04/19', value: Number(weight || 0) }],
            feedFrequency: initialPet?.feedFrequency ?? [{ week: 'W1', count: 0 }],
            humiditySeries: initialPet?.humiditySeries ?? [{ date: '04/19', value: 0 }],
            timeline: initialPet?.timeline ?? [{ date: `${year}/${month}/${day}`, title: 'Created', detail: 'New reptile created' }],
            records: initialPet?.records ?? [],
            photos: initialPet?.photos ?? ['📷'],
          })}>{mode === 'edit' ? 'Save Changes' : 'Save Reptile'}</Button>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function PlanScreen({ onBack, onOpenProfile, onCreatePlan, onUpdatePlan, onOpenCalendar }: { onBack: () => void; onOpenProfile: (id: string) => void; onCreatePlan: (payload: { petId: string; type: string; frequency: string; date: string; dates?: string[]; time: string }) => void; onUpdatePlan: (payload: { eventId: string; petId: string; type: string; frequency: string; date: string; time: string }) => void; onOpenCalendar: () => void }) {
  const [mode, setMode] = useState<'list' | 'settings' | 'create' | 'edit'>('list')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [createPetId, setCreatePetId] = useState('cream')
  const [createType, setCreateType] = useState('Feeding')
  const [otherType, setOtherType] = useState('')
  const [, setPlanTagVersion] = useState(0)
  const [scheduleMode, setScheduleMode] = useState<'interval' | 'weekly'>('interval')
  const [intervalDays, setIntervalDays] = useState('5')
  const [weeklyDays, setWeeklyDays] = useState<string[]>(['Mon'])
  const [hour, setHour] = useState('20')
  const [minute, setMinute] = useState('00')
  const weekDays = [
    { label: 'Sun', date: '2026-04-19' },
    { label: 'Mon', date: '2026-04-20' },
    { label: 'Tue', date: '2026-04-21' },
    { label: 'Wed', date: '2026-04-22' },
    { label: 'Thu', date: '2026-04-23' },
    { label: 'Fri', date: '2026-04-24' },
    { label: 'Sat', date: '2026-04-25' },
  ]
  const planItems = calendarEvents.filter((event) => event.date >= '2026-04-19' && event.date <= '2026-04-25')
  const selectedPlan = planItems.find((item) => item.id === selectedPlanId) ?? planItems[0] ?? null
  const firstWeeklyDate = weekDays.find((item) => weeklyDays.includes(item.label))?.date ?? '2026-04-20'
  const formattedFrequency = scheduleMode === 'interval' ? `Every ${intervalDays} days` : `Every week ${weeklyDays.join(', ')} ${hour}:${minute}`
  const planTypeOptions = ['Feeding', 'Soaking', 'Water Change', ...customPlanTypes, 'Other']
  const finalType = createType === 'Other' ? otherType.trim() : createType
  const scheduledDates = scheduleMode === 'interval'
    ? weekDays.filter((_, index) => index % Math.max(Number(intervalDays || 1), 1) === 0).map((item) => item.date)
    : weekDays.filter((item) => weeklyDays.includes(item.label)).map((item) => item.date)

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="Feeding Plan" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => setMode('settings')}>Settings</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={() => setMode('create')}>Add Plan</Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenCalendar}>View Calendar</Button>
          </div>
          {mode === 'settings' && <div className="mt-4 rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-700"><button onClick={() => window.alert('Open Apple Settings')} className="rounded-full bg-white px-3 py-2 font-semibold text-stone-700">Enable Notifications</button></div>}
          {(mode === 'create' || mode === 'edit') && <div className="mt-4 grid gap-3">
            <SelectField label="Reptile" value={createPetId} onChange={setCreatePetId} options={pets.map((pet) => ({ label: pet.name, value: pet.id }))} />
            <SelectField label="Task Type" value={createType} onChange={setCreateType} options={planTypeOptions.map((item) => ({ label: item, value: item }))} />
            {createType === 'Other' && <div className="rounded-2xl bg-stone-50 px-4 py-4"><InputField label="Other Task Type" value={otherType} onChange={setOtherType} placeholder="Enter task type" />{otherType.trim() && <Button variant="secondary" size="sm" className="mt-3 rounded-full" onClick={() => { customPlanTypes.push(otherType.trim()); setPlanTagVersion((value) => value + 1); setCreateType(otherType.trim()); window.alert('Custom tag added') }}>Save as Custom Tag</Button>}</div>}
            <SelectField label="Frequency" value={scheduleMode} onChange={(value) => setScheduleMode(value as 'interval' | 'weekly')} options={[{ label: 'Every N Days', value: 'interval' }, { label: 'Specific Weekdays', value: 'weekly' }]} />
            {scheduleMode === 'interval' ? <InputField label="Every how many days" value={intervalDays} onChange={setIntervalDays} placeholder="e.g. 5" /> : <div className="rounded-2xl bg-stone-50 px-4 py-4"><p className="text-xs font-semibold text-stone-500">Select Weekdays</p><div className="mt-2 flex flex-wrap gap-2">{weekDays.map((item) => <button key={item.label} onClick={() => setWeeklyDays((current) => current.includes(item.label) ? current.filter((entry) => entry !== item.label) : [...current, item.label])} className={`rounded-full px-3 py-2 text-sm font-semibold ${weeklyDays.includes(item.label) ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>{item.label}</button>)}</div></div>}
            <div className="grid grid-cols-2 gap-2">
              <SelectField label="Hour" value={hour} onChange={setHour} options={Array.from({ length: 24 }, (_, index) => ({ label: String(index).padStart(2, '0'), value: String(index).padStart(2, '0') }))} />
              <SelectField label="Minute" value={minute} onChange={setMinute} options={['00', '15', '30', '45'].map((item) => ({ label: item, value: item }))} />
            </div>
            <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-stone-700">Schedule Preview:{formattedFrequency}</div>
            <Button className="rounded-full bg-stone-900 text-white" onClick={() => mode === 'edit' && selectedPlan ? onUpdatePlan({ eventId: selectedPlan.id, petId: createPetId, type: finalType || 'Feeding', frequency: formattedFrequency, date: scheduledDates[0] ?? firstWeeklyDate, time: `${hour}:${minute}` }) : onCreatePlan({ petId: createPetId, type: finalType || 'Feeding', frequency: formattedFrequency, date: scheduledDates[0] ?? firstWeeklyDate, dates: scheduledDates, time: `${hour}:${minute}` })}>{mode === 'edit' ? 'Save Changes' : 'Save Plan'}</Button>
          </div>}
          <div className="mt-4 grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayItems = planItems.filter((item) => item.date === day.date)
              return <div key={day.date} className="rounded-2xl bg-stone-50 px-2 py-3 text-center"><p className="text-xs font-semibold text-stone-500">{day.label}</p><p className="mt-1 text-xs text-stone-600">{day.date.slice(5)}</p><p className="mt-2 text-[11px] font-semibold text-stone-800">{dayItems.length ? `${dayItems.length} items` : '—'}</p>{dayItems.slice(0, 2).map((item) => <p key={item.id} className="mt-1 truncate text-[10px] text-stone-500">{item.petName}</p>)}</div>
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
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => { setSelectedPlanId(plan.id); setCreatePetId(plan.petId); setCreateType(plan.type === 'soak' ? 'Soaking' : plan.type === 'water' ? 'Water Change' : 'Feeding'); setScheduleMode(plan.detail.includes('Every week') ? 'weekly' : 'interval'); setIntervalDays(plan.detail.match(/(\d+)/)?.[1] ?? '5'); setHour(plan.time.split(':')[0]); setMinute(plan.time.split(':')[1]); setMode('edit') }}>Edit Plan</Button>
                </div>
              </div>
            ))}
          </div>
          {selectedPlan && <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4">
            <p className="text-sm font-semibold text-orange-500">Plan Details</p>
            <p className="mt-2 text-sm font-bold text-stone-900">{selectedPlan.petName} · {selectedPlan.title}</p>
            <p className="mt-1 text-sm text-stone-700">{selectedPlan.date} {selectedPlan.time} · {selectedPlan.detail}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onOpenProfile(selectedPlan.petId)}>Go to Pet Profile</Button>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => window.alert('Open Apple Settings')}>Notification Permission Guide</Button>
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
        <SubPageHeader title="Calendar" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <SelectField label="Filter by Reptile" value={petFilter} onChange={setPetFilter} options={[{ label: 'All Reptiles', value: 'all' }, ...pets.map((pet) => ({ label: pet.name, value: pet.id }))]} />
            <SelectField label="Filter by Event Type" value={typeFilter} onChange={setTypeFilter} options={[{ label: 'All Events', value: 'all' }, { label: 'Feeding', value: 'feeding' }, { label: 'Soaking', value: 'soak' }, { label: 'Water Change', value: 'water' }, { label: 'Observation', value: 'observe' }, { label: 'Supplement', value: 'supplement' }, { label: 'Weight', value: 'weight' }]} />
          </div>
          <MonthDotsCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">{selectedDate.replace('2026-', '')} Event Content</p>
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
            <p className="text-sm font-semibold text-orange-500">Event Details</p>
            <p className="mt-2 text-sm font-bold text-stone-900">{selectedEvent.petName} · {selectedEvent.title}</p>
            <p className="mt-1 text-sm text-stone-700">{selectedEvent.date} {selectedEvent.time} · {selectedEvent.detail}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => onOpenProfile(selectedEvent.petId)}>Go to Pet Profile</Button>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={onOpenRecord}>Go to Records</Button>
            </div>
          </div>}
        </section>

        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">7 days of tasks</p>
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
      <SectionHeader eyebrow="Discussion" title="Exotic pet forum with image uploads" />
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
        <SubPageHeader title="Post Editor" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Enter title" className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
            <button onClick={() => onCoverImageChange(mockUploadImages[(mockUploadImages.indexOf(coverImage) + 1) % mockUploadImages.length])} className="rounded-2xl bg-orange-50 px-3 py-4 text-center">Cover Image Upload</button>
            <button onClick={() => {
              const next = mockUploadImages.find((item) => !images.includes(item) && item !== coverImage)
              if (next && images.length < 5) onImagesChange([...images, next])
            }} className="rounded-2xl bg-orange-50 px-3 py-4 text-center">Inline Image Upload ({images.length}/5)</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MediaThumb src={coverImage} alt="cover" className="h-20 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-xs text-stone-500" />
            {images.map((image) => (
              <button key={image} onClick={() => onImagesChange(images.filter((item) => item !== image))} className="relative">
                <MediaThumb src={image} alt="body" className="h-20 w-full rounded-2xl object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-xs text-stone-500" />
                <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">Remove</span>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-stone-50 px-4 py-3 text-xs text-stone-600">Mock upload: click cover image to switch assets, click inline image upload to add, and click an added image to remove it.</div>
          <textarea value={body} onChange={(event) => onBodyChange(event.target.value)} placeholder="Enter article body" className="mt-3 min-h-40 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none" />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={() => window.alert('Draft saved')}>Save Draft</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={onPublish}>Publish</Button>
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
        <SubPageHeader title="Article Detail" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-xl font-bold text-stone-900">{post.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>{post.category}</span>
            <span className="inline-flex items-center gap-1"><Heart className="size-3.5" /> {post.likes}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {(postComments[post.id] ?? []).length}</span>
            {post.isMine && <Button variant="secondary" size="sm" className="rounded-full" onClick={onEdit}>Edit</Button>}
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
            <Button variant="secondary" className="rounded-full" onClick={onLike}><Heart className="mr-1 size-4" />{liked ? `Liked ${post.likes}` : `Likes ${post.likes}`}</Button>
            <Button variant="secondary" className="rounded-full"><MessageCircle className="mr-1 size-4" />Comments {(postComments[post.id] ?? []).length}</Button>
          </div>
        </section>
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-500">Comment Area</p>
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
            <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Enter a comment..." className="min-h-20 w-full resize-none bg-transparent text-sm outline-none" />
            <Button className="mt-2 w-full rounded-full bg-stone-900 text-white" onClick={() => { const ok = onSubmitComment(post.id, commentText); if (ok) setCommentText('') }}>Submit Comment</Button>
          </div>
        </section>
      </div>
    </SwipeBackPage>
  )
}

function ShopScreen({ onOpenProduct, onAddToCart }: { onOpenProduct: (id: string) => void; onAddToCart: (id: string) => void }) {
  return (
    <div className="relative space-y-4 pb-24">
      <SectionHeader eyebrow="Shop" title="Platform-owned product flow" />
      <section className="rounded-[28px] bg-gradient-to-r from-orange-300 via-rose-300 to-pink-300 p-4 text-white shadow-sm">
        <p className="text-sm font-semibold">Platform Picks</p>
        <h3 className="mt-1 text-xl font-bold">Food, equipment, and accessories in one place</h3>
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
              <p className="mt-1 text-xs text-stone-500">In Stock {product.stock}</p>
            </button>
            <Button className="mt-3 w-full rounded-full bg-stone-900 text-white" onClick={() => onAddToCart(product.id)}>Add to Cart</Button>
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
        <SubPageHeader title="Product Detail" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <MediaThumb src={product.image} alt={product.name} className="h-56 w-full rounded-[24px] object-cover" fallbackClassName="flex items-center justify-center bg-stone-50" fallbackTextClassName="text-7xl" />
          <p className="mt-4 text-xs font-semibold text-orange-500">{product.category}</p>
          <h3 className="mt-1 text-2xl font-bold text-stone-900">{product.name}</h3>
          <p className="mt-2 text-2xl font-bold text-orange-600">NT$ {product.price}</p>
          <p className="mt-3 text-sm leading-7 text-stone-700">{product.desc}</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-700">
            <div className="rounded-2xl bg-stone-50 px-4 py-3">Specifications:{product.specs.join(' / ')}</div>
            <div className="rounded-2xl bg-stone-50 px-4 py-3">Stock:{product.stock}</div>
            <div className="rounded-2xl bg-stone-50 px-4 py-3">Shipping:{product.shipping}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full" onClick={onAddToCart}>Add to Cart</Button>
            <Button className="flex-1 rounded-full bg-stone-900 text-white" onClick={onBuyNow}>Buy Now</Button>
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
        <SubPageHeader title="Cart" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {cartProducts.length === 0 ? (
              <div className="rounded-2xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">Your cart is empty</div>
            ) : (
              cartProducts.map((item) => (
                <div key={item.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                  <p className="text-sm font-bold text-stone-900">{item.name}</p>
                  <p className="text-sm text-stone-600">Quantity {item.qty} · NT$ {item.price}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-stone-800">Total: NT$ {total}</div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onCheckout}>Go to Checkout</Button>
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
  const [region, setRegion] = useState('Taipei City')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  return (
    <SwipeBackPage onBack={onBack}>
      <div className="space-y-4 pb-8">
        <SubPageHeader title="Checkout" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="Recipient Name" value={recipient} onChange={setRecipient} placeholder="Enter recipient name" />
            <InputField label="Phone Number" value={phone} onChange={setPhone} placeholder="Enter phone number" />
            <InputField label="City / District" value={region} onChange={setRegion} placeholder="Enter city / district" />
            <InputField label="Address" value={address} onChange={setAddress} placeholder="Enter address" />
            <div className="rounded-2xl bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold text-stone-500">Notes</p>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Enter notes" className="mt-2 min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none" />
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-stone-800">Order Total: NT$ {total}</div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={() => window.alert('Order submitted')}>Submit Order</Button>
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
      <InputField label="Member Name" value={memberName} onChange={setMemberName} placeholder="Enter member name" />
      <InputField label="Email" value={memberEmail} onChange={setMemberEmail} placeholder="Enter Email" />
      <FieldCard label="Birth Year" value={memberProfile.year} />
      <FieldCard label="Sex" value={memberProfile.gender} />
      <Button className="rounded-full bg-stone-900 text-white" onClick={() => window.alert('Member profile saved')}>Save Profile</Button>
    </div>,
    pets: <div className="space-y-2">{pets.slice(0, 3).map((pet) => <div key={pet.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{pet.name} · {pet.species} · Arrival {pet.careDays} days</div>)}</div>,
    posts: <div className="space-y-2">{discussionPosts.filter((post) => post.isMine).map((post) => <div key={post.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{post.title}</div>)}</div>,
    orders: <div className="space-y-3"><div className="flex gap-2"><Button variant={activeOrder === 'RL+1024' ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setActiveOrder('RL+1024')}>#RL+1024</Button><Button variant={activeOrder === 'RL+1021' ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setActiveOrder('RL+1021')}>#RL+1021</Button></div><div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{activeOrder === 'RL+1024' ? 'Frozen pinky mice 30-pack, pending shipment, expected tomorrow.' : 'Thermo-hygrometer delivered. You can leave a review.'}</div></div>,
    notifications: <div className="space-y-3"><button onClick={() => { setNotificationsEnabled((value) => !value); window.alert('Open Apple Settings') }} className="flex w-full items-center justify-between rounded-2xl bg-stone-50 px-4 py-4 text-left text-sm font-semibold text-stone-700"><span>Enable Notifications</span><span className={`rounded-full px-3 py-1 text-xs ${notificationsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</span></button></div>,
  } satisfies Record<string, React.ReactNode>

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader eyebrow="Member" title="Member System" />
      {!isLoggedIn ? (
        <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
          <p className="text-base font-bold text-stone-900">Not Logged In</p>
          <p className="mt-2 text-sm leading-7 text-stone-600">Please log in to view your profile, orders, and notification settings.</p>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onOpenLogin}>Go to Login</Button>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-base font-bold text-stone-900">{memberProfile.name}</p>
            <p className="text-sm text-stone-600">{memberProfile.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['profile', 'My Profile'],
              ['pets', 'My Reptiles Summary'],
              ['posts', 'My Articles'],
              ['orders', 'My Orders'],
              ['notifications', 'Notification Settings'],
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
        <SubPageHeader title="Login / Register" onBack={onBack} />
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <InputField label="Email" value={email} onChange={setEmail} placeholder="Enter Email" />
            <InputField label="Password" value={password} onChange={setPassword} placeholder="Enter password" />
            <InputField label="Nickname (Register)" value={nickname} onChange={setNickname} placeholder="Enter nickname" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full">Google</Button>
            <Button variant="secondary" className="flex-1 rounded-full">Apple</Button>
          </div>
          <Button className="mt-4 w-full rounded-full bg-stone-900 text-white" onClick={onLogin}>Login</Button>
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
    { key: 'petHub', label: 'Reptiles', icon: <PawPrint className="size-4" /> },
    { key: 'discussion', label: 'Discussion', icon: <MessageCircleMore className="size-4" /> },
    { key: 'home', label: 'Home', icon: <House className="size-4" /> },
    { key: 'shop', label: 'Shop', icon: <ShoppingBag className="size-4" /> },
    { key: 'member', label: 'Member', icon: <UserRound className="size-4" /> },
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
        <p className="text-sm font-semibold text-orange-500">Subpage</p>
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
        <SubPageHeader title="Pet AI+ Assistant" onBack={onBack} />
        <section className="rounded-[24px] border border-orange-100 bg-white p-3 shadow-sm">
          <select value={selectedPetId} onChange={(event) => onChangePet(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none">
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name} · {pet.species}</option>
            ))}
          </select>
          {pet && <div className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-stone-700">Latest Status:{pet.latestEvent}<br />AI Suggestion:{pet.aiLastLine}</div>}
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
              <textarea defaultValue="" placeholder="Type a message..." rows={1} className="min-h-10 max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" />
              <Button className="rounded-full bg-stone-900 text-white">Submit</Button>
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
              <p className="font-semibold text-stone-900">{item.count} times</p>
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
        <p className="text-sm font-bold text-stone-900">2026 Year 4 Month</p>
        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" /> Feeding</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-sky-500" /> Other</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-stone-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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





