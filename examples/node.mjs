// The Rasikh API from Node 18+ (built-in fetch). Run: node examples/node.mjs
// Optional: RASIKH_KEY=your-key node examples/node.mjs  (higher daily limits)

const API = "https://api.rasikh.ai/v1";
const headers = process.env.RASIKH_KEY ? { "X-API-Key": process.env.RASIKH_KEY } : {};

async function get(path) {
  const r = await fetch(API + path, { headers });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(`${r.status} ${path}: ${JSON.stringify(body)}`);
  }
  console.log(`(${r.headers.get("X-RateLimit-Remaining")} left today in "${r.headers.get("X-RateLimit-Group")}")`);
  return r.json();
}

// A verse with the Urdu translation and its credit
const ayah = await get("/ayah/2:255?translations=ur.jalandhry");
const tr = ayah.translations[0];
console.log(ayah.reference);
console.log(ayah.text_uthmani);
console.log(tr.text);
console.log(`Quran text: Tanzil Project (tanzil.net) · Translation: ${tr.translator} (Tanzil)\n`);

// A hadith with its Urdu translation and the publisher's credit line
const hadith = await get("/hadith/bukhari/13?lang=ur");
console.log(hadith.reference_ur);
console.log(hadith.text_ar);
console.log(hadith.translation.text);
console.log(hadith.translation.attribution.credit_ur, "\n");

// A search: the references found. Each result also has the full Arabic and translation
// (text_ar, translation or translations) with their credit: show them whole, never cut short.
const found = await get("/search?q=sabr&limit=5");
for (const item of found.results) console.log(`- ${item.type}: ${item.reference}`);
