import React from "react";
import { singUp } from "@/api/auth/sing-up";
import { useSession } from "@/app/ctx";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Button,
    Linking,
    StyleSheet,
    TextInput,
    useColorScheme,
} from "react-native";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import { getCepData } from "@/api/auth/get-cep";
import { Text, View } from "../themed";
import { color } from "@/constants/color";
import { userStore } from "@/store/user-store";
import { useRouter } from "expo-router";
import { editUser } from "@/api/user/edit";

interface IForm {
    username: string;
    password: string;
    cep: string;
    city: string;
    state: string;
}

export const UserForm = ({ edit }: { edit?: boolean }) => {
    const [loading, setLoading] = useState(false);
    const { session, signIn } = useSession();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const userState = userStore((state) => state.user);
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IForm>({
        defaultValues: {
            username: userState?.username,
            cep: userState?.cep,
            city: userState?.city,
            state: userState?.state,
        },
    });

    const onSubmit = async (data: IForm) => {
        setLoading(true);
        try {
            if (edit) {
                await editUser(session as string, data);
                router.replace("/profile");
            } else {
                const loginToken = await singUp(data);
                const { access_token } = loginToken;
                signIn(access_token);
                //@ts-ignore
                router.replace("/");
            }
        } catch (e) {
            Toast.error(errorHandler(e));
        } finally {
            setLoading(false);
        }
    };

    const handleCepChange = async (cep: string) => {
        if (cep.length === 8) {
            try {
                const data = await getCepData(cep);
                setValue("city", data.localidade);
                setValue("state", data.uf);
            } catch (error) {
                Toast.error("Erro ao buscar dados do CEP.");
            }
        }
    };
    return (
        <>
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Usuário"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="username"
            />
            {errors.username && <Text>Usuário é obrigatório.</Text>}
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry
                        placeholder="Senha"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
            />
            {errors.password && <Text>Senha é obrigatório.</Text>}
            <Controller
                control={control}
                rules={{ required: true, pattern: /^[0-9]{5}-?[0-9]{3}$/ }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="CEP"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={(text) => {
                            onChange(text);
                            handleCepChange(text);
                        }}
                        value={value}
                        keyboardType="numeric"
                    />
                )}
                name="cep"
            />
            {errors.cep && <Text>CEP é obrigatório e deve ser válido.</Text>}
            <Controller
                control={control}
                render={({ field: { value } }) => (
                    <TextInput
                        placeholder="Cidade"
                        style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                        value={value}
                        editable={false}
                    />
                )}
                name="city"
            />
            <Controller
                control={control}
                render={({ field: { value } }) => (
                    <TextInput
                        placeholder="Estado"
                        style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                        value={value}
                        editable={false}
                    />
                )}
                name="state"
            />
            <View>
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={color[colorScheme ?? "light"].tint}
                    />
                ) : (
                    <Button
                        color={color[colorScheme ?? "light"].tint}
                        title={edit ? "Editar" : "Login"}
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
});
