import React from 'react'
import { singUp } from "@/api/auth/sing-up";
import { useSession } from "@/app/ctx";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Button, Linking, StyleSheet, TextInput, useColorScheme } from "react-native";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { errorHandler } from "@/utils/error-handler";
import { getCepData } from "@/api/auth/get-cep";
import { Text, View } from "../themed";
import { color } from "@/constants/color";

interface IForm {
    username: string;
    password: string;
    cep: string;
    city: string;
    state: string;
}

export const UserForm = () => {
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const { signIn } = useSession();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IForm>();

    const handleLogin = async (data: IForm) => {
        setLoading(true);
        try {
            const loginToken = await singUp(data);
            const { access_token } = loginToken;
            signIn(access_token);
            Linking.openURL("/");
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
                        placeholder="Username"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="username"
            />
            {errors.username && <Text>Username is required.</Text>}
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry
                        placeholder="Password"
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
            />
            {errors.password && <Text>Password is required.</Text>}
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
                        placeholder="City"
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
                        placeholder="State"
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
                        title="Login"
                        onPress={handleSubmit(handleLogin)}
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