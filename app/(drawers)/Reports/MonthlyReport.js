import { View, Text, TouchableOpacity, Modal, Dimensions, FlatList, Button, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import http from '../../../http';
import { Dropdown } from 'react-native-element-dropdown';
import { Stack, useFocusEffect } from 'expo-router';
import { StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ScreenOrientation from 'expo-screen-orientation';
import dayjs from "dayjs";


const MonthlyReport = () => {
  const [monthFilter, setMonthFilter] = useState({
    month: dayjs().format("MMMM"),
    year: dayjs().year(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [monthlySales, setMonthlySales] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  useFocusEffect(
      useCallback(()=>{
          width > 900 ? ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE) : ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      },[])
  )

  const months = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August", 
  "September", "October", "November", "December"
  ];

  const years = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 
    2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 
    2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 
    2047, 2048, 2049, 2050
  ]

  function convertDate(data) {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const monthIndex = months.indexOf(data.month);
    if (monthIndex === -1) throw new Error("Invalid month");

    const startDate = new Date(data.year, monthIndex, 1, 0, 0, 0, 0);

    const endDate = new Date(data.year, monthIndex + 1, 0, 23, 59, 59, 999);

    return { startDate, endDate };
  }

  const adjustToUTC8 = (date) => {
    return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString();
  };

  const getMonthlyOrders = async () => {
    try {
      const dateValue = convertDate(monthFilter)
      const dateFilter = adjustToUTC8(new Date(dateValue.startDate)) + '/' + adjustToUTC8(new Date(dateValue.endDate));
      // const dateFilter = new Date(dateValue.startDate).toISOString() + '/' + new Date(dateValue.endDate).toISOString()
      const response = await http.get('getMonthlyOrders?date='+dateFilter);
      setMonthlySales(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>{setMonthFilter({...monthFilter, month : item}); setShowDatePicker(false)}} className="w-[100px] m-1 py-1.5 bg-[#f9f9f9] border border-gray-200 rounded-sm">
      <Text className="text-center text-gray-500">{item}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    getMonthlyOrders()
  },[monthFilter])

  return (
    <View className="flex-1 flex flex-col bg-[#f9f9f9]">
      <Stack.Screen options={{  headerShown: false }} />
      {/* header */}
        <View className="w-full flex flex-col h-[60px] bg-white p-2">
          <Text className="text-center text-gray-500">Select Date</Text>
          <TouchableOpacity onPress={()=>setShowDatePicker(true)} >
          <Text className="text-center font-medium text-gray-800">{dayjs(convertDate(monthFilter).endDate).format("MMMM, YYYY")}</Text>
          </TouchableOpacity>
        </View>
        {
          showDatePicker &&
          <TouchableOpacity onPress={()=>setShowDatePicker(false)} style={{width: width+15, height: height-100  , backgroundColor: 'rgba(0,0,0,0.5)'}} className=" absolute  top-0 left-0 z-[1000000] flex flex-col justify-center items-center">
          <View className="w-fit h-fit rounded bg-white px-4 py-5 flex flex-col gap-2 justify-center">
            <View className="flex-row gap-2 justify-between px-3">
              <TouchableOpacity onPress={()=> setMonthFilter({...monthFilter, year: parseInt(monthFilter.year) - 1})}>
                <AntDesign name="left" size={24} color="gray" />
              </TouchableOpacity>
              <Text className="text-lg text-center">{monthFilter.year}</Text>
              <TouchableOpacity onPress={()=> setMonthFilter({...monthFilter, year: parseInt(monthFilter.year) + 1})}>
                <AntDesign name="right" size={24} color="gray" />
          </TouchableOpacity>
            </View>
          
          <View className="flex-row gap-2">
          <FlatList
          data={months}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={2}
          />
            </View>
          </View>
          </TouchableOpacity>
        }
        <View className="w-full flex flex-col gap-3 justify-between items-center  py-3">
          <Text className="font-medium text-gray-500 text-lg">Total Monthly Sales: ₱{monthlySales?.reduce((acc, item) => acc + item?.totalSales, 0)}</Text>
          <Text className="font-medium text-red-500 text-lg">Total Expenses: ₱{monthlySales?.reduce((acc, item) => acc + item?.expense, 0)}</Text>
          <Text className="font-medium text-green-500 text-lg">Total Net Sales: ₱{monthlySales?.reduce((acc, item) => acc + item?.totalSales - item?.expense, 0)}</Text>
        </View>
      

      <View className="flex-1 flex flex-col ">
        <ScrollView>
          {
              monthlySales?.map((sale, index)=>{
                const [month, day, year] = sale?.date?.split("/");
                const formattedDate = dayjs(`${year}-${month}-${day}`).format("MMMM D, YYYY");
                return (
                  <TouchableOpacity onPress={()=>setSelectedIndex(index)} className={`flex-1 border border-gray-300 border-t-0 w-full h-fit py-5 px-2 ${selectedIndex == index ? "bg-gray-200" : "bg-white"} flex flex-row justify-between items-start`} key={index}>
                    <View className=" flex-1 flex flex-col">
                      <Text className="text-start w-[150px] text-gray-800 text-sm font-medium">{formattedDate}</Text>
                      <View className="flex-1   flex flex-row  justify-between items-center">
                      <View className=" w-[120px]">
                      <Text className="text-sm text-gray-600">
                        {
                          `Gross Sales: ₱${sale?.totalSales}`
                        }
                      </Text>
                      </View>
                      <View className=" w-[120px]">
                      <Text className="text-sm text-gray-600">
                        {
                          `Expenses: ₱${sale?.expense}`
                        }
                      </Text>
                      </View>
                      <View className="w-[120px] ">
                      <Text className="text-green-500 font-medium text-sm">
                        {
                          `Net Sale: ₱${sale?.dailySale}`
                        }
                      </Text>
                      </View>
                      </View>
                    </View>
                    <View className="h-full  flex flex-col justify-center">
                      <Text className={`${sale?.status === 'Done' ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>{sale?.status?.toUpperCase()}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
          }
        </ScrollView>
      </View>
      
    </View>
  )
}
export default MonthlyReport