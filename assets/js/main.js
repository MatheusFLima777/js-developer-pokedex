const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const typeNav = document.getElementById('typeNav');
const darkModeButton = document.getElementById('ModoEscuro');

const maxRecords = 300;
const limit = 30;
let offset = 0;

let currentTypeFilter = 'all';
let filteredPokemons = [];

function convertPokemonToCard(pokemon) {
  return `
    <li class="pokemon" data-type="${pokemon.types.join(', ')}">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>

      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<u class="type ${type}">${type}</u>`).join('')}
        </ol>

        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToCard).join('');
    pokemonList.innerHTML += newHtml;
  });
}

function loadAllPokemons() {
  offset = 0;
  pokemonList.innerHTML = '';
  loadMoreButton.style.display = 'block';
  currentTypeFilter = 'all';
  loadPokemonItens(offset, limit);
}

// Nova função: carregar todos e filtrar localmente
function loadPokemonsByType(type) {
  pokeApi.getPokemons(0, maxRecords).then((pokemons = []) => {
    filteredPokemons = pokemons.filter(pokemon => pokemon.types.includes(type));

    offset = 0;
    pokemonList.innerHTML = '';

    const paginated = filteredPokemons.slice(offset, offset + limit);
    const newHtml = paginated.map(convertPokemonToCard).join('');
    pokemonList.innerHTML += newHtml;

    if (filteredPokemons.length <= limit) {
      loadMoreButton.style.display = 'none';
    } else {
      loadMoreButton.style.display = 'block';
    }
  });
}

// Botão de "gerar mais"
loadMoreButton.addEventListener('click', () => {
  offset += limit;

  if (currentTypeFilter === 'all') {
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItens(offset, limit);
    }
  } else {
    const paginated = filteredPokemons.slice(offset, offset + limit);
    const newHtml = paginated.map(convertPokemonToCard).join('');
    pokemonList.innerHTML += newHtml;

    if (offset + limit >= filteredPokemons.length) {
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    }
  }
});

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});
feather.replace();

// Filtro por tipo na navbar
typeNav.addEventListener('click', (e) => {
  e.preventDefault();

  const link = e.target.closest('a[data-type]');
  if (!link) return;

  const type = link.getAttribute('data-type');
  currentTypeFilter = type;

  if (type === 'all') {
    loadAllPokemons();
  } else {
    loadPokemonsByType(type);
  }
});

// Carrega a primeira página inicialmente
loadPokemonItens(offset, limit);
