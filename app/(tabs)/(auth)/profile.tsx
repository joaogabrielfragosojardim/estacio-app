import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, useColorScheme, TouchableOpacity, Linking } from "react-native";
import { useSession } from "@/app/ctx";
import { getMe } from "@/api/user/get-me";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import { User } from "@/dtos/user";
import Avatar from "boring-avatars";
import { Text, View } from "@/components/themed";
import { color, mainColor } from "@/constants/color";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { userStore } from "@/store/user-store";

export default function Profile() {
  const { session } = useSession();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const store = userStore()
  const [userData, setUserData] = useState<User>();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (session) {
          const data = await getMe(session);
          setUserData(data);
          store.addUser(data as User)
        }
      } catch (e) {
        Toast.error(errorHandler(e));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={color[colorScheme ?? "light"].tint}
        />
      </View>
    );
  }

  const handleEditProfile = () => {
    router.replace("/edit-profile");
  };

  return (
    <View>
      <View style={styles.user}>
        <View style={styles.avatarContainer}>
          <Avatar size={40} variant="beam" name={userData?.username} />
          <Text>{userData?.username}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text
            style={styles.title}
          >{`${userData?.city}/${userData?.state}`}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <FontAwesome
              name="pencil"
              size={15}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}></View>
      <ToastManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  user: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "gray",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  avatarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    borderRadius: "100%",
    backgroundColor: mainColor,
  },
});
