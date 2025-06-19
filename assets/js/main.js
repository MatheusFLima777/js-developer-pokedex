const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const typeNav = document.getElementById('typeNav');
const darkModeButton = document.getElementById('ModoEscuro');

const maxRecords = 151;
const limit = 10;
let offset = 0;

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
  pokemonList.innerHTML = ''; // limpa a lista
  loadMoreButton.style.display = 'block'; // mostra o botão
  isFiltering = false;
  loadPokemonItens(offset, limit);
}

loadPokemonItens(offset, limit);



loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNextPage = offset + limit;

  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
  });
  feather.replace()

  typeNav.addEventListener('click', (e) => {
    e.preventDefault();
  
    // Procura o elemento <a> clicado (ou que envolva o clique)
    const link = e.target.closest('a[data-type]');
    if (!link) return; // clique fora dos links ignorado
  
    const type = link.getAttribute('data-type');
  
    if (type === 'all') {
      loadAllPokemons();
    } else {
      loadPokemonsByType(type);
    }
  });
  