const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bqacfcanqwmyabubnzkp.supabase.co';
const supabaseKey = 'sb_publishable_QXD5m3vw287hQqcTzE8CKg_ri3AK18M';
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    { name: 'Paneer Butter Masala', description: 'Rich and creamy paneer curry cooked with tomatoes, spices and butter', price: 250, original_price: 300, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/paneer.jpg', rating: 4.8, in_stock: true, is_popular: true },
    { name: 'Vegetable Biryani', description: 'Aromatic basmati rice with mixed vegetables and spices', price: 200, original_price: 250, categories: ['Rice', 'Vegetarian', 'Indian'], image: '/images/menu/veg_biryani.jpg', rating: 4.5, in_stock: true, is_featured: true },
    { name: 'Dal Makhani', description: 'Classic black lentils slow-cooked overnight with cream and butter', price: 180, original_price: 220, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/dal_makhani.jpg', rating: 4.7, in_stock: true, is_popular: true },
    { name: 'Aloo Gobi Masala', description: 'Homestyle potatoes and cauliflower curry', price: 150, original_price: 180, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/aloo_gobi.jpg', rating: 4.2, in_stock: true },
    { name: 'Veg Hakka Noodles', description: 'Indo-Chinese style stir-fried noodles with fresh vegetables', price: 160, original_price: 200, categories: ['Chinese', 'Vegetarian', 'Noodles'], image: '/images/menu/hakka_noodles.jpg', rating: 4.4, in_stock: true, is_popular: true },
    { name: 'Malai Kofta', description: 'Cottage cheese and potato dumplings in a rich creamy cashew gravy', price: 260, original_price: 320, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/malai_kofta.jpg', rating: 4.9, in_stock: true, is_featured: true },
    { name: 'Amritsari Chole Bhature', description: 'Spicy chickpea curry served with two fluffy deep-fried breads', price: 180, original_price: 230, categories: ['Street Food', 'Vegetarian', 'Indian'], image: '/images/menu/chole_bhature.jpg', rating: 4.8, in_stock: true, is_popular: true },
    { name: 'Palak Paneer', description: 'Soft paneer cubes in a smooth, spiced spinach pureé', price: 240, original_price: 280, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/palak_paneer.jpg', rating: 4.6, in_stock: true },
    { name: 'Crispy Veg Spring Rolls', description: 'Crispy deep-fried rolls filled with seasoned mixed vegetables', price: 140, original_price: 180, categories: ['Starters', 'Vegetarian', 'Chinese'], image: '/images/menu/spring_rolls.jpg', rating: 4.5, in_stock: true },
    { name: 'Mix Veg Curry', description: 'Healthy and satisfying mixed seasonal vegetables in a mildly spiced gravy', price: 170, original_price: 200, categories: ['Main Course', 'Vegetarian', 'Indian'], image: '/images/menu/mix_veg.jpg', rating: 4.3, in_stock: true }
];

async function seedProducts() {
    const { data, error } = await supabase.from('menu_items').insert(products).select();
    if (error) {
        console.error('Error inserting products:', error);
    } else {
        console.log(`Successfully inserted ${data.length} products!`);
    }
}

seedProducts();
