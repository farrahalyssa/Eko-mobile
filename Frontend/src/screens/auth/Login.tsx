import React, { useState } from "react";
import { Text, TextInput, SafeAreaView, Alert, View, TouchableOpacity } from "react-native";
import { styles } from "../../utils/Styles";
import ForgotPassword from "../../components/ForgotPassword";
import { StackParamList } from "../../Types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import TabNav from "../../navigation/Tab";
import { API_URL } from "../../API_URL";


export default function Login() {
    //for navigation
    type LoginNavigationProp = StackNavigationProp<StackParamList, 'Login'>;
    const navigation = useNavigation<LoginNavigationProp>();

   
    // state variables for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // function to handle login
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Please enter both email and password");
            return;
        }
    
        setLoading(true); 
    
        try {
            const response = await axios.post(`http://${API_URL}/api/login`, {
                email,
                password
            });
    
            if (response.status === 200) {
                const userData = response.data;
                // Store the user ID in AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                

                // Navigate to the Home screen after successful login
                navigation.replace('TabNav');
            } else {
                Alert.alert("Failed to login", response.data.error);
            }
        } catch (error: any) {
            if (error.response) {
                console.error('Login error response:', error.response);
                Alert.alert("Login failed", error.response.data.error || "An error occurred during login.");
            } else {
                console.error('Login error:', error);
                Alert.alert("Login failed", "An error occurred during login.");
            }
        }
    }
        

    return (
        <SafeAreaView style={styles.container}>

            <TextInput 
                style={styles.textInput}
                placeholder="Email"
                value={email.toLowerCase()}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Log in"}
                </Text>
            </TouchableOpacity>

            <ForgotPassword />

            <View style={[styles.dividerContainer, {marginBottom:'10%'}]}>
                <View style={styles.divider} />
                <Text>or</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Register')}}>
                <Text style={styles.buttonText}>Create an account</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

}