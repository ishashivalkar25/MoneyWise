import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Background from "./Background";
import Btn from "./Btn";
import { darkGreen, green } from "./Constants";
import { useNavigation } from '@react-navigation/core';
import { auth } from '../Firebase/config' 

const Index = (props) => {
    
    const navigation = useNavigation();
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if(user && user.emailVerified){
            navigation.replace("HomePage");
            // console.log(user);
        }
        });
        return unsubscribe;
    }, []);
  
    return (
        <Background>
           <View style={{marginTop:40}}></View>
            <View style={{ marginHorizontal: 50, marginVertical: 50 ,alignItems: 'center'}}>
                <Text style={{ color: "#D0F0C0", fontSize: 40, fontWeight: "bold" ,}}>
                MoneyWise 
                </Text>
                <Text
                style={{
                    color: "#5E716A",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 40,
                }}
                >
               (Income & Expense Tracker)
                </Text>
                {/* <Lottie animationData={animation1} /> */}
            </View>
            
            <View
                style={{
                backgroundColor: "white",
                // marginTop: "700",
                height: 700,
                width: 420,
                borderTopLeftRadius: 140,
                borderTopEndRadius: 140,
                paddingTop: 80,
                marginTop:40
                }}
            >
                <View
                    style={{
                        backgroundColor: "lightgrey",
                        alignItems: "center",
                        // marginTop: "700",
                        height: 400,
                        width: 420,
                        borderTopLeftRadius: 140,
                        borderTopEndRadius: 140,
                        paddingTop: 80,
                    }}
                    >
                    <View
                        style={{
                        backgroundColor: "grey",
                        alignItems: "center",
                        // marginTop: "700",
                        height: 400,
                        width: 420,
                        borderTopLeftRadius: 140,
                        borderTopEndRadius: 140,
                        paddingTop: 80,
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                            > 
                            <Btn
                                bgColor={green}
                                textColor="white"
                                btnLabel="Login"
                                Press={() => props.navigation.navigate("Login")}
                            />
                            <Btn
                                bgColor="white"
                                textColor={darkGreen}
                                btnLabel="Signup"
                                Press={() => props.navigation.navigate("Sign Up")}
                            />
                        </View>
                    </View>
                </View>
            </View>  
        </Background>
    )
}

export default Index;

const styles = StyleSheet.create({})
