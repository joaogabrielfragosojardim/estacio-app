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
} from "react-native";
import { color, mainColor } from "@/constants/color";
import { useFocusEffect, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { bookStore } from "@/store/book-store";

export const UserBookList = () => {
    const { session } = useSession();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const addBook = bookStore((state) => state.addBook);

    const [loading, setIsLoading] = useState(false);
    const [bookData, setBookData] = useState<Book[]>();

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
        console.log({ book });
        addBook(book);
        router.replace("/edit-book");
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
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => {
                                                handleEditBook(book);
                                            }}
                                        >
                                            <FontAwesome name="pencil" size={12} color="white" />
                                        </TouchableOpacity>
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
    pencilContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
