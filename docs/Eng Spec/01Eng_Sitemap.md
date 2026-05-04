# Reptile Love+ Sitemap

> Priority rule: Home IA, bottom navigation, Member placement, and AI / Details entries follow the hand-drawn Home reference first. Other fields and feature details follow the spec documents.

---

## 1. Global Navigation and Interaction Rules

### 1.1 Bottom Navigation
The bottom navigation is fixed and contains 5 tabs:

1. Reptiles
2. Discussion
3. Home
4. Shop
5. Member

### 1.2 Global Interaction
- Home is a long scrollable page.
- Content continues downward above the bottom navigation.
- The bottom navigation stays fixed and visible at all times.
- Every subpage has its Back button in the upper-left corner.
- Every subpage supports swipe-right-to-go-back from the left edge.

### 1.3 Member and Notification Settings
- Member is a main bottom tab.
- Notification Settings belongs inside the Member entry.

---

## 2. Home

### 2.1 Top Section: Today Widget
- Shows today's care task summary.
- Displays today's task cards.
- Only 2 cards are partially visible in the first viewport.
- If there are more than 2 cards, the rest must be reachable by vertical scrolling inside the Today Widget section.
- Card fields: avatar, reptile name, task type, time, status.
- Tapping a card defaults to the selected reptile's Pet Profile page. If a clearer task page is defined later, it can navigate to that task-specific page instead.

### 2.2 Today Widget Extended Entry
- Pet AI+ Assistant

### 2.3 First Shortcut Row
- My Reptiles
- Feeding / Records

### 2.4 Second Shortcut Row
- Feeding Plan
- Breeding Records
- Reptile Album

### 2.5 Main Sections Below
- Calendar Block: full April monthly calendar, red dots for feeding events, blue dots for other events.
- Discussion Block: tappable and leads to Discussion.
- Shop Block: only visible after scrolling down.

---

## 3. Reptiles Tab

### 3.1 Reptiles Hub
- My Reptiles
- Feeding / Records
- Feeding Plan
- Photo and History entry
- Reserved Phase 2 entries:
  - Reptile Notes
  - Breeding Plan
  - Rainbow Bridge
  - Reptile Encyclopedia

### 3.2 My Reptiles
- Reptile list
- Add reptile
- Edit reptile
- Pet Profile
- Pet Profile can open Edit Reptile.
- After add / edit is saved, the frontend display must update immediately.

### 3.3 Pet Profile
- Block A: individual reptile summary.
- Block B: core feature entries: Feeding / Records, Feeding Plan, Pet AI+, Reptile Album.
- Block C: one-line AI summary.
- Block D: weight trend chart.
- Block E: feeding frequency chart.
- Block F: temperature and humidity trends.
- Block G: recent event timeline.
- Block H: history records.
- Block I: Reptile Album entry.
- Fixed `Pet AI+` FAB in the lower-right corner.
- Pet Profile is the preferred return page for core feature flows.

### 3.4 Feeding / Records
- Reptile selector.
- Species template is loaded directly based on the selected reptile.
- Date and time.
- Basic fields.
- Dynamic quick-pick form.
- Special conditions and events.
- Excretion health tracking.
- Custom routine tags.
- Photo upload / camera.
- Saved confirmation / warning.
- After submit, return to that reptile's Pet Profile and show the newly written record.

### 3.5 Feeding Plan
- Plan list.
- Add plan.
- Edit plan.
- Calendar switch / calendar entry.
- Plan details.
- Notification permission guidance.
- Plan details can navigate to the reptile page.
- Plans are long-term schedules and must not use the meaning of "complete plan".
- After add / edit, updates must be reflected in the Pet Profile and task data.

### 3.6 AI Assistant Chat Window
- Top reptile switcher.
- Conversation area.
- Image upload button.
- Input area.
- Must show the latest status summary for the current reptile.
- Conversation is based on the selected reptile's data.
- Back must return to the previous entry context instead of always returning to Home.

---

## 4. Discussion Tab
- Discussion list page.
- Post editor.
- Article detail page.
- Reply area.
- Fixed post button in the lower-right corner.

---

## 5. Shop Tab
- Shop home.
- Product list page.
- Product detail page.
- Cart.
- Checkout.
- Order completion page.
- Fixed cart entry in the lower-right corner.

---

## 6. Member Tab
- My Profile.
- My Reptiles Summary.
- My Articles.
- My Orders.
- Notification Settings.
- Login / Register.

---

## 7. Calendar Block / Calendar Feature
- The Calendar main page is a full monthly calendar.
- Calendar.
- Day view.
- Filter by reptile.
- Filter by event type.
- Event list for a selected date.
- Event details.
- Navigate to Record / Pet Profile.
- Upcoming Tasks in 7 Days section.

---

## 8. Phase 2 Features
- Breeding Plan.
- Reptile Notes.
- Rainbow Bridge.
- Reptile Encyclopedia.
- Full Shop.

---

## 9. Phase 3 Features
- Widget:
  - Shows feeding reminders.
  - Shows how many days a reptile has been cared for.

---

## 10. Frontend Implementation Sitemap Addendum
> Added on 2026-04-26 based on currently reachable paths in `src/App.tsx`. This mock does not use a URL router; the items below describe screen state hierarchy.

### 10.1 Bottom Nav
1. Reptiles: `petHub`
2. Discussion: `discussion`
3. Home: `home`
4. Shop: `shop`
5. Member: `member`

### 10.2 Home: `home`
- `home` -> `pets`
- `home` -> `record`
- `home` -> `plan`
- `home` -> `discussion`
- `home` -> `shop`
- `home` -> `album`, default filter is all reptiles.
- `home` -> `calendar`
- `home` -> `ai`, return target is `home`.
- `home` -> `article`
- `home` -> `product`
- `home` -> `construction`

### 10.3 Reptiles: `petHub`
- `petHub` -> `pets`
- `petHub` -> `record`
- `petHub` -> `plan`
- `petHub` -> `album`, default filter is all reptiles.
- `pets` -> `profile`
- `pets` -> `addPet`, opened by the floating button.
- `addPet` -> save -> `pets`
- `profile` -> `editPet`
- `editPet` -> save -> `profile`
- `profile` -> `record`
- `profile` -> `plan`
- `profile` -> `ai`, return target is `profile`.
- `profile` -> `album`, default filter is the current reptile.
- `profile` -> `history`
- `record` -> submit -> `profile`
- `plan` -> `calendar`
- `calendar` -> `profile`
- `calendar` -> `record`

### 10.4 Album: `album`
- `album` is a shared subpage for Home, Reptiles Hub, and Pet Profile.
- `album` can switch the reptile filter without changing the page level.
- Tapping a photo only opens an in-page enlarged preview and does not switch screens.
- Changing a photo's reptile assignment updates mock data only and does not switch screens.

### 10.5 Discussion: `discussion`
- `discussion` -> `article`
- `discussion` -> `editor`, opened by the post floating button.
- `article` -> `editor`, shown only for the user's own article.
- `editor` publish -> `article`

### 10.6 Shop: `shop`
- `shop` -> `product`
- `shop` -> `cart`, opened by the cart floating button.
- `product` -> addToCart, stays on the product page.
- `product` -> buyNow -> `checkout`
- `cart` -> `checkout`
- `checkout` submit order, stays on Checkout and shows a mock alert.

### 10.7 Member: `member`
- `member` logged out -> `login`
- `login` login -> `member`
- Logged-in `member` uses internal tabs without switching screens: My Profile, My Reptiles, My Articles, My Orders, Notification Settings.

### 10.8 Back Rules
- General subpages return to the previous screen.
- Bottom navigation switching clears the back stack.
- `ai` keeps a fallback return target based on its entry source.
- Most subpages support left-edge swipe-back. The interaction requires starting near the left edge, swiping right far enough, and keeping vertical movement small.

