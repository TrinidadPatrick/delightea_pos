import { View, Text } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from "@react-navigation/drawer";

const Data = () => {
  return (
    <Drawer.Screen
    options={{
        title: "Data",
        headerShown: true,
        headerLeft: () => <DrawerToggleButton />
    }}
    />
  )
}

export default Data