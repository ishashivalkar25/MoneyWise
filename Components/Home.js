import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { auth } from '../Firebase/config'
import { useNavigation } from '@react-navigation/core';

const Home = () => {

    const navigation = useNavigation();


    const signOutFromAcc = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
                console.log("Sign out")
            })
            .catch(error => alert("Cannot signout from the application!!"));
    }
    return (
        <View>
            <Text>Home</Text>
            <Button title="Sign Out" onPress={signOutFromAcc}></Button>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})
