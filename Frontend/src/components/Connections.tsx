import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StackParamList } from '../Types';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../API_URL';
type ConnectionsRouteProp = RouteProp<StackParamList, 'Connections'>;

interface Connection {
  userId: string;
  name: string;
  username: string;
  profileImage: string;
}

export default function Connections() {
  const route = useRoute<ConnectionsRouteProp>();
  const { userId, type } = route.params; // type will be 'following' or 'followers'
  const navigation = useNavigation();

  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const endpoint = `http://${API_URL}/api/users/${userId}/${type}Data`;
      const response = await axios.get(endpoint);
      setConnections(response.data);
    } catch (err: any) {
      if (err.response) {
        console.error('Response error:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
    }
    setLoading(false);
  };
  

  useEffect(() => {
    // Set the navigation title dynamically based on the type (following or followers)
    navigation.setOptions({ title: type === 'following' ? 'Following' : 'Followers' });
    fetchConnections();
  }, [type]);

  const renderConnectionItem = ({ item }: { item: Connection }) => {
    console.log('Connection Item:', item); // Add this for debugging
    return (
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
    );
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList 
          data={connections}
          keyExtractor={(item) => item.userId ? item.userId.toString() : Math.random().toString()}
          renderItem={renderConnectionItem}
        />
      )}
    </View>
  );
}
