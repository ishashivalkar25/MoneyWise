import React from 'react'
import { StyleSheet, Text, View ,Button} from 'react-native'

export default function ScanBills() {
   
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello</Text>
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      
    },
    text : {
      color: '#9c27b0'
    },
  });