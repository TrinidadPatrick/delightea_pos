import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import CategoryStore from '../../../store/categoryStore'
import ProductStore from '../../../store/ProductStore'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ProductProvider from '../../../Hooks/ProductProvider'

const P_product_list = () => {
  const router = useRouter();
  const {Categories, setCategories} = CategoryStore()
  const {Products, setProducts} = ProductStore()
  const {getProducts} = ProductProvider()

  const [structuredProducts, setStructureProducts] = useState([])

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

  const handleDestructure = () => {
    return Categories?.filter((category_t)=> category_t.category_name !== 'All').map((category) => ({
      category_name: category.category_name,
      products: Products?.filter((product) => product.category_id._id === category._id),
    }));
  };
  
  const handleDeleteProduct = async (_id, product) => {
    Alert.alert(
      'Confirm delete',
      'Are you sure you want to delete ' + product + '?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await http.delete('deleteProduct/'+_id);
              const productsData = await getProducts()
              setProducts(productsData.products)
              showToast('Product deleted successfully')
            } catch (error) {
              console.log(error)
            }
          },
          style: 'cancel',
        },
      ],
      {
        cancelable: true
      },)
    
  }

  useEffect(() => {
    if (Categories !== null && Products !== null) {
      setStructureProducts(handleDestructure())
    }
  }, [Products, Categories])

  return (
    <View className="flex-1 ">
      <ScrollView contentContainerStyle={{gap: 5}} className="flex-1 p-3">
        {
          structuredProducts?.map((category, index) => {
            return (
            <View className={` ${category?.products?.length <= 0 && 'hidden'}  flex flex-col justify-start items-start`} key={index}>
              {
                category?.products?.length > 0 &&
                <View className="flex-1 h-fit p-0 flex flex-col justify-start items-start">
                <Text className="text-center text-lg font-bold text-gray-700">{category?.category_name}</Text>
                <View className="w-full flex-1">
                  {
                    category?.products?.length !== 0 && category?.products?.map((product, index) => {
                      return (
                        <TouchableOpacity onPress={()=>router.push({pathname: '/Components/ProductsComponents/p_edit_product', params: {product : JSON.stringify(product)}})} className="flex-1 w-full h-fit py-3 px-2 bg-white flex flex-row justify-between items-start" key={index}>
                          <View className="flex flex-col">
                          <Text className="text-start w-[150px] text-gray-800 font-medium">{product?.product_name}</Text>
                          <Text className="text-sm text-gray-600">
                            {
                              product?.variants?.length !== 0 && product?.variants[0]?.variant_price !== null ?
                              `₱${product.variants[0]?.variant_price} - ₱${product.variants.slice(-1)[0]?.variant_price}`
                              : `₱${product.product_price}`
                            }
                          </Text>
                          </View>
                          {/* Status */}
                          <View className="h-full  flex flex-col justify-center">
                            <Text className={`${product?.status === 'active' ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>{product?.status?.toUpperCase()}</Text>
                          </View>
                          {/* Action buttons */}
                          <View className="flex flex-row h-full items-center">
                            <TouchableOpacity className="w-[50px]  flex flex-row justify-center items-center" onPress={()=>handleDeleteProduct(product._id, product.product_name)}>
                              <FontAwesome6 name="trash-can" size={22} color="red" className="text-center" />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
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