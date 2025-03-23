import { View, Text } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Stack, useFocusEffect } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import * as ScreenOrientation from 'expo-screen-orientation';

const _layout = () => {

  
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Home', headerShown: false, drawerLabel: 'Home' }} />
      <Drawer.Screen name="Products" options={{ title: 'Products', headerShown: false }} />
      <Drawer.Screen name="Reports"  options={{ title: "Reports", headerShown: true }} />
      <Drawer.Screen name="Expenses"  options={{ title: "Expenses", headerShown: true }} />
    </Drawer>
  )
}

export default _layout