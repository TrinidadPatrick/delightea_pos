import { View, Text } from 'react-native'
import { Redirect } from 'expo-router';
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const index = () => {

  return  (
    <View>
      <StatusBar hidden  />
      <Redirect href={"/(drawer)/home"} />
    </View>
    
  )
}

export default index