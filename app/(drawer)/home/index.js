import { Pressable, Text, TouchableOpacity, View, Platform, Dimensions, StatusBar } from 'react-native';
import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import HomeProductList from './h_product_list';
import HomeCartProducts from './h_cart_products';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from 'expo-router/drawer';
import '../../../global.css'
import { TextInput } from 'react-native-gesture-handler';

export default function Home() {

    useEffect(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, []);

    const TabHeader = () => {
      return (
        <View className="w-[95%] h-[45px] border border-[#f9f9f9] flex flex-row gap-5 items-center">
          {/* <Text className="font-medium text-lg">Delightea</Text> */}
          <View className=" w-[400px] bg-white rounded overflow-hidden shadow">
            <TextInput className="w-full bg-" placeholder="Search item.." />
          </View>
        </View>
      )
    }


  return  (
  <View className="flex-1 flex flex-row bg-white">

    <Drawer.Screen
    options={{
        title: "",
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', elevation: 0, shadowOpacity: 0, backgroundColor: '#f9f9f9' },
        headerLeft: () => <View className="shadow bg-white rounded"><DrawerToggleButton className="w-[50px] bg-white " /></View>,
        headerRight: () => <TabHeader />
    }}  
    />
    <HomeProductList />
    <HomeCartProducts />
  </View>
  
  )
}