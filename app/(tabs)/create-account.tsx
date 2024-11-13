import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, TextInput, useColorScheme } from "react-native";
import { useSession } from "../ctx";
import { Link } from "expo-router";
import * as Linking from 'expo-linking';
import { Controller, useForm } from "react-hook-form";
import { singUp } from "@/api/auth/sing-up";
import { getCepData } from "@/api/auth/get-cep";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import Colors from "@/constants/Colors";
import { Text, View } from "@/components/Themed";


interface IForm {
  username: string;
  password: string;
  cep: string;
  city: string;
  state: string;
}

export default function CreateAccount() {
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { signIn } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IForm>();

  const handleLogin = async (data: IForm) => {
    setLoading(true);
    try {
      const loginToken = await singUp(data);
      const { access_token } = loginToken;
      signIn(access_token);
      Linking.openURL("/");
    } catch (e) {
      Toast.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const data = await getCepData(cep);
        setValue("city", data.localidade);
        setValue("state", data.uf);
      } catch (error) {
        Toast.error("Erro ao buscar dados do CEP.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <ToastManager />
      <Text style={styles.title}>Sign Up! 📚 </Text>
      <View
        style={styles.separator}
      />
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
      {errors.username && <Text>Username is required.</Text>}
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            secureTextEntry
            placeholder="Password"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password is required.</Text>}

      {/* Campo de CEP */}
      <Controller
        control={control}
        rules={{ required: true, pattern: /^[0-9]{5}-?[0-9]{3}$/ }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="CEP"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              handleCepChange(text);
            }}
            value={value}
            keyboardType="numeric"
          />
        )}
        name="cep"
      />
      {errors.cep && <Text>CEP é obrigatório e deve ser válido.</Text>}

      <Controller
        control={control}
        render={({ field: { value } }) => (
          <TextInput
            placeholder="City"
            style={[styles.input, { backgroundColor: "#f0f0f0" }]}
            value={value}
            editable={false}
          />
        )}
        name="city"
      />

      <Controller
        control={control}
        render={({ field: { value } }) => (
          <TextInput
            placeholder="State"
            style={[styles.input, { backgroundColor: "#f0f0f0" }]}
            value={value}
            editable={false}
          />
        )}
        name="state"
      />

      <View>
        {loading ? (
          <ActivityIndicator size="large" color={Colors[colorScheme ?? "light"].tint} />
        ) : (
          <Button
            color={Colors[colorScheme ?? "light"].tint}
            title="Login"
            onPress={handleSubmit(handleLogin)}
          />
        )}
      </View>
      <Link href="/login" style={styles.dontHaveAccount}>
        Already have an account? login
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
