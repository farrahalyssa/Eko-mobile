import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../utils/Styles';
import axios from 'axios';
import {formatDateTime} from '../../utils/DateUtils';
import { Post, Comment } from '../../utils/data';
import { StackParamList } from '../../Types';
import { useUserData } from '../../utils/data';
import { usePostsData } from '../../utils/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { navigateToProfile } from '../../utils/ProfileNavigationUtils';
import { API_URL } from '../../../API_URL';

type PostDetailsRouteProp = RouteProp<StackParamList, 'PostDetails'>;

const PostDetails = () => {
  const { userData } = useUserData();
  const { posts, fetchPosts } = usePostsData(userData?.userId || '');
  const route = useRoute<PostDetailsRouteProp>();
  const { postId, userId } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const navigateToLikes = () => {
    navigation.navigate('Likes', { postId });
  };

  
  // Fetch post details and comments
  useEffect(() => {
    
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get<Post>(`http://${API_URL}/api/users/${userId}/posts/${postId}`);
        setPost(response.data);


        const commentsResponse = await axios.get<Comment[]>(`http://${API_URL}/api/posts/${postId}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        setError('Error fetching post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, userId]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (!userData?.userId) {
        console.error("User ID is missing");
        return;
      }

      if (!isLiked) {
        await axios.post(`http://${API_URL}/api/posts/${postId}/likes`, { userId: userData.userId });
      } else {
        await axios.delete(`http://${API_URL}/api/posts/${postId}/likes`, {
          data: { userId: userData.userId }
        });
      }

      fetchPosts();
    } catch (err) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:`, err);
    }
  };

  // Submit a new comment
  const handleSubmitComment = async () => {
    if (commentText.trim() === '') return;

    try {
      await axios.post(`http://${API_URL}/api/posts/${postId}/comments`, {
        userId: userData?.userId,
        content: commentText,
      });

      // Refetch the comments after posting
      const response = await axios.get<Comment[]>(`http://${API_URL}/api/posts/${postId}/comments`);
      setComments(response.data);
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  const renderHeader = () => (
    <View style={styles.postContainer}>
      <View style={styles.rowContainer2}>
        <TouchableOpacity onPress={() => {
    navigateToProfile(
     navigation as StackNavigationProp<StackParamList, 'ExternalProfile'>,
      post.userId || '',
      post.name || '',
      post.username || '',
      post.profileImage || '',
      post.userBio|| '',
      post.userCreatedAt || ''
    );
  }}>
          <View style={styles.rowContainer2}>

        {post.profileImage ? (
          <Image
            source={{ uri: post.profileImage }}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
        ) : (
          <Ionicons name="person-circle" size={50} color="#CFE1D0" />
        )}
        <View style={{ marginLeft: '5%' }}>
          <Text style={{ fontWeight: 'bold' }}>{post.name}</Text>
          <Text style={{ color: '#777' }}>@{post.username}</Text>
        </View>
        </View>

        </TouchableOpacity>

      </View>

      <Text style={{ marginVertical: '3%', marginHorizontal: '3%' }}>{post.content}</Text>
     {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
      )}
      <Text style={[styles.subtext, { marginHorizontal: '3%' }]}>{formatDateTime(post.createdAt)}</Text>

      <View style={[styles.rowContainer, {paddingBottom:20}]}>
        <TouchableOpacity onPress={() => handleLike(post.postId, post.isLiked)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={post.isLiked ? 'heart' : 'heart-outline'} size={24} color="#646B4B" />
            <TouchableOpacity onPress={navigateToLikes}><Text style={{ color: '#646B4B', fontSize: 12 }}>{post.likes}</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#646B4B" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="repeat" size={30} color="#646B4B" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#646B4B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <View style={styles.rowContainer2}>
                {item.profileImage ? (
                  <Image
                    source={{ uri: item.profileImage }}
                    style={styles.commentProfileImage}
                  />
                ) : (
                  <Ionicons name="person-circle" size={40} color="#CFE1D0" />
                )}

                <View style={styles.commentTextContainer}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ color: '#777' }}>@{item.username}</Text>
                </View>
              </View>
              <Text style={{ marginHorizontal: '3%', marginTop: '1%' }}>{item.content}</Text>
              <Text style={[styles.subtext, { marginHorizontal: '3%' }]}>{formatDateTime(item.createdAt)}</Text>
            </View>
          )}
          ListHeaderComponent={renderHeader}  // Render the post details as the header
        />

        <View style={styles.commentInputContainer}>
          <TextInput
            style={[styles.commentInput, { textAlignVertical: 'center', paddingVertical: 10 }]}
            value={commentText}
            placeholder="Write a comment..."
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleSubmitComment}>
            <Ionicons name="send-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetails;
