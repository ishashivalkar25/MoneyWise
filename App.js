import React from 'react';
import { Image, TouchableOpacity, View, StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import Index from './Components/Index';
import HomePage from './Components/HomePage';
import AddIncome from './Components/AddIncome';
import AddExpense from './Components/AddExpense';
import Header from "./Components/Header";
import Visualisation from "./Components/Visualisation";
import { SafeAreaProvider } from 'react-native-safe-area-context'


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <StatusBar></StatusBar>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Index" component={Index} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{headerTitle: () => <Header></Header>}}/>
          <Stack.Screen name="Sign Up" component={SignUp} options={{headerTitle: () => <Header></Header>}}/>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerTitle: () => <Header></Header>,
              headerRight: () => (
                <View>
                  <TouchableOpacity >
                    <Image
                      source={require("./assets/log-out.png")}
                      style={{ width: 27, height: 27, alignSelf: "center" }}
                    />
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                shadowColor: "#000",
                elevation: 25,
                color:"black"
              },
            }}
          />
          <Stack.Screen name="AddIncome" component={AddIncome} options={{headerTitle: () => <Header></Header>}}/>
          <Stack.Screen name="AddExpense" component={AddExpense} options={{headerTitle: () => <Header></Header>}}/>
          <Stack.Screen name="Visualisation" component={Visualisation} options={{headerTitle: () => <Header></Header>}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
