import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { Component, useEffect } from 'react'
import Categories from '../../../data/CategoryList'
import '../../../global.css'
import CategoryStore from '../../../store/categoryStore'


const HomeHeader = ({selectedCategory, setSelectedCategory}) => {
  const {Categories} = CategoryStore()

  useEffect(() => {
    Categories !== null && setSelectedCategory(Categories[1]?._id);
  }, [Categories]);
  
  return (
  <View className="w-full  p-1 h-[50px] flex flex-row justify-center items-center">
    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{display: 'flex', flexDirection: 'row', gap: 10}} className=" w-full h-full ">
      {
        Categories?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((category, index) => {
          return (
            <TouchableOpacity onPress={()=>setSelectedCategory(category._id)} className={`w-[100px] h-[40px] ${selectedCategory == category._id ? ' bg-theme-medium text-white' : 'bg-white'} border border-gray-200 rounded flex flex-row justify-center items-center`} key={index}>
              <Text className={`text-center ${selectedCategory == category._id ? 'text-white' : 'text-gray-800'} font-bold`}>{category.category_name}</Text>
            </TouchableOpacity>
          )
        })
      }
    </ScrollView>
    </View>
  )
}

export default HomeHeader