import {
  ActivityIndicator,
  Button,
  Linking,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { useSession } from "../ctx";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { login } from "@/api/auth/login";
import { errorHandler } from "@/utils/error-handler";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { useState } from "react";
import { Text, View } from "@/components/themed";
import { LoginForm } from "@/components/forms/login-form";

interface IForm {
  username: string;
  password: string;
}

export default function Login() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const { signIn } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const handleLogin = async (data: IForm) => {
    setLoading(true)
    try {
      const loginToken = await login(data);
      const { access_token } = loginToken;
      signIn(access_token);
      Linking.openURL("/");
    } catch (e) {
      Toast.error(errorHandler(e));
    } finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <ToastManager />
      <Text style={styles.title}>Login! 📚 </Text>
      <View
        style={styles.separator}
      />
      <LoginForm />
      <Link href="/create-account" style={styles.dontHaveAccount}>
        Don't have an account? create one
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dontHaveAccount: {
    marginTop: 30,
    fontSize: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});
