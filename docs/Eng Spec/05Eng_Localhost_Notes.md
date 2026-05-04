# Reptile Love+ Localhost and Notes

## 1. Mock Project Location
- `/Users/bao_new/.openclaw/workspace/projects/reptile-love-plus-mock`

## 2. Localhost / Available URLs
- Local localhost: `http://localhost:4173/`
- Other devices on the same network: `http://192.168.0.11:4173/`
- GitHub Pages: `https://chauge01.github.io/reptile-love-plus-mock/`
- Note: `5173` is currently occupied by another project, so this mock uses `4173`.

## 3. Updated Document List
- `00_Current_Priority_Rules.md`
- `01_Sitemap.md`
- `02_Module_Function_List.md`
- `03_Screen_List.md`
- `04_Block_List_By_Page.md`
- `05_Localhost_Notes.md`
- `06_Mock_Data_One_Month_Sample.md`

## 4. Current Highest Priority Core Features
- My Reptiles
- Feeding / Records
- Feeding Plan
- Pet AI+

## 5. Mock Implementation Completed in This Round
- Home AI button renamed to `Pet AI+ Assistant`.
- Home Details button removed.
- Today Widget cards now include status and can open the corresponding Pet Profile.
- Home calendar block changed to full-month dot visualization.
- Feeding events use red dots; other events use blue dots.
- Full Calendar can show event content for a selected date.
- The original single-day event section changed to Upcoming Tasks in 7 Days.
- Discussion list has preview images on the left.
- Discussion list and article detail now use real images instead of placeholder blocks.
- Discussion lower-right post button is fixed as a FAB and opens the post editor.
- Post editor has cover image, inline images, and draft-save mock.
- Shop lower-right cart entry is fixed as a FAB / fixed CTA.
- Shop product images now use real reptile care / equipment images instead of emoji only.
- Add to Cart increments products in the cart.
- Cart can navigate to Checkout.
- Checkout page has address and contact information fields.
- Pet Profile has real charts.
- Weight trend, feeding frequency, and humidity trend are separated into independent blocks.
- My Reptiles list shows age and days since arrival.
- My Reptiles list, Pet Profile avatar, and photo entry now use real images.
- Pet Profile has become one of the main entry points for the four core features.
- Pet Profile AI summary was moved above the weight chart.
- AI block shows one AI sentence.
- Pet Profile lower-right corner has a `Pet AI+` FAB.
- Pet Profile includes Reptile Album entry and full history entry.
- Reptile Album is now a single shared page: entering from the Reptiles page does not default to a filter, while entering from Pet Profile defaults to the selected reptile.
- Album page now includes upper-right filter, three-column photos, enlarged preview, manual assignment dropdown, and upload FAB.
- Manual assignment in Album writes the photo ownership back to mock data.
- Album upload writes the photo into the selected reptile's album data.
- Discussion list and article detail now read live comment counts.
- A single article like is limited to once per user.
- Post editor formatting toolbar removed.
- Inline article images now use horizontal browsing.
- Article top area includes author, date, category, likes, comments, and edit entry for the current user's own article.
- Likes and comments are displayed as icon + number.
- The top of the AI chat window can switch reptiles.
- AI chat back behavior returns to the previous entry context.
- AI chat layout is closer to a GPT-style layout.
- 15 different real reptile care related images were downloaded to `public/mock-images/`.
- Image source list was saved at `public/mock-images/sources.tsv`.
- Image upload button moved to the left side of the input box.
- AI chat supports photo upload.
- Add Reptile button changed to a fixed lower-right FAB and opens Add Reptile.
- Pet Profile can open Edit Reptile.
- Saving Edit Reptile updates frontend content.
- Feeding / Records page includes reptile dropdown, camera / upload area, and submit button.
- After submitting Feeding / Records, the app returns to the previous page context and shows the new data in history / timeline.
- If the submitted record includes a photo, the photo is automatically attached to that reptile's Reptile Album.
- Other fields can be manually entered and saved as custom tags.
- Feeding / Records now directly loads the species template based on the selected reptile and no longer shows a template switcher.
- Saved results show only fields entered in the current submission and do not fill in empty fields.
- Custom tag saving for `Other` fields now actually works.
- High-risk events / excretion content show warning prompts.
- Member page previously had extra notification UI removed and now keeps a single notification toggle that leads to an Apple Settings prompt.
- Feeding Plan page currently focuses on add / edit behavior and does not use the meaning of "complete plan".
- Plan page includes View Calendar button and Settings entry.
- Plan page includes same-week view showing whether each day in the week has scheduled tasks.
- Plan page is split into two schedule modes: Every N days and Specific weekdays.
- `Frequency` became a mode dropdown and reveals the relevant fields.
- Task type includes `Other` input and custom tag button.
- Specific weekdays mode supports weekday and hour / minute selection, and shows schedule preview.
- Same-week view includes daily schedule count and reptile name summary.
- Adding a plan expands interval / weekday rules into mock schedules across different days of the same week.
- Calendar page removed the monthly / day-view switch and keeps only the monthly calendar overview.
- Calendar page includes reptile / event filter, event details, and navigation buttons.
- Member login mock added.
- Member page includes internal tabs: My Profile, My Reptiles Summary, My Articles, My Orders, Notification Settings.
- Notification Settings currently keeps one toggle and shows Enabled / Disabled states.
- Member tabs include basic interaction, such as profile save, order switching, and notification toggle.
- Checkout fields are editable.
- Post editor image mock depth improved: cover image switching, inline image add / remove, preview display, and published article synchronization.
- Article detail layout improved and is no longer a single stacked text block.
- One main flow test pass was completed: Home / Reptiles / AI / Discussion / Shop / Checkout / Member Login main flows are navigable.
- Core features are currently focused on My Reptiles / Feeding / Records / Feeding Plan / Pet AI+.
- One frontend data-flow correction pass was completed, making screen updates after Edit Reptile / Publish Post / Submit Record more stable.

## 6. Data Sources
- `src/mockData.ts`
- `06_Mock_Data_One_Month_Sample.md`
- Current data is still frontend mock data, but final Member / Reptile / Discussion / Shopping data must be stored in the cloud.
- Backend and cloud service direction can evaluate `Cloudflare + AWS`.

## 7. Current Engineering Handoff Notes
- Pet Profile is the main entry point for the four core features.
- After submitting Feeding / Records, the app must return to the previous page context and show the updated data.
- Feeding Plan uses add / edit language and must not use "complete plan" language.
- AI block and AI chat window must both reflect the selected reptile's latest status.
- If build or flow QA finds frontend / document drift, update documents and frontend in the same round.

## 8. Verification Result
- `npm run build` succeeded.
