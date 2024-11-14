import React from "react";
import { useSession } from "@/app/ctx";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { Text, View } from "../themed";
import { color } from "@/constants/color";
import { userStore } from "@/store/user-store";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { editUser } from "@/api/user/edit";
import { bookStore } from "@/store/book-store";
import { createBook } from "@/api/books/create-book";
import { errorHandler } from "@/utils/error-handler";

interface IForm {
  name: string;
  media: string;
  description: string;
}

export const BookForm = ({ edit }: { edit?: boolean }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session, signIn, signOut } = useSession();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const bookState = bookStore((state) => state.book);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      description: bookState?.description,
      media: bookState?.media,
      name: bookState?.name,
    },
  });

  const onSubmit = async (data: IForm) => {
    setLoading(true);
    try {
      if (edit) {
        await createBook(session as string, data);
        signOut();
        router.replace("/login");
      } else {
        await createBook(session as string, { ...data, media: image as string });
        router.replace("/profile");
      }
    } catch (e) {
      Toast.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Titúlo"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            maxLength={20}
          />
        )}
        name="name"
      />
      {errors.name && <Text>Titúlo é obrigatório.</Text>}
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Descrição"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
            }}
            value={value}
            keyboardType="numeric"
            maxLength={120}
            multiline
            numberOfLines={4}
          />
        )}
        name="description"
      />
      {errors.description && <Text>Descrição é obrigatória.</Text>}

      <View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button title="Escolha uma imagem" onPress={pickImage} />
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={color[colorScheme ?? "light"].tint}
          />
        ) : (
          <Button
            disabled={!image}
            color={color[colorScheme ?? "light"].tint}
            title={edit ? "Editar" : "Criar"}
            onPress={handleSubmit(onSubmit)}
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
  obs: {
    marginTop: 30,
  },
  image: {
    marginVertical: 20,
    width: 200,
    height: 200,
  },
  container: {
    marginVertical: 20,
  },
});
