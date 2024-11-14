import { useSession } from "@/app/ctx";
import { Text, View } from "./themed";
import { useCallback, useState } from "react";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
} from "react-native";
import { color, mainColor } from "@/constants/color";
import { useFocusEffect } from "expo-router";
import { getBooks } from "@/api/books/get-books";
import { BookWithUser } from "@/dtos/book-with-user";
import Avatar from "boring-avatars";

export const HomeBookList = () => {
  const { session } = useSession();
  const colorScheme = useColorScheme();

  const [loading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState<BookWithUser[]>();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          if (session) {
            const data = await getBooks(session);
            console.log(data);
            setBookData(data);
          }
        } catch (e) {
          Toast.error(errorHandler(e));
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [session])
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator
          size="large"
          color={color[colorScheme ?? "light"].tint}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {bookData?.length ? (
          <View style={styles.bookList}>
            {bookData.map((book) => (
              <View style={styles.bookCard}>
                <View key={book._id} style={styles.bookInfos}>
                  <Image
                    source={{ uri: book.media }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                  <View style={styles.bookFlex}>
                    <Text style={styles.bookDescription}>
                      {book.name}
                    </Text>
                    <Text style={styles.bookDescription}>
                      {book.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.user}>
                  <View style={styles.avatarContainer}>
                    <Avatar size={20} variant="beam" name={book?.username} />
                    <Text>{book?.username}</Text>
                  </View>
                  <Text>{book?.phone}</Text>

                  <View style={styles.avatarContainer}>
                    <Text>{`${book?.city}/${book?.state}`}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBooks}>Você não tem livros no momento :(</Text>
        )}
      </ScrollView>
      <ToastManager />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBooks: {
    textAlign: "center",
    paddingVertical: 30,
  },
  booksButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  bookList: {
    flexDirection: "column-reverse",
    padding: 10,
  },
  bookCard: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: color.light.background,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  bookInfos: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bookImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  bookFlex: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    backgroundColor: color.light.background,
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    borderRadius: "100%",
    backgroundColor: mainColor,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  user: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
