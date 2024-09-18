import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';

// Modular function to navigate to profile with userId and related info
export const navigateToProfile = (
    navigation: StackNavigationProp<StackParamList, 'ExternalProfile'>, // Expecting ExternalProfile navigation prop
    userId: string,
  name: string,
  username: string,
  profilephoto_url: string | null,
  bio: string,
  createdAt: string
) => {
  // Navigate to ExternalProfile with user details
  navigation.navigate('ExternalProfile', {
    userId,
    name,
    username,
    profilephoto_url: profilephoto_url || '', // Provide a fallback for profilephoto_url
    bio,
    createdAt
  });
};
