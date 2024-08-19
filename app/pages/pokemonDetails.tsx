import {DefaultError, InfiniteData, useInfiniteQuery} from "@tanstack/react-query"
import React from "react"
import {ActivityIndicator, FlatList, StyleSheet} from "react-native"
import {useSafeAreaInsets} from "react-native-safe-area-context"

import {PokemonService} from "../../src/services"
import {PageContainer} from "../../src/components"
import {PokemonDetailsModel} from "../../src/models/pokemonDetailsModel";
import {PokemonDetailsCard} from "../../src/components/pokemon-detail-card";

const PAGE_SIZE = 20

export default function Page() {
  const insets = useSafeAreaInsets()

  const {data, isLoading} =
    useInfiniteQuery<
      PokemonDetailsModel,
      DefaultError,
      InfiniteData<PokemonDetailsModel, number>,
      string[],
      number
    >({
      queryKey: ['pokemon'],
      queryFn: ({pageParam}) => PokemonService.getPokemon({
        id: 1
      }),
      initialPageParam: 0,
      getNextPageParam: (_, allPages) => allPages.length * PAGE_SIZE
    })

  return (
    <PageContainer title="Pokemons">
      {isLoading && <ActivityIndicator/>}
      {!isLoading && (
        <FlatList
          data={data?.pages.flat()}
          contentContainerStyle={[styles.contentContainerStyle, {
            paddingBottom: insets.bottom
          }]}
          renderItem={
            ({item, index}) => (
              <PokemonDetailsCard item={item} isFirst={index === 0}/>
            )
          }
        />
      )}
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  }
})
