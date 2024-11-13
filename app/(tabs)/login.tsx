import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Text, View } from "@/components/themed";
import { LoginForm } from "@/components/forms/login-form";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login! 📚 </Text>
      <View style={styles.separator} />
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
