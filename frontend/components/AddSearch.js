import axios from 'axios';
import { useState, useCallback } from 'react';
import { endpoint } from '../config';
import {Tags} from '../components/SearchTags';

function useInput(initalValue = '') {
  const [value, update] = useState(initalValue);
  const onChange = useCallback(e => {
    update(e.currentTarget.value);
  }, []);
  return { value, onChange };
}

async function handleSubmit(e, data, tags) {
  e.preventDefault();
  console.log(endpoint, data);
  const res = await axios.post(`${endpoint}/searches`, {
    tags: tags,
    name: data.name.value,
    feed: data.feed.value,
  });
  console.log(res);
}

async function handleSubmitNew(e, platform, data, tags) {
  e.preventDefault();
  console.log(endpoint, data);
  const res = await axios.post(`${endpoint}/searches`, {
    platform: platform,
    search_tags: tags.searchTags.map(t=>t.id),
    location_tags: tags.locationTags.map(t =>t.id  ),
    search_term: data.value,
  });
  console.log(res);
}


export default function AddSearch() {
  const name = useInput('Facebook');
  const feed = useInput('Kijiji');
  const [ locationTags, setLocationTags ] = useState([
    { id: 'Montreal', text: 'Montreal' },
    { id: 'Sherbrooke', text: 'Sherbrooke' },

  ]); 
  const [ searchTags, setSearchTags ] = useState([
  ]); 

  const submitCallback = useCallback((e,p, data) => {
    handleSubmitNew(e,p, data, {searchTags, locationTags});
  }, [searchTags, locationTags])

  console.log(searchTags);  
  return (
    <div>
      <Tags tags={locationTags} setTags={setLocationTags} />
      <Tags tags={searchTags} setTags={setSearchTags} />

      <form onSubmit={e => submitCallback(e,"facebook", name)}>
        <input type="text" name="name" placeholder="name" {...name} />
        <button type="submit">+ Add Search</button>
      </form>

      <form onSubmit={e => submitCallback(e, "kijiji", feed)}>
      <input type="text" name="feed" placeholder="feed" {...feed} />
      <button type="submit">+ Add Search</button>
      </form>
    </div>

  );
}
