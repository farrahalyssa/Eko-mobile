import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../utils/Styles';
import { useUserData } from '../utils/data';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';
import axios from 'axios';
import { API_URL } from '../API_URL';

type User = {
  userId: string;
  [key: string]: any;
};

export default function ProfileTopButton({ profileUserId }: { profileUserId: string }) {
  const { currentUserId, followUser, unfollowUser, followedUsers } = useUserData();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(true);  
  const navigation = useNavigation<StackNavigationProp<StackParamList, 'EditProfile'>>();
  const { userData } = useUserData();
  console.log("ProfileUserId", profileUserId);
  console.log("CurrentUserId", currentUserId);
  // Function to rename keys in user objects
  function renameKeys(obj: User): User {
    const newObj: User = {} as User;
    Object.keys(obj).forEach(key => {
      const newKey = key.replace(/\"/g, "");
      newObj[newKey] = obj[key];
    });
    return newObj;
  }

  // Fetch or create chat room
  const fetchOrCreateChatRoom = async () => {
    console.log('Fetching or creating chat room:', profileUserId, currentUserId);
  
    if (!currentUserId || !profileUserId) {
      console.error('User IDs are required');
      return { chatRoomId: null };
    }
  
    try {
      const response = await fetch(`http://${API_URL}/api/chatrooms/find-or-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: profileUserId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Chat room ID:', data.chatRoomId);
        return { chatRoomId: data.chatRoomId };
      } else {
        console.error('Error creating chat room:', data);
        return { chatRoomId: null };
      }
    } catch (error: any) {
      console.error('Error fetching or creating chat room:', error.message);
      return { chatRoomId: null };
    }
  };
  
  
  

  useEffect(() => {
    if (currentUserId && profileUserId) {
      fetchOrCreateChatRoom();
    }
  }, [currentUserId, profileUserId]); 

  useEffect(() => {
    const updatedFollowedUsers = followedUsers.map((user: any) => renameKeys(user));
    const isFollowingProfile = updatedFollowedUsers.some((user: User) => user.userId === profileUserId);
    setIsFollowing(isFollowingProfile);
  }, [profileUserId, followedUsers, refreshFlag]);  

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId);
      } else {
        await followUser(profileUserId);
      }
      setRefreshFlag(prev => !prev);
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  // Handle chat button press
  const handleChatPress = async () => {
    const { chatRoomId } = await fetchOrCreateChatRoom();
    console.log('Chat room ID:', chatRoomId);
    if (chatRoomId) {
      navigation.navigate('ChatRoom', { chatRoomId, senderId: currentUserId || '', receiverId: profileUserId });
    } else {
      console.error('Failed to fetch or create a chat room.');
    }
  };

  if (isFollowing === null) return null;

  return (
    <View style={{ top: '3%', left: '45%' }}>
      {profileUserId === currentUserId ? (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('EditProfile', {
            userId: profileUserId,
            initialName: userData?.name || '',
            initialUsername: userData?.username || '',
            initialBio: userData?.bio || ''
          })}
        >
          <Text style={styles.secondaryButtonText}>Edit profile</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: 'row', marginLeft: -45, alignItems: 'center', width: '60%' }}>
          <TouchableOpacity style={{ marginRight: 10 }} onPress={handleChatPress}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color='#646B4B' />
          </TouchableOpacity>
          <TouchableOpacity
            style={isFollowing ? styles.secondaryButton : styles.button}
            onPress={handleFollowToggle}
          >
            <Text style={isFollowing ? styles.secondaryButtonText : styles.buttonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
