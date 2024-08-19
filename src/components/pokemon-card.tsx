import React from "react"
import { StyleSheet, Text, View } from "react-native"

import { Pokemon } from "../models"
import { Colors } from "../utils"


interface IProps {
  item: Pokemon
  isFirst?: boolean
}

export const PokemonCard: React.FunctionComponent<IProps> =
  ({ item, isFirst = false }) => {
    return (
      <View style={[styles.card, isFirst && styles.first]}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.url}>{item.url}</Text>
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
