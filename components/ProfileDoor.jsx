import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";

const ProfileDoor = ({ item, isEven, userId, setProfiles }) => {
  const colors = ["#f0f8ff", "#FFF4FF"];
  const [liked, setLiked] = useState(false);
  const [selected, setSelected] = useState(false);
  const handleLike = async (selectedUserId) => {
    try {
      setLiked(true);
      await axios.post("http://localhost:3000/send-like", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });
      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setLiked(false);
      }, 200);
    } catch (error) {
      console.log("error liking", error);
    }
  };
  const handleLikeOther = async (selectedUserId) => {
    try {
      setSelected(true);
      await axios.post("http://localhost:3000/send-like", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });
      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setSelected(false);
      }, 200);
    } catch (error) {
      console.log("error liking", error);
    }
  };
  if (isEven) {
    return (
      <View style={{ padding: 12, backgroundColor: colors[0] }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: "Optima",
                  marginBottom: 8,
                }}
              >
                {item?.description.length > 160
                  ? item?.description.substr(0, 160) + "..."
                  : item?.description}
              </Text>
            </View>
            {item.profileImages.slice(0, 1).map((dim, index) => (
              <View key={index} style={{ position: "relative" }}>
                <Image
                  key={dim.id}
                  style={{
                    width: 280,
                    height: 280,
                    resizeMode: "contain",
                    borderRadius: 5,
                  }}
                  source={{ uri: dim }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#e0e0e0",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 25,
                }}
              >
                <FontAwesome name="diamond" size={27} color="#de3163" />
              </Pressable>
              {liked ? (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#ff033e",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="white" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleLike(item?._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#ff033e",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  } else {
    return (
      <View style={{ padding: 12, backgroundColor: colors[1] }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            {item.profileImages.slice(0, 1).map((dim, index) => (
              <View key={index} style={{ position: "relative" }}>
                <Image
                  key={dim.id}
                  style={{
                    width: 280,
                    height: 280,
                    resizeMode: "contain",
                    borderRadius: 5,
                  }}
                  source={{ uri: dim }}
                />
              </View>
            ))}
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: "Optima",
                  marginBottom: 8,
                }}
              >
                {item?.description.length > 160
                  ? item?.description.substr(0, 160) + "..."
                  : item?.description}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="darkgray" />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#e0e0e0",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 25,
                }}
              >
                <FontAwesome name="diamond" size={27} color="#0066b2" />
              </Pressable>
              {selected ? (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#6699cc",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="white" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleLikeOther(item._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#6699cc",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  }
};

export default ProfileDoor;
