# Reptile Love+ Block List by Page

---

## 1. Global Rules

### Required Rules
- Home is a long scrollable page.
- Bottom navigation stays fixed and visible.
- Content scrolls above the bottom navigation.
- Every subpage has a Back button fixed in the upper-left corner.
- Every subpage supports swipe-right-to-go-back from the left edge.
- Every Back flow should return to the previous page, not to a fixed module home.
- The outermost mock must include an iPhone frame.

---

## 2. Home Main Screen

### Required Blocks
- Header.
- Today Widget:
  - Today's task cards.
  - Only 2 cards are partially visible in the first viewport.
  - If there are more than 2 cards, the section must scroll vertically inside the block.
  - Card content: avatar, reptile name, task type, time, status.
  - Tapping a card defaults to the selected reptile's Pet Profile.
- Today Widget extended entry:
  - Pet AI+ Assistant as a wide horizontal button.
- First shortcut row:
  - My Reptiles.
  - Feeding / Records.
- Second shortcut row:
  - Feeding Plan.
  - Breeding Records.
  - Reptile Album.
- Calendar Block:
  - Full April calendar.
  - Legend above the month: red dot = feeding, blue dot = other.
  - Feeding events use red dots.
  - Other events use blue dots.
- Discussion Block.
- Shop Block: placed lower and only visible after scrolling.
- Upcoming Tasks section.
- Bottom navigation.

---

## 3. Reptiles Hub

### Required Blocks
- Header.
- My Reptiles entry.
- Feeding / Records entry.
- Feeding Plan entry.
- Photo and History entry.
- Reserved Phase 2 entry area.
- Bottom navigation.

---

## 4. My Reptiles List

### Required Blocks
- Header.
- Upper-left Back button.
- Search / filter area.
- Reptile card list showing age and days since arrival.
- Fixed Add Reptile button in the lower-right corner as a FAB.
- Bottom navigation.

---

## 5. Pet Profile

### Required Blocks
- Header.
- Upper-left Back button.
- Block A: individual reptile summary.
- Block B: core feature entries: Feeding / Records, Feeding Plan, Pet AI+, Reptile Album.
- Pet Profile is the preferred return page for other core feature flows.
- Block C: one-line AI summary.
- Block D: weight trend chart.
- Block E: feeding frequency chart.
- Block F: temperature and humidity trends.
- Block G: recent event timeline.
- Block H: history records.
- Block I: Reptile Album entry.
- Fixed `Pet AI+` FAB in the lower-right corner.
- Edit Reptile entry.
- Bottom navigation.

---

## 6. Feeding / Records Main Screen

### Required Blocks
- Header.
- Upper-left Back button.
- Reptile dropdown.
- Date and time section.
- Basic field section, mainly using dropdowns.
- Dynamic quick-pick form section.
- Advanced options toggle section.
- Special conditions and events section.
- Excretion health tracking section.
- Custom routine tag button area, shown only after the user enters other content.
- Photo upload / camera section.
- High-risk event warning section.
- Submit button.
- After submit, return to Pet Profile and refresh history, timeline, and latest event.
- Show only the result fields entered in this submission.
- Bottom navigation.

---

## 7. Calendar

### Required Blocks
- Header.
- Calendar main page as a full monthly calendar.
- Legend above the month: red dot = feeding, blue dot = other.
- Filters.
- Calendar body.
- Selected-date event list.
- Event detail card.
- Buttons to navigate to Pet Profile / Feeding Records.
- Bottom navigation.

---

## 5.5 AI Assistant Chat Window

### Required Blocks
- Header.
- Upper-left Back button.
- Top reptile switcher.
- Conversation area.
- Image upload area.
- Input area.

---

## 8. Discussion List Page

### Required Blocks
- Header.
- Article list:
  - Preview image.
  - Title.
  - Summary.
  - Date.
  - Author.
  - Like count.
  - Reply count.
- Fixed post button in the lower-right corner as a FAB.
- Bottom navigation.

---

## 9. Shop Home / Product List

### Required Blocks
- Header.
- Banner area.
- Product category area.
- Product card list:
  - Product image.
  - Product name.
  - Product category.
  - Price.
  - Stock / status.
  - Add to Cart button.
- Fixed cart entry in the lower-right corner as a FAB / fixed CTA.
- Bottom navigation.

---

## 10. Add / Edit Reptile

### Required Blocks
- Header.
- Upper-left Back button.
- Basic information form.
- Advanced information form.
- Photo upload / camera section.
- Save button.
- Saved completion prompt.
- Bottom navigation.

---

## 11. Feeding Plan Page

### Required Blocks
- Header.
- Upper-left Back button.
- Settings button.
- Add Plan button.
- View Calendar button.
- Same-week view.
- Task type dropdown.
- Other task type input / custom tag button.
- Frequency dropdown.
- Every N days input area.
- Specific weekdays: weekday multi-select plus hour and minute selectors.
- Schedule preview area.
- Plan list.
- Plan details.
- Edit Plan entry.
- Bottom navigation.

---

## 12. Checkout Page

### Required Blocks
- Header.
- Upper-left Back button.
- Recipient information input fields.
- Address input fields.
- Note input field.
- Order total.
- Submit Order button.
- Bottom navigation.

---

## 12.5 Reptile Album

### Required Blocks
- Header.
- Upper-left Back button.
- Upper-right reptile filter.
- Three-column photo list.
- Enlarged photo preview.
- Manual photo assignment dropdown.
- Download button.
- Fixed Upload button in the lower-right corner as a FAB.
- Default filter state when entered from a selected reptile.

---

## 13. Member / Notification Settings

### Required Blocks
- Header.
- Login / Register entry.
- Internal Member tab switcher.
- My Profile.
- My Reptiles Summary.
- My Articles.
- My Orders.
- Notification Settings with one toggle.
- Notification status badge: Enabled / Disabled.
- Basic interaction area for each tab.
- Bottom navigation.

---

## 14. Frontend Implementation Block List Addendum
> Added on 2026-04-26 based on currently implemented visible blocks and interaction components in `src/App.tsx`.

### 14.1 Shared Blocks
- TopBar.
- SubPageHeader: Back button and page title.
- SwipeBackPage: left-edge swipe-back interaction container.
- BottomNav: five main tabs.
- FloatingActionButton: primary action shown by current page.
- MediaThumb: shows an image for image paths and text fallback for non-image content.
- MonthDotsCalendar: monthly grid, event color dots, and selected-date state.

### 14.2 Home Blocks
- Today's care task list: tappable and opens Pet Profile.
- AI Assistant entry.
- Shortcut entries: My Reptiles, Feeding / Records, Feeding Plan, Album, Calendar, and others.
- Discussion article preview: tappable and opens article detail.
- Product preview: tappable and opens product detail.
- Calendar preview: tapping a date updates `selectedDate`.

### 14.3 Reptiles Blocks
- Reptiles Hub cards: My Reptiles, Feeding / Records, Feeding Plan, Album.
- My Reptiles list card: photo, name, morph, status, care days, latest event.
- Pet Profile summary card: avatar, name, morph, status, care days, weight, last feeding.
- Pet Profile action row: Edit, Record, Plan, AI, Album.
- Charts: weight line, feeding frequency, humidity line.
- Recent timeline.
- Album preview.
- History record list: abnormal badge and has-photo badge.

### 14.4 Add / Edit Reptile Blocks
- Name input.
- Main species category selector.
- Detailed morph input.
- Sex selector.
- Birth or care start date: year, month, and day selectors.
- Weight and unit.
- Photo source: upload photo, camera, app album.
- Save button.

### 14.5 Album Blocks
- Reptile filter select.
- Photo grid.
- Enlarged photo preview.
- Reptile assignment select.
- Close enlarged preview button.
- Upload floating button.

### 14.6 Feeding / Records Blocks
- Reptile selector.
- Date-time hour selector.
- Feeding content select.
- Other feeding content input and Save Custom Tag button.
- Feeding weight and quantity inputs.
- Advanced Records expand / collapse.
- Event select, other event input, and Save Custom Tag button.
- Excretion select, other excretion description input, and Save Custom Tag button.
- Upload photo and camera mock actions.
- Submit button.

### 14.7 Feeding Plan Blocks
- Mode switch: settings and add plan.
- View Calendar button.
- Notification Settings entry.
- Reptile select.
- Task type select and other task type input.
- Frequency select: Every N days / Specific weekdays.
- Interval days input.
- Weekday multi-select chips.
- Hour and minute select.
- Save Plan / Save Changes button.
- Plan list.
- Plan details: go to Pet Profile and notification permission guidance.

### 14.8 Calendar Blocks
- Monthly calendar.
- Filter by reptile select.
- Filter by event type select.
- Selected-date event list.
- Event details.
- Go to Pet Profile.
- Go to Feeding / Records.

### 14.9 AI Assistant Blocks
- Reptile select.
- Latest event and AI summary section.
- Conversation message list.
- Message input row: attachment mock button, textarea, send button.

### 14.10 Discussion and Article Blocks
- Discussion list card: cover, category, title, summary, author, date, like count, reply count.
- Post floating button.
- Editor: title, cover image upload, attached image upload, attached image removal, body, save draft, publish.
- Article detail: cover, title, author, date, content, images, likes, comments.
- Edit button shown for the current user's own article.
- Comment input and submit.

### 14.11 Shop Blocks
- Product list card: image, name, category, price, badge, stock, Add to Cart.
- Product detail: image, price, description, specifications, stock, shipping information.
- Product CTA: Add to Cart, Buy Now.
- Cart list: product, quantity, subtotal.
- Cart total and Go to Checkout.
- Checkout form: recipient, phone, city / district, address, note.
- Order total and Submit Order.

### 14.12 Member Blocks
- Logged-out prompt and Go to Login.
- Login form: Email, password, nickname.
- Google / Apple mock buttons.
- Member tab chips.
- My Profile edit form.
- My Reptiles summary list.
- My Articles summary list.
- My Orders switcher and order status.
- Notification toggle badge.

