import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { TabParamList } from "../../Types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import FeedPosts from "../../components/FeedPosts";
import Loading from "../../components/Loading";
import { useUserData } from "../../utils/data";

export default function Home() {

    type HomeNavigationProp = StackNavigationProp<TabParamList, 'Home'>;
    const navigation = useNavigation<HomeNavigationProp>();
    const { userData, followedUsers } = useUserData(); // Get followed users as well

    return (
        <ScrollView>
            <FeedPosts/>
        </ScrollView>
    );
}
