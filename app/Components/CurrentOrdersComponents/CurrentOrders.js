import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ToastAndroid, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import PendingOrdersProvider from '../../../Hooks/PendingOrdersProvider'
import CurrentOrdersStore from '../../../store/CurrentOrdersStore'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import http from '../../../http'
import dayjs from "dayjs";

const CurrentOrders = () => {
    const router = useRouter()
    const {pendingOrders, getPendingOrders} = PendingOrdersProvider()
    const {CurrentOrders, setCurrentOrders} = CurrentOrdersStore()
    const [isSwiped, setIsSwiped] = useState(false);
    const [indexSwiped, setIndexSwiped] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    let rightCount = 0

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await getPendingOrders();
            setIsRefreshing(false);
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateOrder = async (_id, status) => {
      // console.log(_id, status)
      const index = CurrentOrders.findIndex((item) => item.order_id === _id);
      if (index !== -1) {
        CurrentOrders[index].status = status;
        setCurrentOrders([...CurrentOrders]);
      }
        try {
            const response = await http.patch('updateOrderStatus', {order_id: _id, status: status});
            if(response.status === 200) {
                showToast('Order updated successfully')
                getPendingOrders()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const RightAction = ({ prog, drag, index, id }) => {
        const styleAnimation = useAnimatedStyle(() => {
      
          return {
            transform: [{ translateX: drag.value + 70 }],
          };
        });
      
        return (
          <Reanimated.View style={styleAnimation} >
            <TouchableOpacity onPress={()=>handleUpdateOrder(id, 'Done')} className="w-[70px] bg-green-500  h-[96%] mt-2 flex flex-row justify-center items-center">
                <Text className="text-white">Done</Text>
            </TouchableOpacity>
          </Reanimated.View>
        );
    }

    const LeftAction = ({ prog, drag, index, id }) => {

        const styleAnimation = useAnimatedStyle(() => {
          return {
            transform: [{ translateX: drag.value - 70 }],
          };
        });
      
        return (
          <Reanimated.View style={styleAnimation}>
            <TouchableOpacity onPress={()=>handleUpdateOrder(id, 'Cancelled')} className={`w-[70px] bg-red-500 h-[96%] mt-2 flex flex-row justify-center items-center`}>
                <Text className="text-white">Delete</Text>
            </TouchableOpacity>
          </Reanimated.View>
        );
    }

    const handleSwipe = (dragX, index) => {
        rightCount = dragX == 'right' ? rightCount + 1 : rightCount
        if(rightCount > 2)
        {
            setIndexSwiped([...indexSwiped, index])
            rightCount = 0
        }
    }

    const handleCloseSwipe = (index) => {
            setIndexSwiped([...indexSwiped.filter((item) => item !== index)])
    }

    const handlePress = (order) => {
      Alert.alert(
        'Edit order',
        'Edit order No. ' + order.order_id + '?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'proceed',
            onPress: ()=> router.push({pathname : '(drawers)', params: {order: JSON.stringify(order)}}) ,
            style: 'default',
          },
        ],
        {
          cancelable: true
        },)
      
    }

    console.log(CurrentOrders)

  return (
<GestureHandlerRootView>
    <View className="flex-1 flex flex-col bg-[#eeeeee]">
        <Stack.Screen
        options={{
            title: "Pending Orders",
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', elevation: 0, shadowOpacity: 0, backgroundColor: '#f9f9f9' },
            headerRight: () => <></>
        }}  
        />
        <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
            {
                CurrentOrders?.sort((a, b) => b.created_at - a.created_at).filter((order) => order.status === 'active').map((order, index)=>{
                    const dateCreated = new Date(order.created_at)
                    const dateString = dateCreated.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'})
                    const formattedTime = dayjs(dateCreated).subtract(8, "hour").format("hh:mm A");
                    const items = order.items
                    return (
                        <ReanimatedSwipeable leftThreshold={100} onSwipeableCloseStartDrag={()=>{handleCloseSwipe(index)}} onSwipeableOpenStartDrag={(dragX)=>{handleSwipe(dragX, index)}} renderLeftActions={(progress, dragX) => (
                            <LeftAction index={index} id={order.order_id} prog={progress} drag={dragX} />  // Pass the index dynamically here
                          )}  renderRightActions={(progress, dragX) => (
                            <RightAction index={index} id={order.order_id} prog={progress} drag={dragX} />)} key={index}>
                            <TouchableOpacity onPress={()=>handlePress(order)} className={`flex-1 ${indexSwiped.includes(index) ? ' pl-[75px]' : 'pl-2'} transition ease-in-out duration-500 bg-white h-fit flex flex-col justify-start gap-2 p-2 mt-2`}> 
                            <View className="flex flex-row  justify-between">
                                <View className="flex flex-row gap-3">
                                <Text className="font-bold text-lg text-green-500">{order.order_id}</Text>
                                {order.customer_name && <Text className="font-medium text-lg text-gray-500">({order.customer_name})</Text>}
                                </View>
                            <Text className=" text-sm text-gray-300 mt-1">{formattedTime}</Text>
                            </View>
                            
                            {
                                items.map((item, index) => {
                                    return (
                                    <View className="flex flex-col" key={index}>
                                        <View className="w-full flex flex-row justify-start items-center gap-2" key={index}>
                                            <Text className="text-sm text-gray-500">{item.quantity}x</Text>
                                            <Text className="text-base text-gray-600 font-bold">{item.product_name}</Text>
                                            {item?.variant && <Text className="text-sm text-gray-500">({item.variant})</Text>}
                                            {/* <Text className="text-sm text-gray-800 font-medium">({item.category_name})</Text> */}
                                        </View>
                                          {
                                            item.addons.length !== 0 &&
                                            <View className="flex ml-4 flex-col gap-2 items-start w-full mt-2">
                                              {
                                                item.addons.map((addon, index) => {
                                                  return (
                                                    <View className="flex flex-row gap-2 items-center  px-1 rounded-sm" key={index}>
                                                      <Text className="text-start text-sm font-light text-gray-600">*{addon.addon_name}</Text>
                                                    </View>
                                                  )
                                                })
                                              }
                                            </View>
                                          }

                                        {item.notes && <Text className="text-xs pl-6 text-gray-400">{item.notes}</Text>}
                                    </View>
                                    )
                                })
                            }
                            <Text>Total: {order.total_price}</Text>
                            </TouchableOpacity>
                    </ReanimatedSwipeable>
                    )
                })
            }
        </ScrollView>
    </View>
    </GestureHandlerRootView>
  )
}   

const styles = StyleSheet.create({
    rightAction: { width: 50, height: 50, backgroundColor: 'purple' },
    separator: {
      width: '100%',
      borderTopWidth: 1,
    },
    swipeable: {
      height: 50,
      backgroundColor: 'papayawhip',
      alignItems: 'center',
    },
  });

export default CurrentOrders