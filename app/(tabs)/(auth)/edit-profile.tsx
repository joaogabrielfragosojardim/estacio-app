import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/themed";
import { UserForm } from "@/components/forms/user-form";

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <UserForm edit />
      <View style={styles.separator} />
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
