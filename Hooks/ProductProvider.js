import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import http from '../http'

const ProductProvider = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await http.get('getProducts');
            const data = response.data;
            setProducts(data.products);
            return data
        } catch (error) {
            console.log(error.response)
        }
    }

  useEffect(() => {
    getProducts()
  }, [])
  return {
    products,
    getProducts
  }
}

export default ProductProvider