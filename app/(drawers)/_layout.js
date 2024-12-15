import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'

const _layout = () => {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Home', headerShown: false, drawerLabel: 'Home' }} />
      <Drawer.Screen name="Products" options={{ title: 'Products', headerShown: false }} />
    </Drawer>
  )
}

export default _layout