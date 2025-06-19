const pokeApi = {};

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then((pokeDetail) => {
      return {
        number: pokeDetail.id,
        name: pokeDetail.name,
        types: pokeDetail.types.map((t) => t.type.name),
        type: pokeDetail.types[0].type.name,
        photo: pokeDetail.sprites.front_default,
      };
    });
};

pokeApi.getPokemons = (offset = 0, limit = 10, type = null) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => Promise.all(pokemons.map(pokeApi.getPokemonDetail)))
    .then((pokemons) => {
      // Filtra os Pokémons pelo tipo, se especificado
      if (type) {
        return pokemons.filter(pokemon => pokemon.types.includes(type));
      }
      return pokemons;
    });
};

function filterPokemon(type) {
  const pokemons = document.querySelectorAll('.pokemon');

  pokemons.forEach(pokemon => {
    const types = pokemon.getAttribute('data-type').split(',').map(t => t.trim());

    if (type === 'all' || types.includes(type)) {
      pokemon.style.display = 'flex'; // Ou 'block' conforme seu layout
    } else {
      pokemon.style.display = 'none';
    }
  });
}
