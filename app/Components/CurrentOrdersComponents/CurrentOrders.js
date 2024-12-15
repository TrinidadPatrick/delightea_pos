import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import PendingOrdersProvider from '../../../Hooks/PendingOrdersProvider'
import CurrentOrdersStore from '../../../store/CurrentOrdersStore'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CurrentOrders = () => {
    const {pendingOrders} = PendingOrdersProvider()
    const {CurrentOrders, setCurrentOrders} = CurrentOrdersStore()
    const [isSwiped, setIsSwiped] = useState(false);
    const [indexSwiped, setIndexSwiped] = useState([]);
    
    let rightCount = 0

    // useEffect(() => {
    //     console.log(CurrentOrders)
    // }, [CurrentOrders]);

    const RightAction = (prog, drag) => {
        const styleAnimation = useAnimatedStyle(() => {
      
          return {
            transform: [{ translateX: drag.value + 70 }],
          };
        });
      
        return (
          <Reanimated.View style={styleAnimation}>
            <View className="w-[70px] bg-green-500  h-[96%] mt-2 flex flex-row justify-center items-center">
                <Text className="text-white">Done</Text>
            </View>
          </Reanimated.View>
        );
    }

    const LeftAction = ({ prog, drag, index }) => {

        const styleAnimation = useAnimatedStyle(() => {
          return {
            transform: [{ translateX: drag.value - 70 }],
          };
        });
      
        return (
          <Reanimated.View style={styleAnimation}>
            <View className={`w-[70px] bg-red-500 h-[96%] mt-2 flex flex-row justify-center items-center`}>
                <Text className="text-white">Delete</Text>
            </View>
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
        <ScrollView>
            {
                CurrentOrders?.sort((a, b) => b.created_at - a.created_at).map((order, index)=>{
                    const date = new Date(order.created_at)
                    const dateString = date.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'})
                    const items = order.items
                    return (
                        <ReanimatedSwipeable leftThreshold={100} onSwipeableCloseStartDrag={()=>{handleCloseSwipe(index)}} onSwipeableOpenStartDrag={(dragX)=>{handleSwipe(dragX, index)}} renderLeftActions={(progress, dragX) => (
                            <LeftAction index={index} prog={progress} drag={dragX} />  // Pass the index dynamically here
                          )}  renderRightActions={RightAction} key={index}>
                            <View className={`flex-1 ${indexSwiped.includes(index) ? ' pl-[75px]' : 'pl-2'} transition ease-in-out duration-500 bg-white h-fit flex flex-col justify-start gap-2 p-2 mt-2`}> 
                            <View className="flex flex-row  justify-between">
                                <View className="flex flex-row gap-3">
                                <Text className="font-bold text-lg text-green-500">{order.order_id}</Text>
                                {order.customer_name && <Text className="font-medium text-lg text-gray-500">({order.customer_name})</Text>}
                                </View>
                            <Text className=" text-sm text-gray-300 mt-1">{dateString}</Text>
                            </View>
                            
                            {
                                items.map((item, index) => {
                                    return (
                                    <View className="flex flex-col" key={index}>
                                        <View className="w-full flex flex-row justify-start items-center gap-2" key={index}>
                                            <Text className="text-sm text-gray-500">{item.quantity}x</Text>
                                            <Text className="text-sm text-gray-500">{item.product_name}</Text>
                                            <Text className="text-sm text-gray-500">({item.variant})</Text>
                                        </View>
                                        {item.notes && <Text className="text-xs pl-6 text-gray-400">{item.notes}</Text>}
                                    </View>
                                    )
                                })
                            }
                            <Text>Total: {order.total_price}</Text>
                            </View>
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