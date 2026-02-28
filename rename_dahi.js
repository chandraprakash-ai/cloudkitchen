const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'images', 'menu', 'dahi_vada.jpg');
const renamed = path.join(__dirname, 'public', 'images', 'menu', 'dahi_vada.png');

if (fs.existsSync(file)) {
    fs.renameSync(file, renamed);
    console.log("Renamed dahi_vada.jpg to dahi_vada.png");
}
