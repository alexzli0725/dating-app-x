import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bottom from "./bottom";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Door from "../screens/Door";

const index = () => {
  const Stark = createNativeStackNavigator();
  return (
    <Stark.Navigator screenOptions={{ headerShown: false }}>
      <Stark.Screen name="login" component={Login} />
      <Stark.Screen name="register" component={Register} />
      <Stark.Screen name="door" component={Door} />
      <Stark.Screen name="bottom" component={Bottom} />
    </Stark.Navigator>
  );
};

export default index;
