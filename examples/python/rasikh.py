"""The Rasikh API from Python 3.9+, standard library only.

Run:  python examples/python/rasikh.py
Optional: set RASIKH_KEY to your free key for higher daily limits.
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.rasikh.ai/v1"


def get(path: str, **params) -> dict:
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"User-Agent": "rasikh-api-example/1.0"})
    if key := os.environ.get("RASIKH_KEY"):
        req.add_header("X-API-Key", key)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            left = r.headers.get("X-RateLimit-Remaining")
            print(f"({left} left today in {r.headers.get('X-RateLimit-Group')!r})")
            return json.load(r)
    except urllib.error.HTTPError as e:
        # errors come as JSON with a code and a message in Urdu and English
        raise SystemExit(f"{e.code}: {e.read().decode('utf-8', 'replace')}") from None


def main() -> None:
    # A verse with the Urdu translation and its credit
    ayah = get("/ayah/2:255", translations="ur.jalandhry")
    tr = ayah["translations"][0]
    print(ayah["reference"])
    print(ayah["text_uthmani"])
    print(tr["text"])
    print(f"Quran text: Tanzil Project (tanzil.net) · Translation: {tr['translator']} (Tanzil)\n")

    # A hadith with its Urdu translation and the publisher's credit line
    hadith = get("/hadith/bukhari/13", lang="ur")
    print(hadith["reference_ur"])
    print(hadith["text_ar"])
    print(hadith["translation"]["text"])
    print(hadith["translation"]["attribution"]["credit_ur"], "\n")

    # A search: the references found. Each result also has the full Arabic and translation
    # (text_ar, translation or translations) with their credit: show them whole, never cut short.
    found = get("/search", q="sabr", limit=5)
    for item in found["results"]:
        print(f"- {item['type']}: {item['reference']}")


if __name__ == "__main__":
    main()
