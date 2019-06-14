const db = require('diskdb');
const { parseString } = require('xml2js');
const { promisify } = require('util');

const parseStringAsync = promisify(parseString);

const axios = require('axios');

db.connect(
  './db',
  ['listings', 'searches']
);
async function scrapeSearch(url) {
  if (url.length <1) {
    console.log("Bad url "+ url);
    return[];
  }
  else{
  console.log("Parsing : " + url);
  }
  const res = await axios.get(url, {
    responseType: 'text',
  })
    // console.log(res)

  const json = await parseStringAsync(res.data, { explicitArray: false });
  if (!json.rss.channel.item) {
    return []; // no items
  }
  const items = json.rss.channel.item.map(item => ({
    title: item.title,
    link: item.link,
    description: item.description,
    price: item['g-core:price'],
    date: item.pubDate,
    image: item.enclosure.$.url,
    adId: item.link.split('/').pop(),
          lat: item['geo:lat'],
          long: item['geo:long'],
    nah: false,
    from: 'kijiji',
  }));

  var nitems = 0;
  // save to DB
  items.forEach(item => {
    // see if we already have it
    const existingItem = db.listings.findOne({ adId: item.adId });
    if (existingItem) {
      console.log(`Item ${item.adId} already in DB`);
      return;
    }

    const geg = db.listings.save(item);
    nitems+=1;
    console.log(`Saved: ${geg._id}`);
  });
  console.log(`Found ${nitems} items`);
  return items;
}

async function scrapeListings() {
  // const searches = db.searches.find();
  // const searches =db.searches.find()[0];
  const searches = db.searches.find().filter(s=>s.platform =="kijiji");

  const scrapeSearches = searches.map(search => scrapeSearch(search.search_term));
  const allData = await Promise.all(scrapeSearches);
  return 'Kijiji Search Finished';
}

module.exports = scrapeListings;
