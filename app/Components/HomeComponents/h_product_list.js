import { View, Text, Dimensions,  FlatList, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeHeader from './h_header'
import ProductStore from '../../../store/ProductStore';
import Modal from "react-native-modal";
import CartStore from '../../../store/CartStore';
import http from '../../../http';

const HomeProductList = ({result}) => {
  const [elementWidth, setElementWidth] = useState(0);
  const {Products} = ProductStore()
  const {Cart, setCart} = CartStore()
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState({
    product_name: '',
    product_price : 0,
    total_price : 0,
    variant: '',
    quantity: 1,
    addons : [],
    notes : ''
  })
  const [selectedCategory, setSelectedCategory] = useState('');

  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-7); // Current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2, 10); // Random alphanumeric string
    return `ORD-${timestamp}-${randomString.toUpperCase()}`; // Format as desired
  }

  const generateId = () => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2, 10); // Random alphanumeric string
    return `ITEM-${timestamp}-${randomString.toUpperCase()}`; // Format as desired
  }

  // Setting of products from product store
  useEffect(() => {
    Products !== null && setProducts(Products)
  }, [Products]);

  useEffect(() => {
    if (result !== null) {
      setProducts(result);
      setSelectedCategory('674bec4b254613927136d279');
  }
  }, [result]);

  // Setting of products from selected category
  useEffect(() => {
    selectedCategory !== null && Products !== null && setProducts(selectedCategory == '674bec4b254613927136d279' ? Products : Products.filter((item) => item.category_id._id === selectedCategory));
  }, [selectedCategory, Products]);

  const isSubmitDisabled = () => {
    return itemToAdd.product_name === '' || itemToAdd.quantity === 0 || itemToAdd.product_price === 0;
  }

  // Cancel button
  const handleCancel = () => {
    setItemToAdd({...itemToAdd, product_name : '', product_price : 0, quantity : 1, variant : '', addons : [], notes : ''});
    setSelectedItem(null);
    setIsModalOpen(false);
  }

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout; 
    setElementWidth(width);
  };

  // selecting item from menu
  const handleSelectItem = (item) => {
    setItemToAdd({...itemToAdd, product_name : item.product_name});
    setSelectedItem(item);
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

  const handleSubmit = () => {
    const data = {...itemToAdd, id : generateId(), total_price : computeAddonPrice(), image : selectedItem.image, category_id : selectedItem.category_id, category_name : selectedItem.category_id.category_name, item_info : selectedItem};
    setCart({order_id : Cart.order_id || generateOrderId(), items : [...Cart.items, data]});
    handleCancel();
  }

  return (
    <View className="flex-1 flex flex-col bg-[#f9f9f9] h-full p-3  justify-start items-center">
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
          <View className="flex w-full mt-3 flex-row justify-center">
            <TouchableOpacity disabled={isSubmitDisabled()} className="bg-green-500 disabled:bg-green-300 w-full text-white px-4 py-2 rounded-lg" onPress={() => handleSubmit()}>
              <Text className="text-center text-white">Submit</Text>
            </TouchableOpacity>
          </View>

          </ScrollView>
        </View>
      </Modal>
      <HomeHeader selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <FlatList
      onLayout={handleLayout}
      style={{ width: '100%'}}
      numColumns={5}
      data={products}
      renderItem={({ item }) => <TouchableOpacity onPress={()=>{handleSelectItem(item);setIsModalOpen(true)}} style={{width: elementWidth/5}} className=" h-fit p-1 flex flex-col justify-center items-center">
        <View className="flex-1 bg-white rounded-md border border-gray-200 w-full h-fit flex flex-col p-2">
          {/* Image */}
          <View className="w-full relative aspect-square bg-red-100 rounded-lg overflow-hidden shadow">
            <Image source={{uri: item.image || 'https://placehold.co/400x400?text=No%20Image'}} className="w-full aspect-square bg-red-100 rounded-lg overflow-hidden shadow" />
          </View>
          <View className=" w-fit h-fit bg-white">
              <Text style={{width : 'fit-content'}} className="text-center mt-1 ">({item.category_id.category_name})</Text>
          </View>
          <Text className="text-center mt-2 font-bold">{item.product_name}</Text>
        </View>
      </TouchableOpacity>}
      keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default HomeProductList