export type PokemonDetailsModel = {
  sprites: {
    front_default: string
  }
  types: Array<type>
  moves: Array<move>
}

type move = {
  move: {
    name: string
    url: string
  },
}

type type = {
  slot: number
  type: {
    name: string
    url: string
  }
}