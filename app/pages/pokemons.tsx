import { DefaultError, InfiniteData, useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { PokemonService } from "../../src/services"
import { PageContainer, PokemonCard, PokemonsFooter } from "../../src/components"
import { Pokemon } from "../../src/models"
import { Link } from "expo-router";

const PAGE_SIZE = 20

export default function Page() {
  const insets = useSafeAreaInsets()

  const {data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage} =
    useInfiniteQuery<
      Pokemon,
      DefaultError,
      InfiniteData<Pokemon, number>,
      string[],
      number
    >({
      queryKey: ['pokemons'],
      queryFn: ({pageParam}) => PokemonService.getPokemons({
        limit: PAGE_SIZE,
        offset: pageParam
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
              <Link href={{
                pathname: "/pages/pokemonDetails",
                params: {pokemonName: item.name},
              }} asChild>
                <Pressable>
                  <PokemonCard item={item} isFirst={index === 0}/>
                </Pressable>
              </Link>
            )
          }
          ListFooterComponent={
            <PokemonsFooter
              isHidden={!hasNextPage}
              onPress={fetchNextPage}
              isLoading={isFetchingNextPage}
            />
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
