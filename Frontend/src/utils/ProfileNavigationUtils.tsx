import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';

export const navigateToProfile = (
  navigation: StackNavigationProp<StackParamList>,
  userId: string,
  name: string,
  username: string,
  profilephoto_url: string,
  bio: string,
  createdAt: string
) => {
  navigation.navigate('ExternalProfile', {
    userId,
    name,
    username,
    profilephoto_url,
    bio,
    createdAt,
  });
};
