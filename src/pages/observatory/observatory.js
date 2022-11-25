import { Facet, SearchProvider, Results, PagingInfo, SearchBox } from '@elastic/react-search-ui';

import Connector from '@/services/APIConnector';

import {
  Layout,
  SingleLinksFacet,
  BooleanFacet,
  SingleSelectFacet,
} from '@elastic/react-search-ui-views';

const connector = new Connector({});

const config = {
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    search_fields: {
      title: {
        weight: 3,
      },
      description: {},
      states: {},
    },
    result_fields: {
      visitors: { raw: {} },
      world_heritage_site: { raw: {} },
      location: { raw: {} },
      acres: { raw: {} },
      square_km: { raw: {} },
      title: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      nps_link: { raw: {} },
      states: { raw: {} },
      date_established: { raw: {} },
      image_url: { raw: {} },
      description: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
    },
    disjunctiveFacets: ['acres', 'states.keyword', 'date_established', 'location'],
    facets: {
      'world_heritage_site.keyword': { type: 'value' },
      'states.keyword': { type: 'value', size: 30, sort: 'count' },
      acres: {
        type: 'range',
        ranges: [
          { from: -1, name: 'Any' },
          { from: 0, to: 1000, name: 'Small' },
          { from: 1001, to: 100000, name: 'Medium' },
          { from: 100001, name: 'Large' },
        ],
      },
      location: {
        // San Francisco. In the future, make this the user's current position
        center: '37.7749, -122.4194',
        type: 'range',
        unit: 'mi',
        ranges: [
          { from: 0, to: 100, name: 'Nearby' },
          { from: 100, to: 500, name: 'A longer drive' },
          { from: 500, name: 'Perhaps fly?' },
        ],
      },
      visitors: {
        type: 'range',
        ranges: [
          { from: 0, to: 10000, name: '0 - 10000' },
          { from: 10001, to: 100000, name: '10001 - 100000' },
          { from: 100001, to: 500000, name: '100001 - 500000' },
          { from: 500001, to: 1000000, name: '500001 - 1000000' },
          { from: 1000001, to: 5000000, name: '1000001 - 5000000' },
          { from: 5000001, to: 10000000, name: '5000001 - 10000000' },
          { from: 10000001, name: '10000001+' },
        ],
      },
    },
  },
  autocompleteQuery: {
    results: {
      search_fields: {
        parks_search_as_you_type: {},
      },
      resultsPerPage: 5,
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        nps_link: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        documents: {
          fields: ['parks_completion'],
        },
      },
      size: 4,
    },
  },
};


const Observatory = () =>{
  return (
    <>
      <SearchProvider config={config}>
        <Layout
          bodyHeader={<PagingInfo />}
          sideContent={
            <div>
              <Facet field="categories.keyword" label="Categories" />
              <Facet field="designername.keyword" label="Designer" isFilterable={true} show="1000" />
              <Facet field="states.keyword" label="States" filterType="any" isFilterable={true} />
              <Facet
                field="world_heritage_site.keyword"
                label="World Heritage Site"
                view={BooleanFacet}
              />
              <Facet field="visitors" label="Visitors" view={SingleLinksFacet} />
              <Facet field="date_established" label="Date Established" filterType="any" />
              <Facet field="location" label="Distance" filterType="any" />
              <Facet field="acres" label="Acres" view={SingleSelectFacet} />
            </div>
          }
          header={
            <SearchBox
              autocompleteMinimumCharacters={3}
              autocompleteResults={{
                linkTarget: '_blank',
                sectionTitle: 'Results',
                titleField: 'title',
                urlField: 'nps_link',
                shouldTrackClickThrough: true,
                clickThroughTags: ['test'],
              }}
              autocompleteSuggestions={true}
              debounceLength={0}
            />
          }
          bodyContent={<Results />}
        />
      </SearchProvider>;
    </>
  );
};

export default Observatory;