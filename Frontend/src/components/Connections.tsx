import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StackParamList } from '../Types';
import { API_URL } from '../API_URL';
import { navigateToProfile } from '../utils/ProfileNavigationUtils';
import { getOtherUserData } from '../utils/data';
import customLogger from '../utils/loggerUtils';
type ConnectionsRouteProp = RouteProp<StackParamList, 'Connections'>;
type NavigationProp = StackNavigationProp<StackParamList, 'ExternalProfile'>;

interface Connection {
  userId: string;
  name: string;
  username: string;
  profileImage: string;
}

export default function Connections() {
  const route = useRoute<ConnectionsRouteProp>();
  const { userId, type } = route.params; 
  const navigation = useNavigation<NavigationProp>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetching the connections from the backend
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const endpoint = `http://${API_URL}/api/users/${userId}/${type}Data`;
      const response = await axios.get<Connection[]>(endpoint);
      setConnections(response.data);
    } catch (err: any) {
      if (err.response) {
        console.error('Response error:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch connections when component mounts or type changes
  useEffect(() => {
    navigation.setOptions({ title: type === 'following' ? 'Following' : 'Followers' });
    fetchConnections();
  }, [type]);

  // Rendering each connection item
  const renderConnectionItem = ({ item }: { item: Connection }) => {
    const handlePress = async () => {
      try {
        const otherUserData = await getOtherUserData(item.userId);
        const userData = Array.isArray(otherUserData) ? otherUserData[0] : otherUserData;
        customLogger(userData); 

        navigateToProfile(
          navigation, 
          item.userId, 
          item.name, 
          item.username, 
          item.profileImage, 
          userData?.bio || '', 
          userData?.created_at || ''
        );
      } catch (error) {
        console.error('Error fetching other user data:', error);
      }
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          {item.profileImage ? (
            <Image 
              source={{ uri: item.profileImage }} 
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <Ionicons name="person-circle" size={50} color="#CFE1D0" />
          )}
          <View style={{ marginLeft: 10 }}>
            <Text>{item.name}</Text>
            <Text>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList 
          data={connections}
          keyExtractor={(item) => item.userId}
          renderItem={renderConnectionItem}
        />
      )}
    </View>
  );
}
