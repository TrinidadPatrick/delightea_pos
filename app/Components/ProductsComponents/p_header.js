import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import Products from '../../../data/ProductList'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router'
import http from '../../../http';
import CategoryStore from '../../../store/categoryStore';
import CategoryProvider from '../../../Hooks/CategoryProvider';
import AddonStore from '../../../store/AddonStore';
import AddonProvider from '../../../Hooks/AddonProvider';

const ProductsHeader = ({height, width}) => {
  const router = useRouter();
  const {Categories, setCategories} = CategoryStore()
  const {Addons, setAddons} = AddonStore()
  const {getAddons} = AddonProvider()
  const {getCategories} = CategoryProvider()
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openAddAddonsModal, setOpenAddAddonsModal] = useState(false);
  const [category, setCategory] = useState('');
  const [addon, setAddon] = useState({addon_name: '', addon_price: 0});
  const [isSubmitting, setIsSubmitting] = useState(false)

  const arrangeProducts = () => {
    const categories = Categories.map(category => {
      return Products.filter(product => product.category_id === category.id)
    })
    return categories
  }

  const handleSubmitCategory = async () => {
    try {
      setIsSubmitting(true)
      const response = await http.post('addCategory', {category_name: category});
      const data = await getCategories()
      setCategories(data.categories)
    } catch (error) {
      console.log(error)
    } finally{
      setCategory('');
      setIsSubmitting(false)
    }
    setOpenAddCategoryModal(false);
  }

  const handleSubmitAddon = async () => {
    try {
      setIsSubmitting(true)
      const response = await http.post('addAddon', {addon_name: addon.addon_name, addon_price: addon.addon_price});
      const data = await getAddons()
      setAddons(data.addons)
    } catch (error) {
      console.log(error)
    } finally{
      setAddon({addon_name: '', addon_price: 0});
      setIsSubmitting(false)
    }
    setOpenAddAddonsModal(false);
  }

  const navigateToAddProduct = () => {
    // router.push('../../Components/ProductsComponents/p_add_product');
    router.push('/Components/ProductsComponents/p_add_product');
  };

  return (
    <View className="w-full gap-3 p-2 h-[55px] flex flex-row justify-start items-center ">
      {/* Add category Modal */}
      {
        openAddCategoryModal &&
        <View style={{width: width > 900 ? width+15 : '104%', height: width > 900 ? height-85 : height+400, backgroundColor: 'rgba(0,0,0,0.5)'}} className=" absolute top-0 left-0 z-10 flex flex-col justify-center items-center">
        <View className="w-[310px] h-fit rounded bg-white px-2 py-5 flex flex-col gap-2 justify-center">
          {/* text input */}
          <View className="w-[295px] flex flex-col gap-2">
            <Text className="text-sm text-gray-400">Category name</Text>
              <TextInput value={category} onChangeText={(text)=>setCategory(text)} className="w-full h-[50px] bg-white border rounded border-gray-300 px-2" placeholder="Enter category" />
          </View>
          <TouchableOpacity onPress={handleSubmitCategory} className="w-full  h-[40px] bg-blue-500 text-white shadow rounded flex flex-col items-center justify-center">
          <Text className="text-white">{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setOpenAddCategoryModal(false)} className="w-full  h-[40px] bg-gray-50 text-white shadow rounded flex flex-col items-center justify-center">
            <Text className="text-gray-900">Cancel</Text>
          </TouchableOpacity>
        </View>
        </View>
      }

      {/* Add Addons Modal */}
      {
        openAddAddonsModal &&
        <View style={{width: width > 900 ? width+15 : '104%', height: width > 900 ? height-85 : height+400, backgroundColor: 'rgba(0,0,0,0.5)'}} className=" absolute  top-0 left-0 z-10 flex flex-col justify-center items-center">
        <View className="w-[310px] h-fit rounded bg-white px-2 py-5 flex flex-col gap-2 justify-center">
          {/* text input */}
          <View className=" w-[295px] flex flex-col gap-2">
            <Text className="text-sm text-gray-400">Addon name</Text>
              <TextInput value={addon.addon_name} onChangeText={(text)=>setAddon({...addon, addon_name: text})} className="w-full h-[50px] bg-white border rounded border-gray-300 px-2" placeholder="Enter addon" />
          </View>
          <View className=" w-[295px] flex flex-col gap-2">
            <Text className="text-sm text-gray-400">Addon price</Text>
              <TextInput value={addon.addon_price} onChangeText={(text)=>setAddon({...addon, addon_price: Number(text)})} className="w-full h-[50px] bg-white border rounded border-gray-300 px-2" placeholder="Enter addon price" />
          </View>
          <TouchableOpacity onPress={handleSubmitAddon} className="w-full  h-[40px] bg-blue-500 text-white shadow rounded flex flex-col items-center justify-center">
            <Text className="text-white">{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setOpenAddAddonsModal(false)} className="w-full  h-[40px] bg-gray-50 text-white shadow rounded flex flex-col items-center justify-center">
            <Text className="text-gray-900">Cancel</Text>
          </TouchableOpacity>
        </View>
        </View>
      }

      {/* Add products button */}
      <TouchableOpacity onPress={navigateToAddProduct} className="w-fit px-3 h-[40px] bg-white shadow rounded flex flex-col items-center justify-center">
        <FontAwesome6 name="add" size={24} color="black" />
      </TouchableOpacity>

      {/* Add Category button */}
      <TouchableOpacity onPress={()=>setOpenAddCategoryModal(true)} className="w-fit px-3 h-[40px] bg-white shadow rounded flex flex-col items-center justify-center">
        <Text className="tex
        t-sm text-gray-400">Add Category</Text>
      </TouchableOpacity>

      {/* Add Addons button */}
      <TouchableOpacity onPress={()=>setOpenAddAddonsModal(true)} className="w-fit px-3 h-[40px] bg-white shadow rounded flex flex-col items-center justify-center">
        <Text className="tex
        t-sm text-gray-400">Add Addons</Text>
      </TouchableOpacity>

      {/* Search bar */}
      {/* <View className=" w-[350px] h-full rounded overflow-hidden shadow">
            <TextInput className="w-full bg-white h-[55px] flex-1 px-2" placeholder="Search item.." />
      </View> */}
    </View>
  )
}

export default ProductsHeader