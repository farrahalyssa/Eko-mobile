import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { TabParamList } from "../../Types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Posts from "../../components/Posts";
import Loading from "../../components/Loading";
import { useUserData } from "../../utils/data";

export default function Home() {

    type HomeNavigationProp = StackNavigationProp<TabParamList, 'Home'>;
    const navigation = useNavigation<HomeNavigationProp>();
    const { userData, followedUsers } = useUserData(); // Get followed users as well

    return (
        <ScrollView>
            {/* Pass both userId and followed users' IDs to the Posts component */}
            <Posts profileUserId={userData?.userId || ''}/>
        </ScrollView>
    );
}
