# Credit and licence rules

The texts the Rasikh API returns come from named publishers and projects, each with its own
licence. Every item in a response carries its `attribution` and, where the source gives one, a
ready credit line (`credit_ur`, `credit_en`). Whenever you show a text, show its attribution with
it, and follow these rules. They are the same as in the guide at https://rasikh.ai/docs.

| Source | Rule |
|---|---|
| Quran text (Tanzil) | Word for word, never changed. Credit "Tanzil Project" with a link to tanzil.net. |
| Tanzil translations | Credit the translator and Tanzil, and do not change the text. Non-commercial use only. |
| Urdu hadith translations | Show the publisher's credit line (Maktaba Quddusia, Darussalam, Dar ul Ilm and others) on every display. |
| Musnad Ahmad | The Urdu (Maktaba Rahmaniya) with its credit line, also where another book reuses that Urdu. The Arabic (Open-Hadith-Data, ODbL 1.0) attributed, and a database built from it shared alike. |
| Mishkat al-Masabih (Maktaba Islamia) | Its credit line. Hafiz Zubair Ali Zai's grades only with his name. |
| Quranic Universal Library (Tarteel) | Tafsir Ibn Kathir, Bayan ul Quran, the translations `ur-Latn.maududi` and `ur.mahmudulhasan`, and the surah introductions. Non-commercial use only. With the tafsirs show "Tafsir data: Quranic Universal Library (Tarteel)" and the tafsir's name and author; with the others, the credit line in the item's `attribution`. Use the text exactly as given. |
| Tafsir al-Sa'di (QuranEnc.com) | Unchanged, with the publisher, QuranEnc.com and the version given in the response. |
| The sunnah.com books | Credit "via sunnah.com", and the translator where named. |
| HadeethEnc.com | Do not change the text. Credit HadeethEnc.com with a link. |
| Grades | Only as stored, always with the grader's name. A grade is that scholar's, never Rasikh's or yours. |
| Quran Foundation | Its content is shown on rasikh.ai only and is not in the API. |

Every licence in full: `GET https://api.rasikh.ai/v1/sources`. Please also credit Rasikh with a
link to rasikh.ai.

The API is free for personal, educational, research and non-commercial use. Some texts are
licensed for non-commercial use only, so for any commercial use, ask first at contact@rasikh.ai.
Using the API means you accept the terms at https://rasikh.ai/terms.
