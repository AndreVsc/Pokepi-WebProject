// PokemonList.jsx
import React from 'react';
import StatBar from './StatBar'; // Importe o novo componente

function PokemonList({ data }) {
  return (
    <div>
      {data.map((item, index) => (
        <StatBar
          key={index}
          label={item.stat.name}
          value={item.base_stat}
          max={255} // Valor máximo de uma stat (ajuste conforme necessário)
        />
      ))}
    </div>
  );
}

export default PokemonList;
