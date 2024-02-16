// Pokemon.jsx
import { useState, useEffect } from 'react';
import apFetch from '../api/config';
import { useParams } from 'react-router-dom';
import pokepi from '../assets/Pokepi.png';

// css
import './Pokemon.css';

// components
import PokemonList from '../components/PokemonList';
import PokemonEvol from '../components/PokemonEvol';

function Pokemon() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = [`pokemon-form/${id}`, `pokemon/${id}`, `pokemon-species/${id}`];
      try {
        const [pokemonResponse, additionalInfoResponse, speciesResponse] = await Promise.all(
          endpoints.map(endpoint => apFetch.get(endpoint))
        );
        setData({
          pokemon: pokemonResponse.data,
          additionalInfo: additionalInfoResponse.data,
          stats: additionalInfoResponse.data.stats,
          especies: speciesResponse.data,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <h3>Carregando...</h3>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  const { name, sprites, types } = data.pokemon || {};
  const { height, weight, id: pokemonId } = data.additionalInfo || {};
  const typeNames = types ? types.map((typeData) => typeData.type.name) : [];
  const especiesNum = data.especies.evolution_chain.url.replace("https://pokeapi.co/api/v2/evolution-chain/", "");

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

  return (
    <div id='pokekon'>
      <div>
        <div className='pokenav'>
          <img src={pokepi} alt='Pokepi' />
        </div>
        <div id='apresent'>
          <h2>{name}</h2>
          <div id='types'>
            {typeNames.map((type, index) => (
              <div
                key={index}
                className='typebox'
                style={{ backgroundColor: getTypeColor(type) }}
              >
                <div className='type'>{type}</div>
              </div>
            ))}
          </div>
          <img src={sprites ? sprites.front_default : ''} alt={name} />
        </div>
        <div id='dados'>
          <p>National №: #{("0000" + pokemonId).slice(-4)}</p>
          <p>Tamanho: {height}</p>
          <p>Peso: {weight}</p>
          <PokemonList id='pokemondata' data={data.stats || []} />
        </div>
        <div id='evolute'>
          <h3>Evoluções</h3>
          <PokemonEvol id={especiesNum} />
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
