import React from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import { DefaultError, useQuery } from "@tanstack/react-query";
import { PokemonService } from "../services";


interface Props {
  type: string
}


export const PokemonType: React.FunctionComponent<Props> =
  ({type}) => {
    const {data: pokemonTypeUrl, isLoading} =
      useQuery<string, DefaultError, string>({
        queryKey: ['pokemonTypes', type],
        queryFn: () => PokemonService.getPokemonTypeUrl({
          type
        })
      })

    return (
      <View>
        {isLoading && <ActivityIndicator/>}
        {!isLoading && pokemonTypeUrl && (<Image
          style={[styles.icon]}
          source={{
            uri: pokemonTypeUrl,
          }}
        />)}
      </View>
    )

  }

const styles = StyleSheet.create({
  icon: {
    height: 16,
    width: 88,
    marginRight: 16
  }
})
