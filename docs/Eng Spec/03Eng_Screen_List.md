# Reptile Love+ Screen List

---

## A. Main Phase 1 Screens

### 1. Home
- 1-1 Home main screen: long scrollable page.
- 1-2 Today Widget task detail.
- 1-3 Pet AI+ Assistant chat window.
- 1-4 Expanded Calendar Block.
- 1-5 Upcoming Tasks in 7 Days section.
- 1-6 Expanded Discussion Block.
- 1-7 Expanded Shop Block.

### 2. Reptiles
- 2-1 Reptiles Hub.
- 2-2 My Reptiles list.
- 2-3 Add Reptile.
- 2-4 Edit Reptile.
- 2-5 Pet Profile: main entry for the four core features.
- 2-6 Pet Profile AI Assistant chat window: returns to the previous entry context.
- 2-7 Reptile Album: all reptiles.
- 2-8 Reptile Album: filtered to a selected reptile.
- 2-9 Enlarged photo / manual assignment state.

### 3. Feeding / Records
- 3-1 Feeding / Records main screen.
- 3-2 Snake quick-pick form.
- 3-3 Gecko / lizard quick-pick form.
- 3-4 Tortoise quick-pick form.
- 3-5 Aquatic turtle quick-pick form.
- 3-6 Amphibian quick-pick form.
- 3-7 Arthropod quick-pick form.
- 3-8 High-risk event warning card / follow-up reminder.
- 3-9 Species template automatically loaded by selected reptile.

### 3.5 Feeding Plan
- 3.5-1 Plan list.
- 3.5-2 Add plan.
- 3.5-3 Edit plan.
- 3.5-4 Plan details.
- 3.5-5 Same-week view.
- 3.5-6 Every N days mode.
- 3.5-7 Specific weekdays mode.
- 3.5-8 Other task type / custom tag state.

### 4. Calendar
- 4-1 Monthly overview.
- 4-2 Day view.
- 4-3 Selected-date event list.
- 4-4 Event details.
- 4-5 Reptile / event type filter state.

### 5. Discussion
- 5-1 Discussion list page.
- 5-2 Post editor.
- 5-3 Article detail page.
- 5-4 Reply area.
- 5-5 Fixed post button in the lower-right corner.
- 5-6 Frontend edit entry for the current user's own article.
- 5-7 One-like-per-article state.
- 5-8 Real-time comment insertion state.

### 6. Shop
- 6-1 Shop home.
- 6-2 Product list page.
- 6-3 Product detail page.
- 6-4 Cart.
- 6-5 Checkout.
- 6-6 Order completion page.
- 6-7 Fixed cart entry in the lower-right corner.

### 7. Member
- 7-1 Member home.
- 7-2 My Profile.
- 7-3 My Reptiles Summary.
- 7-4 My Articles.
- 7-6 My Orders.
- 7-7 Notification Settings.
- 7-8 Login / Register.
- 7-9 Login mock state switch.
- 7-10 Internal Member tab switching state.
- 7-11 Notification toggle state: Enabled / Disabled.

---

## B. Global Interaction Screen Requirements
- Bottom navigation stays fixed and visible.
- Subpage Back button is fixed in the upper-left corner.
- Subpages support swipe-right-to-go-back from the left edge.
- Mock presentation must include an iPhone frame as the outermost layer.

---

## C. Phase 2 Screens
- Breeding Plan.
- Reptile Notes.
- Rainbow Bridge.
- Reptile Encyclopedia.
- Full Shop.

---

## D. Phase 3 Screens
- Widget: feeding reminders / care days.

---

## E. Frontend Implementation Screen List Addendum
> Added on 2026-04-26 based on the current implementation in `src/App.tsx`.

### E-1 Global Shell
- Phone mock frame.
- TopBar.
- Scrollable content area.
- BottomNav: Reptiles / Discussion / Home / Shop / Member.
- FloatingActionButton shown depending on the current page.
- Shared subpage Back button and left-edge swipe-back.

### E-2 Home Related
- HomeScreen: Home overview.
- CalendarScreen: Calendar detail page, reachable from the Home calendar or Plan page.
- AIScreen: Pet AI+ Assistant, reachable from Home or Pet Profile.
- ConstructionScreen: mock under-construction page.

### E-3 Reptiles Related
- PetHubScreen: Reptiles Hub.
- PetsScreen: My Reptiles list.
- AddPetScreen: Add Reptile.
- AddPetScreen edit mode: Edit Reptile.
- PetProfileScreen: Pet Profile.
- AlbumScreen: Reptile Album.
- HistoryScreen: reptile history records.
- RecordScreen: Feeding / Records.
- PlanScreen: Feeding Plan, including list / settings / create / edit modes.

### E-4 Discussion Related
- DiscussionScreen: Discussion list.
- ArticleScreen: article detail and comments.
- EditorScreen: shared editor for adding and editing articles.

### E-5 Shop Related
- ShopScreen: product list.
- ProductScreen: product detail.
- CartScreen: cart.
- CheckoutScreen: checkout.

### E-6 Member Related
- MemberScreen logged out: logged-out Member page.
- LoginScreen: Login / Register.
- MemberScreen logged in: logged-in Member page.
- Internal logged-in Member tabs: My Profile, My Reptiles, My Articles, My Orders, Notification Settings.

### E-7 Main Navigation Rules
- Home can open My Reptiles, Feeding / Records, Feeding Plan, Discussion, Shop, Album, Calendar, AI, and Construction.
- Reptiles Hub can open My Reptiles, Feeding / Records, Feeding Plan, and Album.
- My Reptiles list can open Pet Profile; the floating button opens Add Reptile.
- Pet Profile can open Edit, Records, Plan, AI, Album, and History.
- Discussion list can open article detail; the floating button opens the article editor.
- The current user's own article can open the article editor in edit mode.
- Shop list can open product detail; the floating button opens Cart.
- Product detail can open Checkout.
- Cart can open Checkout.
- Logged-out Member can open Login / Register; successful login returns to Member.

