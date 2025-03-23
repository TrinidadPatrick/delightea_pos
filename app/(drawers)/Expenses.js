import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Dropdown } from 'react-native-element-dropdown';
import http from '../../http';
import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

const Expenses = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState({name : new Date().toLocaleDateString('EN-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    }), value : new Date()});
    const [item, setItem] = useState('');
    const [total_price, setTotalPrice] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [item_id, setItemId] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expenseCategories = [
        { label: 'Milktea', value: 'Milktea' },
        { label: 'Snack', value: 'Snack' },
        { label: 'Short', value: 'Short' },
        { label: 'Salary', value: 'Salary' },
      ];

      useFocusEffect(
        useCallback(()=>{
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        },[]))

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    const clearInputs = () => {
        setItem('');
        setTotalPrice('');
    }

    const handleConfirm = (date) => {
        const newDate = new Date(date);
        const dateString = {
          name : newDate.toLocaleDateString('EN-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
          }),
          value : newDate
        }
        setDate(dateString);
        setShowDatePicker(false);
    }

    const handleAddExpense = async () => {
      setIsSubmitting(true)
        const data = {
            item : item,
            total_price : total_price,
            expenseCategory : expenseCategory,
            expenseDate : date.value.toLocaleDateString('EN-US', {
                year : '2-digit',
                month : '2-digit',
                day : '2-digit',
            }),
        }
        try {
            const response = await http.post('addExpense', data);
            clearInputs();
            showToast('Expense added successfully')
            setIsSubmitting(false)
            handleGetExpenses()
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleEdit = (id, item, total_price, expenseCategory) => {
        setItemId(id);
        setItem(item);
        setExpenseCategory(expenseCategory);
        setTotalPrice(total_price.toString());
    }

    const handleUpdateExpense = async () => {
      setIsSubmitting(true)
        const data = {
            _id : item_id,
            item : item,
            expenseCategory : expenseCategory,
            total_price : Number(total_price),
        }
        try {
            const response = await http.patch('updateExpense/'+item_id, data);
            showToast('Expense updated successfully')
            handleGetExpenses()
            setIsSubmitting(false)
            clearInputs()
            setItemId('')
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleGetExpenses = async () => {
        const dateFilter = date.value.toLocaleDateString('EN-US', {
            year : '2-digit',
            month : '2-digit',
            day : '2-digit',
        })
        try {
            const response = await http.get('getExpenses?date='+dateFilter);
            setExpenses(response.data.expenses)
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleDeleteExpense = async (_id, item) => {
        Alert.alert(
            'Confirm delete',
            'Are you sure you want to delete ' + item + '?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async () => {
                    try {
                        const response = await http.delete('deleteExpense/'+_id);
                        showToast('Expense deleted successfully')
                        handleGetExpenses()
                    } catch (error) {
                        console.log(error.response)
                    }
                },
                style: 'cancel',
              },
            ],
            {
              cancelable: true
            },)
        
    }

    useEffect(() => {
        handleGetExpenses()
    }, [date])

    const isSubmitDisabled = () => {
      return item.length === 0 || total_price === 0 || expenseCategory.length === 0 || isSubmitting === true
    }

    // console.log(expenses)

  return (
    <View className="flex-1 flex flex-col bg-white">
        {/* Date picker */}
      <View className="w-full flex flex-col h-[60px] bg-white p-2 shadow">
        <Text className="text-center text-gray-500">Select Date</Text>
        <TouchableOpacity onPress={()=>setShowDatePicker(true)} >
        <Text className="text-center font-medium text-gray-800">{date.name}</Text>
        </TouchableOpacity>
        <DateTimePicker onCancel={()=>setShowDatePicker(false)} onConfirm={handleConfirm} mode='date' isVisible={showDatePicker} date={date.value} />
      </View>
      {/* Add expense fields */}
      <View className="w-full flex flex-row gap-3 mt-3 p-3">
        <View className="w-[250px] ">
            <Text className="text-sm pl-1.5 text-gray-500  w-[100px]">Item</Text>
            <TextInput value={item} onChangeText={(text)=>setItem(text)} className=" bg-white border rounded border-gray-300 px-2 py-2" placeholder="Enter item" />
        </View>
        <View className="w-[200px] ">
            <Text className="text-sm pl-1.5 text-gray-500  w-[100px]">Total</Text>
            <TextInput value={total_price} onChangeText={(text)=>setTotalPrice(text)} keyboardType='numeric' className=" bg-white border rounded border-gray-300 px-2 py-2" placeholder="Enter total price" />
        </View>
        <View className="w-[250px] h-[50px] ">
        <Text className="text-sm pl-1.5 text-gray-500  w-[200px]">Expense Category</Text>
        <Dropdown
          style={{borderColor: '#9ca3af', borderWidth: 1, height: 37, borderRadius: 4, paddingLeft: 10}}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={expenseCategories}
          value={expenseCategory}
          onChange={(value) => setExpenseCategory(value.value)}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          />
        </View>
        <View>
            <Text className="text-sm pl-1.5 text-white  w-[100px]">Total</Text>
            {
                item_id == '' ?
                <TouchableOpacity disabled={isSubmitDisabled()} onPress={handleAddExpense} className="bg-green-500 disabled:bg-green-300 h-[36px] rounded flex flex-col justify-center items-center  py-2">
                <Text className="text-sm text-white w-[100px] text-center">{isSubmitting ? 'Adding...' : 'Add'}</Text>
                </TouchableOpacity>
            :
            <TouchableOpacity disabled={isSubmitDisabled()} onPress={handleUpdateExpense} className="bg-blue-500 disabled:bg-blue-300 rounded flex flex-col justify-center items-center  py-2">
                <Text className="text-sm text-white w-[100px] text-center">{isSubmitting ? 'Updating...' : 'Update'}</Text>
            </TouchableOpacity>
            }
        </View>
      </View>
      {/* Expenses */}
      <ScrollView>
      <View className="w-full flex flex-col gap-3 mt-3 p-3">
       
        {
            expenses?.length !== 0 && expenses?.map((expense, index)=>{
                return (
                    <View className="flex flex-row justify-between items-center mt-2" key={index}>
                        <View className="flex flex-col w-[200px] ">
                            <Text className=" text-gray-800 font-medium text-base">{expense?.item}</Text>
                            <Text className="text-sm text-gray-500">₱{expense?.total_price}</Text>
                        </View>
                        <View className="flex flex-col justify-center w-[100px] ">
                            <Text className="text-base text-gray-500 text-center">{expense?.expenseCategory}</Text>
                        </View>
                        <View className="flex flex-row gap-3">
                            <TouchableOpacity onPress={()=>handleEdit(expense?._id, expense?.item, expense?.total_price, expense?.expenseCategory)}>
                                <Text className="text-green-500">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleDeleteExpense(expense?._id, expense?.item)}>
                                <Text className="text-red-500">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })
        }
        
      </View>
      </ScrollView>
    </View>
  )
}

export default Expenses

const styles = StyleSheet.create({
    dropdown: {
      height: 20,
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
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 30,
      fontSize: 16,
    },
  });