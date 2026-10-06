# The Rasikh API from the terminal

Base URL: `https://api.rasikh.ai/v1`. No key is needed to start.

## Quran

```bash
# One verse with the Urdu (Jalandhry) and English (Saheeh International) translations
curl "https://api.rasikh.ai/v1/ayah/2:255?translations=ur.jalandhry,en.sahih"

# Several verses of one surah (at most 40)
curl "https://api.rasikh.ai/v1/ayahs/1:1-7"

# All 114 surahs, and the translations on offer
curl "https://api.rasikh.ai/v1/surahs"
curl "https://api.rasikh.ai/v1/translations"
```

## Hadith

```bash
# One hadith by book and number, with its Urdu translation
curl "https://api.rasikh.ai/v1/hadith/bukhari/13?lang=ur"

# The books and their keys
curl "https://api.rasikh.ai/v1/collections"
```

## Search

```bash
# Roman Urdu, Urdu, English or Arabic words, or a reference such as 2:255 or "Bukhari 1"
curl "https://api.rasikh.ai/v1/search?q=sabr&limit=5"
```

## Tafsir, duas, topics

```bash
curl "https://api.rasikh.ai/v1/tafsir/2/255"
curl "https://api.rasikh.ai/v1/duas"
curl "https://api.rasikh.ai/v1/topics"
```

## A free key

```bash
curl -X POST https://api.rasikh.ai/v1/keys/register \
  -H "content-type: application/json" \
  -d '{"name": "Your name", "email": "you@example.com"}'

# then send it with every request
curl -H "X-API-Key: YOUR_KEY" "https://api.rasikh.ai/v1/search?q=namaz"
```

Every response shows your remaining daily limit in `X-RateLimit-Remaining` (`curl -i` prints the
headers). Show each text with its `attribution` (see [CREDITS.md](../CREDITS.md)).
