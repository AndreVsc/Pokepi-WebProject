import React, { useState, useEffect } from "react";
import apFetch from "../api/config";
import { Link } from "react-router-dom";

// css
import './PokemonEvol.css'

function PokemonEvol({ id }) {
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);

  useEffect(() => {
    const fetchPokeEvolution = async () => {
      try {
        const res = await apFetch.get(`evolution-chain/${id}`);
        setEvolution(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokeEvolution();
  }, [id]);

  useEffect(() => {
    const fetchEvolutionData = async () => {
      const names = getEvolutionNames(evolution.chain);
      const dataPromises = names.map((name) =>
        apFetch.get(`pokemon/${name.toLowerCase()}`)
      );

      try {
        const evolutionData = await Promise.all(dataPromises);
        setEvolutionData(evolutionData.map((res) => res.data));
      } catch (err) {
        setError(err);
      }
    };

    if (evolution.chain) {
      fetchEvolutionData();
    }
  }, [evolution]);

  const getEvolutionNames = (evolutionData) => {
    const names = [];

    if (evolutionData.species) {
      names.push(evolutionData.species.name);
    }

    if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
      for (const childEvolution of evolutionData.evolves_to) {
        names.push(...getEvolutionNames(childEvolution));
      }
    }

    return names;
  };

  if (loading) {
    return <h3>Carregando informações de evolução...</h3>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div>
      <ul className="evolucon">
        {evolutionData.map((data) => (
          <li key={data.id}>
            <Link to={`/${data.name}`}><img className="picevol" src={data.sprites.front_default} alt={data.name} /></Link>
            <p>{data.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonEvol;
