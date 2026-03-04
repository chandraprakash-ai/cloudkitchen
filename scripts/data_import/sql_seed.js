const fs = require('fs');
const content = `
UPDATE menu_items SET image = '/images/menu/sambar_vada_idli.png' WHERE name = 'South Indian Thali';
UPDATE menu_items SET image = '/images/menu/dal_baati.jpg' WHERE name = 'Authentic Dal Baati';
UPDATE menu_items SET image = '/images/menu/chaat_papdi.jpg' WHERE name = 'Dilli Style Papdi Chaat';
UPDATE menu_items SET image = '/images/menu/aloo_tikki.jpg' WHERE name = 'Crispy Aloo Tikki';
UPDATE menu_items SET image = '/images/menu/dahi_vada.png' WHERE name = 'Classic Dahi Vada';
`;
fs.writeFileSync('seed_images.sql', content);
