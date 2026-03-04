const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'menu');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const images = {
    "sambar_vada_idli.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Idli_Sambar.JPG/960px-Idli_Sambar.JPG",
    "dal_baati.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Dal_baati_churma.jpg/960px-Dal_baati_churma.jpg",
    "rice.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Cooked_rice.jpg/960px-Cooked_rice.jpg",
    "pulao.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vegetable_Pulao.jpg/960px-Vegetable_Pulao.jpg",
    "malai_sandwich.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Malai_Sandwich_1.jpg/960px-Malai_Sandwich_1.jpg",
    "papad.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Indian_Papad.jpg/960px-Indian_Papad.jpg",
    "uttapam.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Mini_Uttappam.jpg/960px-Mini_Uttappam.jpg",
    "chaat_papdi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Papdi_Chaat.jpg/960px-Papdi_Chaat.jpg",
    "aloo_tikki.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Aloo_Tikki_served_with_chutneys.jpg/960px-Aloo_Tikki_served_with_chutneys.jpg",
    "dahi_vada.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Indian_Dahi_Vada.jpg/960px-Indian_Dahi_Vada.jpg",
    "kadhi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kadhi_Pakora.jpg/960px-Kadhi_Pakora.jpg",
    "dry_veg.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Aloo_gobi.jpg/960px-Aloo_gobi.jpg",
    "shahi_tukda.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shahi_Tukray_%28Shahi_Tukda%29.JPG/960px-Shahi_Tukray_%28Shahi_Tukda%29.JPG",
    "shahi_kheer.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kheer.jpg/960px-Kheer.jpg"
};

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'CloudKitchenDemo/1.0 (https://cloudkitchen.vercel.app/; user@example.com)'
            }
        };
        https.get(url, options, (response) => {
            if(response.statusCode === 404 || response.statusCode === 403) {
               console.error(`${response.statusCode} for`, url);
               resolve();
               return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function downloadAll() {
    for (const [filename, url] of Object.entries(images)) {
        console.log(`Downloading ${filename}...`);
        try {
            await download(url, path.join(dir, filename));
        } catch(e) {
            console.error(`Failed ${filename}:`, e);
        }
    }
    console.log("Done");
}

downloadAll();
