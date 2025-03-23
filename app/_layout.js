import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import http from '../http'

const _layout = () => {
  useEffect(() => {
    const keepAlive = async () => {
      try {
        const response = await http.get('getCategories');
      } catch (error) {
        console.log(error)
      }
    }

    const intervalId = setInterval(keepAlive, 120000);

    return () => clearInterval(intervalId);
  }, [])
  return (
    <Stack>
      <Stack.Screen name='(drawers)' options={{ title: 'Home', headerShown: false }} />
    </Stack>
  )
}

export default _layout