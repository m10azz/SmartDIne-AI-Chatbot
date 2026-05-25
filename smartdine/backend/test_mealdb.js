async function searchImage(query) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (json.meals && json.meals.length > 0) {
      console.log(json.meals[0].strMealThumb);
    } else {
      console.log("No image found");
    }
  } catch (e) {
    console.error(e.message);
  }
}
searchImage('butter chicken');
