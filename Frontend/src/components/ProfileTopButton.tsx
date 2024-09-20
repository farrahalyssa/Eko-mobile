import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../utils/Styles';
import { useUserData } from '../utils/data';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';


export default function ProfileTopButton({ profileUserId }: { profileUserId: string }) {
  const { currentUserId, followUser, unfollowUser, followedUsers } = useUserData();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const navigation = useNavigation<StackNavigationProp<StackParamList, 'EditProfile'>>();
  const { userData } = useUserData();
  console.log(followedUsers);


  useEffect(() => {
    const isFollowingProfile = followedUsers.some(user => user["userId"] === profileUserId);
    console.log(isFollowingProfile);
    setIsFollowing(isFollowingProfile);
    
  }, [profileUserId, followedUsers]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId);
      } else {
        await followUser(profileUserId);
      }
      
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  if (isFollowing === null) {
    return null;
  }
  (currentUserId ?
  console.log("hi",currentUserId) : console.log('no current user'))
  return (
    <View style={{ top: '3%', left: '45%' }}>
      {profileUserId === currentUserId ? (
        <TouchableOpacity style={styles.secondaryButton}
  
        onPress={() => navigation.navigate('EditProfile', { userId: profileUserId, initialName: userData?.name || '', initialUsername: userData?.username || '', initialBio: userData?.bio || '' })}>
        <Text style={styles.secondaryButtonText}>Edit profile</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: 'row', marginLeft: -45, alignItems: 'center', width:'60%',}}> 
        <TouchableOpacity style={{marginRight: 10}}>
          <Ionicons name="chatbubble-ellipses-outline" size={28}  color='#646B4B' />
        </TouchableOpacity>
        <TouchableOpacity 
            style={isFollowing ? styles.secondaryButton : styles.button} 
            onPress={handleFollowToggle}>
          <Text 
            style={isFollowing ? styles.secondaryButtonText : styles.buttonText} 
            >
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
