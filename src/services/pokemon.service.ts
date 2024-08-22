import axios from "axios"
import { getAllEvolutions, searchEvolutionChainForPokemon } from "../utils"

class PokemonServiceImpl {
  async getPokemons(
    {limit = 20, offset = 0}: { limit?: number; offset?: number }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      )
    return response.data.results
  }

  async getPokemon(
    {name}: { name?: string }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      )
    return response.data
  }

  async getPokemonTypeUrl(
    {type}: { type?: string }
  ) {
    const response =
      await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      )
    return response.data.sprites["generation-viii"]["sword-shield"]["name_icon"]
  }

  async getPokemonEvolutions(
    {name: pokemonNome}: { name?: string }
  ) {
    const speciesResponse =
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonNome}`
      )
    const evolutionChainResponse =
      await axios.get(
        `${speciesResponse.data["evolution_chain"].url}`
      )

    const pokemon = searchEvolutionChainForPokemon(evolutionChainResponse.data["chain"], pokemonNome)

    return pokemon ? getAllEvolutions(pokemon) : []
  }
}

export const PokemonService = new PokemonServiceImpl()
