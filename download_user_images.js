const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'menu');

const images = {
    "dal_baati.jpg": "https://media.istockphoto.com/id/1151606558/photo/dal-bati-churma.jpg?s=612x612&w=0&k=20&c=6cEvqZpI0y5A8o8Xj8j_YXY1H9oH8R7E4mK_dO4E4b0=",
    "aloo_tikki.jpg": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80", 
    "chaat_papdi.jpg": "https://media.istockphoto.com/id/1286829707/photo/papdi-chaat.jpg?s=612x612&w=0&k=20&c=8e7o8C2oO0T8a9S2yXv7C5jX7yV6F7M2pM4dJ8pP7H8=",
    "dry_veg.jpg": "https://media.istockphoto.com/id/1292635321/photo/mix-veg.jpg?s=612x612&w=0&k=20&c=X7yV6F7M2pM4dJ8pP7H88e7o8C2oO0T8a9S2yXv7C5j=",
    "kadhi.jpg": "https://media.istockphoto.com/id/1292635321/photo/kadhi.jpg?s=612x612&w=0&k=20&c=X7yV6F7M2pM4dJ8pP7H88e7o8C2oO0T8a9S2yXv7C5j="
}

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            if(response.statusCode !== 200) {
               console.error(`${response.statusCode} for`, url);
               resolve();
               return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });
        
        req.on('error', (err) => {
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
