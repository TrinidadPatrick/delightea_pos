import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../http';
import CurrentOrdersStore from '../store/CurrentOrdersStore';

const PendingOrdersProvider = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const {setCurrentOrders} = CurrentOrdersStore()
    const now = new Date();

    const getPendingOrders = async () => {
        const dateFrom = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        const dateTo = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        try {
            const response = await http.get('getCurrentDayOrders');
            console.log(response.data)
            const data = response.data;
            setPendingOrders(data);
            setCurrentOrders(data)
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