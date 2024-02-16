import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apFetch from '../api/config';
import './Pokedex.css';
import pokepi from '../assets/Pokepi.png';

function Pokedex() {
  const [poke, setPoke] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pokemonsPerPage = 8;
  const [search, setSearch] = useState('');
  const [filterPokemons, setFilterPokemons] = useState([]);

  function searchPokemons() {
    if(search !== ''){
      const filteredPokemons = poke.filter(pokemon => pokemon.name.toLowerCase().includes(search.toLowerCase()))
      setFilterPokemons(filteredPokemons)
    }
    else{
      setFilterPokemons(poke)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apFetch.get("/pokemon-form?limit=151");
        const data = response.data.results;
        const requests = data.map(pokemon => apFetch.get(`/pokemon-form/${pokemon.name}`));
        const responses = await Promise.all(requests);
        const pokemonData = responses.map(response => response.data);
        setPoke(pokemonData);
        setFilterPokemons(pokemonData)
      } catch (error) {
        console.log("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

useEffect(() => {
  searchPokemons()
},[search]);

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  // Lógica para a paginação
  const indexOfLastPokemon = (currentPage + 1) * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filterPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(filterPokemons.length / pokemonsPerPage);

  // Função para renderizar os botões de paginação
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 0; i < totalPages; i++) {
      if(i === currentPage || i === currentPage - 1 || i === currentPage + 1 || i === totalPages){
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i + 1}
          </button>
        );
      }
      else if (buttons[buttons.length - 1] !== '...'){
        buttons.push('...')
      }
    }

    return buttons;
  };

  // Função para alterar a página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id='pokecontainer'>
      <div className='pokenav'>
        <img src={pokepi} alt='Pokepi' />
      </div>
      <div className='inputbox'>
        <span class="material-symbols-outlined">search</span>
        <input type="text" placeholder='Faça sua pesquisa' value={search} onChange={e => setSearch(e.target.value)}/>
      </div>
      <ul className='loading'>
        {currentPokemons.length === 0 ? 'Carregando...' : currentPokemons.map((pokemon, index) => (
          <PokeItem key={index} {...pokemon} />
        ))}
      </ul>
      {/* Controles de página */}
      <div className="pagination">
        {renderPaginationButtons()}
      </div>
    </div>
  );
}

function PokeItem({ name, id, types }) {
  // Função para obter a cor com base no tipo
  const getTypeColor = (type) => {
    switch (type) {
      case 'grass':
        return '#9bcc50 ';
      case 'fire':
        return '#fd7d24';
      case 'water':
        return '#4592c4';
      case 'bug':
        return '#729f3f';
      case 'rock':
        return '#a38c21';
      case 'poison':
        return '#b97fc9';
      case 'steel':
        return '#9eb7b8';
      case 'ghost':
        return '#7b62a3';
      case 'ground':
        return '#ab9842';
      case 'fighting':
        return '#d56723';
      case 'normal':
        return '#a4acaf';
      case 'ice':
        return '#51c4e7';
      case 'psychic':
        return '#f366b9';
      case 'electric':
        return '#eed535';
      case 'dark':
        return '#707070';
      case 'flying':
        return '#707070';
      case 'fairy':
        return '#fdb9e9';
      case 'dragon':
        return '#53a4cf';
      // Adicione mais tipos conforme necessário
      default:
        return 'gray';
    }
  };

  // Obtém a cor do primeiro tipo do Pokémon (pode ser ajustado conforme necessário)
  const backgroundColor = getTypeColor(types[0].type.name);

  const typeBoxes = types.map((typeData, index) => (
    <div key={index} className='tipobox' style={{ backgroundColor: getTypeColor(typeData.type.name) }}>
      {typeData.type.name}
    </div>
  ));

  return (
    <div id='box-pokemon'>
      <li>
        <h2>{name}</h2>
        <Link to={`/${name}`}>
          <img className="poketure" alt={name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} />
        </Link>
        <div className='tipo'>
          {typeBoxes}
        </div>
      </li>
    </div>
  );
}

export default Pokedex;
