import { useQuery } from "@tanstack/react-query"
import React from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native"

import { PokemonService } from "../../src/services"
import { PageContainer, PokemonCard, PokemonTypeIcon } from "../../src/components"
import { Link, useLocalSearchParams } from "expo-router"
import { PokemonDetailsModel } from "../../src/models"
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_IMAGE_SIZE = 32
const MAX_IMAGE_SIZE_PERCENTAGE = 0.25
const MIN_PADDING_RIGHT = 0
const MIN_PADDING_TOP = -10
const MAX_MOVE_COUNT = 5

type SearchParamType = {
  pokemonName: string
}


export default function Page() {
  const insets = useSafeAreaInsets()
  const [scrollYPosition, setScrollYPosition] = React.useState(0)
  const {width: windowWidth, height: windowHeight} = useWindowDimensions()
  const {pokemonName} = useLocalSearchParams<SearchParamType>()

  const {data: pokemonDetails, isLoading: isLoadingPokemonDetails} =
    useQuery<PokemonDetailsModel>({
      queryKey: ['pokemonDetails', pokemonName], queryFn: () => PokemonService.getPokemon({
        name: pokemonName
      })
    })
  const {data: allEvolutions, isLoading: isLoadingAllEvolutions} =
    useQuery<Array<{ name: string, url: string }>>({
      queryKey: ['pokemonEvolution', pokemonName], queryFn: () => PokemonService.getPokemonEvolutions({
        name: pokemonName
      })
    })

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newScrollYPosition = event.nativeEvent.contentOffset.y
    setScrollYPosition(newScrollYPosition)
  }

  // COMMENT ONLY FOR TECHNICAL TEST: Maybe extract this and the image in another component, but it is only used here once for now
  const getDynamicStyles = () => {
    const originalSize = windowHeight * MAX_IMAGE_SIZE_PERCENTAGE
    const scrollPercentage = (scrollYPosition / windowHeight)
    const resizedSize = originalSize * (1 - scrollPercentage)
    const padding = ((windowWidth / 2) - (resizedSize / 2)) * (1 - scrollPercentage)
    return {
      imageSize: resizedSize <= MIN_IMAGE_SIZE ? MIN_IMAGE_SIZE : resizedSize,
      paddingRight: scrollPercentage > 1 ? MIN_PADDING_RIGHT : padding,
      paddingTop: scrollPercentage > 1 ? MIN_PADDING_TOP : scrollPercentage * MIN_PADDING_TOP,
    }
  }
  const {imageSize, paddingRight, paddingTop} = getDynamicStyles()

  return (
    <PageContainer
      paddingBottom={imageSize - MIN_IMAGE_SIZE}
      title={pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : "Unknown pokemon"}
      rightComponent={pokemonDetails &&
          <Image
              style={[styles.pokemonImage, {
                height: imageSize,
                width: imageSize,
                top: paddingTop,
                right: paddingRight,
              }]}
              source={{
                uri: pokemonDetails.sprites.front_default,
              }}
          />
      }>
      <ScrollView scrollEventThrottle={20} onScroll={handleScroll}>
        {isLoadingPokemonDetails || isLoadingAllEvolutions && <ActivityIndicator/>}
        {!isLoadingPokemonDetails && !isLoadingAllEvolutions && (
          <View style={[styles.contentContainerStyle, {paddingBottom: insets.bottom}]}>
            <FlatList
              horizontal
              data={pokemonDetails?.types.flat()}
              renderItem={
                ({item}) => (
                  <PokemonTypeIcon type={item.type.name}/>
                )
              }
            />
            <Text style={styles.title}>First 5 moves</Text>
            {
              pokemonDetails?.moves.slice(0, MAX_MOVE_COUNT).map(({move}, index) =>
                <PokemonCard key={index}
                             item={{name: move.name, url: move.url}}
                             isFirst={index === 0}/>)
            }
            {
              allEvolutions && allEvolutions.length > 0 && (
                <Text style={styles.title}>Evolutions</Text>
              )
            }
            {
              allEvolutions?.map(({name: evolutionName, url}, index) =>
                <Link push key={index} href={{
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
  pokemonImage: {
    position: "absolute",
    alignSelf: "flex-end",
  },
})
