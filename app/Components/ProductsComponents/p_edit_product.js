import { Stack, useLocalSearchParams, useSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ToastAndroid, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import ProductStore from '../../../store/ProductStore'
import { MultiSelect } from 'react-native-element-dropdown';

const p_edit_product = () => {
    const router = useRouter();
    const { width } = Dimensions.get('window');
    const { product } = useLocalSearchParams();
    const {getProducts} = ProductProvider()
    const {setProducts} = ProductStore()
    const {Addons} = AddonStore()
    const [selected, setSelected] = useState([])
    const {Categories, setCategories} = CategoryStore()
    const [uploadingImage, setUploadingImage] = useState(false)
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dno1ztttc/image/upload' 
    const uploadPreset = 'product_image'
    const[variants, setVariants] = useState([])
    const [productInfo, setProductInfo] = useState({
        product_name: '',
        product_price: '',
        image: '',
        variants: [],
        addons: [],
        category_id: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if(product !== null)
        {
            const new_product = JSON.parse(product)
            setProductInfo(JSON.parse(product))
            setVariants(new_product.variants)
            setSelected(new_product.addons.map((addon)=>addon._id))
            setCategories(Categories)
        }
    }, [product]);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    
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

      const handleChangeStatus = async (status) => {
        setIsSubmitting(true)
        const data = {_id : productInfo._id, status : status}
        try {
          const response = await http.patch('changeStatus/'+productInfo._id, data);
          const productsData = await getProducts()
          setProducts(productsData.products)
          showToast('Product updated successfully')
          setIsSubmitting(false)
          router.back()
        } catch (error) {
          console.log(error.response)
        }
      }
    
      const handleSubmit = async ()=> {
        setIsSubmitting(true)
        const data = {...productInfo, variants: variants, addons: selected}
        try {
          const response = await http.patch('updateProduct/'+productInfo._id, data);
          showToast('Product updated successfully')
          router.back()
          setIsSubmitting(false)
          const productsData = await getProducts()
          setProducts(productsData.products)
          clearInputs()
          
        } catch (error) {
          console.log(error.response)
        }
      }
    
      const pickImage = async () => {
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
            setProductInfo({...productInfo, image: response.data.secure_url})
            setUploadingImage(false)
        } catch (error) {
          console.log(error)
          setUploadingImage(false)
        }
    
    
      }
    
      const isSubmitEnabled = () => {
        return productInfo.product_name.length > 0 && (productInfo.product_price > 0 && isSubmitting === false || variants.length > 0)
      }

  return (
    <View className="flex-1 flex flex-row bg-[#f9f9f9] justify-center">
    <Stack.Screen options={{ title: 'Edit Product', headerShown: true }} />
    <View className="w-[400px]  bg-white rounded overflow-hidden shadow flex flex-col p-2 gap-3">
      <ScrollView contentContainerStyle={{ paddingBottom: 60, flexGrow: 1, justifyContent: 'flex-start' }} showsVerticalScrollIndicator={false}>

      {/* Product image */}
      <View className="  mt-0">
      {
        productInfo.image &&
        <View>
          <View className="w-full pb-2 flex flex-row items-center justify-center">
          <Image source={{uri: productInfo.image}} className="w-[100px] aspect-square bg-red-100 rounded-lg overflow-hidden shadow" />
        </View>
        </View>
      }
      <TouchableOpacity onPress={pickImage} className="w-full h-[40px] bg-gray-200 text-white rounded flex flex-col items-center justify-center">
          <Text className="text-gray-800">{uploadingImage ? 'Uploading...' : 'Upload Image'}</Text>
        </TouchableOpacity>
      </View>

      {/* Product name */}
      <View className="h-[60px] flex flex-col">
        <Text className="text-sm text-gray-400">Product Name</Text>
        <TextInput value={productInfo.product_name} className="w-full flex-1 bg-white px-2 border rounded border-gray-400" onChangeText={(text) => setProductInfo({...productInfo, product_name: text})} />
      </View>

      {/* Category and Price */}
      <View className="flex h-[60px] flex-row items-start justify-between gap-3">
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
          value={productInfo.category_id._id || productInfo.category_id}
          onChange={(value) => setProductInfo({...productInfo, category_id: value.value})}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          />
        </View>

        {/* Product Price */}
      <View className="flex-1 h-[60px]">
        <Text className="text-sm text-gray-400">Product price</Text>
        <TextInput editable={variants.length == 0} value={variants.length > 0 ? '' : productInfo?.product_price.toString()} keyboardType='numeric' className="w-[99%] flex-1 bg-white px-2 border rounded border-gray-400" onChangeText={(text) => setProductInfo({...productInfo, product_price: Number(text)})} />
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
                  <TextInput value={variant.variant_name} placeholder='Variant name' className="w-full bg-white h-[43px] px-2 border rounded border-gray-400" onChangeText={(text) => handleVariantInput(index, text)} />
                </View>
                <View className="w-[32.5%]">
                  <TextInput value={variant.variant_price.toString()} placeholder='Variant price' keyboardType='numeric' className="w-full h-[43px] bg-white px-2 border rounded border-gray-400" onChangeText={(text) => handleVariantPriceInput(index, text)} />
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
        <MultiSelect 
        style={styles.dropdown}
        labelField='label'
        valueField='value'
        value={selected}
        placeholder="Select addons"
        placeholderStyle={{color: 'gray'}}
        selectedStyle={{color: 'black', borderRadius: 100, borderWidth: 1, borderColor: 'black', height: 39}}
        onChange={(val) => setSelected(val)}
        data={Addons?.map((addon)=>({value: addon._id, label: addon.addon_name}))}
        dropdownPosition={width < 900 ? 'bottom' : 'top'}
        />
        </View>

      {/* Submit button */}
      <View className="w-full flex flex-row gap-2 ">
      <TouchableOpacity disabled={!isSubmitEnabled()} onPress={handleSubmit} className="flex-1 mt-3 h-[40px] disabled:bg-green-300 bg-green-500 text-white shadow rounded flex flex-col items-center justify-center">
        <Text className="text-white">{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
      {
        productInfo.status === 'active' ?
        <TouchableOpacity disabled={isSubmitting} onPress={()=>handleChangeStatus('disabled')} className="w-[100px] mt-3 h-[40px] disabled:bg-green-300 bg-green-500 text-white shadow rounded flex flex-col items-center justify-center">
        <Text className="text-white">Enabled</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity disabled={isSubmitting} onPress={()=>handleChangeStatus('active')} className="w-[100px] mt-3 h-[40px] disabled:bg-red-300 bg-red-500 text-white shadow rounded flex flex-col items-center justify-center">
        <Text className="text-white">Disabled</Text>
      </TouchableOpacity>
      }
      </View>
      

      </ScrollView>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 30,
        backgroundColor: 'transparent',
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
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
  
        elevation: 2,
      }
  });

export default p_edit_product