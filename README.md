# Rasikh API: examples and widget

[Rasikh](https://rasikh.ai) is a free, maslak-neutral Quran and Hadith research site for Urdu
speakers. Its texts are available through a free JSON API at `https://api.rasikh.ai/v1`. Every
verse, hadith and translation in a response comes with its source and credit.

This repository holds **examples and a ready-made widget**. It is not the Rasikh source code.

- **Guide** (quick start, free key, limits, credit rules; in Urdu, Roman Urdu and English):
  https://rasikh.ai/docs
- **Full reference** (every endpoint and parameter, with "Try it out"):
  https://api.rasikh.ai/docs
- **Terms of use:** https://rasikh.ai/terms

## Verse or hadith of the day, on any website

Paste this where the card should appear:

```html
<div data-rasikh="ayah" data-lang="ur"></div>
<script src="https://cdn.jsdelivr.net/gh/chmuzamil/rasikh-api@main/widget/rasikh-widget.js" defer></script>
```

| Attribute | Values |
|---|---|
| `data-rasikh` | `ayah` (verse of the day) or `hadith` (hadith of the day) |
| `data-lang` | `ur` (Urdu, default) or `en` (English) |

- Each card shows the Arabic, the translation, the reference, the credit line and a link to the
  passage on rasikh.ai.
- The picks are the same short, well-known passages rasikh.ai shows on its Home page, one a day
  by the Pakistan calendar day.
- No server, no key and no cookies are needed. It works on WordPress, Blogger and any HTML page.
- The texts are shown exactly as the API returns them; the widget never changes or shortens
  them.

Try it: open [`widget/demo.html`](widget/demo.html) from a local web server (for example
`python -m http.server`, then `http://localhost:8000/widget/demo.html`).

## Examples

| File | What |
|---|---|
| [`examples/curl.md`](examples/curl.md) | The main endpoints from the terminal |
| [`examples/browser.html`](examples/browser.html) | A search box on a plain web page, no server |
| [`examples/node.mjs`](examples/node.mjs) | Node 18+: a verse, a hadith and a search |
| [`examples/python/rasikh.py`](examples/python/rasikh.py) | Python 3, standard library only |

## Calling the API

- **Without a key:** every endpoint works. Limits are per IP address, per UTC day: 1,000 read
  requests, 200 searches, 10 questions to /ask and 10 hadith checks.
- **With a free key** (`X-API-Key` header): 5,000 reads, 1,000 searches, 60 /ask and 30 checks a
  day. Register with one request:

  ```bash
  curl -X POST https://api.rasikh.ai/v1/keys/register \
    -H "content-type: application/json" \
    -d '{"name": "Your name", "email": "you@example.com"}'
  ```

  The key is shown once and stored only as a hash. Keep it on your server: never put it in a web
  page.
- **From a web page:** read and search endpoints accept browser calls from any website. /ask,
  /check and key registration accept browser calls from rasikh.ai only; call those from your
  server.
- Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`.
  Over the limit you get `429` with `Retry-After`.
- The texts rarely change, so please cache what you fetch.

## Credit

The texts come from named publishers and projects, each with its own licence. When you show a
text, show its credit as the API gives it. The short version is in [CREDITS.md](CREDITS.md); the
full licences are at `GET https://api.rasikh.ai/v1/sources`.

Some texts are licensed for **non-commercial use only**. For any commercial use, ask first at
contact@rasikh.ai.

## Problems and questions

Open an issue in this repository for API problems or examples you would like. For anything
else: contact@rasikh.ai.

## Licence

The example code and the widget are MIT-licensed ([LICENSE](LICENSE)). That licence covers this
code only. The Quran and hadith texts, translations and tafsir the API returns keep their own
licences ([CREDITS.md](CREDITS.md)).

Rasikh is a product of [Chaudhery Studio](https://chaudhery.com).
