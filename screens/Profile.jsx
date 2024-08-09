import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ProfileDoor from "../components/ProfileDoor";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null); // Changed to null to better handle loading state
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userId);
        }
      } catch (error) {
        console.log("Error fetching user token:", error);
        setError("Failed to retrieve user token.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserDescription = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `http://localhost:3000/users/${userId}`
          );
          setUser(response.data?.user || {});
        }
      } catch (error) {
        console.log("Error fetching user description:", error);
        setError("Failed to retrieve user description.");
      }
    };
    fetchUserDescription();
  }, [userId]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (userId && user) {
          const response = await axios.get("http://localhost:3000/profiles", {
            params: {
              userId: userId,
              gender: user.gender,
              turnOns: user.turnOns,
              lookingFor: user.lookingFor,
            },
          });
          setProfiles(response.data.profiles || []);
        }
      } catch (error) {
        console.log("Error fetching profiles:", error);
        setError("Failed to retrieve profiles.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [userId, user]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={profiles}
        renderItem={({ item, index }) => (
          <ProfileDoor
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
