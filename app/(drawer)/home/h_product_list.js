import { View, Text } from 'react-native'
import React from 'react'
import HomeHeader from './h_header'

const HomeProductList = () => {
  return (
    <View className="w-[70%] flex flex-col bg-[#f9f9f9] h-full p-3  justify-start items-center">
      <HomeHeader />
    </View>
  )
}

export default HomeProductList