# Contributing to InterviewVerse

First off — **thank you!** 🙌 InterviewVerse is a community-driven, open-source project.
Our goal is to become a home for **every engineering interview** — every language, framework,
and career path — told through stories. We're starting with a complete **.NET track**, and
**everything else is added by the community, over time.** That's where you come in.

You do **not** need to be an expert to contribute. The most valuable contributions are:

1. 🧠 **New interview questions & answers** — for **any** of any language or path (Java, Python, JavaScript/React, DSA, System Design, DevOps, Go, mobile, cloud… anything).
2. 🧭 **New tracks** — propose a language/path you want covered.
3. 🌍 **Language translations** for the interface.

There's no backend and no database — **all content is JSON**, so most contributions are
just editing (or adding) a data file. The engine is track-agnostic: any new language or
path uses the exact same lesson format shown below.

---

## Ways to contribute

- 💡 **Suggest a question** — open an [issue](../../issues) with the question, a good answer, and which language/track it belongs to. No code required.
- 🧭 **Request a track** — open an issue titled e.g. `Track request: Python`. We prioritise by community interest, so 👍 the ones you want.
- ✍️ **Add a full lesson** — add a JSON object (schema below) and open a PR.
- 🌐 **Add / improve a UI language** — translate the interface strings.
- 🐛 **Report a bug** or **suggest a feature** via issues.
- 🎨 **Improve the UI/UX**, accessibility, or animations.

Prefer chatting first? Drop suggestions in the comments on the launch post or DM — they're
all welcome, whatever the language or topic.

---

## Quick start (local dev)

```bash
git clone https://github.com/Kamilmakwana/InterviewVerse.git
cd InterviewVerse
npm install
npm run dev        # http://localhost:3000
npm run build      # verify your change compiles before opening a PR
```

Requirements: **Node.js 18+**.

---

## 🧠 Adding a new interview question (lesson)

Every lesson is **one JSON object** inside a chapter file under `data/`. The .NET track's
chapters live here today, and new tracks add their own files the same way:

```
data/csharp.json          data/oop.json            data/advanced.json
data/aspnet.json          data/entityframework.json data/sqlserver.json
data/azure.json           data/systemdesign.json    data/coding.json
data/production.json      data/behavioral.json      data/ai.json
```

**Steps**

1. Open (or create) the relevant chapter file.
2. Copy an existing lesson object as a template and edit every field.
3. Give it a unique `id` and a unique kebab-case `slug`.
4. Add matching slim fields to `data/search-index.json` (see below).
5. Run `npm run build` to confirm it compiles, then open a PR.

**Lesson schema** (all fields required — see `lib/types.ts`):

```jsonc
{
  "id": "csharp-21",
  "title": "Short concept title",
  "slug": "unique-kebab-case-slug",
  "category": "csharp",                 // the chapter/track this belongs to
  "difficulty": "Beginner",             // Beginner | Intermediate | Advanced
  "estimatedTime": 6,                    // minutes
  "emoji": "📦",
  "icon": "Boxes",                       // a lucide-react icon name (PascalCase)
  "tags": ["memory", "types"],
  "keywords": ["stack", "heap", "value type"],
  "companies": ["Microsoft", "Amazon"],
  "interviewQuestion": "The question an interviewer asks.",
  "story": {
    "setup": "1–2 sentences that set the scene.",
    "scenes": ["Beat 1 mapped to the idea", "Beat 2", "Beat 3"],
    "moral": "The 'aha' that ties the story back to the concept."
  },
  "analogy": "One crisp real-world analogy sentence.",
  "animation": "generic",                // stack|queue|array|flow|layers|network|timeline|compare|generic
  "explanation": "Accurate technical explanation (3–6 sentences).",
  "interviewAnswerShort": "1–2 sentence answer to say out loud.",
  "interviewAnswerDetailed": "4–8 sentence model answer.",
  "codeExample": { "language": "csharp", "code": "// real code\n", "explanation": "What it shows." },
  "mistakes": ["Common mistake 1", "Common mistake 2"],
  "followUps": [{ "question": "Follow-up?", "answer": "Answer." }],
  "memoryHack": { "emoji": "📦", "oneLiner": "...", "mnemonic": "...", "memoryPalace": "..." },
  "bestPractices": ["..."],
  "performanceTips": ["..."],
  "quiz": [{ "question": "?", "options": ["a","b","c","d"], "answer": 0, "explanation": "Why." }],
  "flashcards": [{ "front": "Q", "back": "A" }],
  "revision30": "30-second recap.",
  "revision2min": "2-minute recap.",
  "challenge": "A challenge task to test deep understanding.",
  "related": ["another-slug"],
  "summary": "One-sentence takeaway."
}
```

The `codeExample.language` can be **any** language (`java`, `python`, `javascript`, `sql`,
`go`, …) — not just C#. Use whatever fits the question.

**Also add a slim entry** to `data/search-index.json` (so search, roadmap and the
dashboard pick it up) with these fields: `id, title, slug, category, emoji, difficulty,
estimatedTime, interviewQuestion, summary, tags, keywords, companies, related, animation`.

> Tip: keep code **accurate and compilable**, keep prose tight, and make the story vivid.

### Adding a whole new chapter or track

A **chapter** is a themed group of questions; a **track** is a set of chapters for a
language/path (e.g. "Java", "Python", "DSA"). Both are just data:

1. Create `data/<slug>.json` (an array of lessons).
2. Import it in `lib/data.ts` and add its entry to `CHAPTERS` in `lib/chapters.ts`
   (title, world name, emoji, icon, color, order).
3. Add its lessons to `data/search-index.json`.

Not sure how to structure a track? Open an issue and we'll help scope it together — a
track switcher across languages/paths is on the roadmap as more tracks land.

---

## 🌍 Adding or improving a language

UI translations live in `messages/<code>.json`, one file per language. Currently supported:
`en, hi, ta, te, bn, mr, gu, es, fr, de, pt, ar, zh`.

**To improve a language:** edit its file — keep the **exact same keys** as `messages/en.json`
and translate only the values. Keep brand/technical tokens verbatim (e.g. `InterviewVerse`,
`.NET`, `C#`, `XP`, `AI`, `SQL`, `API`).

**To add a new language:**

1. Copy `messages/en.json` to `messages/<code>.json` and translate the values.
2. Add the locale to `LOCALES` in `lib/i18n.ts` (`code`, `label`, `native`, `speech`
   BCP-47 tag, and `rtl: true` for right-to-left languages).
3. Import the new file in `lib/i18n.ts`.

Full lesson-content translation is on the roadmap — open an issue if you'd like to help
lead a language.

---

## 🔀 Pull request guidelines

- Branch from `main`: `git checkout -b add-python-generators-question`.
- Keep PRs focused (one topic/track/feature per PR).
- Run `npm run build` and make sure it passes.
- Use clear commit messages (e.g. `content: add Python generators lesson`, `track: scaffold Java`, `i18n: improve Hindi nav`).
- Describe **what** and **why** in the PR description; screenshots help for UI changes.
- Validate any JSON you edit (no trailing commas, valid UTF-8).

---

## 🎨 Style

- **TypeScript** and **Tailwind CSS** utility classes (match the existing components).
- Keep components small and reusable; prefer the existing `ui/` primitives.
- Respect accessibility: keyboard focus, ARIA labels, reduced-motion.
- Content must be **technically accurate** — this is real interview prep, for every track.

---

## 📜 Code of conduct

Be kind, be constructive, and assume good intent. We want InterviewVerse to be a welcoming
place for first-time contributors and experienced engineers alike, across every language and
background. Harassment or discrimination of any kind isn't tolerated.

---

Thanks again for helping developers everywhere ace their interviews — in every language. ❮
