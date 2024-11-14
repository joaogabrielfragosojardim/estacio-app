import { useSession } from "@/app/ctx";
import { Text, View } from "./themed";
import { useCallback, useEffect, useState } from "react";
import { getUserBooks } from "@/api/books/get-user-books";
import { Book } from "@/dtos/book";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { color, mainColor } from "@/constants/color";
import { useFocusEffect, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { bookStore } from "@/store/book-store";
import { deleteBook } from "@/api/books/delete-book";

export const UserBookList = () => {
  const { session } = useSession();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const addBook = bookStore((state) => state.addBook);

  const [loading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState<Book[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          if (session) {
            const data = await getUserBooks(session);
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

  const redirectToCreateBook = () => {
    router.replace("/create-book");
  };

  const handleEditBook = (book: Book) => {
    addBook(book);
    router.replace("/edit-book");
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    setIsLoading(true);
    try {
      await deleteBook(session as string, bookToDelete._id as string);
      const data = await getUserBooks(session as string);
      setBookData(data);
      Toast.success("Livro excluído com sucesso.");
    } catch (e) {
      Toast.error(errorHandler(e));
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

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
      <View style={styles.booksButton}>
        <Button
          color={color[colorScheme ?? "light"].tint}
          title="Adicionar livro"
          onPress={redirectToCreateBook}
        />
      </View>
      <ScrollView>
        {bookData?.length ? (
          <View style={styles.bookList}>
            {bookData.map((book) => (
              <View key={book._id} style={styles.bookCard}>
                <Image
                  source={{ uri: book.media }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <View style={styles.bookInfo}>
                  <View style={styles.pencilContainer}>
                    <Text style={styles.bookTitle}>{book.name}</Text>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          handleEditBook(book);
                        }}
                      >
                        <FontAwesome name="pencil" size={12} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setBookToDelete(book);
                          setModalVisible(true); // Abre o modal
                        }}
                      >
                        <FontAwesome name="trash" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.bookDescription}>{book.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBooks}>Você não tem livros no momento :(</Text>
        )}
      </ScrollView>
      <ToastManager />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Tem certeza que deseja excluir este livro?
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)} // Fecha o modal
              />
              <Button
                title="Excluir"
                color={color[colorScheme ?? "light"].tint}
                onPress={handleDeleteBook}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
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
  bookImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  bookInfo: {
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
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    borderRadius: "100%",
    backgroundColor: mainColor,
    marginLeft: 10,
  },
  pencilContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionsContainer: {
    flexDirection: "row",
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
});
