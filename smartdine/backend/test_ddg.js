async function searchImage(query) {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " food high quality photography")}`);
    const text = await res.text();
    const match = text.match(/src="(\/\/external-content\.duckduckgo\.com\/iu\/\?u=[^"]+)"/);
    if (match) {
      console.log('https:' + match[1].replace(/&amp;/g, '&'));
    } else {
      console.log("No image found");
    }
  } catch (e) {
    console.error(e.message);
  }
}
searchImage('butter chicken');
