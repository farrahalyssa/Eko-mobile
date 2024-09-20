import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../API_URL';
const Likes = ({ route }: any) => {
  const { postId } = route.params; 
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://${API_URL}/api/posts/${postId}/likes`);
        setLikes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching likes:', error);
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {likes.length === 0 ? (
        <Text style={styles.noLikesText}>No likes yet</Text>
      ) : (
        <FlatList
          data={likes}
          keyExtractor={(item: any) => item.userId.toString()}
          renderItem={({ item }) => (
            <View style={styles.likeItem}>
            {item.profilephoto_url ? (
  <Image source={{ uri: item.profilephoto_url }} style={styles.profilePhoto} />
) : (
  <Ionicons name="person-circle" size={40} color="#CFE1D0" />
)}

              <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#555',
  },
  noLikesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Likes;
