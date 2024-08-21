import { DefaultError, useQuery } from "@tanstack/react-query"
import React from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native"

import { PokemonService } from "../../src/services"
import { PageContainer, PokemonCard } from "../../src/components"
import { Link, useLocalSearchParams } from "expo-router";
import { PokemonDetailsModel } from "../../src/models/pokemonDetailsModel";
import { PokemonType } from "../../src/components/pokemon-type";

const MIN_IMAGE_SIZE = 32

type SearchParamType = {
  pokemonName: string;
};


export default function Page() {
  const [scrollYPosition, setScrollYPosition] = React.useState(0)
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
    const newScrollYPosition = event.nativeEvent.contentOffset.y
    setScrollYPosition(newScrollYPosition)
  };

  const {pokemonName} = useLocalSearchParams<SearchParamType>();

  const {data: pokemonDetails, isLoading: isLoadingPokemonDetails} =
    useQuery<PokemonDetailsModel, DefaultError, PokemonDetailsModel>({
      queryKey: ['pokemon', pokemonName], queryFn: () => PokemonService.getPokemon({
        name: pokemonName
      })
    })

  const {data: allEvolutions, isLoading: isLoadingAllEvolutions} =
    useQuery<Array<{ name: string, url: string }>, DefaultError, Array<{ name: string, url: string }>>({
      queryKey: ['pokemonEvolution', pokemonName], queryFn: () => PokemonService.getPokemonEvolutions({
        name: pokemonName
      })
    })


  const getDynamicStyles = () => {
    const originalSize = windowHeight * 0.25
    const scrollPercentage = scrollYPosition / windowHeight
    const resizedSize = originalSize * (1 - scrollPercentage)
    const padding = ((windowWidth / 2) - (resizedSize / 2)) * (1 - scrollPercentage)
    return {
      imageSize: resizedSize <= MIN_IMAGE_SIZE ? MIN_IMAGE_SIZE : resizedSize,
      paddingRight: scrollPercentage > 1 ? 0 : padding,
      paddingTop: scrollPercentage > 1 ? -10 : scrollPercentage * -10,
    }
  }
  const {imageSize, paddingRight, paddingTop} = getDynamicStyles()

  return (
    <PageContainer
      paddingBottom={imageSize - MIN_IMAGE_SIZE}
      title={pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : "Unknown pokemon"}
      rightComponent={pokemonDetails &&
          <Image
              style={[styles.smallImage, {
                height: imageSize,
                width: imageSize,
                position: "absolute",
                top: paddingTop,
                right: paddingRight,
              }]}
              source={{
                uri: pokemonDetails.sprites.front_default,
              }}
          />
      }>
      <ScrollView onScroll={handleScroll}>
        {isLoadingPokemonDetails || isLoadingAllEvolutions && <ActivityIndicator/>}
        {!isLoadingPokemonDetails && !isLoadingAllEvolutions && (
          <View style={styles.contentContainerStyle}>
            <FlatList
              horizontal
              data={pokemonDetails?.types.flat()}
              renderItem={
                ({item}) => (
                  <PokemonType type={item.type.name}/>
                )
              }
            />
            <Text style={styles.title}>First 5 moves</Text>
            {
              pokemonDetails?.moves.slice(0, 5).map(({move}, index) =>
                <PokemonCard key={index}
                             item={{name: move.name, url: move.url}}
                             isFirst={index === 0}/>)
            }
            {allEvolutions && allEvolutions?.length > 0 && (<Text style={styles.title}>Evolutions</Text>)}
            {
              allEvolutions?.map(({name: evolutionName, url}, index) =>
                <Link key={index} href={{
                  pathname: "/pages/pokemonDetails",
                  params: {pokemonName: evolutionName},
                }} asChild>
                  <Pressable>
                    <PokemonCard
                      item={{name: evolutionName, url}}
                      isFirst={index === 0}/>
                  </Pressable>
                </Link>)
            }
          </View>
        )}
      </ScrollView>
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  title: {
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24.2,
  },
  contentContainerStyle: {
    padding: 16,
  },
  smallImage: {
    alignSelf: "flex-end",
  },
})
