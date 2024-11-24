import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
export default function Layout() {
    return (    
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="home" options={{ drawerLabel: 'Home', title: '' }} />
            <Drawer.Screen name="products/index" options={{ drawerLabel: 'Products', title: 'Products' }} />
            <Drawer.Screen name="data/index" options={{ drawerLabel: 'Data', title: 'Data' }} />
        </Drawer>
    </GestureHandlerRootView>
      );
}