# Artikel Trainer

A fast, offline-friendly German noun article trainer.

## Tables practice

Use **Tables** beside **Articles**, or open `index.html#tables`. The existing article round stays in memory while switching sections.

- 11 tables: definite/indefinite/negative articles, dieser/welcher, one shared possessive-ending table with practice across seven stems, personal/reflexive pronouns, and three adjective-ending patterns.
- Study, partially missing cells, full-table rebuild, random recall, and mistake review. All exercises use typed answers.
- Optional Genitiv for the applicable tables; no artificial forms for the plural of ein or pronoun Genitiv.
- Browser-local progress, export to JSON, and review cleared after two later correct attempts.

Tables use the supplied B2 grammar material. See [SOURCES.md](SOURCES.md) for learning notes. No external downloads are needed.

Open the whole folder locally, or serve it with `python -m http.server 8765 --bind 127.0.0.1`. Visit `http://127.0.0.1:8765/#tables`.

### Checks

`node --test tests/tables.test.cjs` checks grammar data and answer handling. With Playwright installed and Microsoft Edge available, `node tests/browser.cjs` tests all tables, review persistence, keyboard isolation, mobile width and unavailable storage. Set `ARTIKEL_SCREENSHOT_DIR` to save desktop/mobile screenshots.

Open the app, choose a level from A1 to C2, and play 30-word rounds by selecting **der**, **die**, or **das**. The app keeps score for the current session and brings missed words back in later rounds.

## Use it

### Online

The app has no backend. Keep index.html, tables.css, tables-data.js and tables.js together.

### Offline

Download the repository ZIP, unzip it, and open:

```text
index.html
```

The trainer runs fully in the browser.

## Vocabulary

The existing built-in noun deck is included. No additional deck, dictionary download or import is required.

## Keyboard shortcuts

- `1` = der
- `2` = die
- `3` = das
- `Enter` = next word

## License

The app code is released under the MIT License.

## Expressions and verb–preposition practice

Nomen–Verb offers an initial 40 expressions from the supplied B2 chart. Study reveals meanings and new example sentences; Practice asks for an infinitive using an English meaning cue. Common equivalent verbs are accepted for selected prompts.

Verb + Präposition offers an initial 44 combinations from the fixed-preposition chart. Every prompt supplies the verb and its intended meaning. Type both the preposition and case; valid alternate combinations retain their own case. Examples and corrections appear after checking.

Both sections use 12-expression rounds and independent browser-local review records (`artikel-phrases-nvv-v1`, `artikel-phrases-preps-v1`). Two later correct attempts clear a mistake. The four sections keep their current exercise when switching navigation. Direct links: `#nvv` and `#preps`.

These are selected first sets, not a transcription of every row in the charts. No general preposition-case or verb-case module is included yet. Keep all root HTML/JS/CSS files together for offline use. Run `node --test tests/*.test.cjs` for data checks and `node tests/phrases-browser.cjs` for expression browser checks (Playwright + Edge).
