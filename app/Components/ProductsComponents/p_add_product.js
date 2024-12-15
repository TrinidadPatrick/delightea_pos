import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import Categories from '../../../data/CategoryList'
import { Dropdown } from 'react-native-element-dropdown';
import http from '../../../http'
import CategoryStore from '../../../store/categoryStore'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import AddonStore from '../../../store/AddonStore'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import ProductProvider from '../../../Hooks/ProductProvider'


const P_add_product = () => {
  const router = useRouter();
  const {getProducts} = ProductProvider()
  const [uploadingImage, setUploadingImage] = useState(false)
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dno1ztttc/image/upload' 
  const uploadPreset = 'product_image'
  const [selected, setSelected] = useState([])
  const {Categories, setCategories} = CategoryStore()
  const {Addons} = AddonStore()
  const[variants, setVariants] = useState([])
  const [productInfo, setProductInfo] = useState({
    product_name: '',
    product_price: '',
    image: '',
    variants: [],
    addons: [],
    category_id: '',
  })

  const clearInputs = () => {
    setProductInfo({...productInfo, product_name: '', product_price: '', image: '', variants: [], addons: [], category_id: 1})
  }

  const handleAddVariant = () => {
    setVariants([...variants, {variant_name: '', variant_price: 0}])
  }

  const handleVariantInput = (index, value) => {
    setVariants([...variants.map((variant, i)=>i === index ? {...variant, variant_name: value} : variant)])
  }

  const handleVariantPriceInput = (index, value) => {
    setVariants([...variants.map((variant, i)=>i === index ? {...variant, variant_price: value} : variant)])
  }

  const handleSubmit = async ()=> {
    const data = {...productInfo, variants: variants, addons: selected}
    clearInputs()
    try {
      const response = await http.post('addProduct', data);
      getProducts()
      router.push('/Components/ProductsComponents/p_product_list');
    } catch (error) {
      console.log(error.response)
    }
  }

  const pickProfile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    
  });

  handleImageUpload(result.assets[0].uri)
}

  const handleImageUpload = async (uri) => {
    const data = new FormData();
    const filename = uri.split('/').pop();
    const filetype = filename.split('.').pop();

    data.append('file', {
      uri,
      name: filename,
      type: `image/${filetype}`,
    });

    data.append('upload_preset', uploadPreset);

    try {
      setUploadingImage(true)
      const response = await axios.post(cloudinaryUrl, data, {  
        headers: {
          'Content-Type': 'multipart/form-data',
        }
        });
        setProductInfo({...productInfo, image: response.data.url})
        setUploadingImage(false)
    } catch (error) {
      console.log(error)
      setUploadingImage(false)
    }


  }

  const isSubmitEnabled = () => {
    return productInfo.product_name.length > 0 && (productInfo.product_price > 0 || variants.length > 0)
  }

  return (
    <View className="flex-1 flex flex-row bg-[#f9f9f9] justify-center">
        <Stack.Screen options={{ title: 'Add Product', headerShown: true }} />
    
    <View className="w-[400px] h-[100%] bg-white rounded overflow-hidden shadow flex flex-col p-2 gap-3">
      <ScrollView>

      {/* Product image */}
      <View className="flex-1 mt-0">
        {
          productInfo.image &&
          <View className="w-full pb-2 flex flex-row items-center justify-center">
          <Image source={{uri: productInfo.image}} className="w-[100px] aspect-square bg-red-100 rounded-lg overflow-hidden shadow" />
        </View>
        }
        <TouchableOpacity onPress={pickProfile} className="w-full h-[40px] bg-gray-200 text-white rounded flex flex-col items-center justify-center">
          <Text className="text-gray-800">{uploadingImage ? 'Uploading...' : 'Upload Image'}</Text>
        </TouchableOpacity>
      </View>

      {/* Product name */}
      <View>
        <Text className="text-sm text-gray-400">Product Name</Text>
        <TextInput value={productInfo.product_name} className="w-full bg-white px-2 border rounded border-gray-400" onChangeText={(text) => setProductInfo({...productInfo, product_name: text})} />
      </View>

      {/* Category and Price */}
      <View className="flex flex-row items-start justify-between gap-3">
        {/* Category */}
        <View className="flex-1">
        <Text className="text-sm text-gray-400">Category</Text>
          <Dropdown
          style={{borderColor: '#9ca3af', borderWidth: 1, height: 43, borderRadius: 5, paddingLeft: 10}}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={Categories?.map((item) => ({ label: item.category_name, value: item._id }))}
          value={productInfo.category_id !== '' ? productInfo.category_id : Categories[0]._id}
          onChange={(value) => setProductInfo({...productInfo, category_id: value.value})}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          />
        </View>

        {/* Product Price */}
      <View className="flex-1">
        <Text className="text-sm text-gray-400">Product price</Text>
        <TextInput editable={variants.length == 0} value={variants.length > 0 ? '' : productInfo?.product_price.toString()} keyboardType='numeric' className="w-full bg-white px-2 border rounded border-gray-400" onChangeText={(text) => setProductInfo({...productInfo, product_price: Number(text)})} />
      </View>

      </View>

      {/* Variants */}
      <View className="w-full flex flex-col gap-2 mt-2 ">
        {variants.length > 0 && <Text Text className="text-sm text-gray-400">Variants</Text>}
        <View className="w-full flex flex-col gap-3">
          {
            variants.map((variant, index)=>(
              <View key={index} className="flex flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <TextInput value={variant.variant_name} placeholder='Variant name' className="w-full bg-white px-2 border rounded border-gray-400" onChangeText={(text) => handleVariantInput(index, text)} />
                </View>
                <View className="w-[32.5%]">
                  <TextInput value={variant.variant_price} placeholder='Variant price' keyboardType='numeric' className="w-full bg-white px-2 border rounded border-gray-400" onChangeText={(text) => handleVariantPriceInput(index, text)} />
                </View>
                <TouchableOpacity onPress={()=>setVariants(variants.filter((item, i)=>i !== index))} className="  h-[40px] bg-red-500 text-white px-2 shadow rounded flex flex-col items-center justify-center">
                  <Text className="text-white text-xs">Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </View>
        <TouchableOpacity onPress={handleAddVariant} className="w-full mt-2 h-[40px] bg-gray-200 text-white rounded flex flex-col items-center justify-center">
          <Text className="text-gray-800">Add Variant</Text>
        </TouchableOpacity>
      </View>

       {/* Addon */}
        <View className="flex-1 mt-3">
        <Text className="text-sm text-gray-400">Choose addon</Text>
        <MultipleSelectList 
        search={false}
        setSelected={(val) => setSelected(val)}
        data={Addons?.map((addon)=>({key: addon._id, value: addon.addon_name}))}
        save="key"
        label="Addons"
        />
        </View>

      {/* Submit button */}
      <TouchableOpacity disabled={!isSubmitEnabled()} onPress={handleSubmit} className="w-full mt-3 h-[40px] disabled:bg-green-300 bg-green-500 text-white shadow rounded flex flex-col items-center justify-center">
        <Text className="text-white">Submit</Text>
      </TouchableOpacity>

      </ScrollView>
    </View>
    </View>
  )
}

export default P_add_product

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});