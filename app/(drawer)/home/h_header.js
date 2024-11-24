import { Text, View } from 'react-native'
import React, { Component } from 'react'

export class HomeHeader extends Component {
  render() {
    return (
      <View className="flex w-full flex-row bg-white p-3  justify-center items-center">
        <Text>h_header</Text>
      </View>
    )
  }
}

export default HomeHeader