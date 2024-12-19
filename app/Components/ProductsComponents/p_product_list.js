import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import CategoryStore from '../../../store/categoryStore'
import ProductStore from '../../../store/ProductStore'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const P_product_list = () => {
  const {Categories, setCategories} = CategoryStore()
  const {Products} = ProductStore()

  const [structuredProducts, setStructureProducts] = useState([])

  const handleDestructure = () => {
    return Categories?.filter((category_t)=> category_t.category_name !== 'All').map((category) => ({
      category_name: category.category_name,
      products: Products?.filter((product) => product.category_id._id === category._id),
    }));
  };
  
  

  useEffect(() => {
    setStructureProducts(handleDestructure())
  }, [Products, Categories])

  console.log(structuredProducts)
  return (
    <View className="flex-1 ">
      <ScrollView contentContainerStyle={{gap: 5}} className="flex-1 p-3">
        {
          structuredProducts?.map((category, index) => {
            return (
            <View className={` ${category.products.length <= 0 && 'hidden'}  flex flex-col justify-start items-start`} key={index}>
              {
                category.products.length > 0 &&
                <View className="flex-1 h-fit p-0 flex flex-col justify-start items-start">
                <Text className="text-center text-lg font-bold text-gray-700">{category?.category_name}</Text>
                <View className="w-full flex-1">
                  {
                    category?.products?.map((product, index) => {
                      return (
                        <View className="flex-1 w-full h-fit py-3 px-2 bg-white flex flex-row justify-between items-start" key={index}>
                          <View className="flex flex-col">
                          <Text className="text-start w-[150px] text-gray-800 font-medium">{product.product_name}</Text>
                          <Text className="text-sm text-gray-600">
                          { 
                            product?.product_price 
                              ? `₱${product.product_price}` 
                              : `₱${product?.variants[0]?.variant_price} - ₱${product?.variants?.at(-1)?.variant_price}` 
                          }
                          </Text>
                          </View>
                          {/* Status */}
                          <View className="h-full  flex flex-col justify-center">
                            <Text className={`${product.status === 'active' ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>{product.status.toUpperCase()}</Text>
                          </View>
                          {/* Action buttons */}
                          <View className="flex flex-row h-full items-center">
                            <TouchableOpacity>
                              <FontAwesome6 name="trash-can" size={22} color="red" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
              }
            </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}

export default P_product_list