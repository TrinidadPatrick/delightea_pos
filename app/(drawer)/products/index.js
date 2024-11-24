import { Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function Products() {
  return <Drawer.Screen
  options={{
      title: "Products",
      headerShown: true,
      headerLeft: () => <DrawerToggleButton />
  }}
  />
}