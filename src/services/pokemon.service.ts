import axios from "axios";

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
}

export const PokemonService = new PokemonServiceImpl();
