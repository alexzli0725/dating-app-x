import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          navigation.navigate("bottom", {
            screen: "bio",
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:3000/login", user);
      const token = response.data.token;
      await AsyncStorage.setItem("auth", token);
      navigation.navigate("door");
    } catch (error) {
      Alert.alert("Login Error", "An error occurred while logging in");
      console.log("login failed", error);
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "pink", width: "100%" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Image
            style={{ width: 80, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
            fontFamily: "GillSans-SemiBold",
          }}
        >
          Match Mate
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            marginTop: 25,
            color: "#f9629f",
          }}
        >
          Log in to your Account
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Image
          style={{ width: 120, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
          }}
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#ffc0cb",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 30,
          }}
        >
          <MaterialIcons
            style={{ marginLeft: 8, color: "white" }}
            name="email"
            size={24}
          />
          <TextInput
            value={email}
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter your email"
            placeholderTextColor="white"
            style={{
              color: "white",
              marginVertical: 10,
              width: 300,
              fontSize: email ? 17 : 17,
            }}
          />
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#ffc0cb",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="white"
            />
            <TextInput
              value={password}
              onChangeText={(e) => setPassword(e)}
              secureTextEntry={true}
              placeholder="Enter your password"
              placeholderTextColor="white"
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 17 : 17,
              }}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ color: "#007fff", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>
        <Pressable
          onPress={handleLogin}
          style={{
            marginTop: 50,
            width: 200,
            backgroundColor: "#ffc0cb",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Login;
