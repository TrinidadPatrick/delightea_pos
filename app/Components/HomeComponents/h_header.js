import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { Component, useEffect } from 'react'
import Categories from '../../../data/CategoryList'
import '../../../global.css'
import CategoryStore from '../../../store/categoryStore'


const HomeHeader = ({selectedCategory, setSelectedCategory}) => {
  const {Categories} = CategoryStore()

  useEffect(() => {
    Categories !== null && setSelectedCategory(Categories[0]?.category_name);
  }, [Categories]);
  
  return (
  <View className="w-full  p-1 h-[50px] flex flex-row justify-center items-center">
    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{display: 'flex', flexDirection: 'row', gap: 10}} className=" w-full h-full ">
      {
        Categories?.map((category, index) => {
          return (
            <TouchableOpacity onPress={()=>setSelectedCategory(category.category_name)} className={`w-[100px] h-[40px] ${selectedCategory == category.category_name ? ' bg-theme-medium text-white' : 'bg-white'} shadow rounded flex flex-row justify-center items-center`} key={index}>
              <Text className={`text-center ${selectedCategory == category.category_name ? 'text-white' : 'text-black'}`}>{category.category_name}</Text>
            </TouchableOpacity>
          )
        })
      }
    </ScrollView>
    </View>
  )
}

export default HomeHeader