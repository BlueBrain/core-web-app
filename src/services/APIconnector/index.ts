class APIConnector {
  constructor() {}

  onResultClick() {
    // optional. Called when a result has been clicked
  }
  onAutocompleteResultClick() {
    // optional. Called when an autocomplete result has been clicked
  }

  async onSearch(requestState: any, queryConfig: any) {
    const response = await fetch('api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    console.log(response.json());
    return response.json();
  }

  async onAutocomplete(requestState: any, queryConfig: any) {
    const response = await fetch('api/autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    console.log(response);
    return response.json();
  }
}

export default APIConnector;
