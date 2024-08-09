import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    // send a POST  request to the backend API to register the user
    axios
      .post("http://localhost:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
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
          Register to your Account
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
          <Ionicons
            style={{ marginLeft: 8, color: "white" }}
            name="person-sharp"
            size={24}
          />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter your name"
            placeholderTextColor={"white"}
            style={{
              color: "white",
              marginVertical: 10,
              width: 300,
              fontSize: name ? 17 : 17,
            }}
          />
        </View>
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
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            placeholderTextColor={"white"}
            style={{
              color: "white",
              marginVertical: 10,
              width: 300,
              fontSize: password ? 17 : 17,
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
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="Enter your password"
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 17 : 17,
              }}
              placeholderTextColor="white"
            />
          </View>
        </View>
        <Pressable
          onPress={handleRegister}
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
            Register
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("login")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Register;
