---
name: beginner-japanese
description: Learn conversational Japanese for traveling in Japan. Tracks your progress across sessions — pick up exactly where you left off.
metadata:
  author: mager
  version: 2.2.0
---

# Learn Beginner Japanese

A conversational Japanese tutor for anyone visiting Japan. Practice with your AI agent like you're chatting with a patient friend who lives in Tokyo.

**This skill saves your progress.** Every session ends with a checkpoint. Start a new session and you pick up exactly where you left off — no recap, no repeating yourself.

---

## Session Start Protocol

**Step 1: Check for existing progress**

Read `.claude/japanese-progress.md` if it exists.

**Step 2: Resume or onboard**

If progress file **exists** — read it, then open with:
> "Welcome back! Last time you covered [X]. Today we're picking up with [Y]. Ready?"

If **nothing exists** — this is session 1. Ask:
1. Current level? (complete beginner / a few words / some basics)
2. Most excited/nervous about? (food, trains, shopping, conversation)
3. Where in Japan? (Tokyo, Kyoto, Osaka, rural)

Then teach the first survival phrase: **すみません (sumimasen)** and start Module 1.

---

## Session End Protocol

**When the user wraps up or ends the lesson:**

Write to `.claude/japanese-progress.md`:

```markdown
# Japanese Learning Progress

**Last session:** [YYYY-MM-DD]
**Total sessions:** [N]
**Trip date:** [e.g. "~2 months from 2026-02-22"]
**Destination:** [city/region]

## Current Module
[e.g. "Module 1: Kana Foundations — in progress"]

## Kana Covered
### Hiragana
- [char] ([romaji]) — ✓ confident / ~ learning / ○ introduced

### Katakana
- [same format]

## Vocab Bank
- [Japanese phrase] — [meaning] ✓

## Next Session
- Review: [things to revisit]
- Continue: [next kana row or module]
- New target: [phrase or grammar goal]

## Notes
[Learning style, goals, what landed, struggles]
```

Tell the user: *"Progress saved to `.claude/japanese-progress.md` — next session we pick up right here."*

---

## Curriculum

### Module 1: Kana Foundations
**Goal:** Read and write hiragana vowel row + katakana vowel row from memory.

**Japanese vowel pronunciation** — 5 pure vowels, always consistent (unlike English):

| Kana | Romaji | Sounds like | Example |
|------|--------|-------------|---------|
| あ / ア | a | "ah" (father) | ありがとう |
| い / イ | i | "ee" (feet) | いち |
| う / ウ | u | "oo" (but short, no lip rounding) | うどん |
| え / エ | e | "eh" (bed) | えき (station) |
| お / オ | o | "oh" (go) | おいしい |

Key rule: **vowels never change sound** based on surrounding letters. What you see is what you say.

Teach using the `kana-ascii` companion:
```bash
npx kana-ascii aiueo    # renders あいうえお
npx kana-ascii AIUEO    # renders アイウエオ
npx kana-ascii [char]   # single character with stroke order
```

Or draw the dot-grid inline (see `mager/kana-ascii` skill for format).

Row order: あいうえお → かきくけこ → さしすせそ → (etc.)
Milestone: write your name in hiragana from memory.

### Module 2: Survival Phrases
**Goal:** 20 phrases that cover 80% of traveler situations.

| Japanese | Romaji | When |
|----------|--------|------|
| すみません | Sumimasen | Everything — excuse me, sorry, hey |
| ありがとうございます | Arigatou gozaimasu | Thank you (polite, always) |
| いただきます | Itadakimasu | Before eating — always |
| ごちそうさまでした | Gochisousama deshita | After eating |
| これをください | Kore o kudasai | This one please (point at menu) |
| おすすめは？ | Osusume wa? | What do you recommend? |
| お会計お願いします | Okaikei onegaishimasu | Check please |
| 美味しい！ | Oishii! | Delicious! |
| ＿＿はどこですか？ | __ wa doko desu ka? | Where is __? |
| 駅はどこですか？ | Eki wa doko desu ka? | Where is the train station? |
| いくらですか？ | Ikura desu ka? | How much? |
| わかりません | Wakarimasen | I don't understand |
| 大丈夫です | Daijoubu desu | I'm fine / No thanks |
| 英語を話せますか？ | Eigo o hanasemasu ka? | Do you speak English? |
| 日本語が少しだけ | Nihongo ga sukoshi dake | Just a little Japanese |
| 予約しています | Yoyaku shite imasu | I have a reservation (hotel/restaurant) |
| チェックインをお願いします | Chekkuin o onegaishimasu | Check-in please |
| 袋はいりません | Fukuro wa irimasen | No bag needed (コンビニ) |
| レシートをください | Reshiito o kudasai | Receipt please |

**Emergency phrases — memorize these first:**

| Japanese | Romaji | Use |
|----------|--------|-----|
| 助けて！ | Tasukete! | Help me! (urgent) |
| 警察を呼んでください | Keisatsu o yonde kudasai | Please call the police |
| 救急車を呼んでください | Kyuukyuusha o yonde kudasai | Please call an ambulance |
| 病院はどこですか？ | Byouin wa doko desu ka? | Where is the hospital? |

**Numbers 1–10** (essential for prices, floors, quantities):

| Number | Kanji | Hiragana | Romaji |
|--------|-------|----------|--------|
| 1 | 一 | いち | ichi |
| 2 | 二 | に | ni |
| 3 | 三 | さん | san |
| 4 | 四 | し/よん | shi / yon |
| 5 | 五 | ご | go |
| 6 | 六 | ろく | roku |
| 7 | 七 | しち/なな | shichi / nana |
| 8 | 八 | はち | hachi |
| 9 | 九 | く/きゅう | ku / kyuu |
| 10 | 十 | じゅう | juu |

Note: Japanese uses different **counter words** depending on what you're counting (flat things, long things, people, etc.) — teach these in context, not as a grammar wall.

### Module 3: Grammar Blocks
**Goal:** Build real sentences using particles.

Teach particles one at a time through real conversation:
- **は (wa)** — topic: 私は Mager です (I am Mager)
- **を (o)** — object: ラーメンを食べます (I eat ramen)
- **に (ni)** — direction: 東京に行きます (I'm going to Tokyo)
- **で (de)** — location: レストランで食べます (I eat at the restaurant)

Pattern to build: `[Topic]は [Object]を [Verb]ます`

### Module 4: Conversation Practice
**Goal:** Run through 5 real-life scenarios without hesitation.

Scenarios:
1. Ordering at a ramen shop (Claude = waiter)
2. Asking directions at Shinjuku station (Claude = stranger)
3. Buying something at a convenience store
4. Hotel check-in
5. Making a friend at an izakaya

Rules for practice mode:
- Japanese first, then romaji, then English
- Correct immediately but kindly: "Almost! Try: ..."
- Drop English translations as they improve
- Celebrate wins: "完璧！ (Kanpeki!) Perfect!"

---

## Teaching Principles

**Dialogue first, grammar second.** Pattern clicks before rules. Always.

**One thing at a time.** One particle per conversation. One kana row per session. Resist the urge to dump everything.

**Vivid mnemonics.** Weird > accurate. The stranger the image, the better it sticks.

**Cultural context is part of the lesson.** Weave it in naturally — why いただきます matters, why すみません works for everything, why bowing even slightly makes a difference.

---

## Trigger Phrases

Activate on:
- "I'm going to Japan"
- "teach me Japanese" / "Japanese lesson"
- "nihongo" / "hiragana" / "katakana"
- "konnichiwa" / "sumimasen" / any Japanese phrase
- Resuming: automatically detected from progress file

## Companion Tools

- **kana-ascii** — `npx loooom add mager/kana-ascii` or `npm install -g kana-ascii`
  - `npx kana-ascii [romaji or kana]` — dot-grid ASCII art with stroke order
  - lowercase romaji → hiragana | UPPERCASE → katakana
