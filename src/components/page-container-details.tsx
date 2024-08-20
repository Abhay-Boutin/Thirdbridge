import {useNavigation} from "expo-router"
import React, {FunctionComponent, PropsWithChildren} from "react"
import {Pressable, StyleSheet, Text, View} from "react-native"
import {useSafeAreaInsets} from "react-native-safe-area-context"

import {Colors} from "../utils"

type Props = {
  title: string
  rightComponent?: React.ReactNode
  isScrolled?: boolean
}

export const PageContainerDetails: FunctionComponent<PropsWithChildren<Props>> =
  ({children, isScrolled = false, title, rightComponent = <View/>}) => {
    const insets = useSafeAreaInsets()
    const {goBack} = useNavigation()

    return (
      <>
        <View style={[styles.header, {paddingTop: insets.top}]}>
          <Pressable onPress={goBack} style={[styles.button, isScrolled && styles.part]}>
            <Text style={styles.back}>
              ← Back
            </Text>
          </Pressable>
          <Text style={[styles.title, isScrolled && styles.part]}>{title}</Text>
          <View style={isScrolled && styles.part}>
            {!isScrolled && rightComponent}
          </View>
        </View>
        {children}
      </>
    )
  }

const styles = StyleSheet.create({
  back: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  button: {
    paddingVertical: 16
  },
  header: {
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderColor: Colors.GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  part: {
    flex: 1,
  },
})
