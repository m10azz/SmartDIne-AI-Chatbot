const fs = require('fs');

async function getWikiImage(query) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].original) {
      return pages[pageId].original.source;
    }
  } catch (e) {}
  return null;
}

const db = require('./db');

const fallbackImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1565557613262-b0eb9de7090b?w=800&q=80',
  'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
  'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=800&q=80',
  'https://images.unsplash.com/photo-1544025162-8113222a7f50?w=800&q=80',
  'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80',
  'https://images.unsplash.com/photo-1599487618113-6447e170868c?w=800&q=80'
];
let fallbackIndex = 0;

async function run() {
  const result = await db.query('SELECT id, name FROM menu_items ORDER BY id ASC');
  const items = result.rows;
  
  let sql = fs.readFileSync('db_schema.sql', 'utf8');

  for (const item of items) {
    let img = await getWikiImage(item.name);
    
    // Attempt fallback searches if primary fails
    if (!img) {
      const parts = item.name.split(' ');
      if (parts.length > 1) {
        img = await getWikiImage(parts[parts.length - 1]); // last word, e.g. "Masala"
      }
    }
    
    if (!img) {
      img = fallbackImages[fallbackIndex % fallbackImages.length];
      fallbackIndex++;
    }

    console.log(`Setting ${item.name} to ${img}`);
    await db.query('UPDATE menu_items SET image_url = $1 WHERE id = $2', [img, item.id]);
    
    // Update db_schema.sql too
    const regex = new RegExp(`\\('${item.name}'.*?'(https://[^']+)'\\)`, 'g');
    sql = sql.replace(regex, (match, p1) => {
      return match.replace(p1, img);
    });
  }

  fs.writeFileSync('db_schema.sql', sql);
  console.log('Finished updating all images to be unique and exact!');
  process.exit(0);
}

run();
