import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="DailyReport" options={{ title: "Daily Report", tabBarIcon: () => <AntDesign name="areachart" size={24} color="black" /> }} />
      <Tabs.Screen name="MonthlyReport" options={{ title: "Monthly Report", tabBarIcon: () => <AntDesign name="areachart" size={24} color="black" /> }} />
      <Tabs.Screen name="Expenses" options={{ title: "Expenses" }} />
    </Tabs>
  );
}
