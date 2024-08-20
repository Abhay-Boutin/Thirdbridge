import {DefaultError, useQuery} from "@tanstack/react-query"
import React from "react"
import {ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View} from "react-native"

import {PokemonService} from "../../src/services"
import {PokemonCard} from "../../src/components"
import {useLocalSearchParams} from "expo-router";
import {PokemonDetailsModel} from "../../src/models/pokemonDetailsModel";
import {Colors} from "../../src/utils";
import {PageContainerDetails} from "../../src/components/page-container-details";

type SearchParamType = {
  id: string;
  name: string;
};


export default function Page() {
  const [scrollYPosition, setScrollYPosition] = React.useState(0)
  const windowHeight = Dimensions.get('window').height;

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
    const newScrollYPosition = event.nativeEvent.contentOffset.y
    setScrollYPosition(newScrollYPosition)
  };
  console.log(scrollYPosition)
  console.log("HEIGHT: " + windowHeight)
  console.log("Scroll percentage" + scrollYPosition / windowHeight)

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
      <ScrollView onScroll={handleScroll}>
        {isLoading && <ActivityIndicator/>}
        {!isLoading && data && (
          <View style={styles.contentContainerStyle}>
            <FlatList
              horizontal
              data={data.types.flat()}
              contentContainerStyle={styles.type}
              renderItem={
                ({item}) => (
                  <Text style={styles.title}>{item.type.name}</Text>
                )
              }
            />

            <Text style={styles.title}>First 5 moves</Text>
            {
              data?.moves.map(({move}, index) => <PokemonCard
                item={{name: move.name, url: move.url}} isFirst={index === 0}/>)
            }
            <Text style={styles.title}>Evolutions</Text>
          </View>
        )}
      </ScrollView>
    </PageContainerDetails>
  )
}


const styles = StyleSheet.create({
  title: {
    paddingTop: 10,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24.2,
  },
  contentContainerStyle: {
    padding: 16,
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
  },
  type: {
    paddingRight: 16
  }
})
