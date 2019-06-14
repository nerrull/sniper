import AddSearch from '../components/AddSearch';
import SearchesList from '../components/SearchesList';
import Listings from '../components/Listings';
import Page from '../components/Page';

const IndexPage = () => (
  <Page>
    <AddSearch />
    <Listings />
    <SearchesList />
  </Page>
);

export default IndexPage;
