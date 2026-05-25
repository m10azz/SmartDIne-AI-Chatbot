async function testLorem() {
  const url = 'https://loremflickr.com/800/600/butter,chicken,food/all?lock=1';
  const res = await fetch(url, { redirect: 'manual' });
  console.log(res.status, res.headers.get('location'));
}
testLorem();
