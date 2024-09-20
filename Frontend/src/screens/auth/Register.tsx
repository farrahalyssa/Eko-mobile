import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
import { styles } from "../../utils/Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../Types";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../API_URL";
export default function Register() {   
    
    
    // for navigation
    type RegisterNavigationProp = StackNavigationProp<StackParamList, 'Register'>;
    const navigation = useNavigation<RegisterNavigationProp>();

    // state variables for input fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // function to handle sign up
    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await axios.post(`http://${API_URL}/api/register`, {
                name,
                username,
                email,
                password,
            });
    
            if (response.status === 201) {
                Alert.alert("User registered successfully!");
                const userData = response.data;
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                navigation.replace('TabNav');
            } else {
                Alert.alert("Failed to register", response.data.error || "Unknown error");
            }
        } catch (error: any) {
            if (error.response) {
                // The request was made, and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response error:', error.response.data);
                Alert.alert("Failed to register", error.response.data.error || "Unknown error");
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response received:', error.request);
                Alert.alert("Failed to register", "No response from server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
                Alert.alert("Failed to register", error.message);
            }
        }
    };
    

    return(
        <SafeAreaView style={styles.container}>
            <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={name}
            autoCapitalize="none"
            onChangeText={setName} />
            <TextInput
            style={styles.textInput} 
            placeholder="Username"
            autoCapitalize="none"
            value={username.toLowerCase()}
            onChangeText={setUsername} />
            <TextInput
            style={styles.textInput} 
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail} />
            <TextInput
            style={styles.textInput} 
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
            secureTextEntry />
            <TextInput
            style={styles.textInput} 
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
