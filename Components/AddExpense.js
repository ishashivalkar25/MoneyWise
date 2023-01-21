import React from 'react'
import { View, Text, Linking} from 'react-native'
import { darkGreen } from "./Constants";
import Btn from "./Btn";

export default function AddExpense() {

    const addExpenseByScanningBills = () => {
     
    }

    const redirectToPaymentApps = () => {
        
    }
    
    const addExpenseManually = () => {
        
    }
    return (
        <View>
            <Text>Add Expense</Text>
            {/* <Btn
              textColor="white"
              bgColor={darkGreen}
              btnLabel="Scan Receipt"
              Press={addExpenseByScanningBills}
            />
            <Btn
              textColor="white"
              bgColor="pink"
              btnLabel="Redirect to Payment Apps"
              Press={() => Linking.openURL("myapp://GPay/" )}
            />
            <Btn
              textColor="white"
              bgColor={darkGreen}
              btnLabel="Mannually Add Expense Record"
              Press={addExpenseManually}
            /> */}
        </View>
    )
}
