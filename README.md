# Artikel Trainer

A fast, offline-friendly German noun article trainer.

## Tables practice (development preview)

Use **Tables** beside **Articles**, or open `index.html#tables`. The existing article round stays in memory while switching sections.

- 17 tables: definite/indefinite/negative articles, dieser/welcher, seven possessive stems, personal/reflexive pronouns, and three adjective-ending patterns.
- Study, partially missing cells, full-table rebuild, random recall, and mistake review. All exercises use typed answers.
- Optional Genitiv for the applicable tables; no artificial forms for the plural of ein or pronoun Genitiv.
- Browser-local progress, export to JSON, and review cleared after two later correct attempts.

Forms were checked against the user's B2 grammar charts. See [SOURCES.md](SOURCES.md) for source pages and editorial decisions. The PDFs and dict.cc download are not needed to run Tables and are not bundled with this feature.

Open the whole folder locally, or serve it with `python -m http.server 8765 --bind 127.0.0.1`. Visit `http://127.0.0.1:8765/#tables`. This development branch has not been deployed to the live site.

### Checks

`node --test tests/tables.test.cjs` checks grammar data and answer handling. With Playwright installed and Microsoft Edge available, `node tests/browser.cjs` tests all tables, review persistence, keyboard isolation, mobile width and unavailable storage. Set `ARTIKEL_SCREENSHOT_DIR` to save desktop/mobile screenshots.

Open the app, choose a level from A1 to C2, and play 30-word rounds by selecting **der**, **die**, or **das**. The app keeps score for the current session and brings missed words back in later rounds.

## Use it

### Online

The app has no backend. Keep index.html, tables.css, tables-data.js and tables.js together. Review the vocabulary note below before public hosting.

### Offline

Download the repository ZIP, unzip it, and open:

```text
index.html
```

The trainer runs fully in the browser.

## Vocabulary data

The existing article edition embeds a noun deck and describes it as privately derived from dict.cc. It also supports importing a personal dict.cc DE → EN text file as a Custom deck. The earlier README described a starter-only deck; that description did not match the checked-in code. Tables does not change the existing noun deck. Resolve its distribution status before publishing a new public edition.

The import happens locally in your browser and is not uploaded anywhere.

Please do not publish or redistribute dict.cc database content unless you have permission from dict.cc.

## Keyboard shortcuts

- `1` = der
- `2` = die
- `3` = das
- `Enter` = next word

## License

The app code is released under the MIT License. Vocabulary sources may have their own terms; see the data note above.
