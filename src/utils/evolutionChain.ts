import { PokemonEvolutionChain } from "../models";

export const searchEvolutionChainForPokemon = (pokemonEvolutionChain: PokemonEvolutionChain, pokemonName?: string): PokemonEvolutionChain | undefined => {
  if (pokemonEvolutionChain.species.name == pokemonName) {
    return pokemonEvolutionChain
  } else if (pokemonEvolutionChain["evolves_to"]) {
    let result = undefined
    for (const evolution of pokemonEvolutionChain["evolves_to"]) {
      result = searchEvolutionChainForPokemon(evolution, pokemonName)
    }
    return result
  }
  return undefined
}

export const getAllEvolutions = (pokemonEvolutionChain: PokemonEvolutionChain): Array<{
  name: string,
  url: string
}> => {
  if (pokemonEvolutionChain["evolves_to"]) {
    let result: Array<{ name: string, url: string }> = []
    for (const evolution of pokemonEvolutionChain["evolves_to"]) {
      result.push({name: evolution.species.name, url: evolution.species.url})
      result = result.concat(getAllEvolutions(evolution))
    }
    return result
  }
  return []
}