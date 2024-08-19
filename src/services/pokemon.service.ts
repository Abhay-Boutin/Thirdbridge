import axios from "axios";

 class PokemonServiceImpl {
  async getPokemons(
    { limit = 20, offset = 0 }: { limit?: number; offset?: number }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      );
    return response.data.results;
  }
}

export const PokemonService = new PokemonServiceImpl();
