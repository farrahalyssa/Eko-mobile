import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../utils/Styles';
import { useUserData } from '../utils/data';
import { Ionicons } from '@expo/vector-icons';
export default function ProfileTopButton({ profileUserId }: { profileUserId: string }) {
  const { currentUserId, followUser, unfollowUser, followedUsers } = useUserData();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    // Ensure profileUserId is included in followedUsers correctly
    const isFollowingProfile = followedUsers.includes(profileUserId);
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
  console.log(isFollowing);
  return (
    <View style={{ top: '3%', left: '45%' }}>
      {profileUserId === currentUserId ? (
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Edit profile</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: 'row', marginLeft: -45, alignItems: 'center', width:'60%',}}> 
        <TouchableOpacity style={{marginRight: 10}}>
          <Ionicons name="chatbubbles-outline" size={28}  color='#6E6E6E' />
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
