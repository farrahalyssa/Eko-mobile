import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../utils/Styles';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackParamList } from '../../Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { pickImage } from '../../utils/ImageUtils';
import axios from 'axios';
import { API_URL } from '../../utils/data';
import { UserData, useUserData } from '../../utils/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EditProfileRouteProp = RouteProp<StackParamList, 'EditProfile'>;
type EditProfileNavigationProp = StackNavigationProp<StackParamList, 'EditProfile'>;

type EditProfileProps = {
  route?: EditProfileRouteProp;
};

const EditProfile: React.FC<EditProfileProps> = ({ route }) => {
  if (!route) {
      // handle the case where route is not provided
      return null;
  }
  const navigation = useNavigation<EditProfileNavigationProp>();

  const { userId, initialName, initialUsername, initialBio } = route.params;
  const { userData } = useUserData();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>(initialName);
  const [username, setUsername] = useState<string>(initialUsername);
  const [bio, setBio] = useState<string>(initialBio);

  const handlePickImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        setImage(uri);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    }
  };

  const handleSave = async () => {
    if (!userData) {
      console.error('User data is missing');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('bio', bio);

      if (image) {
        formData.append('profilePhoto', {
          uri: image,
          name: `profile_${userId}.jpg`,
          type: 'image/jpeg',
        } as any); // Using "as any" to bypass TypeScript issues with FormData
      }

      const response = await axios.put(`http://${API_URL}/api/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Profile updated successfully');
        const updatedUserData: UserData = {
          userId,
          name,
          username,
          bio,
          
          email: userData.email,
          profilephoto_url: response.data.profilephoto_url || userData.profilephoto_url,
          active: userData.active,
          createdAt: userData.createdAt,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        navigation.goBack();
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error.message);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
     

              

                       
        <View style={[styles.container]}>

        <TouchableOpacity style={styles.headerImageContainer}>
                    <Image 
                        source={{ uri: 'https://i.pinimg.com/736x/64/76/95/647695c27a66f0131b98f5cc73615874.jpg' }} 
                        style={styles.headerImage} 
                    />
                </TouchableOpacity>
            <View style={[styles.profileSection, {marginBottom: '5%',marginLeft: '-60%', marginTop:50 }]}>
          <View style={styles.profileImageContainer}> 
          <TouchableOpacity onPress={handlePickImage}>
            <View>
              {image ? (
                <Image
                  source={{ uri: image  }}
                  style={{ width: 155, height: 155, borderRadius: 100, marginTop: '10%', marginBottom: '4%', marginHorizontal: 'auto' }}
                />
              ) : (
                <Ionicons  style={[styles.profileImage, { width: 155, height: 155 }]}name="person-circle" size={155} color="#CFE1D0" />
              )}
            </View>
          </TouchableOpacity>

        </View>
        </View>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Button title="Save" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditProfile;