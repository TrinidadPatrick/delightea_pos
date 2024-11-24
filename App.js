import { StatusBar as MainStatusbar } from 'expo-status-bar';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export default function App() {

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <View className="flex-1" > 
      <Text className="text-red-500">Open up App.js to start working on your app!</Text>
      <MainStatusbar style="auto" />
    </View>
  );
}


