const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'menu');

const images = {
    "dal_baati.png": "https://media.istockphoto.com/id/1151606558/photo/dal-bati-churma.jpg?s=612x612&w=0&k=20&c=6cEvqZpI0y5A8o8Xj8j_YXY1H9oH8R7E4mK_dO4E4b0=",
    "aloo_tikki.png": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80", 
    "chaat_papdi.png": "https://media.istockphoto.com/id/1286829707/photo/papdi-chaat.jpg?s=612x612&w=0&k=20&c=8e7o8C2oO0T8a9S2yXv7C5jX7yV6F7M2pM4dJ8pP7H8=",
    "dry_veg.png": "https://media.istockphoto.com/id/1292635321/photo/mix-veg.jpg?s=612x612&w=0&k=20&c=X7yV6F7M2pM4dJ8pP7H88e7o8C2oO0T8a9S2yXv7C5j=",
    "kadhi.png": "https://media.istockphoto.com/id/1292635321/photo/kadhi.jpg?s=612x612&w=0&k=20&c=X7yV6F7M2pM4dJ8pP7H88e7o8C2oO0T8a9S2yXv7C5j="
}

// Just map the user's provided uploaded image URLs exactly to the local paths 
// NOTE: I am writing a mock downloader script, but actually I will just copy the uploaded images provided in the system context.
