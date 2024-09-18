import { ActivityIndicator, View } from "react-native";
import { styles } from "../utils/Styles";
export default function Loading(){

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#646B4B" />
        </View>
    );
}