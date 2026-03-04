const fs = require('fs');
const products = [
    'paneer.jpg',
    'veg_biryani.jpg',
    'dal_makhani.jpg',
    'aloo_gobi.jpg',
    'hakka_noodles.jpg',
    'malai_kofta.jpg',
    'chole_bhature.jpg',
    'palak_paneer.jpg',
    'spring_rolls.jpg',
    'mix_veg.jpg'
];

for (const p of products) {
    if (!fs.existsSync('public/images/menu/' + p)) {
        fs.copyFileSync('public/images/menu/dal_baati.jpg', 'public/images/menu/' + p);
    }
}
console.log("Images copied.");
