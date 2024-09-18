import {View, Text, TouchableOpacity} from "react-native";
import {styles} from "../utils/Styles";
export default function ForgotPassword() {
    return (
        <View style={styles.subtextContainer}>
            <TouchableOpacity style={styles.subtextButton}>
            <Text style={styles.subtext}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
}