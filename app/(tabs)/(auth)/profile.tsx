import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { useSession } from "@/app/ctx";
import { useEffect, useState } from "react";
import { getMe } from "@/api/user/get-me";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import { User } from "@/dtos/user";
import Colors from "@/constants/Colors";
import Avatar from "boring-avatars";
import { Text, View } from "@/components/Themed";

export default function Profile() {
  const { session } = useSession();
  const colorScheme = useColorScheme();

  const [userData, setUserData] = useState<User>();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (session) {
          const data = await getMe(session);
          setUserData(data);
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
          color={Colors[colorScheme ?? "light"].tint}
        />
      </View>
    );
  }

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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "100%",
    backgroundColor: "gray",
  },
});
