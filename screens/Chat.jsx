import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserChat from "../components/UserChat";

const Chat = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  // const getLastMessage = () => {
  //   const n = messages.length - 1;
  //   return messages[n-1]
  // }
  // const lastMessage = getLastMessage();

  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/messages", {
  //       params: { senderId, receiverId },
  //     });
  //     setMessages(response.data);
  //   } catch (error) {
  //     console.log("error fetching", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchMessages();
  // }, []);

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

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchData();
      }
    }, [userId])
  );
  // console.log(matches?.map((item, index) => (item.profileImages[0])))
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profiles...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Chats</Text>
          <Ionicons name="chatbox-ellipses-outline" size={25} />
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("select", {
              profiles: JSON.stringify(profiles),
              userId: userId,
            })
          }
          style={styles.likesButton}
        >
          <View style={styles.likesButtonIcon}>
            <Feather name="heart" size={24} />
          </View>
          <Text style={styles.likesText}>
            You have got {profiles?.length} likes
          </Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} />
        </Pressable>
        <View>
          {matches?.map((item, index) => (
            <UserChat key={index} userId={userId} item={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    padding: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  likesButton: {
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  likesButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  likesText: {
    fontSize: 17,
    marginLeft: 10,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
