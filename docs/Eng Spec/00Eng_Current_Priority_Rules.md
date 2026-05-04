# Current Priority Rules

> This document keeps only the rules that are currently in effect.
> If new verbal updates are made later, update this document first so older documents do not keep misleading the project.

---

## 1. Source of Truth
- The highest priority source is currently the **hand-drawn Home IA / latest verbal updates**.
- If older documents conflict with the drawing or the latest verbal updates, **the latest updates take precedence**.

---

## 2. Current Core Documents
There are currently 5 core documents, not 4:

1. `01_Sitemap.md`
2. `02_Module_Function_List.md`
3. `03_Screen_List.md`
4. `04_Block_List_By_Page.md`
5. `05_Localhost_Notes.md`

Note:
- `06_Mock_Data_One_Month_Sample.md` is the mock data document. It is not part of the 5 core documents, but it is important.

---

## 3. Highest Priority Core Features
- `My Reptiles`
- `Feeding / Records`
- `Feeding Plan`
- `Pet AI+`

Notes:
- These four areas are the current product core. Future frontend integration, data flow cleanup, and document updates should prioritize these areas.
- The Pet Profile page must serve as the main entry point for these four core features.
- Discussion, Shop, and Member must still be kept, but they are not the current primary decision center.

---

## 4. Home and Navigation Rules
- Bottom navigation: `Reptiles / Discussion / Home / Shop / Member`
- The bottom navigation must remain fixed and visible.
- Home is a long scrollable page.
- The Shop block should only be visible after scrolling down.
- Every subpage must have the Back button in the upper-left corner.
- Every subpage must support swipe-right-to-go-back from the left edge.
- The outermost mock display must include an iPhone frame.

---

## 5. Home Today Widget
- Only 2 task cards are partially visible in the first viewport.
- If there are more than 2 tasks, the remaining cards must be reachable by vertical scrolling inside the Today Widget section.
- The Today Widget has only one extended entry:
  - `Pet AI+ Assistant`
- The `Details` entry is removed and must not be kept.

---

## 6. Home Sections
- First shortcut row: `My Reptiles / Feeding / Records`
- Second shortcut row: `Feeding Plan / Breeding Records / Reptile Album`
- Main sections below:
  - Calendar
  - Discussion
  - Shop

---

## 7. Calendar Rules
- The Home calendar block displays a full monthly calendar.
- A legend must appear above the month:
  - Red dot = feeding
  - Blue dot = other
- The full Calendar page uses the same rule.
- Tapping a date must show the concrete events for that date.
- The original single-day event section has been changed to `Upcoming Tasks in 7 Days`.

---

## 8. Discussion, Shop, Member, and AI

## 8.1 Pet AI+ Assistant Rules
- The Home button label is fixed as `Pet AI+ Assistant`.
- The Home AI button must be a wider horizontal button.
- The AI Assistant also appears in the middle of the Pet Profile page.
- The Pet Profile page displays a one-line AI summary above the weight chart.
- The Pet Profile page has a `Pet AI+` FAB in the lower-right corner.
- Tapping it opens the AI chat window.
- The top of the AI chat window must allow switching the active reptile.
- The conversation must be based on the selected reptile's data.

### Discussion
- The Discussion section must be tappable and lead to the Discussion page.
- Each article row must have a preview image on the left.
- The post button must be fixed in the lower-right corner.
- Tapping the post button must perform an actual action.

### Shop
- Product cards must include product images.
- The Shop page must have a fixed cart entry in the lower-right corner.
- Adding to cart must actually add the product.
- The cart must be able to navigate to Checkout.

### Member
- A member login mock must exist.

---

## 9. Data Storage and Cloud Direction
- User data must be stored in the cloud and must not exist only in frontend local state.
- Cloud data must include at least:
  - Member profile data
  - Reptile data
  - Care records, feeding records, and plans
  - Discussion posts, comments, and saved items
  - Cart, orders, recipient information, and other shopping data
- Backend and cloud service options must be selected in a dedicated later step.
- The current candidate direction is `Cloudflare + AWS`.
- The mock can use frontend simulated data for now, but the documents must clearly state that the final system should store data in the cloud.

---

## 10. Workflow Rules
- Determine the source of truth first.
- Update documents 01 through 05 first.
- Then update the mock.
- Then run build and localhost verification.
- Do not refresh large amounts of old data just for formality.
- Update related documents only when there is a real change.
