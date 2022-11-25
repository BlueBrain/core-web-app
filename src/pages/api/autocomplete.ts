import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector';

const connector = new ElasticsearchAPIConnector({
  host: 'https://sbo.ent.us-central1.gcp.cloud.es.io',
  index: 'national-parks-demo',
  apiKey: 'search-5coytg1zv58cvc71w68a2avs',
});

export default async function handler(req:any, res:any) {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onAutocomplete(requestState, queryConfig);
  res.json(response);
}
