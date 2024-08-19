import React from "react"
import {StyleSheet, Text, View} from "react-native"
import {Colors} from "../utils"
import {PokemonDetailsModel} from "../models/pokemonDetailsModel";


interface IProps {
  item: PokemonDetailsModel
  isFirst?: boolean
}

export const PokemonDetailsCard: React.FunctionComponent<IProps> =
  ({item, isFirst = false}) => {
    return (
      <View style={[styles.card, isFirst && styles.first]}>
        <Text style={styles.name}>{item.sprites.front_default}</Text>
        <Text style={styles.url}>{item.moves.flat().at(0).move.name}</Text>
        <Text style={styles.name}>{item.types.flat().at(0).type.name}</Text>
      </View>
    )
  }

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    padding: 8
  },
  first: {
    marginTop: 0
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  url: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4
  }
})
