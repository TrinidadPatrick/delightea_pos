import { Pressable, Text, TouchableOpacity, View, Platform, Dimensions, StatusBar, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import HomeCartProducts from '../Components/HomeComponents/h_cart_products';
import HomeProductList from '../Components/HomeComponents/h_product_list';
import '../../global.css'
import { Stack, useRouter } from 'expo-router';
import CategoryProvider from '../../Hooks/CategoryProvider';
import CategoryStore from '../../store/categoryStore';
import AddonProvider from '../../Hooks/AddonProvider';
import AddonStore from '../../store/AddonStore';
import ProductStore from '../../store/ProductStore';
import ProductProvider from '../../Hooks/ProductProvider';
import CartStore from '../../store/CartStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import PendingOrdersProvider from '../../Hooks/PendingOrdersProvider';
import CurrentOrdersStore from '../../store/CurrentOrdersStore';

export default function Home() {
    const router = useRouter();
    const {pendingOrders} = PendingOrdersProvider()
    const {CurrentOrders, setCurrentOrders} = CurrentOrdersStore()
    const {Cart} = CartStore()
    const {categories} = CategoryProvider()
    const {Categories, setCategories} = CategoryStore()
    const {Addons, setAddons} = AddonStore()
    const {Products, setProducts} = ProductStore()
    const {products} = ProductProvider()
    const {addons} = AddonProvider()

    useEffect(() => {
      categories.length !== 0 && setCategories(categories);
    }, [categories]);

    useEffect(() => {
      addons.length !== 0 && setAddons(addons);
    }, [addons]);

    useEffect(() => {
      products.length !== 0 && setProducts(products);
    }, [products]);

    const TabHeader = () => {
      return (
        <View className="w-[100%] h-[45prx]  flex flex-row gap-2 items-center justify-between">
          {/* <Text className="font-medium text-lg">Delightea</Text> */}
          <View className=" w-[400px] bg-white rounded overflow-hidden shadow">
            <TextInput className="w-full bg-white" placeholder="Search item.." />
          </View>
          {/* View current Orders button */}
          <View className="flex-1 flex flex-row justify-end">
              <TouchableOpacity onPress={()=>router.push('/Components/CurrentOrdersComponents/CurrentOrders')} className="bg-white border relative border-gray-100 shadow-sm rounded-sm w-[50px] py-2 flex flex-row justify-center items-center">
                <AntDesign name="shoppingcart" size={27} color="gray" className=" w-[30px]" />
                <View className=" bg-red-500 rounded-full px-[6px] py-0.5 top-0.5 right-[7px] absolute">
                  <Text className="text-white text-xs ml-[1px]">{CurrentOrders?.length}</Text>
                </View>
              </TouchableOpacity>
          </View>
          <View className="flex flex-row gap-2 items-start justify-start w-[290px] px-5 ">
            <Text className="font-medium text-lg">Order ID: <Text className="text-gray-500">{Cart?.order_id}</Text></Text>
          </View>
        </View>
      )
    }


  return  (
  <View className="flex-1 flex flex-row bg-white">

    <Stack.Screen
    options={{
        title: "",
        headerShown: true,
        headerShadowVisible: false,
        // headerStyle: { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', elevation: 0, shadowOpacity: 0, backgroundColor: '#f9f9f9' },
        headerRight: () => <TabHeader />
    }}  
    />
    <HomeProductList />
    <HomeCartProducts />
  </View>
  
  )
}