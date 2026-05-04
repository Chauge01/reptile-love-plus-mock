---
title: Reptile Love+ IA Flow Chart - Designer Review Version
---

# Reptile Love+ IA Flow Chart - Designer Review Version

> Recommended entry: open `Eng_ia-diagram.html` directly. The HTML version supports zoom, drag, module focus, and persistent highlighting when clicking nodes or links.

## How Designers Should Use This

1. Start with the left-side module focus instead of viewing the full chart immediately.
2. Click a node or a link and review the highlighted node, highlighted link, and connected nodes to confirm upstream and downstream screen flow.
3. Highlighting stays active until another node, link, module, blank canvas area, or `Show All` is clicked.
4. When reviewing cross-module links, prioritize Home entries, Pet Profile entries, Calendar jumps, and AI return context.
5. Use module groups to mark UI work scope:
   - Home
   - Reptiles Core
   - Support Tools: Calendar / Photo / AI
   - Discussion
   - Shop
   - Member

## Cleanup Strategy in This Version

- The main chart shows only screen states and key in-page interactions, so minor form fields do not become separate nodes.
- Form fields and state details inside the same screen stay in node notes instead of becoming independent links.
- In-page interactions are kept only when they affect design work, such as enlarged photo preview, comment interaction, Member tabs, and Checkout mock submit.
- Ambiguous older names were standardized:
  - `Pet Notes` is represented as `Pet Profile`.
  - `Order Completion Page` is removed because the current frontend keeps the user on Checkout and shows a mock alert.
  - `Reptile Album: All / Selected` is merged into one Reptile Album page. The entry source decides the default filter.

## IA Review Result

| Area | Result |
|---|---|
| Bottom Navigation | Matches the English spec and frontend: Reptiles / Discussion / Home / Shop / Member. |
| Home | Includes shortcuts, Calendar, AI, content previews, and Construction entry. |
| Reptiles Core | Matches frontend screens: Hub, list, add, profile, edit, records, plan, album, history, and AI. |
| Calendar | Matches the rules: full monthly calendar, filters, selected-date events, event details, and jumps to Pet Profile or Records. |
| Reptile Album | Matches the rules: single Album page with all / selected reptile filter, enlarged photo preview, and reassignment. |
| AI | Matches the rules: can enter from Home or Pet Profile, and returns based on entry source. |
| Discussion | Matches the rules: list, article, editor, comments, and edit entry for the current user's own article. |
| Shop | Corrected: the current frontend has no Order Completion page. Checkout submit shows a mock alert and stays on Checkout. |
| Member | Matches the rules: logged-out guide, Login page, logged-in tabs, and Notification Settings toggle. |

## Interactive Files

- Mermaid source: `docs/spec/Eng_ia-diagram.mmd`
- Interactive view: `docs/spec/Eng_ia-diagram.html`
- Static preview: `docs/spec/Eng_ia-diagram.preview.svg`

