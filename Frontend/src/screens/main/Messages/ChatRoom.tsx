import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../../API_URL';
import { formatTimestamp } from '../../../utils/DateUtils';
import { getOtherUserData } from '../../../utils/data';
import { useUserData } from '../../../utils/data';
const ChatRoom = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<any, 'MessageScreen'>>();
  const { userId, senderId, receiverId } = route.params;
  const [chatRoomId, setChatRoomId] = useState(route.params.chatRoomId || null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for sending messages
  const senderData =useUserData();
  const flatListRef = useRef(null);
  const [receiverData, setReceiverData] = useState({});
  useEffect(() => {
    const fetchOtherUserData = async () => {
      const data = await getOtherUserData(receiverId);
      if (data) {
        setReceiverData(data);
      }
    };
  
    if (receiverId) {
      fetchOtherUserData(); 
    }
  }, [receiverId]); 
  console.log('receiverData:', receiverData);

  const fetchMessages = async () => {
    if (!chatRoomId) return;
    try {
      const response = await axios.get(`http://${API_URL}/api/chatrooms/${chatRoomId}/messages`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a new message
  const handleSend = async () => {
    if (message.trim()) {
      try {
        setIsLoading(true);  
        if (!chatRoomId) {
          const createChatRoomResponse = await axios.post(`http://${API_URL}/api/chatrooms/find-or-create`, {
            senderId: senderId,
            receiverId: receiverId,
          });
          setChatRoomId(createChatRoomResponse.data.chatRoomId);
        }
       
        await axios.post(`http://${API_URL}/api/chatrooms/${chatRoomId}/messages`, {
          chatRoomId,
          senderId: senderId,
          receiverId: receiverId,
          content: message,
        });

        setMessage('');  
        fetchMessages();  
      } catch (error) {
        console.error('Error sending message or creating chat room:', error);
      } finally {
        setIsLoading(false); 
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatRoomId]);

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === senderId ? styles.messageSent : styles.messageReceived
      ]}
    >
      <View style={[
        styles.messageBubble,
        { backgroundColor: item.senderId === senderId ? '#0d0d0d' : '#d9d9d9' },
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.senderId === senderId ? '#fff' : '#000' }
        ]}>
          {item.content}
        </Text>
        <Text style={[
          styles.messageTimestamp,
          { color: item.senderId === senderId ? '#fff' : '#000' }
        ]}>
          {formatTimestamp(item.created_at)}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
    >
      
      <View style={styles.container}>
      <View>
       
      </View>
      <FlatList
      ref={flatListRef}
      data={messages.slice().reverse()} 
      renderItem={renderItem}
      keyExtractor={(item: any) => item.messageId}
      ListEmptyComponent={<Text style={styles.emptyMessage}>Start a conversation</Text>}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
      inverted
    />


        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message"
            style={styles.input}
            editable={!isLoading}  
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={message.trim().length === 0 || isLoading}  
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  messageSent: {
    marginRight: 10,
    justifyContent: 'flex-end',
  },
  messageReceived: {
    marginLeft: 10,
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    marginTop: 0,
    opacity: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical: '5%',
    width: '100%',
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: 'transparent',
  },
  sendButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
});

export default ChatRoom;
