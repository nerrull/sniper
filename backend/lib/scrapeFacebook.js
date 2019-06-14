require('isomorphic-fetch');
const db = require('diskdb');

db.connect(
  './db',
  ['listings', 'searches']
);

async function scrapeFacebook(query, location_tags, search_tags) {
  const variables = {
    params: {
      bqf: { callsite: 'COMMERCE_MKTPLACE_WWW', query },
      browse_request_params: {
        filter_location_id: '104011556303312',
        filter_price_lower_bound: 0,
        filter_price_upper_bound: 214748364700,
      },
      custom_request_params: {
        surface: 'SEARCH',
        search_vertical: 'C2C',
      },
    },
  };

  const res = await fetch('https://www.facebook.com/api/graphql/', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: `variables=${JSON.stringify(variables)}&doc_id=2022753507811174`,
    method: 'POST',
    mode: 'cors',
  });
  const { data } = await res.json();
  console.log(data);
  // Pagination Cursor - doesn't seem to work if I pass it above
  console.log(data.marketplace_search.feed_units.page_info);

  const items = data.marketplace_search.feed_units.edges.map(
    ({
      node: {
        product_item: { for_sale_item: item },
      },
    }) => 
        console.log(item) || {
        title: item.group_commerce_item_title,
        link: `https://www.facebook.com/marketplace/item/${item.id}`,
        price: item.formatted_price.text.replace('$', ''),
        date: new Date(item.creation_time * 1000),
        image: item.primary_photo.image.uri,
        adId: item.id,
        nah: false,
        from: 'facebook',
        tags: search_tags,
        location : item.location,
      }

    // console.log(for_sale_item.group_commerce_item_title);
  );
  // save to DB
  items.forEach(item => {
    // see if we already have it
    const existingItem = db.listings.findOne({ adId: item.adId });
    if (existingItem) {
      console.log(`Item ${item.adId} already in DB`);
      return;
    }
    const geg = db.listings.save(item);
    console.log(`Saved: ${geg._id}`);
  });
  return items;
}

async function scrapeFacebookListings() {
  console.log("Scraping facebook");

  const searches = db.searches.find().filter(s=>s.platform =="facebook");
  console.log(searches);
  const scrapeSearches = searches.map(search => scrapeFacebook(search.search_term, search.location_tags, search.search_tags));
  const allData = await Promise.all(scrapeSearches);
  return 'Facebook Search Finished';
}

module.exports = scrapeFacebookListings;
