import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../../Types';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../../API_URL';

interface ChatListProps {
  currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({ currentUserId }) => {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>({});
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: { message: string, senderId: string, timestamp: string | null, seen: boolean, flagged: boolean } }>({});
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const chatRoomsResponse = await axios.get(`http://${API_URL}/api/chatrooms/${currentUserId}`);
        setChatRooms(chatRoomsResponse.data.chatRooms);

        const details: { [key: string]: any } = {};
        for (const chatRoom of chatRoomsResponse.data.chatRooms) {
          const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
          if (otherUserId && !userDetails[otherUserId]) {
            const userDetailsResponse = await axios.get(`http://${API_URL}/api/users/${otherUserId}`);
            details[otherUserId] = userDetailsResponse.data.user;
          }
        }
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching chat rooms or user details:', error);
      }
    };

    fetchChatRooms();
  }, [currentUserId]);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const messagesData: { [key: string]: { message: string, senderId: string, timestamp: string | null, seen: boolean, flagged: boolean } } = {};
        
        for (const chatRoom of chatRooms) {
          const messagesResponse = await axios.get(`${API_URL}/api/messages/latest/${chatRoom.chatRoomId}`);
          if (messagesResponse.data.message) {
            messagesData[chatRoom.chatRoomId] = messagesResponse.data.message;
          }
        }
        setLatestMessages(messagesData);
      } catch (error) {
        console.error('Error fetching latest messages:', error);
      }
    };

    if (chatRooms.length > 0) {
      fetchLatestMessages();
    }
  }, [chatRooms]);

  const handleChatPress = async (chatRoom: any) => {
    const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
    if (otherUserId && userDetails[otherUserId]) {
      const otherUserData = userDetails[otherUserId];

      const createdAt = otherUserData?.createdAt || ''; 

      try {
        await axios.post(`${API_URL}/api/messages/mark-seen`, {
          chatRoomId: chatRoom.chatRoomId,
          currentUserId,
        });

        navigation.navigate('ChatRoom', {
          chatRoomId: chatRoom.chatRoomId,
          senderId: currentUserId,
          receiverId: otherUserId,
        });
      } catch (error) {
        console.error('Error marking messages as seen:', error);
      }
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: any }) => {
    const otherUserId = item.users.find((id: string) => id !== currentUserId);
    const otherUser = userDetails[otherUserId];
    const messageDetails = latestMessages[item.chatRoomId] || { message: 'No messages yet', senderId: '', timestamp: null, seen: false, flagged: false };

    const senderUsername = messageDetails.senderId === currentUserId ? 'You' : userDetails[messageDetails.senderId]?.username || 'Unknown';

    if (!otherUser) return null;

    return (
      <TouchableOpacity style={styles.chatRoomContainer} onPress={() => handleChatPress(item)}>
        <Image source={{ uri: otherUser.photoUrl }} style={styles.profileImage} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.chatRoomText, { marginRight: '43%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>{otherUser.username}</Text>
              {!messageDetails.seen && <Ionicons name="ellipse" size={10} color="#DE3B48" />}
            </View>
            <Text style={{ opacity: 0.7 }}>
              {senderUsername}: {messageDetails.message}
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
            <Text style={{ opacity: 0.5 }}>{formatTimestamp(messageDetails.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>Follow a friend to start messaging</Text>
      ) : (
        <FlatList data={chatRooms} renderItem={renderItem} keyExtractor={(item) => item.chatRoomId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 15,
    marginTop: '-3%',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatRoomText: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ChatList;
