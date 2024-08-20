import {DefaultError, useQuery} from "@tanstack/react-query"
import React from "react"
import {ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native"

import {PokemonService} from "../../src/services"
import {PageContainer, PokemonCard} from "../../src/components"
import {useLocalSearchParams} from "expo-router";
import {PokemonDetailsModel} from "../../src/models/pokemonDetailsModel";
import {Colors} from "../../src/utils";

const MIN_IMAGE_SIZE = 32

type SearchParamType = {
  name: string;
};


export default function Page() {
  const [scrollYPosition, setScrollYPosition] = React.useState(0)
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
    const newScrollYPosition = event.nativeEvent.contentOffset.y
    setScrollYPosition(newScrollYPosition)
  };

  const params = useLocalSearchParams<SearchParamType>();
  const {name} = params;

  const {data, isLoading} =
    useQuery<PokemonDetailsModel, DefaultError, PokemonDetailsModel>({
      queryKey: ['pokemon', name], queryFn: () => PokemonService.getPokemon({
        name
      })
    })


  const headerImageSize = () => {
    const originalSize = windowHeight * 0.25
    const resizedSize = originalSize * (1 - scrollYPosition / windowHeight)
    return resizedSize <= MIN_IMAGE_SIZE ? MIN_IMAGE_SIZE : resizedSize
  }

  const paddingRight = () => {
    const padding = (1 - scrollYPosition / windowHeight) * (windowWidth / 6)
    return padding <= 0 ? 0 : padding
  }


  return (
    <PageContainer
      paddingBottom={headerImageSize() - MIN_IMAGE_SIZE}
      title={name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown pokemon"}
      rightComponent={data &&
          <Image
              style={[styles.smallImage, {
                height: headerImageSize(),
                width: headerImageSize(),
                position: "absolute",
                top: -10,
                right: paddingRight(),
              }]}
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
              data?.moves.slice(0, 5).map(({move}, index) =>
                <PokemonCard key={index}
                             item={{name: move.name, url: move.url}}
                             isFirst={index === 0}/>)
            }
            <Text style={styles.title}>Evolutions</Text>
          </View>
        )}
      </ScrollView>
    </PageContainer>
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
    alignSelf: "flex-end",
  },
  type: {
    paddingRight: 16
  }
})
