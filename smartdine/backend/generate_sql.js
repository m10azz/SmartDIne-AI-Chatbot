const fs = require('fs');
const db = require('./db');

// Provided by user
const specificUpdates = [
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' WHERE name = 'Paneer Butter Masala';",
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' WHERE name = 'Palak Paneer';",
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' WHERE name = 'Vegetable Biryani';",
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1626132647523-66c5c4aca1f8?w=400' WHERE name = 'Dal Makhani';",
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' WHERE name = 'Chicken Tikka Masala';",
  "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' WHERE name = 'Mutton Rogan Josh';"
];

const completedNames = [
  'Paneer Butter Masala', 'Palak Paneer', 'Vegetable Biryani', 
  'Dal Makhani', 'Chicken Tikka Masala', 'Mutton Rogan Josh'
];

// Pool of high quality unique Unsplash photo IDs for food
const pool = [
  '1512621776951-a57141f2eefd', '1473093295043-cdd812d0e601', '1490645935980-d41dfeaf26b5',
  '1546069901-ba9599a7e63c', '1565557613262-b0eb9de7090b', '1559742811-822873691df8',
  '1589302168068-964664d93dc0', '1631452180519-c014fe946bc0', '1546833999-b9f581a1996d',
  '1512058564366-18510be2db19', '1596797038530-2c107229654b', '1544025162-8113222a7f50',
  '1580476262798-bddd9f4b7369', '1599487618113-6447e170868c', '1547592180-85f173990554',
  '1515543237350-b3eea1ec8082', '1520072959219-c595dc870360', '1534080564583-6be75777b70a',
  '1476124369491-e59f5f0ceb07', '1628840042765-356cda07504e', '1589114473210-91129beafdfb',
  '1605197132836-ce0196c80db0', '1606313564200-e75d5e30476c', '1533134242443-d4fd215305ad',
  '1571115177098-24c42d640fa9', '1557142046-c704a3adf364', '1464305795204-6f5bbfc7fb81',
  '1611293388250-580b08c4a145', '1488477181946-6428a0291777', '1556679343-c7306c1976bc',
  '1461023058943-07fcbe16d735', '1544787219-7f47ccb76574', '1513558161293-cdaf765ed2fd',
  '1551538827-9c037cb4f32a', '1499638673689-79a0b5115d87', '1600271886742-f049cd451bba',
  '1589733955941-5eeaf752f6dd', '1572490122747-3968b75bb811', '1484723091781-3fc52cb424a1',
  '1432139555190-58524dae6a55', '1478144592103-75b24c8cb4e7', '1493770348161-369560ae357d',
  '1494859802808-527447656d02', '1504544750281-c6928bc63a43', '1504670073073-61b6c703080d',
  '1505253758668-c7365a01150b', '1505935428951-bd12c9ceeb07', '1506084868230-bb9ed114d2ba',
  '1511690655022-00508a8e104e', '1512621776951-a57141f2eefd', '1514326162391-766b9afdc5eb',
  '1516684732162-8706d8be728e', '1517244683847-759023c5a5e3', '1520072959219-c595dc870360',
  '1523905330026-b75f73d84950', '1525351484163-7529414344d8', '1528735602780-2552fd46c7af'
];

let poolIndex = 0;

const southIndian = [
  { name: 'Masala Dosa', category: 'Veg', price: 120.00, calories: 380, protein: 8, carbs: 65, fats: 10, desc: 'Crispy rice and lentil crepe stuffed with potato curry.', rating: 4.8 },
  { name: 'Plain Dosa', category: 'Veg', price: 80.00, calories: 280, protein: 6, carbs: 55, fats: 5, desc: 'Classic crispy rice and lentil crepe served with chutneys.', rating: 4.6 },
  { name: 'Idli Sambar - 3 pieces', category: 'Veg', price: 80.00, calories: 200, protein: 7, carbs: 40, fats: 2, desc: 'Steamed rice cakes served with hot lentil soup.', rating: 4.7 },
  { name: 'Medu Vada', category: 'Veg', price: 90.00, calories: 310, protein: 9, carbs: 45, fats: 12, desc: 'Deep-fried lentil donuts, crispy outside and soft inside.', rating: 4.6 },
  { name: 'Uttapam', category: 'Veg', price: 110.00, calories: 350, protein: 8, carbs: 60, fats: 8, desc: 'Thick savory pancake topped with onions and tomatoes.', rating: 4.5 },
  { name: 'Pongal', category: 'Veg', price: 100.00, calories: 420, protein: 12, carbs: 65, fats: 15, desc: 'Comforting dish made of rice and moong dal tempered with ghee.', rating: 4.7 },
  { name: 'Chettinad Chicken Curry', category: 'Non-Veg', price: 280.00, calories: 420, protein: 28, carbs: 15, fats: 25, desc: 'Spicy, flavorful chicken curry from the Chettinad region.', rating: 4.8 },
  { name: 'Fish Fry', category: 'Non-Veg', price: 220.00, calories: 310, protein: 25, carbs: 8, fats: 18, desc: 'Crispy pan-fried fish marinated with South Indian spices.', rating: 4.6 },
  { name: 'Prawn Masala (South Indian)', category: 'Non-Veg', price: 320.00, calories: 380, protein: 24, carbs: 12, fats: 22, desc: 'Juicy prawns cooked in a rich coconut and tomato gravy.', rating: 4.7 },
  { name: 'Rasam', category: 'Veg', price: 60.00, calories: 80, protein: 2, carbs: 15, fats: 2, desc: 'Tangy and spicy South Indian soup made with tamarind and tomatoes.', rating: 4.5 },
  { name: 'Sambar', category: 'Veg', price: 70.00, calories: 120, protein: 5, carbs: 20, fats: 3, desc: 'Hearty lentil and vegetable stew.', rating: 4.6 },
  { name: 'Coconut Chutney', category: 'Veg', price: 40.00, calories: 90, protein: 2, carbs: 5, fats: 7, desc: 'Fresh ground coconut dip tempered with mustard seeds.', rating: 4.7 },
  { name: 'Filter Coffee', category: 'Drinks', price: 50.00, calories: 60, protein: 1, carbs: 10, fats: 2, desc: 'Traditional South Indian coffee brewed with milk and sugar.', rating: 4.9 },
  { name: 'Payasam', category: 'Dessert', price: 120.00, calories: 280, protein: 4, carbs: 45, fats: 10, desc: 'Sweet pudding made with vermicelli, milk, nuts, and ghee.', rating: 4.8 },
  { name: 'Appam with Stew', category: 'Veg', price: 150.00, calories: 340, protein: 5, carbs: 55, fats: 12, desc: 'Lace-edged rice pancakes served with mild coconut vegetable stew.', rating: 4.7 }
];

async function run() {
  const result = await db.query('SELECT name FROM menu_items');
  const allNames = result.rows.map(r => r.name);
  
  let outSql = `-- UPDATE 6 PROVIDED ITEMS\n`;
  outSql += specificUpdates.join('\n') + '\n\n';
  outSql += `-- UPDATE REMAINING 44 ITEMS\n`;

  for (const name of allNames) {
    if (!completedNames.includes(name)) {
      const id = pool[poolIndex % pool.length];
      poolIndex++;
      const url = `https://images.unsplash.com/photo-${id}?w=400`;
      outSql += `UPDATE menu_items SET image_url = '${url}' WHERE name = '${name.replace(/'/g, "''")}';\n`;
    }
  }

  outSql += '\n-- INSERT 15 SOUTH INDIAN DISHES\n';
  outSql += `INSERT INTO menu_items (name, category, price, description, calories, protein, carbs, fats, rating, image_url) VALUES\n`;

  const values = southIndian.map(dish => {
    const id = pool[poolIndex % pool.length];
    poolIndex++;
    const url = `https://images.unsplash.com/photo-${id}?w=400`;
    return `('${dish.name.replace(/'/g, "''")}', '${dish.category}', ${dish.price}, '${dish.desc.replace(/'/g, "''")}', ${dish.calories}, ${dish.protein}, ${dish.carbs}, ${dish.fats}, ${dish.rating}, '${url}')`;
  });

  outSql += values.join(',\n') + ';\n';

  const path = '../database/update_images_and_south_indian.sql';
  fs.writeFileSync(path, outSql);
  console.log(`Successfully generated ${path}`);

  // Now execute it on PostgreSQL
  try {
    const query = fs.readFileSync(path, 'utf8');
    await db.query(query);
    console.log('Successfully executed the SQL file on PostgreSQL database!');
  } catch(e) {
    console.error('Failed to execute SQL', e);
  }
  process.exit(0);
}

run();
