async function fetchCountries() {
    const response = await fetch(
      'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code'
    );
    return response.json();
  }

  export default fetchCountries;