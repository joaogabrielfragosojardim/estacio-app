import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

interface IForm {
  username: string;
  password: string;
}

export default function CreateAccount() {
  const { signIn } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const handleLogin = (data: IForm) => {
    signIn();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in! 🔥 </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
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
      <Button
        color="#780606"
        title="Sign in"
        onPress={handleSubmit(handleLogin)}
      />
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
