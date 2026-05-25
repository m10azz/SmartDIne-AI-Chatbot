async function getWikiImage(query) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].original) {
      console.log(pages[pageId].original.source);
    } else {
      console.log("No image found for " + query);
    }
  } catch (e) {
    console.error(e.message);
  }
}
getWikiImage('Paneer tikka masala');
getWikiImage('Dal makhani');
getWikiImage('Biryani');
