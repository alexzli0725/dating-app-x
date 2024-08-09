import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";
import { io } from "socket.io-client";
import axios from "axios";

const Chatroom = ({ route }) => {
  const { image, name, receiverId, senderId } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:8000");
  socket.on("connect", () => {
    console.log("Connected to the Socket.IO server");
    socket.on("receiveMessage", (newMessage) => {
      console.log("new Message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  });
  const sendMessage = async (senderId, receiverId) => {
    socket.emit("sendMessage", { senderId, receiverId, message });
    setMessage("");
    setTimeout(() => {
      fetchMessages();
    },200)
  };
  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/messages", {
        params: { senderId, receiverId },
      });
      setMessages(response.data);
    } catch (error) {
      console.log("error fetching", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {messages.map((item, index) => (
          <Pressable
            style={[
              item?.senderId === senderId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#f08080",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "#d87093",
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },
            ]}
            key={index}
          >
            <Text
              style={{
                fontSize: 13,
                textAlign: "left",
                color: "white",
                fontWeight: "500",
              }}
            >
              {item?.message}
            </Text>
            <Text
              style={{
                fontSize: 9,
                textAlign: "right",
                color: "#f0f0f0",
                marginTop: 5,
              }}
            >
              {formatTime(item?.timestamp)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 1,
        }}
      >
        <Entypo
          style={{ marginRight: 7 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => sendMessage(senderId, receiverId)}
          style={{
            backgroundColor: "#007bff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatroom;
