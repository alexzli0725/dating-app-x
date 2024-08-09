import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const Select = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { profiles, userId } = route.params;
  const Parprofiles = JSON.parse(profiles);
  const handleMatch = async (selectedUserId) => {
    try {
      await axios.post("http://localhost:3000/create-match", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });
      navigation.navigate("chart");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
      <ScrollView style={{ marginHorizontal: 14 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 18,
            }}
          >
            <Text style={{ textAlign: "center", fontFamily: "Optima" }}>
              Nearby
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 18,
            }}
          >
            <Text style={{ textAlign: "center", fontFamily: "Optima" }}>
              Looking for
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 18,
            }}
          >
            <Text style={{ textAlign: "center", fontFamily: "Optima" }}>
              Turn-Ons
            </Text>
          </View>
        </View>
        {Parprofiles?.length > 0 ? (
          <View style={{ marginTop: 20 }}>
            {Parprofiles?.map((item, index) => (
              <View key={index} style={{ marginVertical: 15 }}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 50,
                    }}
                  >
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
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
                    <Pressable
                      onPress={() => handleMatch(item._id)}
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
                  </View>
                </View>
                <View>
                  <Text>Turn Ons</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {item?.turnOns?.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "#de3163",
                          padding: 10,
                          borderRadius: 22,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontWeight: "500",
                            fontFamily: "Optima",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text>Looking For</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {item?.lookingFor?.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "#fbceb1",
                          padding: 10,
                          borderRadius: 22,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontWeight: "500",
                            fontFamily: "Optima",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/1642/1642611.png",
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Optima",
                  textAlign: "center",
                }}
              >
                UH - OH{" "}
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Georgia-Bold",
                    color: "#ff6984",
                  }}
                >
                  No likes yet
                </Text>
              </Text>
              <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600" }}>
                Improve your AD to get better likes
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Select;
