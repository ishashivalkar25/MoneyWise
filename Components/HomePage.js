import * as React from 'react'
import {Text,View,Button,StyleSheet,Image, ImageBackground, TouchableOpacity, Dimensions} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { auth , db } from '../Firebase/config'

const Tab = createMaterialTopTabNavigator();
const BTab = createBottomTabNavigator();
const {height, width} = Dimensions.get('window');
import { useNavigation } from '@react-navigation/core';
import Background from './Background';

function Income(props){
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
    return(
        <>
         <View style={{width:'100%'}}>
            <ImageBackground
                source={require('../assets/background4.jpg')}
                style={{ height: "100%",flexDirection:'column',justifyContent:'flex-end'}}
            >
                <View style={{justifyContent:'center',alignItems: 'center',marginBottom:40}}>
                <View 
                    style={{width:70,
                    height:70,
                    borderRadius:35,
                    backgroundColor:"#006A42",
                    justifyContent:'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop:5,
                    marginBottom:5 
                }}
                onStartShouldSetResponder={()=>{props.navigation.navigate('AddIncome')}}
                >
                <Image source={require('../assets/plus.jpeg')}
                style={{width:30,height:30}}
                onPress={() => console.log('image pressed')}
                />
                </View>
                </View>

           
            
           <View style={{fontWeight:'50%',borderTopLeftRadius:140,borderTopEndRadius: 140,width:(width*0.9),alignSelf:'center'}}>
            <Button color="grey" style={{fontWeight:'50%',borderRadius:15,marginBottom:10}} title="Sign Out" onPress={signOutFromAcc}></Button>
          </View>
          </ImageBackground>
         </View>
   
       
        </>
    )
}

function Expense(props){
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
    return(
        <>
         <View style={{width:'100%'}}>
            <ImageBackground
                source={require('../assets/background4.jpg')}
                style={{ height: "100%",flexDirection:'column',justifyContent:'flex-end'}}
            >
                <View style={{justifyContent:'center',alignItems: 'center',marginBottom:40}}>
                <View 
                    style={{width:70,
                    height:70,
                    borderRadius:35,
                    backgroundColor:"#006A42",
                    justifyContent:'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop:5,
                    marginBottom:5 
                }}
                onStartShouldSetResponder={()=>{props.navigation.navigate('AddExpense')}}
                >
                <Image source={require('../assets/plus.jpeg')}
                style={{width:30,height:30}}
                onPress={() => console.log('image pressed')}
                />
                </View>
                </View>

           
            
            <View style={{fontWeight:'50%',borderTopLeftRadius:140,borderTopEndRadius: 140,width:(width*0.9),alignSelf:'center'}}>
                <Button color="grey" style={{fontWeight:'50%',borderRadius:15,marginBottom:10}} title="Sign Out" onPress={signOutFromAcc}></Button>
            </View>
          </ImageBackground>
         </View>
        </>
    )
}

function MyTabs({navigation}) {

    const insets = useSafeAreaInsets();

    return(
        <Tab.Navigator
        initialRouteName="Income"
        tabBarOptions={{
            activeTintColor:'green',
            labelStyle:{fontSize:16},
            style:{backgroundColor:'white',marginTop:insets.top}
        }}>
            <Tab.Screen 
            name="Income"
            component={Income} 
            />

            <Tab.Screen 
            name="Expense"
            component={Expense} 
            options={{tabBarLabel:'Expense'}}/>

            
        </Tab.Navigator>
    )
}

const Add=({children,onPress})=>{
    <TouchableOpacity 
    style={{
        top:-30,
        justifyContent:'center',
        alignItems: 'center',
        ...styles.shadow
    }}
    onPress={onPress}>
        <View
        style={{
            width: 70,
            height: 70,
            borderRadius:35,
            backgroundColor:'red'   //'#e32f45'
        }}>
            {children}
        </View>
    </TouchableOpacity>
}

function BottomTab(){
    return(
        <BTab.Navigator
        tabBarOptions={{
            showLabel:false,
            style: {
                position: 'absolute',
                bottom: 25,
                left:20,
                right:20,
                elevation: 0,
                backgroundColor:'skyblue',
                borderRadius: 15,
                height:90,
                ...styles.shadow
            }
        }}>
            <BTab.Screen name="Add" component={Add}
            options={{
                tabBarIcon: ({focused})=>(
                    <Image
                    source={require('../assets/plus.jpeg')}
                    resizeMode="contain"
                    style={{
                        width:30,
                        height:30,
                        tintColor:'#fff'
                    }}
                    />
                ),
                tabBarButton:(props)=>(
                    <Add {...props} />
                )
            }}
                />
        </BTab.Navigator>
    )
}

export default function HompePage({navigation}){
    return(
        // <NavigationContainer independent={true}>
           <View style={{flex:1,flexDirection: 'column'}}>
            <MyTabs navigation={navigation}/>
            {/* <Background></Background> */}
           </View>
        // </NavigationContainer>
    )
}

const styles = StyleSheet.create({

    shadow:{
        shadowColor:'#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity:0.25,
        shadowRadius: 3.5,
        elevation:5


    }
})