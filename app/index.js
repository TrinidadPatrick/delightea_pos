import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, Stack } from 'expo-router'
import '../global.css'
import { StatusBar } from 'expo-status-bar'
import * as ScreenOrientation from 'expo-screen-orientation';

const index = () => {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <View>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
        <StatusBar hidden={true} />
        <Redirect href="/(drawers)" />
    </View>
    
  )
}

export default index