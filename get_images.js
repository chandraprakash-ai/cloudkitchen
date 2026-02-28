const items = [
  "Sambar",
  "Vada (food)",
  "Idli",
  "Dal bati",
  "Baingan bharta",
  "Rice",
  "Pilaf",
  "Papadum",
  "Uttapam",
  "Papri chaat",
  "Aloo tikki",
  "Dahi vada",
  "Kadhi",
  "Shahi tukra",
  "Kheer"
];

async function getWikiImage(title) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== "-1" && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch(e) {}
  return null;
}

async function run() {
  const results = {};
  for (let i of items) {
    results[i] = await getWikiImage(i);
  }
  console.log(JSON.stringify(results, null, 2));
}
run();
