import axios from "axios";
import {PokemonEvolutionChain} from "../models";

class PokemonServiceImpl {
  async getPokemons(
    {limit = 20, offset = 0}: { limit?: number; offset?: number }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      );
    return response.data.results;
  }

  async getPokemon(
    {name}: { name?: string; }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
    return response.data;
  }

  async getPokemonTypeUrl(
    {type}: { type?: string; }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
    return response.data.sprites["generation-viii"]["sword-shield"]["name_icon"]
  }

  async getPokemonEvolutions(
    {name: pokemonNome}: { name?: string; }
  ) {
    const speciesResponse =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonNome}`
      );
    const evolutionChainResponse =
      await axios.get(
        `${speciesResponse.data["evolution_chain"].url}`
      );

    const pokemon = searchEvolutionChainForPokemon(evolutionChainResponse.data["chain"], pokemonNome)

    const allEvolution: Array<{ name: string, url: string }> = []
    if (pokemon) {
      for (const evolution of pokemon["evolves_to"]) {
        allEvolution.push({name: evolution.species.name, url: evolution.species.url});
      }
    }
    return allEvolution;
  }
}

const searchEvolutionChainForPokemon = (pokemonEvolutionChain: PokemonEvolutionChain, pokemonName?: string): PokemonEvolutionChain | undefined => {
  if (pokemonEvolutionChain.species.name == pokemonName) {
    return pokemonEvolutionChain;
  } else if (pokemonEvolutionChain["evolves_to"]) {
    let result = undefined;
    for (const evolutions of pokemonEvolutionChain["evolves_to"]) {
      result = searchEvolutionChainForPokemon(evolutions, pokemonName);
    }
    return result;
  }
  return undefined;
}

export const PokemonService = new PokemonServiceImpl();
