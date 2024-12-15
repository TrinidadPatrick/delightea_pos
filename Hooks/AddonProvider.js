import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../http'

const AddonProvider = () => {
    const [addons, setAddons] = useState([]);

    const getAddons = async () => {
        try {
            const response = await http.get('getAddons');
            const data = response.data;
            setAddons(data.addons);
            return data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAddons()
    }, [])

  return {addons, getAddons}
}

export default AddonProvider