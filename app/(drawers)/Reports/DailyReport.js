import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Stack, useFocusEffect, useRouter } from 'expo-router'
import DateTimePicker from 'react-native-modal-datetime-picker'
import http from '../../../http'
import { BarChart } from 'react-native-chart-kit'


const DailyReport = () => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState({name : new Date().toLocaleDateString('EN-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }), value : new Date()});
  const [orders, setOrders] = useState([]);
  const [netSales, setNetSales] = useState(0)
  const [topSellers, setTopSellers] = useState({labels: [], datasets: []})

  const data = {
    labels: ["Dark Chocolate", "Matcha", "Cookies & Cream", "Green Apple", "Strawberry"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
        colors: [
          () => `#A67B5B`, // Red
          () => `#A67B5B`, // Green
          () => `#A67B5B`, // Blue
          () => `#A67B5B`, // Orange
          () => `#A67B5B`, // Purple
        ],
      }
    ]
  };

  const handleConfirm = (date) => {
    const newDate = new Date(date);
    const dateString = {
      name : newDate.toLocaleDateString('EN-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }),
      value : newDate
    }
    setDate(dateString);
    setShowDatePicker(false);
    handleGetDailyOrders(dateString.value)
  }

  const handleGetDailyOrders = async (dateString) => {
        try {
          const result = await http.get('getDailyOrders/'+dateString);
          setOrders(result.data)
        } catch (error) {
          console.log(error.response)
        }
  }

  const handleComputeNetSales = () => {
    if(orders.length !== 0)
    {
      const totalNetSales = orders.filter((order)=> order.status == 'Done').reduce((acc, item) => acc + item.total_price, 0)
      setNetSales(totalNetSales)
      return
    }
    return setNetSales(0)
  }

  const handleGetTopSellers = async () => {
    if(orders.length !== 0)
    {
      const productSold = orders.filter((order)=> order.status == 'Done').map((item)=> (item.items))
      const items = productSold.flat()
      const allItems = items.map((item)=> ({item : item.product_name, quantity : item.quantity, color : '#A67B5B'}))
      const mergedItems = allItems.reduce((acc, item) => {
      const existingItem = acc.find((existingItem) => existingItem.item === item.item);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      const sortedItems = mergedItems.sort((a, b) => b.quantity - a.quantity).slice(0, 5)
      setTopSellers({labels: sortedItems.map((item)=> item.item), datasets: [{data: sortedItems.map((item)=> item.quantity), colors: sortedItems.map((item)=> (()=> item.color))}]})
      return
    }

    return setTopSellers({labels: [], datasets: []})
    
  }

  useFocusEffect(
    useCallback(()=>{
      handleGetDailyOrders(date.value)
    },[])
  )

  useEffect(()=>{
      handleComputeNetSales()
      handleGetTopSellers()
  }, [orders])


  return (
    <View className="flex-1 flex flex-col bg-[#f9f9f9]">
      <Stack.Screen options={{  headerShown: false }} />
      {/* header */}
      <View className="w-full flex flex-col h-[60px] bg-white p-2">
        <Text className="text-center text-gray-500">Select Date</Text>
        <TouchableOpacity onPress={()=>setShowDatePicker(true)} >
        <Text className="text-center font-medium text-gray-800">{date.name}</Text>
        </TouchableOpacity>
        <DateTimePicker onCancel={()=>setShowDatePicker(false)} onConfirm={handleConfirm} mode='date' isVisible={showDatePicker} date={date.value} />
      </View>
      {/* Body */}
      <View className="flex-1  mt-3 flex flex-row gap-3">
        {/* Order List */}
        <View className="flex-1 bg-white">
          <ScrollView className="flex-1">
            {
              orders.length !== 0 && orders?.map((order, index)=>{
                const dateCreated = new Date(order.created_at)
                const dateString = dateCreated.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'})
                const quantity = order.items.reduce((acc, item) => acc + item.quantity, 0)
                return (
                  <TouchableOpacity onPress={()=>router.push({pathname: '../../Components/OrderDetailReport/OrderDetailReport', params: {order : JSON.stringify(order)}})} key={index} className="flex flex-col gap-1 p-2 bg-white border-b-[1px] border-gray-200 rounded-md">
                    <View className="flex-1 flex flex-row justify-between">
                    <Text className={`font-medium w-[250px] ${order.status == 'Done' ? 'text-green-500' : 'text-red-500'} text-lg`}>{order.order_id}</Text>
                    <Text className="font-bold text-gray-800 text-lg">₱{order.total_price}</Text>
                    </View>
                    <Text className="text-gray-400">Created {dateString}</Text>
                    <Text className="text-gray-400">{quantity} items</Text>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
        {/* Charts */}
        <View className="flex-1 flex flex-col bg-white p-3">
          <View className="flex flex-row px-5">
            <View className="flex-1">
            <Text className="text-gray-800 font-medium">Net Sales: <Text className="text-gray-500">₱{netSales}</Text></Text>
            </View>
            <View className="flex-1">
            <Text className="text-gray-800 font-medium text-right">Expenses: <Text className="text-gray-500">₱0</Text></Text>
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-center text-sm text-gray-500">Gross Sales</Text>
            <Text className="text-center text-green-500 text-3xl font-medium">₱{netSales}</Text>
          </View>
          <View className="mt-3 flex-1 bg-white">
            {
              topSellers.datasets.length !== 0 ?
              <BarChart 
            height={260}
            data={topSellers}
            chartConfig={{
              useShadowColorFromDataset: false,
              fillShadowGradientOpacity:1,
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `black`,
              labelColor: (opacity = 1) => `black`,
              propsForBackgroundLines : {
                stroke : '#f1f1f1'
              },
              style: {
                borderRadius: 16
              },
              formatYLabel: (value) => parseInt(value).toString()
            }}
            xLabelsOffset={-10}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
            showBarTops={true}
            withCustomBarColorFromData={true}
            flatColor={true}
            width={460}
            />
            :
            <View className="flex-1 flex flex-col bg-white p-3 justify-center items-center">
              <Text className="text-center text-3xl text-gray-400">No data available</Text>
            </View>
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default DailyReport