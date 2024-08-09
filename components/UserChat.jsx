import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const UserChat = ({ item, userId }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const getLastMessage = () => {
    const n = messages.length;
    return messages[n - 1];
  };
  const lastMessage = getLastMessage();

  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = item?._id;
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
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("chatroom", {
          image: item?.profileImages[0],
          name: item?.name,
          receiverId: item?._id,
          senderId: userId,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 12,
      }}
    >
      <View>
        <Image
          style={{ width: 60, height: 60, borderRadius: 35 }}
          source={{ uri: item?.profileImages[0] }}
        />
      </View>
      <View>
        <Text
          style={{
            fontWeight: "500",
            color: "#de3163",
            fontSize: 15,
            fontFamily: "Kailasa",
          }}
        >
          {item?.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            marginTop: 6,
            fontFamily: "Lao Sangam MN",
          }}
        >
          {lastMessage ? lastMessage?.message : `Start Chat with ${item.name}`}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;
