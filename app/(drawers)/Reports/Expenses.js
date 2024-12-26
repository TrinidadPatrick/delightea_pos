import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Expenses = () => {
  return (
    <View className="flex-1 flex flex-col bg-white">
        <Stack.Screen options={{ headerShown: false }} />
      <Text>Expenses</Text>
    </View>
  )
}

export default Expenses