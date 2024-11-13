import React from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Text, View } from "@/components/themed";
import { UserForm } from "@/components/forms/user-form";

export default function CreateAccount() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up! 📚 </Text>
      <View style={styles.separator} />
      <UserForm />
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
});
