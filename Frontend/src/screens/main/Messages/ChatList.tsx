import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "../../../utils/Styles";
import { fetchUsersChats, useUserData, getOtherUserData } from '../../../utils/data'; 
import customLogger from '../../../utils/loggerUtils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../../../Types';

type ChatListScreenNavigationProp = StackNavigationProp<StackParamList, 'ChatRoom'>;
type ChatListScreenRouteProp = RouteProp<StackParamList, 'ChatList'>;

export default function ChatList() {
  const { userData } = useUserData();  
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const userId = userData?.userId;
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [otherUsersData, setOtherUsersData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchChats = async () => {
      if (userId) {
        try {
          const rooms = await fetchUsersChats(userId); 
          customLogger(rooms);
          setChatRooms(Array.isArray(rooms) ? rooms : [rooms]);
        } catch (error) {
          console.error('Error fetching user chats:', error);
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };

    fetchChats();
  }, [userId]);

  useEffect(() => {
    const fetchAllOtherUsers = async () => {
      const fetchedUsers: { [key: string]: any } = {};
      for (const room of chatRooms) {
        const otherUserId = room.senderId === userId ? room.receiverId : room.senderId;
        if (!otherUsersData[otherUserId]) {
          const otherUserData = await getOtherUserData(otherUserId);
          fetchedUsers[otherUserId] = otherUserData;
        }
      }
      setOtherUsersData(prevState => ({ ...prevState, ...fetchedUsers }));
    };

    if (chatRooms.length) {
      fetchAllOtherUsers();
    }
  }, [chatRooms]);

  const renderItem = ({ item }: any) => {
    const otherUserId = item.senderId === userId ? item.receiverId : item.senderId;
    const otherUser = otherUsersData[otherUserId];
    const otherUserInfo = Array.isArray(otherUser) && otherUser.length > 0 ? otherUser[0] : null;

    return (
      <TouchableOpacity 
        onPress={() => 
          navigation.navigate('ChatRoom', { 
            chatRoomId: item.chatRoomId, 
            senderId: userId || '',     
            receiverId: otherUserId     
          })
        }
      >
        <View style={styles.rowContainer2}>
          <Ionicons name="person-circle" size={60} color="#CFE1D0" />
          <View>
            <View style={styles.rowContainer2}>
              <View>
                <Text>{otherUserInfo?.name || otherUserInfo?.username}</Text>
              </View>
            </View>
            <View style={styles.rowContainer2}>
              <Text>
                {item.senderId === userId ? 'You: ' : ''}
                {item.content}
              </Text>
            </View>
            <Text>Date: {item.created_at}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading chat rooms...</Text>
      </View>
    );
  }

  if (!chatRooms.length) {
    return (
      <View style={styles.container}>
        <Text>No chat rooms available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.chatRoomId} 
      />
    </View>
  );
}
