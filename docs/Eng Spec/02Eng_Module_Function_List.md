# Reptile Love+ Module / Function List

> Priority rule: Home IA, bottom navigation, Member placement, and AI / Details entries follow the hand-drawn Home reference first. Other fields and feature details follow the spec documents.

---

## 0. Global Interaction Rules

### Navigation
- Fixed bottom navigation with 5 tabs: Reptiles / Discussion / Home / Shop / Member.
- The bottom navigation must stay fixed and visible while pages scroll.
- Home content must be scrollable.
- The Shop Block should not be fully visible in the first Home viewport; users must scroll down to see it.
- Every subpage has a Back button fixed in the upper-left corner.
- Every subpage supports swipe-right-to-go-back from the left edge.

### Visual / Mock Presentation
- The outermost mock must be wrapped in an iPhone device frame.
- Screen content scrolls inside the phone frame.
- The bottom navigation is fixed to the bottom of the phone frame.

---

## 0.5 Current Core Feature Priority
- My Reptiles
- Feeding / Records
- Feeding Plan
- Pet AI+

All integration, data synchronization, and state cleanup currently prioritize these four areas.

---

## 1. Home

### Modules
- Today Widget
- Pet AI+ Assistant entry
- First shortcut row
- Second shortcut row
- Calendar Block
- Discussion Block
- Shop Block
- Upcoming Tasks in 7 Days section

### Functions
- Today Widget shows today's task summary.
- Only 2 task cards are partially visible in the first viewport.
- If there are more than 2 tasks, the remaining cards must be reachable by vertical scrolling inside the Today Widget section.
- Card fields: avatar, reptile name, task type, time, status.
- Tapping a task card defaults to the selected reptile's Pet Profile page.
- Today Widget can link to the Pet AI+ Assistant.
- The AI button must be a wider horizontal Home button.
- First shortcut row: My Reptiles / Feeding / Records.
- Second shortcut row: Feeding Plan / Breeding Records / Reptile Album.
- Home is a long page and can scroll vertically.
- Calendar Block shows the full April monthly calendar.
- A legend must appear above the month: red dot = feeding, blue dot = other.
- Feeding events use red dots; other events use blue dots.
- Tapping the Home calendar opens the full Calendar page.
- Shop Block is placed lower and only appears after scrolling.
- Upcoming Tasks in 7 Days shows the whole week instead of only single-day events.

---

## 2. Reptiles Tab / Hub

### Modules
- Reptiles Hub main entry
- My Reptiles entry
- Feeding / Records entry
- Feeding Plan entry
- Photo and History entry
- Reserved Phase 2 entries

### Functions
- Serves as the core collection page.
- Reserved Phase 2 entries: Reptile Notes / Breeding Plan / Rainbow Bridge / Reptile Encyclopedia.

---

## 3. My Reptiles

### Modules
- Reptile list
- Search / filter
- Add Reptile form
- Edit Reptile form
- Pet Profile

### Functions
- Add Reptile fields must include basic data and advanced data.
- The Add Reptile button on My Reptiles must be a fixed lower-right FAB.
- Reptile cards show avatar, name, species / morph tag, age, and days since arrival.
- Name and detailed morph / breed fields in Add Reptile must support manual input.
- After saving a reptile, show a completion prompt, return to the previous page, and show the saved content in the frontend.
- Pet Profile must be able to open Edit Reptile.
- Pet Profile must serve as the main entry point for the four core features.
- Pet Profile must include summary, separated chart blocks, AI block, history, and Reptile Album entry.
- When entering Reptile Album from Pet Profile, open the same Reptile Album page, but default the upper-right filter to that reptile.
- Pet Profile is the main view of reptile data. Other core features should prefer returning here.

---

## 4. Feeding / Records

### Modules
- Reptile selector
- Date and time section
- Basic fields section
- Dynamic quick-pick form section
- Special conditions and events section
- Excretion health tracking section
- Custom routine tags section
- Photo upload section
- Saved confirmation / warning section

### Functions
- All fields are optional.
- Select a reptile first, then dynamically switch the species form.
- Do not show a visible species-template switcher; directly load the proper species template based on the selected reptile.
- The form should primarily use clean dropdown controls and must not become visually cluttered.
- Date and time default to the current time, but the user can adjust the hour.
- Supports photo upload and camera.
- Photos added from Pet Profile must be automatically tagged as that reptile's photos.
- Photos added from Feeding / Records must be automatically assigned to the selected reptile.
- Supports recording multiple event types in one submission.
- "Other" values for feeding content, events, and excretion must allow manual input.
- Show the "Save as custom tag" button only after the user enters other text.
- Entered values can be saved as reusable custom tags.
- Feeding method, events, and excretion should be placed inside Advanced Options and expanded by toggle.
- High-risk events must show a warning immediately after being selected.
- A submit button must appear at the bottom of the page.
- After submit, show a completion prompt and return to the previous source page. If the source was Pet Profile, return to Pet Profile.
- Save and display only fields the user filled in or selected in this submission. Empty fields are not written and not shown.
- After submit, update latest event, history records, timeline, and related task status.

### Dynamic Quick-Pick Form Types
- Snake
- Gecko / Lizard
- Tortoise
- Aquatic Turtle
- Amphibian
- Arthropod

---

## 5. Calendar

### Modules
- Monthly calendar
- Day view
- Reptile filter
- Event type filter
- Selected-date event list
- Event detail card

### Functions
- Shows the overall view of all care events.
- The Calendar main page defaults to a full monthly calendar.
- A legend must appear above the month: red dot = feeding, blue dot = other.
- Monthly calendar dot rule: feeding uses red dots; other events use blue dots.
- Do not provide a monthly / day-view switch button; always present the monthly overview.
- Supports filtering by reptile and event type.
- Tapping a date shows all events and tasks for that date.
- Tapping an event shows details.
- Can navigate to that record or that reptile's Pet Profile.
- Shows Upcoming Tasks in 7 Days below.

---

## 5.5 Pet AI+ Assistant

### Modules
- Home Pet AI+ Assistant button
- Pet Profile AI Assistant block
- AI chat window
- Top reptile switcher
- Conversation area
- Image upload area
- Input area

### Functions
- The Home AI button label is fixed as `Pet AI+ Assistant`.
- Pet Profile must have an AI content summary block above the weight trend chart.
- Pet Profile must have a `Pet AI+` FAB in the lower-right corner.
- The AI block only shows one AI sentence.
- Tapping the `Pet AI+` FAB opens the AI chat window.
- The top of the AI chat window can switch the active reptile.
- The AI chat window supports photo upload.
- Back from the AI chat window must return to the previous entry context.
- Conversation must be based on that reptile's data.
- Both the AI block and AI chat window must reflect that reptile's latest status and task context.

---

## 6. Discussion

### Modules
- Discussion list page
- Post editor
- Article detail page
- Reply area

### Functions
- The list shows preview image, title, summary, date, author, like count, and reply count.
- Like count and reply count on the list page must directly reflect the current article data and must not drift from the article detail page.
- Each article must have a preview image on the left.
- The post button is fixed in the lower-right corner as a FAB.
- Supports posting, draft save, category selection, inline images, and cover image.
- The post editor must not keep a formatting toolbar.
- Inline image upload must show an upload limit, for example `(0/5)`.
- Post image upload mock must support preview, add, and remove.
- Cover image must be switchable among mock assets.
- Supports text replies and image upload.
- After publishing, the article detail page must feel like a complete article layout, not a single stacked text block.
- Article top area must show author, date, category, like count, comment count, and edit entry if the article belongs to the current user.
- Articles must have a comment button.
- Articles can be liked, but the same person can like the same article only once.
- The current user's own posts must be editable from the frontend.
- Comment area styling and comment mock data must exist; submitted comments must appear immediately.
- Both the list page and detail page must show correct like and comment counts.
- Likes and comments use icon + number on both list and detail pages.
- Article image structure is cover image plus horizontally scrollable inline images.
- Publish must perform an actual action.

---

## 7. Shop

### Modules
- Shop home
- Product list page
- Product detail page
- Cart
- Checkout
- Order completion page

### Functions
- Phase 1 includes only platform-owned products.
- Product cards must show product images and must not be text-only or banner-only.
- The Shop page has a fixed cart entry in the lower-right corner as a FAB / fixed CTA.
- Supports Add to Cart.
- After Add to Cart, the product quantity must actually increase.
- Cart can navigate to Checkout.
- Checkout must include address and contact information fields.
- Checkout fields must be editable.
- Supports single checkout flow.
- Product fields: product name, category, cover image, carousel images, price, description, specifications, stock, shipping information.

---

## 8. Member

### Modules
- My Profile
- My Reptiles Summary
- My Articles
- My Orders
- Notification Settings with one toggle
- Login / Register

### Functions
- Notification Settings belongs inside Member.
- Member must include a login mock.
- Login methods: Email verification / Google / Apple OAuth.
- After login, the user can switch between My Profile, My Reptiles Summary, My Articles, My Orders, and Notification Settings.
- Notification Settings keeps only one `Enable Notifications` toggle. Tapping it navigates to the Apple Settings page.
- The notification toggle must show two states: `Enabled` and `Disabled`.
- Each Member tab must include basic interaction and must not be only a static title.

---

## 4.5 Reptile Album

### Modules
- Reptile Album page
- Upper-right reptile filter
- Photo grid / three-column list
- Enlarged photo preview
- Manual photo assignment dropdown
- Upload button as FAB

### Functions
- When entering Reptile Album from the Reptiles page, do not default to any reptile filter.
- When entering Reptile Album from Pet Profile, default the upper-right filter to that reptile.
- The Album page shows 3 photos per row.
- Photos can be tapped to enlarge.
- Enlarged photos can be downloaded.
- In the enlarged view, a dropdown can manually assign the photo to a reptile.
- After manual assignment, the photo ownership must actually update.
- The Album page has a fixed `Upload` FAB in the lower-right corner.
- After upload, the photo must be written into the selected reptile's album data.

---

## 8.5 Cloud Data Storage / Backend Direction

### Modules
- Member data storage
- Reptile data storage
- Care records / feeding plan storage
- Discussion data storage
- Cart / order / recipient information storage

### Functions
- User data must be stored in the cloud and must not exist only in frontend local state.
- Cloud data must cover members, reptiles, records, discussion, and shopping data.
- During the mock stage, frontend simulation is acceptable, but the architecture must reserve a future cloud data path.
- Backend / cloud service selection must be handled in a dedicated later step.
- Candidate direction for evaluation: Cloudflare + AWS.

---

## 9. Admin / Management Console

### Modules
- Member management
- Reptile data lookup
- Discussion post management
- Report handling
- Product management
- Order management
- Banner management
- Species category / event dictionary management
- Notification rule management

---

## 10. Mock Data
- Create a complete one-month sample dataset for a normal active user.
- Write it as document 6.
- Sync it into the mock screens.

---

## 11. Phase 2 Features
- Breeding Plan
- Reptile Notes
- Rainbow Bridge
- Reptile Encyclopedia
- Full Shop

---

## 12. Phase 3 Features

### Widget
- Shows feeding reminders.
- Shows how many days a reptile has been cared for.

---

## 13. Frontend Implementation Addendum
> Added on 2026-04-26 based on the currently operable mock frontend in `src/App.tsx`. The items below describe features and interaction logic that already appear in the frontend but were missing or scattered in the original spec.

### 13.1 Global Navigation and Back Behavior
- The app uses a single `screen` state to switch pages. Main tabs are Reptiles, Discussion, Home, Shop, and Member.
- Bottom tab switching clears the back stack. Subpage back uses `backStack` to return to the previous page. If no previous page exists, it returns to Home or a specified fallback.
- Most subpages support left-edge swipe-back: start within 80px from the left edge, horizontal movement greater than 120px, and vertical movement under 100px.
- Bottom tab highlighting maps subpages to their parent tab: reptile subpages to Reptiles, article/editor to Discussion, product/cart/checkout to Shop, Calendar/AI to Home, and Login to Member.
- Floating action buttons change by page: Discussion shows `Post`, Shop shows `Cart (count)`, My Reptiles shows `Add Reptile`, and Pet Profile shows `Pet AI+`.

### 13.2 Home Addendum
- Home can directly open My Reptiles, Feeding / Records, Feeding Plan, Discussion, Shop, Reptile Album, Calendar, AI Assistant, and Construction.
- Tapping today's task card opens the corresponding Pet Profile.
- Article cards on Home open article detail. Product cards open product detail.
- Tapping a date in the Home calendar updates global `selectedDate`; the Calendar page uses the same date state.

### 13.3 Reptiles and Pet Profile Addendum
- Tapping a card in My Reptiles opens Pet Profile and sets the current selected reptile.
- Add Reptile inserts the reptile at the front of the reptile array, refreshes the AI summary, selects that reptile, shows a saved prompt, and returns to the list.
- Edit Reptile overwrites the original reptile data, refreshes the AI summary, shows a saved prompt, and returns to Pet Profile.
- Pet Profile provides Edit, Feeding / Records, Feeding Plan, Pet AI+, Reptile Album, and View More History.
- Pet Profile includes a weight line chart, feeding frequency chart, humidity line chart, recent timeline, and photo section.

### 13.4 Album Addendum
- Reptile Album is an independent page reachable from Home, Reptiles Hub, and Pet Profile.
- If entered from Pet Profile, it defaults to that reptile. If entered from Home or Hub, it defaults to all reptiles.
- Album supports reptile filtering: all reptiles or one reptile.
- Tapping a photo opens an enlarged preview showing the photo and current reptile assignment.
- In enlarged preview, the photo assignment can be changed. The frontend removes the photo from all reptiles and inserts it at the front of the new reptile's album.
- Album has an `Upload` floating button. If the current filter is all reptiles, upload defaults to the first reptile.

### 13.5 History and Construction Addendum
- History is a child page extending Pet Profile. It lists all records for that reptile and marks abnormal records and records with photos.
- Construction is a mock child page reachable from Home. It only shows an unavailable status and Back.

### 13.6 Feeding / Records Addendum
- The record page can select reptile, select hour, select feeding content, and enter feeding weight and quantity.
- Record presets switch by species category, including snake, gecko, tortoise, aquatic turtle, amphibian, and arthropod.
- `Advanced Records` can expand or collapse and includes event and excretion status.
- Feeding content, event, and excretion all support `Other`; after entering text, it can be saved as a custom tag and selected immediately.
- Photo upload and camera inside the record form are mock alerts. On submit, if the record includes photo-related data, a mock image is added to that reptile's album.
- Submit inserts the record at the front of the reptile records, adds a timeline item, updates latest event, and updates last feeding date for feeding records.
- After submit, the app attempts to mark that reptile's incomplete feeding / soaking / observation plan as complete, refreshes the AI summary, and returns to Pet Profile.

### 13.7 Feeding Plan and Calendar Addendum
- Plan page has four modes: list, settings, create, and edit.
- Plans can be added and edited. The user can select reptile, task type, frequency, and time.
- Task type supports `Other` and can be saved as a custom plan type.
- Frequency supports `Every N days` and `Specific weekdays`. Weekday mode allows multiple weekdays.
- Adding a plan generates one or more calendar events based on the schedule, updates the reptile AI summary, and shows a success prompt.
- Editing a plan updates the original event's reptile, type, title, frequency, date, and time.
- Selecting a plan in the list shows details. Details can navigate to Pet Profile or open notification permission guidance.
- Calendar supports reptile filter and event type filter. After selecting a date, it lists events for that date. Tapping an event shows details.
- Calendar event details can navigate to Pet Profile or Feeding / Records.
- Monthly calendar uses red dots for feeding events and blue dots for non-feeding events.

### 13.8 AI Assistant Addendum
- AI Assistant preserves the source return target. Entering from Home or Pet Profile results in different return targets.
- AI Assistant can switch reptiles and shows that reptile's latest event and AI summary.
- Conversation content comes from mock conversation data. The input box and send button are currently UI-only and do not append new messages.

### 13.9 Discussion and Article Addendum
- Tapping an article in the Discussion list opens article detail.
- The Discussion floating button opens the post editor.
- The editor contains title, cover image, attached images, and body. The cover image button cycles through mock images.
- Attached images are capped at 5. Tapping an attached image removes it.
- Draft save is currently a mock alert.
- Title and body are required when publishing. Missing fields trigger an alert.
- Publishing a new post creates a mock post, inserts it at the front of the list, initializes its comment array, clears the draft, and opens article detail.
- If the current user's own article is edited, the editor loads existing article data. Publishing updates the original article and returns to detail.
- Each article can be liked only once per session. Repeated likes trigger an alert.
- Comments are trimmed before submit. Empty comments trigger an alert. Successful comments are inserted at the front, reply count updates, and the input clears.

### 13.10 Shop, Cart, and Checkout Addendum
- Shop list can open product detail and can also add directly to cart.
- Add to Cart increments quantity if the product already exists, or adds a new cart line if it does not.
- Product detail includes specifications, stock, and shipping note. It can add to cart or buy now.
- Buy Now first adds the product to cart, then opens Checkout.
- Cart lists products, quantity, subtotal, and total. Delete and quantity adjustment are not currently provided.
- Checkout includes recipient, phone, city / district, address, note, and order total.
- Submit Order is currently a mock alert and does not clear the cart.

### 13.11 Member and Login Addendum
- Logged-out Member shows login guidance and a button to Login / Register.
- Login page contains Email, password, nickname, Google, and Apple. Tapping login sets `isLoggedIn` to true and returns to Member.
- Logged-in Member has tabs: My Profile, My Reptiles, My Articles, My Orders, and Notification Settings.
- My Profile can edit name and Email. Saving is a mock alert.
- My Orders can switch between mock orders `RL+1024` and `RL+1021` and show different statuses.
- Notification Settings can toggle enabled / disabled badge and mock-navigate to Apple Settings.

### 13.12 Mock Data and State Limits
- All data changes are frontend in-memory mock state and are not preserved after refresh.
- Image sources include `/mock-images/`; non-image paths fall back to text display.
- Alert text represents mock success, permission, or error prompts. Real APIs, login, payment, notifications, camera, and album permissions are not integrated yet.

