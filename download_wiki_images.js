
const fs = require('fs');
const path = require('path');

const terms = {
    "sambar_vada_idli.jpg": "Idli",
    "dal_baati.jpg": "Dal bati",
    "rice.jpg": "Cooked rice",
    "pulao.jpg": "Pilaf",
    "malai_sandwich.jpg": "Chum_chum",
    "papad.jpg": "Papadum",
    "uttapam.jpg": "Uttapam",
    "chaat_papdi.jpg": "Papri_chaat",
    "aloo_tikki.jpg": "Aloo_tikki",
    "dahi_vada.png": "Dahi_vada",
    "kadhi.jpg": "Kadhi",
    "dry_veg.jpg": "Aloo_gobi",
    "shahi_tukda.jpg": "Double_ka_meetha",
    "shahi_kheer.jpg": "Kheer"
};

const dir = path.join(__dirname, 'public', 'images', 'menu');

async function downloadWikiImgs() {
    for (const [filename, title] of Object.entries(terms)) {
        console.log("Fetching url for " + title);
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
        try {
            const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
            const data = await res.json();
            const pages = data.query?.pages;
            if (!pages) continue;
            const page = Object.values(pages)[0];

            if (page && page.thumbnail && page.thumbnail.source) {
                const imgUrl = page.thumbnail.source;
                console.log("Downloading " + imgUrl + " to " + filename);
                const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
                const buffer = await imgRes.arrayBuffer();
                fs.writeFileSync(path.join(dir, filename), Buffer.from(buffer));
            } else {
                console.log("No thumbnail found for " + title);
            }
        } catch (e) {
            console.error("Error on " + title + ": " + e.message);
        }
    }
    console.log("Done");
}

downloadWikiImgs();
