import React from "react";
import { login } from "@/api/auth/login";
import { useSession } from "@/app/ctx";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  Linking,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { errorHandler } from "@/utils/error-handler";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { View, Text } from "../themed";
import { color } from "@/constants/color";


interface ILoginForm {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const { signIn } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const handleLogin = async (data: ILoginForm) => {
    setLoading(true);
    try {
      const loginToken = await login(data);
      const { access_token } = loginToken;
      signIn(access_token);
      Linking.openURL("/");
    } catch (e) {
      Toast.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Username"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />
      {errors.username && <Text>Username é obrigatório.</Text>}
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Senha"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password é obrigatório.</Text>}
      <View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={color[colorScheme ?? "light"].tint}
          />
        ) : (
          <Button
            color={color[colorScheme ?? "light"].tint}
            title="Login"
            onPress={handleSubmit(handleLogin)}
          />
        )}
      </View>
      <ToastManager />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});


