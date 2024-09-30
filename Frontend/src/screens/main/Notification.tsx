// In your Notification component file
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import { timeAgo } from '../../utils/timeAgo'; 
import { useUserData } from '../../utils/data';
import { io } from 'socket.io-client'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../Types';
import { navigateToProfile } from '../../utils/ProfileNavigationUtils'; // Import the utility

interface Notification {
  notificationId: string;
  senderName: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  senderBio: string;
  senderCreatedAt: string;
  senderProfileImage: string;
  type: 'like' | 'comment' | 'follow';
  postId?: string;
  description: string;
  created_at: string;
  hasBeenViewed: boolean;
}

type NotificationScreenNavigationProp = StackNavigationProp<StackParamList, 'Notification'>;

const Notification = () => {
  const { userData } = useUserData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const userId = userData?.userId; 
  const socket = io(`http://${API_URL}`);

  useEffect(() => {
    fetchNotifications();

    socket.on('notification', (newNotification) => {
      console.log('Received new notification:', newNotification);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  const fetchNotifications = async () => {
    try {
      const response = await axios.get<Notification[]>(`http://${API_URL}/api/users/${userId}/notifications`);
      console.log("yes", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if ((notification.type === 'like' || notification.type === 'comment') && notification.postId) {
      navigation.navigate('PostDetails', { postId: notification.postId, userId: notification.senderId });
    } else if (notification.type === 'follow') {
      // Navigate to the profile using the utility function
      navigateToProfile(
        navigation,
        notification.senderId,
        notification.senderName,
        notification.senderUsername,
        notification.senderProfileImage,
        notification.senderBio,
        notification.senderCreatedAt
      );
    } else {
      console.error('postId is undefined');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.notificationId}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleNotificationPress(item)}>
          <View style={styles.notificationItem}>
            <TouchableOpacity onPress={() => navigateToProfile(
                navigation,
                item.senderId,
                item.senderName,
                item.senderUsername,
                item.senderProfileImage,
                item.senderBio,
                item.senderCreatedAt
              )}>
              {item.senderProfileImage ? (
                <Image source={{ uri: item.senderProfileImage }} style={styles.avatar} />
              ) : (
                <Ionicons name="person-circle" size={50} color="#CFE1D0" />
              )}
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.notificationText}>
                <Text style={styles.username}>{item.senderUsername}</Text>{' '}
                {item.type === 'like' && 'liked your post.'}
                {item.type === 'comment' && `commented: "${item.description}".`}
                {item.type === 'follow' && 'started following you.'}
              </Text>
              <Text style={styles.timeAgo}>{timeAgo(item.created_at)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  username: {
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
});

export default Notification;
