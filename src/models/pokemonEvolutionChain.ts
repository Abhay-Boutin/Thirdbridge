export type PokemonEvolutionChain = {
  is_baby: boolean
  species: {
    name: string
    url: string
  }
  evolves_to: Array<PokemonEvolutionChain>
}
