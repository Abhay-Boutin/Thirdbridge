import {DefaultError, useQuery} from "@tanstack/react-query"
import React from "react"
import {ActivityIndicator, FlatList, Image, StyleSheet, Text, View} from "react-native"

import {PokemonService} from "../../src/services"
import {PokemonCard} from "../../src/components"
import {useLocalSearchParams} from "expo-router";
import {PokemonDetailsModel} from "../../src/models/pokemonDetailsModel";
import {Colors} from "../../src/utils";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PageContainerDetails} from "../../src/components/page-container-details";

type SearchParamType = {
  id: string;
  name: string;
};

export default function Page() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<SearchParamType>();
  const {id, name} = params;

  const {data, isLoading} =
    useQuery<PokemonDetailsModel, DefaultError, PokemonDetailsModel>({
      queryKey: ['pokemon', id], queryFn: () => PokemonService.getPokemon({
        id: id
      })
    })


  return (
    <PageContainerDetails
      isScrolled={true}
      title={name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown pokemon"}
      rightComponent={data && <Image
          style={styles.smallImage}
          source={{
            uri: data.sprites.front_default,
          }}
      />
      }>
      {isLoading && <ActivityIndicator/>}
      {!isLoading && data && (
        <View>
          <FlatList
            horizontal
            data={data.types.flat()}
            contentContainerStyle={[styles.contentContainerStyle, {
              paddingBottom: insets.bottom
            }]}
            renderItem={
              ({item}) => (
                <Text style={styles.title}>{item.type.name}</Text>
              )
            }
          />
          <Text style={styles.title}>First 5 moves</Text>
          <FlatList
            data={data?.moves.slice(0, 5).flat()}
            contentContainerStyle={[styles.contentContainerStyle, {
              paddingBottom: insets.bottom
            }]}
            renderItem={
              ({item, index}) => (
                <PokemonCard item={{name: item.move.name, url: item.move.url}} isFirst={index === 0}/>
              )
            }
          />
        </View>
      )}
    </PageContainerDetails>
  )
}


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24.2,
    marginLeft: 15,
  },
  contentContainerStyle: {
    padding: 16,
  },
  card: {
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
  },
  smallImage: {
    height: 32,
    width: 32,
    alignItems: "flex-end"
  }
})
