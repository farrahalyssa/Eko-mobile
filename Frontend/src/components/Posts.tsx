import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../utils/Styles';
import { Ionicons } from '@expo/vector-icons';
import { usePostsData } from '../utils/data';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';
import { useUserData } from '../utils/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import { formatDateTime } from '../utils/DateUtils';
import { navigateToProfile } from '../utils/ProfileNavigationUtils'; // Import the navigation utility function

type PostsNavigationProp = StackNavigationProp<StackParamList, 'Posts'>;

interface PostsProps {
    profileUserId: string;
}

export default function Posts({ profileUserId }: PostsProps) {
    const { userData } = useUserData();
    const userIdToFetch = profileUserId || userData?.userId || '';
    let { posts, loading, error, fetchPosts } = usePostsData(userIdToFetch);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<PostsNavigationProp>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    useEffect(() => {
        if (userIdToFetch) {
            fetchPosts();
        }
    }, [userIdToFetch]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPosts();
        });

        return unsubscribe;
    }, [navigation, fetchPosts]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts().finally(() => setRefreshing(false));
    }, [fetchPosts]);

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
        } catch (err: any) {
            console.error('Error details:', err.response?.data || err.message);
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:`, err);
        }
    };

    const navigateToLikes = (postId: string) => {
        navigation.navigate('Likes', { postId });
    };

    const handleCommentSubmit = async () => {
        if (!selectedPostId) return;

        try {
            await axios.post(`http://${API_URL}/api/posts/${selectedPostId}/comments`, {
                userId: userData?.userId,
                content: comment,
            });

            setIsModalVisible(false);
            setComment('');
        } catch (err) {
            console.log(err);
        }
    };

    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (loading && !refreshing) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return (
            <View>
                <Text>Error fetching posts: {error.message}</Text>
            </View>
        );
    }

    if (sortedPosts.length === 0) {
        return (
            <View>
                <Text>No posts available.</Text>
            </View>
        );
    }
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            nestedScrollEnabled={true} 
        >
           {sortedPosts.map((post) => (
  <TouchableOpacity key={post.postId} onPress={() => {navigation.navigate('PostDetails', { postId: post.postId, userId: userData?.userId })}}>
    <View style={styles.postContainer}>

                    <View style={styles.rowContainer2}>
                    <TouchableOpacity
  onPress={() => {
    navigateToProfile(
     navigation as StackNavigationProp<StackParamList, 'ExternalProfile'>,
      post.userId || '',
      post.name || '',
      post.username || '',
      post.profileImage || '',
      post.userBio || '',
      post.userCreatedAt || ''
    );
  }}
>

                        <View style={[styles.rowContainer2]}>
                            {userData?.profilephoto_url ? (
                                <Image
                                    source={{ uri: userData?.profilephoto_url }}
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
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={24} color="#646B4B" />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginVertical: '3%', marginHorizontal: '3%' }}>{post.content}</Text>
                    {post.imageUri && (
                        <Image source={{ uri: post.imageUri }} style={{ width: '100%', height: 400, borderRadius: 10 }} />
                    )}
                    <Text style={[styles.subtext, { marginHorizontal: '3%' }]}>{formatDateTime(post.createdAt)}</Text>

                    <View style={styles.rowContainer}>
                        <TouchableOpacity onPress={() => handleLike(post.postId, post.isLiked)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name={post.isLiked ? 'heart' : 'heart-outline'}
                            size={24}
                            color = "#646B4B"
                        />
                        <TouchableOpacity onPress={() => navigateToLikes(post.postId)}><Text style={{ color: '#646B4B', fontSize: 12 }}>{post.likes}</Text>
                        </TouchableOpacity>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setSelectedPostId(post.postId);
                            setIsModalVisible(true);
                        }}>
                            <Ionicons name="chatbubble-outline" size={24} color="#646B4B" />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Ionicons name="repeat" size={30} color="#646B4B" />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Ionicons name="paper-plane-outline" size={24} color="#646B4B" />
                        </TouchableOpacity>
                    </View>

                    <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" presentationStyle='pageSheet'>
                        <ScrollView style={{ padding: '3%' }}>
                            <StatusBar hidden />
                            <SafeAreaView>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                        <Text style={{ color: '#646B4B' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleCommentSubmit}
                                        style={{ backgroundColor: '#646B4B', borderRadius: 100, padding: '2%', width: '15%' }}>
                                        <Text style={{ color: '#cfe1d0', fontSize: 16, textAlign: 'center' }}>Post</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                                    {userData?.profilephoto_url ? (
                                        <Image source={{ uri: userData.profilephoto_url }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                                    ) : (
                                        <Ionicons name="person-circle" size={50} color="#CFE1D0" />
                                    )}
                                    <TextInput
                                        style={{ marginLeft: '5%', marginTop: '3%', width: '80%' }}
                                        placeholder="Post your reply..."
                                        multiline
                                        value={comment}
                                        onChangeText={setComment}
                                    />
                                </View>
                            </SafeAreaView>
                        </ScrollView>
                    </Modal>
                </View>
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
}
