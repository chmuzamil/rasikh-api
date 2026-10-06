/*!
 * Rasikh widget: a verse or a hadith of the day from rasikh.ai, for any web page.
 * https://github.com/chmuzamil/rasikh-api  (MIT; the texts keep their own licences, see CREDITS.md)
 *
 * Usage:
 *   <div data-rasikh="ayah" data-lang="ur"></div>
 *   <div data-rasikh="hadith" data-lang="en"></div>
 *   <script src="rasikh-widget.js" defer></script>
 *
 * data-rasikh: "ayah" (verse of the day) or "hadith" (hadith of the day)
 * data-lang:   "ur" (Urdu, default) or "en" (English)
 *
 * Every text comes from api.rasikh.ai exactly as stored, with its credit. Nothing is changed or
 * shortened. The picks are the same short, well-known passages rasikh.ai shows on its Home page,
 * one a day by the Pakistan calendar day.
 */
(function () {
  "use strict";

  var API = "https://api.rasikh.ai/v1";
  var SITE = "https://rasikh.ai";

  // The same lists as rasikh.ai's Home (apps/web/lib/daily.ts, owner-reviewed, 2026-10-06):
  // references only; the texts always come from the API.
  var AYAHS = [
    "2:45", "2:152", "2:186", "2:201", "2:286", "3:8", "3:139", "3:200", "7:56", "9:51",
    "13:28", "14:7", "16:97", "16:128", "18:46", "20:114", "25:63", "29:69", "33:41", "39:53",
    "40:60", "49:10", "49:13", "51:56", "55:60", "64:16", "65:3", "67:2", "93:5", "94:5",
  ];
  var HADITH = [
    "1", "10", "13", "39", "52", "2067", "2320", "2442", "2989", "3559", "5027", "5376",
    "5971", "6011", "6018", "6021", "6026", "6094", "6114", "6116", "6125", "6407", "6412",
    "6464",
  ];

  var TRANSLATION = { ur: "ur.jalandhry", en: "en.sahih" };
  var WORDS = {
    ur: { ayah: "آج کی آیت", hadith: "آج کی حدیث", more: "راسخ پر پڑھیں", error: "ابھی لوڈ نہیں ہو سکا۔" },
    en: { ayah: "Verse of the day", hadith: "Hadith of the day", more: "Read on Rasikh", error: "Could not load right now." },
  };

  // The day number of a Pakistan calendar day (UTC+5, no DST), as on rasikh.ai.
  function pakistanDay() {
    return Math.floor((Date.now() + 5 * 3600000) / 86400000);
  }

  function el(tag, cls, text, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text; // always text, never HTML
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function cached(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function remember(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* private mode or storage blocked: fine, fetch again next time */
    }
  }

  function load(url, key) {
    var hit = cached(key);
    if (hit) return Promise.resolve(hit);
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json().then(function (data) {
        remember(key, data);
        return data;
      });
    });
  }

  function card(lang, kind) {
    var box = el("figure", "rasikh-card", null, { lang: lang, dir: lang === "ur" ? "rtl" : "ltr" });
    box.appendChild(el("figcaption", "rasikh-label", WORDS[lang][kind]));
    return box;
  }

  function renderAyah(box, d, lang) {
    var t = (d.translations || [])[0] || {};
    box.appendChild(el("p", "rasikh-arabic", d.text_uthmani, { lang: "ar", dir: "rtl" }));
    if (t.text) box.appendChild(el("p", "rasikh-translation", t.text));
    var ref = lang === "ur" && d.surah_info ? d.surah_info.name_ar + " " + d.surah + ":" + d.ayah_number
      : (d.surah_info ? d.surah_info.name_translit : "Surah") + " " + d.surah + ":" + d.ayah_number;
    box.appendChild(el("p", "rasikh-ref", ref, { dir: "auto" }));
    var credit = "Quran text: Tanzil Project (tanzil.net)";
    if (t.translator) credit += " · Translation: " + t.translator + " (Tanzil)";
    box.appendChild(el("p", "rasikh-credit", credit, { dir: "ltr", lang: "en" }));
    return SITE + "/source/quran/" + d.surah + "/" + d.ayah_number;
  }

  function renderHadith(box, d, lang) {
    var t = d.translation || {};
    var a = t.attribution || {};
    box.appendChild(el("p", "rasikh-arabic", d.text_ar, { lang: "ar", dir: "rtl" }));
    if (t.text) box.appendChild(el("p", "rasikh-translation", t.text));
    box.appendChild(el("p", "rasikh-ref", lang === "ur" ? d.reference_ur : d.reference_en, { dir: "auto" }));
    var credit = (lang === "ur" ? a.credit_ur : a.credit_en) ||
      (t.translator ? (lang === "ur" ? "ترجمہ: " + (a.translator_ur || t.translator) : "Translation: " + t.translator) : "");
    if (credit) box.appendChild(el("p", "rasikh-credit", credit, { dir: "auto" }));
    return SITE + "/source/hadith/" + d.collection.key + "/" + d.number;
  }

  function mount(host) {
    var kind = host.getAttribute("data-rasikh") === "hadith" ? "hadith" : "ayah";
    var lang = host.getAttribute("data-lang") === "en" ? "en" : "ur";
    var day = pakistanDay();
    var url, key;
    if (kind === "ayah") {
      var ref = AYAHS[day % AYAHS.length];
      url = API + "/ayah/" + ref + "?translations=" + TRANSLATION[lang];
      key = "rasikh-widget:ayah:" + lang + ":" + day;
    } else {
      var n = HADITH[day % HADITH.length];
      url = API + "/hadith/bukhari/" + n + "?lang=" + lang;
      key = "rasikh-widget:hadith:" + lang + ":" + day;
    }
    var box = card(lang, kind);
    host.textContent = "";
    host.appendChild(box);
    load(url, key)
      .then(function (d) {
        var link = kind === "ayah" ? renderAyah(box, d, lang) : renderHadith(box, d, lang);
        var more = el("a", "rasikh-more", WORDS[lang].more, { href: link, target: "_blank", rel: "noopener" });
        box.appendChild(more);
      })
      .catch(function () {
        box.appendChild(el("p", "rasikh-error", WORDS[lang].error));
        box.appendChild(el("a", "rasikh-more", "rasikh.ai", { href: SITE, target: "_blank", rel: "noopener" }));
      });
  }

  function style() {
    if (document.getElementById("rasikh-widget-style")) return;
    var css =
      ".rasikh-card{margin:0;padding:16px;border:1px solid rgba(128,128,128,.35);border-radius:16px;" +
      "max-width:640px;line-height:1.7}" +
      ".rasikh-label{font-weight:600;font-size:.9em;opacity:.75;margin-bottom:8px}" +
      ".rasikh-arabic{font-family:'Amiri Quran','Amiri','Scheherazade New','Noto Naskh Arabic',serif;" +
      "font-size:1.5em;line-height:2;margin:0 0 8px;text-align:right}" +
      ".rasikh-card[lang=ur] .rasikh-translation{font-family:'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif;" +
      "font-size:1.1em;line-height:2.1}" +
      ".rasikh-translation{margin:0 0 8px}" +
      ".rasikh-ref{font-weight:600;margin:0 0 4px}" +
      ".rasikh-credit{font-size:.8em;opacity:.75;margin:0 0 8px}" +
      ".rasikh-more{font-size:.9em}" +
      ".rasikh-error{opacity:.75}";
    var s = el("style", null, css, { id: "rasikh-widget-style" });
    document.head.appendChild(s);
  }

  function init() {
    var hosts = document.querySelectorAll("[data-rasikh]");
    if (!hosts.length) return;
    style();
    for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
