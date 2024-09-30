import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../utils/Styles';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Types';
import { useUserData } from '../utils/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../API_URL';
import { formatDateTime } from '../utils/DateUtils';
import { navigateToProfile } from '../utils/ProfileNavigationUtils';
import { getOtherUserData } from '../utils/data';
import customLogger from '../utils/loggerUtils';

type Post = {
    postId: string;
    content: string;
    imageUri?: string;
    createdAt: string;
    userId: string;
    username: string;
    profileImage?: string;
    name: string;
    userBio?: string;
    userCreatedAt?: string;
    isLiked: boolean;
    likes: number;
};

type PostsNavigationProp = StackNavigationProp<StackParamList, 'Posts'>;

export default function FeedPosts() {
    const { userData } = useUserData(); // Fetch user data
    const [posts, setPosts] = useState<Post[]>([]); // State for posts
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for errors
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<PostsNavigationProp>();
    const [isModalVisible, setIsModalVisible] = useState(false); // State for comment modal
    const [comment, setComment] = useState('');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Fetch like count for a specific post
    const fetchLikeCount = async (postId: string, userId: string): Promise<number> => {
        try {
            const response = await axios.get<{ likeCount: number }>(`http://${API_URL}/api/users/${userId}/posts/${postId}/countLikes`);
            return response.data.likeCount;
        } catch (err) {
            console.error('Failed to fetch like count:', err);
            return 0; // Default to 0 in case of error
        }
    };

    // Fetch posts and their like counts
    const fetchPosts = async () => {
        try {
            if (!userData?.userId) return;
            setLoading(true);

            // Fetch posts from the backend
            const response = await axios.get<Post[]>(`http://${API_URL}/api/users/${userData.userId}/feed`);

            // For each post, fetch the like count
            const postsWithLikeCount = await Promise.all(
                response.data.map(async (post) => {
                    const likeCount = await fetchLikeCount(post.postId, post.userId);
                    return { ...post, likes: likeCount };
                })
            );

            setPosts(postsWithLikeCount); // Update the posts state with like counts
            setError(null);
        } catch (err: any) {
            setError('Error fetching feed posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData?.userId) {
            fetchPosts();
        }
    }, [userData?.userId]);

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

    const handlePress = async (item: Post) => {
        try {
          const otherUserData = await getOtherUserData(item.userId);
          const userData = Array.isArray(otherUserData) ? otherUserData[0] : otherUserData;
          customLogger(userData); 
  
          navigateToProfile(
            navigation, 
            item.userId, 
            item.name, 
            item.username, 
            userData?.profilephoto_url, 
            userData?.bio || '', 
            userData?.created_at || ''
          );
        } catch (error) {
          console.error('Error fetching other user data:', error);
        }
    };
            const handleLike = async (postId: string, isLiked: boolean) => {
        try {
            if (!userData?.userId) {
                console.error("User ID is missing");
                return;
            }

            // Optimistic UI update: update the local post state
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId
                        ? {
                              ...post,
                              isLiked: !isLiked,
                              likes: isLiked ? post.likes - 1 : post.likes + 1, // Update the like count
                          }
                        : post
                )
            );

            // Make the API request
            if (!isLiked) {
                
                await axios.post(`http://${API_URL}/api/posts/${postId}/likes`, { userId: userData.userId, postId: postId });
            } else {
                await axios.delete(`http://${API_URL}/api/posts/${postId}/likes`, {
                    data: { userId: userData.userId }
                });
            }
        } catch (err) {
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:`, err);

            // Rollback in case of an error
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId
                        ? {
                              ...post,
                              isLiked: isLiked, // Revert to previous state
                              likes: isLiked ? post.likes + 1 : post.likes - 1, // Revert like count
                          }
                        : post
                )
            );
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
            fetchPosts(); // Refresh posts after comment submission
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
                <Text>{error}</Text>
            </View>
        );
    }

    if (sortedPosts.length === 0) {
        return (
            <View>
                <Text>No posts available in the feed.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            nestedScrollEnabled={true}
        >
            {sortedPosts.map((post) => (
                <TouchableOpacity key={post.postId} onPress={() => 
                {
            
                navigation.navigate('PostDetails', { postId: post.postId, userId: userData?.userId })}}>
                    <View style={styles.postContainer}>
                        <View style={styles.rowContainer2}>
                            <TouchableOpacity
                                onPress={() => {
                                    handlePress(post);
                                }}
                            >
                                <View style={[styles.rowContainer2]}>
                                    {post.profileImage ? (
                                        <Image source={{ uri: post.profileImage }} style={{ width: 50, height: 50, borderRadius: 100 }} />
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
                            <TouchableOpacity onPress={() => {
                                console.log(post)
                                handleLike(post.postId, post.isLiked)}}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name={post.isLiked ? 'heart' : 'heart-outline'} size={24} color="#646B4B" />
                                    <TouchableOpacity onPress={() => navigateToLikes(post.postId)}>
                                        <Text style={{ color: '#646B4B', fontSize: 12 }}>{post.likes}</Text>
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
