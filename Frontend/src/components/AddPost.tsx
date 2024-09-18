import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../utils/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackParamList } from '../Types';  
import axios from 'axios';
import { useUserData } from '../utils/data';
import { API_URL } from '../../API_URL';

type AddPostProps = {
    onPostSubmitted?: (newPost: any) => void;  // Define the callback prop
};

export default function AddPost({ onPostSubmitted }: AddPostProps) {  // Accept the callback prop
   type AddPostNavigationProp = StackNavigationProp<StackParamList, 'AddPost'>;
   const navigation = useNavigation<AddPostNavigationProp>();

   const [postContent, setPostContent] = useState('');
   const { userData, loading, error } = useUserData();

   const handlePostSubmit = async () => {
    if (postContent.trim() === '') {
        console.log('Post content is empty');
        return;
    }

    try {
        const response = await axios.post(`http://${API_URL}/api/users/${userData?.userId}/posts`, {
            content: postContent,
        });

        console.log('Post submitted successfully', response.data);
        const { postId } = response.data;
        console.log('New post ID:', postId);

        
        // Navigate back to the previous screen
        navigation.goBack();
    } catch (error: any) {
        console.error('Error submitting post:', error.message);
    }
};

   return (
      <SafeAreaView>
          <ScrollView style={{ padding: '3%'}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <TouchableOpacity 
                  onPress={() => navigation.goBack()}>
                      <Text style={{color: '#646B4B'}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={handlePostSubmit} 
                  style={{ backgroundColor: '#646B4B', borderRadius: 100, padding: '2%', width: '15%'}}>
                      <Text style={{color: '#cfe1d0', fontSize: 16, textAlign: 'center'}}>Post</Text>
                  </TouchableOpacity>
             </View>

              <View style={[{flexDirection: 'row', marginTop: '5%'}]}>
                    {userData?.profilephoto_url ? (
                     <Image source={{ uri: userData.profilephoto_url }}style={{ width: 50, height: 50, borderRadius: 100 }} />):(<Ionicons name="person-circle" size={50} color="#CFE1D0" />)}                  
                    <TextInput
                      style={{marginLeft: '5%', marginTop: '3%', width: '80%'}}
                      placeholder="What's on your mind?"
                      multiline
                      value={postContent}
                      onChangeText={setPostContent}
                  />           
              </View>
          </ScrollView>
      </SafeAreaView>
    );
}
