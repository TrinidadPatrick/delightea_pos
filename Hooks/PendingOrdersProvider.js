import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../http';
import CurrentOrdersStore from '../store/CurrentOrdersStore';

const PendingOrdersProvider = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const {setCurrentOrders} = CurrentOrdersStore()

    const getPendingOrders = async () => {
        try {
            const response = await http.post('getCurrentDayOrders');
            const data = response.data;
            setPendingOrders(data);
            setCurrentOrders(data);
            return data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPendingOrders()
    }, [])
  
    return {
        pendingOrders, getPendingOrders
    }
}

export default PendingOrdersProvider