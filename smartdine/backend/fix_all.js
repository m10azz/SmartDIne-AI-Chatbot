const fs = require('fs');
const db = require('./db');

async function run() {
  const result = await db.query('SELECT id, name, category FROM menu_items ORDER BY id ASC');
  const items = result.rows;
  
  let sql = fs.readFileSync('db_schema.sql', 'utf8');

  for (const item of items) {
    const categoryKeyword = item.category.toLowerCase() === 'drinks' ? 'drink' : 'food';
    const nameKeywords = item.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim().split(/\s+/).join(',');
    
    // Create the highly specific, unique loremflickr URL
    const imgUrl = `https://loremflickr.com/800/600/${nameKeywords},${categoryKeyword}/all?lock=${item.id}`;

    console.log(`Updating ${item.name} -> ${imgUrl}`);
    await db.query('UPDATE menu_items SET image_url = $1 WHERE id = $2', [imgUrl, item.id]);
    
    // Also update db_schema.sql
    // We match the name inside the values list and replace the URL string next to it
    const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\('${escapedName}'.*?'(https?://[^']+)'\\)`, 'g');
    
    sql = sql.replace(regex, (match, p1) => {
      return match.replace(p1, imgUrl);
    });
  }

  fs.writeFileSync('db_schema.sql', sql);
  console.log('Finished updating all 50 items to have completely unique, keyword-based professional images!');
  process.exit(0);
}

run();
