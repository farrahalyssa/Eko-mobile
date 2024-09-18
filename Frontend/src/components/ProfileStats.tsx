import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from "../utils/Styles";
import { useUserStats } from "../utils/data";
import { StackParamList } from "../Types";

// Define the type for navigation
type ProfileStatsNavigationProp = StackNavigationProp<StackParamList, 'Connections'>;

export default function ProfileStats({ userId }: { userId: string }) {
  const { stats, loading, error, refreshStats } = useUserStats(userId);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ProfileStatsNavigationProp>(); // Use typed navigation

  // Function to handle the refresh
  const onRefresh = async () => {
    setRefreshing(true);  
    await refreshStats();  
    setRefreshing(false);  
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  // Use 0 as a fallback if stats are not available
  const countPosts = stats?.countPosts || 0;
  const countFollowing = stats?.countFollowing || 0;
  const countFollowers = stats?.countFollowers || 0;

  return (
    <ScrollView
      contentContainerStyle={styles.rowContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>{countPosts}</Text> posts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Connections', { userId, type: 'following' })}>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>{countFollowing}</Text> following
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Connections', { userId, type: 'followers' })}>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>{countFollowers}</Text> followers
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
