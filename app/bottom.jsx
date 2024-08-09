import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bio from "../screens/Bio";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Select from "../screens/Select";
import Chatroom from "../screens/Chatroom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ChatBox = () => {
  const [matches, setMatches] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();
  const fetchData = async () => {
    try {
      const [likesResponse, matchesResponse] = await Promise.all([
        axios.get(`http://localhost:3000/received-likes/${userId}/details`),
        axios.get(`http://localhost:3000/users/${userId}/matches`),
      ]);

      setProfiles(likesResponse.data.receivedLikesArray);
      setMatches(matchesResponse.data.matches);
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);
  const firstProfileImage =
    matches?.length > 0 ? matches[0].profileImages[0] : null;
  const Stark = createNativeStackNavigator();
  return (
    <Stark.Navigator>
      <Stark.Screen
        options={{ headerShown: false }}
        name="chart"
        component={Chat}
      />
      <Stark.Screen
        options={{ headerShown: false }}
        name="select"
        component={Select}
      />
      <Stark.Screen
        name="chatroom"
        component={Chatroom}
        options={{
          headerTitle: "",
          headerLeft: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons
                onPress={() => navigation.navigate("chart")}
                name="arrow-back"
                size={24}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: firstProfileImage }}
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {matches[0].name}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialCommunityIcons name="dots-vertical" size={24} />
              <Ionicons name="videocam-outline" size={24} />
            </View>
          ),
        }}
      />
    </Stark.Navigator>
  );
};

const Bottom = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="eye" size={24} />
            ) : (
              <Feather name="eye" size={24} color="gray" />
            ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatBox}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="chatbubble-ellipses-outline" size={24} />
            ) : (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />
      <Tab.Screen
        name="bio"
        component={Bio}
        options={{
          title: "account",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="guy-fawkes-mask" size={24} />
            ) : (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="gray"
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Bottom;
