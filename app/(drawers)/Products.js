import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from "@react-navigation/drawer";
import ProductsHeader from '../Components/ProductsComponents/p_header';
import P_product_list from '../Components/ProductsComponents/p_product_list';
import WebView from 'react-native-webview';
import Constants from 'expo-constants';

export default function Products() {
  const { height, width } = Dimensions.get('window');

  return (
  <View className="flex-1 flex flex-col bg-[#f9f9f9]">
  <Drawer.Screen
  options={{
      title: "Products",
      headerShown: true,
      headerLeft: () => <DrawerToggleButton />
  }}
  />
  <ProductsHeader height={height} width={width} />
  <P_product_list />
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});