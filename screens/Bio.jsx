import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Button,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useId, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const Bio = () => {
  const [option, setOption] = useState("AD");
  const [description, setDescription] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTurnOns, setSelectedTurnOns] = useState([]);
  const [lookingOptions, setLookingOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const profileImages = [
    {
      image:
        "https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/1215695/pexels-photo-1215695.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/7580971/pexels-photo-7580971.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];
  const turnons = [
    {
      id: "0",
      name: "Music",
      description: "Pop Rock-Indie pick our sound track",
    },
    {
      id: "10",
      name: "Kissing",
      description:
        " It's a feeling of closeness, where every touch of lips creates a symphony of emotions.",
    },
    {
      id: "1",
      name: "Fantasies",
      description:
        "Fantasies can be deeply personal, encompassing diverse elements such as romance",
    },
    {
      id: "2",
      name: "Nibbling",
      description:
        "playful form of biting or taking small, gentle bites, typically done with the teeth",
    },
    {
      id: "3",
      name: "Desire",
      description: "powerful emotion or attainment of a particular person.",
    },
  ];
  const data = [
    {
      id: "0",
      name: "Casual",
      description: "Let's keep it easy and see where it goes",
    },
    {
      id: "1",
      name: "Long Term",
      description: "How about a one life stand",
    },
    {
      id: "2",
      name: "Virtual",
      description: "Let's have some virtual fun",
    },
    {
      id: "3",
      name: "Open for Anything",
      description: "Let's Vibe and see where it goes",
    },
  ];
  const updateUserDescription = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/description`,
        {
          description: description,
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Description updated successfully");
        await AsyncStorage.setItem("description", description);
      }
    } catch (error) {
      console.log("error updating the user description");
    }
  };
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);

          // Attempt to load data from AsyncStorage
          const savedDescription = await AsyncStorage.getItem("description");
          const savedImages = await AsyncStorage.getItem("images");
          const savedTurnOns = await AsyncStorage.getItem("turnOns");
          const savedLookingFor = await AsyncStorage.getItem("lookingFor");

          if (savedDescription) setDescription(savedDescription);
          if (savedImages) setImages(JSON.parse(savedImages));
          if (savedTurnOns) setSelectedTurnOns(JSON.parse(savedTurnOns));
          if (savedLookingFor) setLookingOptions(JSON.parse(savedLookingFor));

          // Fetch latest user data from the server
          const response = await axios.get(
            `http://localhost:3000/users/${userId}`
          );
          const user = response.data?.user;

          if (user) {
            setDescription(user.description || "");
            setImages(user.profileImages || []);
            setSelectedTurnOns(user.turnOns || []);
            setLookingOptions(user.lookingFor || []);

            // Update AsyncStorage with the latest data
            await AsyncStorage.setItem("description", user.description || "");
            await AsyncStorage.setItem(
              "images",
              JSON.stringify(user.profileImages || [])
            );
            await AsyncStorage.setItem(
              "turnOns",
              JSON.stringify(user.turnOns || [])
            );
            await AsyncStorage.setItem(
              "lookingFor",
              JSON.stringify(user.lookingFor || [])
            );
          }
        }
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);
  const handleToggleTurnOn = (turnOn) => {
    if (selectedTurnOns.includes(turnOn)) {
      removeTurnOn(turnOn);
    } else {
      addTurnOn(turnOn);
    }
  };
  const handleAddImage = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/profile-images`,
        {
          imageUrl: imageUrl,
        }
      );

      if (response.status === 200) {
        // Update the local state with the new image
        const updatedImages = [...images, imageUrl];
        setImages(updatedImages);
        setImageUrl("");

        // Save the updated images array to AsyncStorage
        await AsyncStorage.setItem("images", JSON.stringify(updatedImages));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const addTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/add`,
        {
          turnOn: turnOn,
        }
      );
      if (response.status === 200) {
        const updatedTurnOns = [...selectedTurnOns, turnOn];
        setSelectedTurnOns(updatedTurnOns);
        await AsyncStorage.setItem("turnOns", JSON.stringify(updatedTurnOns));
      }
    } catch (error) {
      console.log("error adding turn on");
    }
  };
  const removeTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/remove`,
        {
          turnOn: turnOn,
        }
      );
      if (response.status === 200) {
        const updatedTurnOns = selectedTurnOns.filter(
          (item) => item !== turnOn
        );
        setSelectedTurnOns(updatedTurnOns);
        await AsyncStorage.setItem("turnOns", JSON.stringify(updatedTurnOns));
      }
    } catch (error) {
      console.log("error removing turn on", error);
    }
  };

  useEffect(() => {
    // Load the active slide from AsyncStorage when the component mounts
    const loadActiveSlide = async () => {
      try {
        const savedActiveSlide = await AsyncStorage.getItem("activeSlide");
        if (savedActiveSlide !== null) {
          setActiveSlide(parseInt(savedActiveSlide));
        }
      } catch (error) {
        console.log("Error loading active slide", error);
      }
    };

    loadActiveSlide();
  }, []);

  const handleSnapToItem = async (index) => {
    setActiveSlide(index);
    try {
      await AsyncStorage.setItem("activeSlide", index.toString());
    } catch (error) {
      console.log("Error saving active slide", error);
    }
  };

  const renderImageCarousel = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: "85%",
            resizeMode: "cover",
            height: 290,
            borderRadius: 10,
            transform: [{ rotate: "-5deg" }],
          }}
          source={{ uri: item }}
        />
        <Text
          style={{ position: "absolute", top: 10, right: 10, color: "black" }}
        >
          {activeSlide + 1}/{images.length}
        </Text>
      </View>
    );
  };
  const handleOption = (lookingFor) => {
    if (lookingOptions.includes(lookingFor)) {
      removeLookingFor(lookingFor);
    } else {
      addLookingFor(lookingFor);
    }
  };

  const addLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for`,
        {
          lookingFor: lookingFor,
        }
      );
      if (response.status == 200) {
        setLookingOptions([...lookingOptions, lookingFor]);
        await AsyncStorage.setItem(
          "lookingFor",
          JSON.stringify([...lookingOptions, lookingFor])
        );
      }
    } catch (error) {
      console.log("error adding looking for", error);
    }
  };

  const removeLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for/remove`,
        {
          lookingFor: lookingFor,
        }
      );

      if (response.status === 200) {
        setLookingOptions(lookingOptions.filter((item) => item !== lookingFor));
        await AsyncStorage.setItem(
          "lookingFor",
          JSON.stringify(lookingOptions.filter((item) => item !== lookingFor))
        );
      }
    } catch (error) {
      console.log("error removing looking for: ", error);
    }
  };
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };
  const randomImage = getRandomImage();
  return (
    <View>
      <View>
        <Image
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
          source={{
            uri: randomImage,
          }}
        />
        <View>
          <View>
            <Pressable
              style={{
                padding: 10,
                backgroundColor: "#dda0dd",
                width: 300,
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                position: "absolute",
                top: -60,
                left: "50%",
                transform: [{ translateX: -150 }],
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  resizeMode: "cover",
                }}
                source={{
                  uri: "https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800",
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 6 }}>
                Bangalore
              </Text>
              <Text style={{ marginTop: 4, fontSize: 15 }}>
                22 years 110 days
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 80,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 25,
          justifyContent: "center",
        }}
      >
        <Pressable onPress={() => setOption("AD")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "AD" ? "black" : "gray",
            }}
          >
            AD
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Photos")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Photos" ? "black" : "gray",
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Turn-ons")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Turn-ons" ? "black" : "gray",
            }}
          >
            Turn-ons
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Looking For")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Looking For" ? "black" : "gray",
            }}
          >
            Looking For
          </Text>
        </Pressable>
      </View>
      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option == "AD" && (
          <View
            style={{
              borderColor: "#202020",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              height: 300,
            }}
          >
            <TextInput
              value={description}
              multiline
              onChangeText={(text) => setDescription(text)}
              style={{
                fontFamily: "Helvetica",
                fontSize: description ? 17 : 17,
              }}
              placeholder="write your AD for people to like you"
              placeholderTextColor={"black"}
            />
            <Pressable
              onPress={updateUserDescription}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                backgroundColor: "black",
                borderRadius: 5,
                justifyContent: "center",
                padding: 10,
                marginTop: "auto",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Publish in feed
              </Text>
              <Entypo name="mask" size={24} color="white" />
            </Pressable>
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option == "Photos" && (
          <View>
            <Carousel
              data={images}
              renderItem={renderImageCarousel}
              sliderWidth={350}
              itemWidth={300}
              onSnapToItem={handleSnapToItem}
              firstItem={activeSlide}
            />
            <View style={{ marginTop: 25 }}>
              <Text>Add a picture of yourself</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                  backgroundColor: "#dcdcdc",
                }}
              >
                <Entypo
                  style={{ marginLeft: 8, color: "gray" }}
                  name="image"
                  size={24}
                />
                <TextInput
                  value={imageUrl}
                  onChangeText={(text) => setImageUrl(text)}
                  style={{ color: "gray", marginVertical: 10, width: 300 }}
                  placeholder="enter your image url"
                />
              </View>
              <View style={{ marginTop: 5 }}>
                <Button onPress={handleAddImage} title="Add Image" />
              </View>
            </View>
          </View>
        )}
      </View>
      <View>
        {option == "Turn-ons" && (
          <View>
            {turnons.map((item) => (
              <Pressable
                onPress={() => handleToggleTurnOn(item?.name)}
                style={{
                  backgroundColor: selectedTurnOns.includes(item?.name)
                    ? "#24F595"
                    : "#fffdd0",
                  padding: 10,
                  marginVertical: 10,
                  marginHorizontal: 14,
                }}
                key={item.id}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 4,
                    fontSize: 15,
                    color: "gray",
                  }}
                >
                  {item.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option == "Looking For" && (
          <>
            <View>
              <FlatList
                columnWrapperStyle={{ justifyContent: "space-around" }}
                numColumns={2}
                data={data}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleOption(item?.name)}
                    style={{
                      backgroundColor: lookingOptions.includes(item?.name)
                        ? "#fd5c63"
                        : "white",
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 150,
                      margin: 10,
                      borderRadius: 5,
                      borderColor: "#fd5c63",
                      borderWidth: lookingOptions.includes(item?.name)
                        ? "transparent"
                        : 0.7,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: 13,
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "black",
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        width: 140,
                        marginTop: 10,
                        fontSize: 13,
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "gray",
                      }}
                    >
                      {item?.description}
                    </Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Bio;
