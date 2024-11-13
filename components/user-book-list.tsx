import { useSession } from "@/app/ctx";
import { Text, View } from "./themed";
import { useEffect, useState } from "react";
import { getUserBooks } from "@/api/books/get-user-books";
import { Book } from "@/dtos/book";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import { ActivityIndicator, Button, StyleSheet, useColorScheme } from "react-native";
import { color } from "@/constants/color";

export const UserBookList = () => {
    const { session } = useSession();
    const colorScheme = useColorScheme();

    const [loading, setIsLoading] = useState(false);
    const [bookData, setBookData] = useState<Book[]>();

    useEffect(() => {
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
    }, [session]);

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
                />
            </View>
            {bookData?.length ? (
                <View></View>
            ) : (
                <Text style={styles.noBooks}>Você não tem livros no momento :(</Text>
            )}
            <ToastManager />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerLoading:{
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
});
