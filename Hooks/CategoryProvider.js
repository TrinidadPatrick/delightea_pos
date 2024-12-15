import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../http'

const CategoryProvider = () => {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const response = await http.get('getCategories');
            const data = response.data;
            setCategories(data.categories);
            return data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

  return {categories, getCategories}
}

export default CategoryProvider