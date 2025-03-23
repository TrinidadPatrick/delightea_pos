import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../http'

const CategoryProvider = () => {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const response = await http.get('getCategories');
            const data = response.data;
            const categories = data.categories.sort((a, b) => {
                if (a.category_name === "All") return -1; // Move "All" to the beginning
                if (b.category_name === "All") return 1;  // Move other items after "All"
                return new Date(b.created_at) - new Date(a.created_at); // Sort the rest by date
              });              
            setCategories(categories);
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