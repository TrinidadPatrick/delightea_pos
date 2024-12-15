import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CartStore from '../../../store/CartStore'
import Modal from "react-native-modal";
import LottieView from 'lottie-react-native';
import http from '../../../http';
import PendingOrdersProvider from '../../../Hooks/PendingOrdersProvider';

const h_cart_products = () => {
  const {Cart, setCart} = CartStore()
  const {pendingOrders, getPendingOrders} = PendingOrdersProvider()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowNameModal, setIsShowNameModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [amountPaid, setAmountPaid] = useState(0);
  const [itemToAdd, setItemToAdd] = useState({
    product_name: '',
    product_price : 0,
    variant: '',
    quantity: 1,
    addons : [],
    notes : ''
  })
  const [customerName, setCustomerName] = useState('');


    // Cancel button
    const handleCancel = () => {
      setItemToAdd({...itemToAdd, product_name : '', product_price : 0, quantity : 1, variant : '', addons : [], notes : ''});
      setSelectedItem(null);
      setIsModalOpen(false);
      setIsShowNameModal(false);
    }

    const clearCart = () => {
      setCart({order_id : '', items : [], item_info : null});
      setAmountPaid(0);
      handleCancel();
    }

    const handleRemove = () => {
      setCart({...Cart, items : Cart.items.filter((item) => item.id !== itemToAdd.id)});
      handleCancel();
    }

      // selecting item from menu
    const handleSelectItem = (item, item_info) => {
      setItemToAdd(item);
      setSelectedItem(item_info);
    };

    // computing the total price
    const computeAddonPrice = () => {
      const addons = itemToAdd.addons
      let price =  itemToAdd?.product_price;
      addons.forEach((addon) => {
        price += Number(addon.addon_price);
      });
      return price * itemToAdd?.quantity;
    };

    // selecting addon
    const handleSelectAddons = (addon) => {
      if (itemToAdd.addons.some((item) => item.addon_name == addon.addon_name)) {
        setItemToAdd({...itemToAdd, addons : itemToAdd.addons.filter((item) => item.addon_name != addon.addon_name)});
      } else {
        setItemToAdd({...itemToAdd, addons : [...itemToAdd.addons, addon]});
      }
    };

    const handleQuantityChange = (value) => {
      setItemToAdd({...itemToAdd, quantity : value});
    };

    const isSubmitDisabled = () => {
      return itemToAdd.product_name === '' || itemToAdd.quantity === 0 || itemToAdd.product_price === 0;
    }

    const handleSubmit = () => {
      const data = {...itemToAdd, total_price : computeAddonPrice(), image : selectedItem.image, category_name : selectedItem.category_id.category_name, item_info : selectedItem};
      const new_items = [...Cart.items];  
      const index = new_items.findIndex((item) => item.id === itemToAdd.id);
      new_items[index] = data;
      setCart({order_id : Cart.order_id, items : new_items, item_info : selectedItem});
      handleCancel();
    }

    const computeTotalPrice = () => {
      const total_price = Cart.items.reduce((acc, item) => acc + item.total_price, 0);
      return total_price;
    }

    const computeChangePrice = () => {
      return  Number(amountPaid) - computeTotalPrice()
    }

    const addToDB = async () => {
      const data = {...Cart, customer_name : customerName, total_price : computeTotalPrice(), change_price : computeChangePrice()};
      data.items.forEach((item) => {  
        delete item.item_info;
      })
      
      // console.log(data)
      try {
        const response = await http.post('/createOrder', data);
        console.log(response.data)
        clearCart();
        getPendingOrders()
      } catch (error) {
        console.log(error)
      }
    }
    

  return (
    <View className="w-[30%] h-full flex flex-col bg-white p-3  justify-start items-center">
      {/* Edit Item modal */}
      <Modal onBackdropPress={()=>{handleCancel()}} isVisible={isModalOpen} backdropOpacity={0.5} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
        <View className="flex-1 flex flex-col bg-white w-[60%] h-full mx-auto p-5">
          <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image and product name */}
          <View className="w-full flex flex-col justify-center items-start">
            <View className="w-full flex flex-row gap-4">
            {/* Image */}
            <Image source={{uri: selectedItem?.image || 'https://placehold.co/400x400?text=No%20Image'}} className="w-[100px] aspect-square bg-red-100 rounded-lg overflow-hidden shadow" />
            {/* Order info */}
            <View className="flex flex-col justify-start items-start w-full mt-0">
              <Text className="text-start font-semibold">{itemToAdd?.product_name} ({selectedItem?.category_id?.category_name})</Text>
              <Text className="text-start font-medium">Variant: <Text className="text-gray-500">{itemToAdd?.variant}</Text></Text>
              <Text className="text-start font-medium">Price: <Text className="text-red-600 text-lg">₱{computeAddonPrice()}</Text></Text>
              {/* Quantity */}
              <View className="flex flex-row justify-start gap-2 items-center w-full mt-2">
                <Text className="text-start font-medium text-gray-500">Quantity</Text>
                
                <View className="flex flex-row gap-4 justify-start items-center w-full">
                <TouchableOpacity onPress={() => handleQuantityChange(itemToAdd?.quantity - 1)} className="bg-green-500 w-[33px] text-white py-1 rounded-lg">
                    <Text className="text-center text-xl text-white">-</Text>
                  </TouchableOpacity>
                  <Text className=" text-center text-black p-0 rounded-lg ">{itemToAdd?.quantity}</Text>
                  <TouchableOpacity onPress={() => handleQuantityChange(itemToAdd?.quantity + 1)} className="bg-green-500 w-[33px] text-white py-1 rounded-lg">
                    <Text className="text-center text-xl text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </View>
          </View>

          {/* Variant */}
          {
            selectedItem?.variants?.length > 0 &&
            <>
            <Text className="mt-5 text-start font-medium text-gray-500">Variant</Text>
          <View className="w-full  flex flex-row justify-start rounded py-2 border-gray-100 items-center gap-3">
            {
              selectedItem?.variants?.map((variant, index) => {
                return (
                  <TouchableOpacity onPress={()=>{setItemToAdd({...itemToAdd, variant : variant.variant_name, product_price : variant.variant_price})}} key={index} className={`w-fit px-3 h-fit py-1.5 ${itemToAdd.variant == variant?.variant_name ? 'bg-blue-500 ' : 'bg-white'} rounded-full border border-gray-200 flex flex-row justify-center items-center`} >
                    <Text className={`text-center ${itemToAdd.variant == variant?.variant_name ? 'text-white' : 'text-gray-800'}`}>{variant.variant_name}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
            </>
          }

          {/* Addons */}
          <View>
          <Text className="mt-3 text-start font-medium text-gray-500">Addons</Text>
          <ScrollView className="h-[50px] " horizontal contentContainerStyle={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          {
            selectedItem?.addons?.map((addon, index) => {
              return (
                <View className="w-fit px-2 h-fit flex flex-row justify-start rounded border-gray-100 items-center gap-3" key={index}>
                  <TouchableOpacity onPress={()=>handleSelectAddons({addon_name : addon.addon_name, addon_price : addon.addon_price})} className={`w-fit px-3 h-fit py-1.5 ${itemToAdd.addons.some((item) => item.addon_name === addon.addon_name) ? 'bg-blue-500 ' : 'bg-white'} rounded-full border border-gray-200 flex flex-row justify-center items-center`} >
                    <Text className={`text-center ${itemToAdd.addons.some((item) => item.addon_name === addon.addon_name) ? 'text-white' : 'text-black'}`}>{addon.addon_name}</Text>
                  </TouchableOpacity>
                </View>
              )
            })
          }
          </ScrollView>
          </View>

          {/* Notes */}
          <View>
          <Text className="mt-3 text-start font-medium text-gray-500">Notes</Text>
          <TextInput value={itemToAdd.notes} onChangeText={(text) => setItemToAdd({...itemToAdd, notes : text})} multiline textAlignVertical='top' className="mt-1 w-[99%] h-[65px] border-gray-100 rounded-lg border p-2" placeholder="Add notes here..." />
          </View>

          {/* Submit */}
          <View className="w-full gap-2  p-0.5 mt-3 flex flex-row justify-center">
            <View className="flex-1">
            <TouchableOpacity disabled={isSubmitDisabled()} className="bg-green-500 disabled:bg-green-300  text-white px-4 py-2 rounded" onPress={() => handleSubmit()}>
              <Text className="text-center text-white">Submit</Text>
            </TouchableOpacity>
            </View>
            
            <View className="w-fit flex flex-row justify-center">
            <TouchableOpacity disabled={isSubmitDisabled()} className="bg-red-500 disabled:bg-green-300 text-white px-4 py-2 rounded" onPress={() => handleRemove()}>
              <Text className="text-center text-white">Remove</Text>
            </TouchableOpacity>
            </View>
          </View>

          </ScrollView>
        </View>
      </Modal>
      {/* Add customer name modal */}
      <Modal isVisible={isShowNameModal} onBackdropPress={()=>{handleCancel()}} backdropOpacity={0.5} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
          <View className="w-[250px] h-fit bg-white rounded flex flex-col justify-start mx-auto p-2">
            <View className="w-full flex flex-col items-center justify-center">
            <LottieView autoPlay style={{width: 100,height: 100}}
            source={{uri : 'https://lottie.host/5fd7a578-c56a-41bd-be4d-0d0066fa6584/dVZ4fkm8gq.lottie'}}
            />
              <Text className="text-green-600 text-2xl font-medium text-center">Order Submitted</Text>
            </View>
            <View>
              <Text className="text-lg text-center">Total Change</Text>
              <Text className="font-semibold text-green-500 text-center text-xl">₱{computeChangePrice()}</Text>
            </View>
            <View className="mt-5 w-full">
              <TextInput value={customerName} onChangeText={(text)=>setCustomerName(text)} className="w-full h-fit text-lg text-start placeholder:text-gray-400  border-gray-100 rounded border p-2" placeholder="Enter customer name" />
            </View>
            <TouchableOpacity onPress={()=>addToDB()} className="b bg-theme-medium disabled:bg-theme-light w-full text-white px-4 py-2 rounded mt-2">
              <Text className="text-center text-white">Submit</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    {/* Items */}
    <View className="w-full flex flex-col flex-1 justify-start gap-2 items-center p-1">
      <ScrollView>
      {
        Cart?.items?.map((item, index) => {

          return (
          <TouchableOpacity onPress={()=>{handleSelectItem(item, item.item_info); setIsModalOpen(true)}} className="border border-gray-200 p-2 rounded" key={index}>
            <View className="w-full flex flex-row justify-start rounded items-center gap-2" key={index}>
              <View className="w-[70px] relative aspect-square  rounded overflow-hidden shadow">
                <Image source={{uri: item.image}} className="w-full aspect-square bg-red-100 rounded-lg overflow-hidden shadow" />
              </View>
              <View className="flex-1 w-full h-full flex flex-col justify-start items-start">
                <Text className="text-start text-sm font-semibold">{item.product_name} ({item.category_name})</Text>
                <Text className="text-start text-sm font-medium">Variant: <Text className="text-gray-500">{item.variant}</Text></Text>
                <Text className="text-start text-sm font-medium">Quantity: <Text className="text-gray-500">{item.quantity}x</Text></Text>
                <Text className="text-red-600 text-sm text-right w-full font-medium">₱{item.total_price}</Text>
              </View>
            </View>
            <View className="flex flex-row justify-start items-center w-full">
            {
                  item.addons.length > 0 &&
                  <View className="flex flex-row gap-2 items-center w-full mt-2">
                    {
                      item.addons.map((addon, index) => {
                        return (
                          <View className="flex flex-row gap-2 items-center bg-theme-medium px-1 rounded-sm" key={index}>
                            <Text className="text-start text-sm font-light text-white">{addon.addon_name}</Text>
                          </View>
                        )
                      })
                    }
                  </View>
                }
            </View>
          </TouchableOpacity>
          )
        })
      }
      </ScrollView>
    </View>
    {/* Buttons */}
    <View className="flex flex-col h-fit w-full p-1 border-gray-200 rounded">
      <View className="w-full  flex flex-row justify-start">
        <View className="flex-1">
          <Text className="font-medium text-gray-500">Total </Text>
        </View>
        <View>
        <Text className="font-medium text-gray-500">₱{computeTotalPrice()}</Text>
        </View>
      </View>
      <View className="w-full  flex flex-row justify-start">
        <View className="flex-1">
          <Text className="font-medium text-gray-500">Change </Text>
        </View>
        <View>
        <Text className="font-medium text-gray-500">₱{computeChangePrice() < 0 ? 0 : computeChangePrice()}</Text>
        </View>
      </View>
      {/* Amount input */}
      <View className="w-full  flex flex-row justify-start mt-2">
        <TextInput keyboardType='numeric' value={amountPaid} onChangeText={(text)=>setAmountPaid(text)} className="w-full h-full font-medium text-gray-500 border-gray-100 rounded border p-2" placeholder="Amount" />
      </View>
      {/* Submit Button */}
      <View className="w-full  flex flex-row justify-start mt-2">
        <TouchableOpacity onPress={()=>{setIsShowNameModal(true)}} className=" bg-theme-medium disabled:bg-theme-semiLight w-full text-white px-4 py-2 rounded" >
          <Text className="text-center text-white">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  )
}

export default h_cart_products