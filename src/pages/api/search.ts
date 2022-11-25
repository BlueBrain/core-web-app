import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector';

// const connector = new ElasticsearchAPIConnector({
//   host: 'https://sbo.ent.us-central1.gcp.cloud.es.io',
//   index: 'national-parks-demo',
//   apiKey: 'search-5coytg1zv58cvc71w68a2avs',
// });
const connector = new ElasticsearchAPIConnector({
  host: 'https://sbo.kb.us-central1.gcp.cloud.es.io:9243/',
  index: 'kibana_sample_data_flights',
  apiKey: 'bzRoS3JJUUJyX2tkTVh3cEVxbmM6djR0RThWV09SaEdQTmZYRTYxQ2NWZw==',
});


export default async function handler(req:any, res:any) {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onSearch(requestState, queryConfig);
  res.json(response);}
