require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const imageMap = {
  'Paneer Butter Masala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Paneer_butter_masala.jpg/400px-Paneer_butter_masala.jpg',
  'Vegetable Biryani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Biryani_at_Bawarchi.jpg/400px-Biryani_at_Bawarchi.jpg',
  'Dal Makhani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dal_makhani_quadrat.jpg/400px-Dal_makhani_quadrat.jpg',
  'Kadai Paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kadai_paneer.jpg/400px-Kadai_paneer.jpg',
  'Veg Pulao': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Pulao.jpg/400px-Pulao.jpg',
  'Chicken Tikka Masala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Chicken_tikka_masala.jpg/400px-Chicken_tikka_masala.jpg',
  'Butter Chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Butter_chicken.jpg/400px-Butter_chicken.jpg',
  'Chicken Biryani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Biryani_at_Bawarchi.jpg/400px-Biryani_at_Bawarchi.jpg',
  'Fish Curry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fish_curry.jpg/400px-Fish_curry.jpg',
  'Tandoori Chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tandoori_chicken.jpg/400px-Tandoori_chicken.jpg',
  'Prawn Masala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Prawn_masala.jpg/400px-Prawn_masala.jpg',
  'Mutton Biryani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/sixty/Mutton_biryani.jpg/400px-Mutton_biryani.jpg',
  'Chicken Korma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korma.jpg/400px-Korma.jpg',
  'Egg Curry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Egg_curry.jpg/400px-Egg_curry.jpg',
  'Masala Dosa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/thirty/Masala_dosa.jpg/400px-Masala_dosa.jpg',
  'Plain Dosa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/thirty/Masala_dosa.jpg/400px-Masala_dosa.jpg',
  'Idli Sambar - 3 pieces': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Idli_Sambar.jpg/400px-Idli_Sambar.jpg',
  'Medu Vada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Medu_vada.jpg/400px-Medu_vada.jpg',
  'Uttapam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Uttapam.jpg/400px-Uttapam.jpg',
  'Pongal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Pongal_dish.jpg/400px-Pongal_dish.jpg',
  'Upma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Upma.jpg/400px-Upma.jpg',
  'Curd Rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Curd_rice.jpg/400px-Curd_rice.jpg',
  'Lemon Rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lemon_rice.jpg/400px-Lemon_rice.jpg',
  'Appam with Stew': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Appam_with_stew.jpg/400px-Appam_with_stew.jpg',
  'Filter Coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Filter_coffee.jpg/400px-Filter_coffee.jpg',
  'Payasam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Payasam.jpg/400px-Payasam.jpg',
  'Gulab Jamun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Gulab_jamun_%28single%29.jpg/400px-Gulab_jamun_%28single%29.jpg',
  'Rasgulla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Rasgulla.jpg/400px-Rasgulla.jpg',
  'Mango Lassi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Mango_lassi.jpg/400px-Mango_lassi.jpg',
  'Masala Chai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/forty/Masala_Chai.jpg/400px-Masala_Chai.jpg',
  'Chettinad Chicken Curry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korma.jpg/400px-Korma.jpg',
  'Chicken Chettinad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korma.jpg/400px-Korma.jpg',
  'Fish Fry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fish_curry.jpg/400px-Fish_curry.jpg',
  'Prawn Masala (South Indian)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Prawn_masala.jpg/400px-Prawn_masala.jpg',
  'Mutton Stew': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korma.jpg/400px-Korma.jpg',
  'Vegetable Korma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Korma.jpg/400px-Korma.jpg',
  'Ghee Rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Pulao.jpg/400px-Pulao.jpg',
  'Lentil Soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dal_makhani_quadrat.jpg/400px-Dal_makhani_quadrat.jpg',
  'Quinoa Salad': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=400',
  'Roasted Chickpeas': 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?w=400',
  'Vegan Burger': 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?w=400',
  'Sweet Potato Wedges': 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=400',
  'Mushroom Risotto': 'https://images.pexels.com/photos/1437268/pexels-photo-1437268.jpeg?w=400',
  'Vegan Wrap': 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?w=400',
  'Chocolate Brownie': 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?w=400',
  'Cheesecake': 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?w=400',
  'Tiramisu': 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?w=400',
  'Ice Cream Sundae': 'https://images.pexels.com/photos/1586942/pexels-photo-1586942.jpeg?w=400',
  'Fruit Tart': 'https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?w=400',
  'Chocolate Lava Cake': 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400',
  'Sweet Lassi': 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?w=400',
  'Cold Coffee': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=400',
  'Fresh Lime Soda': 'https://images.pexels.com/photos/1282346/pexels-photo-1282346.jpeg?w=400',
  'Mojito': 'https://images.pexels.com/photos/4051529/pexels-photo-4051529.jpeg?w=400',
  'Iced Tea': 'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?w=400',
  'Orange Juice': 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-158053.jpeg?w=400',
  'Watermelon Juice': 'https://images.pexels.com/photos/5947017/pexels-photo-5947017.jpeg?w=400',
  'Milkshake': 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?w=400',
};

const categoryFallbacks = {
  'Veg': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
  'Non-Veg': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=400',
  'Dessert': 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?w=400',
  'Drinks': 'https://images.pexels.com/photos/1493080/pexels-photo-1493080.jpeg?w=400',
  'Vegan': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400'
};

async function run() {
  try {
    const result = await pool.query('SELECT id, name, category FROM menu_items ORDER BY id ASC');
    const items = result.rows;
    
    console.log(`Found ${items.length} menu items. Starting to map images...`);

    for (const item of items) {
      let newImageUrl = imageMap[item.name];
      let source = 'Hardcoded Map';
      
      if (!newImageUrl) {
        newImageUrl = categoryFallbacks[item.category] || categoryFallbacks['Veg'];
        source = `Category Fallback (${item.category})`;
      }
      
      await pool.query('UPDATE menu_items SET image_url = $1 WHERE id = $2', [newImageUrl, item.id]);
      console.log(`✅ [${item.id}] ${item.name} -> ${source}`);
    }
    
  } catch (dbError) {
    console.error('Database connection error:', dbError.message);
  } finally {
    await pool.end();
    console.log('Database connection closed. Script finished.');
  }
}

run();
