import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
const Door = () => {
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  const updateUserGender = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/gender`,
        {
          gender: option,
        }
      );
      console.log(response.data);
      if (response.status == 200) {
        navigation.navigate("bottom", {
          screen: "bio",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 12 }}>
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "male" ? "#d0d0d0" : "transparent",
          borderWidth: option == "male" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I'm a Man</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "female" ? "#d0d0d0" : "transparent",
          borderWidth: option == "female" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I'm a Woman</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("non-binary")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "non-binary" ? "#d0d0d0" : "transparent",
          borderWidth: option == "non-binary" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I'm Non-Binary</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>

      {option && (
        <Pressable
          onPress={updateUserGender}
          style={{
            marginTop: 25,
            backgroundColor: "black",
            padding: 12,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Done
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default Door;
