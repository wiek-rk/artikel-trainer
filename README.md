# Artikel Trainer

A fast, offline-friendly German noun article trainer.

Open the app, choose a level from A1 to C2, and play 30-word rounds by selecting **der**, **die**, or **das**. The app keeps score for the current session and brings missed words back in later rounds.

## Use it

### Online

Host this folder with GitHub Pages, Vercel, Netlify, or any static web host. The app is just one HTML file and has no backend.

### Offline

Download the repository ZIP, unzip it, and open:

```text
index.html
```

The trainer runs fully in the browser.

## Vocabulary data

The app opens with a small manually curated starter deck so it works immediately.

For the larger deck, the app stores only A1-C2 target word lists. It does **not** include dict.cc articles, meanings, or database rows. If you import your own official dict.cc DE → EN text file, the browser locally matches those target words to dict.cc articles and meanings on your own device.

The import happens locally in your browser and is not uploaded anywhere.

Please do not publish or redistribute dict.cc database content unless you have permission from dict.cc.

## Keyboard shortcuts

- `1` = der
- `2` = die
- `3` = das
- `Enter` = next word

## License

The app code is released under the MIT License. Vocabulary sources may have their own terms; see the data note above.
