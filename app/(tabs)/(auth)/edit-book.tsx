import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/themed";
import { BookForm } from "@/components/forms/book-form";

export default function EditBook() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar livro! 📚 </Text>
      <View style={styles.separator} />
      <BookForm edit />
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
