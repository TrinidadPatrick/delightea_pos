import { View, Text, ScrollView, Touchable, TouchableOpacity, ToastAndroid } from 'react-native'
import React from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import dayjs from "dayjs";
import http from '../../../http';

const OrderDetailReport = () => {
    const {order} = useLocalSearchParams()
    const data = JSON.parse(order)

    const itemCount = data.items.reduce((acc, item) => acc + item.quantity, 0)
    const dateCreated = new Date(data.created_at)
    const dateString = dateCreated.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'})
    const formattedTime = dayjs(dateCreated).subtract(8, "hour").format("hh:mm A");
    const total = data.items.reduce((acc, item) => acc + item.total_price, 0)

    const deleteOrder = async () => {
        try {
            const response = await http.delete('deleteOrder/'+data._id);
            ToastAndroid.show('Order deleted successfully', ToastAndroid.SHORT);
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Error deleting order', ToastAndroid.SHORT);
        }
    }

  return (
    <View className="flex-1 flex flex-col bg-[#f9f9f9] p-3">
        <Stack.Screen options={{ title: data.order_id, headerShown: true }} />
    <View className="py-5 bg-white px-3 flex flex-row justify-between">
        <View>
        <Text className="text-sm text-gray-600">Created at {formattedTime}</Text>
        </View>
        
        <TouchableOpacity onPress={()=>{deleteOrder()}} className="text-sm text-gray-100 bg-red-500 py-1 px-2 rounded-sm">
            <Text className="text-sm text-gray-100">Delete</Text>
        </TouchableOpacity>
    </View>
    <View className="flex-1 flex flex-col gap-3 p-3 mt-3 bg-white">
        <Text className="text-sm"><Text className="text-sm text-gray-800 font-bold">{itemCount} items</Text> for {data.customer_name || 'N/A'}</Text>
    {
    
        <ScrollView className="flex-1">
            <View className="flex-1 flex flex-col gap-1">
            {
                data.items.map((item, index) => {
                    return (
                        <View className="flex flex-col relative px-2  pt-4 pb-5 bg-white border-b-[1px] border-gray-200 rounded-md" key={index}>
                            <View className="flex-1 flex flex-row justify-between">
                            <Text className="font-medium w-[250px] text-gray-800 text-base">{item.quantity}x  {item.product_name}</Text>
                            <Text className="font-bold text-gray-800 text-base">₱{item.total_price}</Text>
                            </View>
                            <View>
                           {item.notes && <Text className="text-sm text-gray-400">{item.notes}</Text>}
                           {
                            item.addons.length !== 0 &&
                            <Text>
                            {
                             item.addons.map((addon, index) => {
                                    return (
                                        <Text key={index} className="text-sm text-gray-400">{addon.addon_name}{index + 1 === item.addons.length ? '' : ', '}</Text>
                                    )
                                })
                            }
                           </Text>
                           }
                            </View>
                        </View>
                    )
                })
            }
            </View>
            <View className="flex-1 w-full mt-3  flex flex-row justify-between">
                <View className="flex-1">
                    <Text className="text-xl font-bold">Total</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-right text-xl font-medium">₱{total}</Text>
                </View>
            </View>
        </ScrollView>
    }
    </View>
    </View>
  )
}

export default OrderDetailReport