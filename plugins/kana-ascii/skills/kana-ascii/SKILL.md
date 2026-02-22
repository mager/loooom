---
name: kana-ascii
description: Render hiragana, katakana, and kanji as ASCII art in the terminal. Backed by the kana-ascii npm package — use the CLI for raw output, this skill for guided learning with stroke order and mnemonics.
author: mager
version: 2.0.0
---

# Kana ASCII

A skill + npm package combo for learning Japanese characters in the terminal.

**The package** renders any kana as a dot-grid ASCII drawing.
**This skill** layers teaching on top — stroke order, mnemonics, drills, and context.

## The Package

```bash
# One-off (no install)
npx kana-ascii あ
npx kana-ascii aiueo        # renders あいうえお in sequence
npx kana-ascii AIUEO        # katakana mode
npx kana-ascii konnichiwa   # converts romaji → kana, shows coverage

# Install globally
npm install -g kana-ascii
kana-ascii --list
kana-ascii --all
```

Romaji input convention: **lowercase → hiragana**, **UPPERCASE → katakana**

Powered by [hepburn](https://github.com/lovell/hepburn) for romaji conversion.

## Programmatic API

```ts
import { render, lookup, renderWord, renderAll, list } from "kana-ascii";

render("あ")          // → formatted string (grid + strokes + mnemonic)
render("a")           // → same (romaji lookup)
renderWord("aiueo")   // → array of RenderResult for each kana
lookup("a")           // → raw KanaChar data
renderAll()           // → all supported characters
list()                // → [{ char, romaji, type }, ...]
```

## How This Skill Works

When a learner asks about a character — or any new character is introduced in a lesson — do this:

1. **Show the CLI command** they can run themselves:
   ```
   npx kana-ascii [char or romaji]
   ```

2. **Draw the character** using the dot-grid system (see below) — Claude renders it inline so the learner sees it immediately without leaving the session

3. **Teach the strokes** with `[1]` `[2]` labels and stroke type descriptions

4. **Give the mnemonic** — vivid, weird, sticky

5. **Drill it** — ask the learner to describe what they see before moving on

## Dot-Grid Drawing System

Draw every character on a **13 wide × 9 tall** dot canvas:

```
. . . . . . . . . . . . .   ← 13 dots wide
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .   ← 9 rows tall
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```

Stroke characters (pure ASCII, guaranteed monospace):
```
-  horizontal stroke
|  vertical stroke
/  diagonal (bottom-left to top-right)
\  diagonal (top-left to bottom-right)
(  left curve
)  right curve
~  hook / flick
^  small arch
*  dot / emphasis point
+  crossing point
```

Label strokes inline: `[1]` `[2]` `[3]` — never ①② (breaks monospace in many terminals).

---

## Character Reference

### Hiragana Vowels

**あ (a) — ah as in father**
```
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . . . | . . | . . . . .
. . . . | [2] | . . . . .
. . . . - - - - . . . . .
. . . . . | . . . . . . .
. . . . ( . ) [3] . . . .
. . . . . . \ . . . . . .
. . . . . . ~[4] . . . . .
```
`[1]` horizontal bar · `[2]` box enclosure · `[3]` drop + loop · `[4]` hook sweep
*Mnemonic: Someone tied the letter 'a' into a knot. It IS an 'a' in there.*

---

**い (i) — ee as in see**
```
. . . . . . . . . . . . .
. . . . . . . . . . . . .
. . ( . . . ( . . . . . .
. . | . . . | . . . . . .
. . | [1] . | [2] . . . .
. . | . . . | . . . . . .
. . ) . . . ) . . . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```
`[1]` left stroke (taller) · `[2]` right stroke (shorter, same hook)
*Mnemonic: Two eels side by side. 'ee' in eel → 'i'.*

---

**う (u) — oo as in food (lips flat)**
```
. . . . . . . . . . . . .
. . . . . ^ . . . . . . .
. . . . . [1] . . . . . .
. . . . ( . . ) . . . . .
. . . . | . [2] | . . . .
. . . . | . . . | . . . .
. . . . ( . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```
`[1]` small arch at top · `[2]` open oval with hook
*Mnemonic: Little hat looking up. 'u' = up.*

---

**え (e) — eh as in get**
```
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . . . . | . . . . . . .
. . . . . | [2] . . . . .
. . . . . | . . . . . . .
. . . ( _ | [3] . . . . .
. . . \ . . . . . . . . .
. . . .\ . . . . . . . . .
. . . . ~ . . . . . . . .
```
`[1]` horizontal cross · `[2]` vertical drop · `[3]` left sweep under and out
*Mnemonic: Person bowing arms wide — elegant.*

---

**お (o) — oh as in go**
```
. . . . . . . . . . . . .
. . - - - [1] - - - . . .
. . ( . . . . . ) . . . .
. . | . . [2] . | . . . .
. . | . . . . . | . . . .
. . | . . * [3] | . . . .
. . ( . . . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```
`[1]` horizontal bar · `[2]` box enclosure · `[3]` center dot + swirl hook
*Mnemonic: A dot orbiting inside a box. 'o' = orbit.*

---

### Katakana Vowels

**ア (A) — ah as in father**
```
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . . . . . . . . .
. . . . . / . \ . . . . .
. . . . . /[2] \ . . . . .
. . . . . . . . \ . . . .
. . . . . . . . |[3] . . .
. . . . . . . . | . . . .
. . . . . . . . . . . . .
```
`[1]` top bar · `[2]` diagonal left · `[3]` vertical drop right
*Mnemonic: A roof with a nail through it. Like the letter A.*

---

**イ (I) — ee as in see**
```
. . . . . . . . . . . . .
. . . \ . . . . . . . . .
. . . .\[1] . . . . . . .
. . . . \ . . . . . . . .
. . . . .\ . . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . ~ . . . . . . .
. . . . . . . . . . . . .
```
`[1]` diagonal slash · `[2]` vertical hook
*Mnemonic: A leaning post with a hook. Tired 'I' falling forward.*

---

**ウ (U) — oo as in food**
```
. . . . . . . . . . . . .
. . . . . * [1] . . . . .
. . . . . . . . . . . . .
. . . . - - [2] - - . . .
. . . . ( . . . ) . . . .
. . . . | . [3] | . . . .
. . . . ( . . . ~ . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```
`[1]` crown jewel dot · `[2]` horizontal bar · `[3]` open oval hooks right
*Mnemonic: A crown with a jewel. Royal 'u'.*

---

**エ (E) — eh as in get**
```
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . . . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . | . . . . . . .
. . - - - [3] - - . . . .
. . . . . . . . . . . . .
. . . . . . . . . . . . .
```
`[1]` top bar · `[2]` center post · `[3]` bottom bar (longer)
*Mnemonic: An I-beam from construction. Engineering.*

---

**オ (O) — oh as in go**
```
. . . . . . . . . . . . .
. . - - - [1] - - . . . .
. . . . . | . . . . . . .
. . . . . |[2] . . . . . .
. . . . . | . . . . . . .
. . . . . + - - [3] . . .
. . . . . . . . \ . . . .
. . . . . . . . ~ . . . .
. . . . . . . . . . . . .
```
`[1]` top bar · `[2]` vertical post · `[3]` right arm swings down and hooks
*Mnemonic: A cross where one arm breaks off and swings. Open swing.*

---

## Session Flow

1. Learner asks about a character (or lesson introduces one)
2. Show: `npx kana-ascii [char]` — so they can run it themselves
3. Draw the dot-grid inline
4. Walk through strokes `[1]` `[2]` with names and directions
5. Give the mnemonic
6. Ask: *"What do you see in this shape?"* — let them encode it
7. Drill: *"Trace it in the air. What strokes, in order?"*
8. Move on only when they can describe it cold

## Trigger Phrases

- `draw [char]` / `show me [char]` / `what does [char] look like`
- `kana ascii` or `ascii mode`
- `npx kana-ascii` — user is already using the package
- Any new character introduced during a lesson

## Coverage

v0.1.0 of the npm package covers hiragana + katakana vowel rows (10 characters).
More added weekly. Run `npx kana-ascii --list` to see current coverage.

## Links

- npm: [npmjs.com/package/kana-ascii](https://npmjs.com/package/kana-ascii)
- GitHub: [github.com/mager/kana-ascii](https://github.com/mager/kana-ascii)
- Pairs with: `mager/beginner-japanese`
