import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../API_URL';


export interface UserData {
  userId: string;
  name: string;
  bio: string;
  username: string;
  email: string;
  active: boolean;
  profilephoto_url: string;
  createdAt: string;
}

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsedUserData: UserData = JSON.parse(userData);
      return parsedUserData;
    } else {
      console.log('No User Data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving User Data:', error);
    return null;
  }
};

export const saveUserData = async (data: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    console.log('User Data saved successfully');
  } catch (error) {
    console.error('Error saving User Data:', error);
  }
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]); // Track followed user IDs

  // Fetch user data and followed users from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();  // Get user data from AsyncStorage
        if (data) {
          setUserData(data);

          // Fetch the list of users this user is following from the backend
          const followDataResponse = await axios.get<string[]>(`http://${API_URL}/api/users/${data.userId}/followingData`);

          // Update the followedUsers state with the fetched data
          setFollowedUsers(followDataResponse.data);
        } else {
          console.log('No User Data found');
        }
      } catch (err: any) {
        setError(err);
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Follow a user
  const followUser = async (profileUserId: string) => {
    try {
      await axios.post(`http://${API_URL}/api/users/${userData?.userId}/follow`, {
        userId: userData?.userId || '',
        followingUserId: profileUserId
      });

      // Add the followed user to the followedUsers list
      setFollowedUsers((prev) => [...prev, profileUserId]);

    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  // Unfollow a user
  const unfollowUser = async (profileUserId: string) => {
    try {
      await axios.delete(`http://${API_URL}/api/users/${userData?.userId}/follow`, {
        data: {
          userId: userData?.userId || '',
          followingUserId: profileUserId,
        },
      });

      // Remove the user from the followedUsers list
      setFollowedUsers((prev) => prev.filter((id) => id !== profileUserId));

    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  return {
    userData,
    setUserData,
    loading,
    error,
    followUser,
    unfollowUser,
    currentUserId: userData?.userId,
    followedUsers // Return followedUsers so it can be accessed in ProfileTopButton
  };
};




export interface Post {
  postId: string;
  name: string;
  userId: string;
  username: string;
  profileImage: string;
  content: string;
  imageUri?: string;
  createdAt: string;
  userBio?: string;
  userCreatedAt?: string;
  likes: number;
  isLiked: boolean;  
}

export const getOtherUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const response = await axios.get<UserData>(`http://${API_URL}/api/users/${userId}`);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error('Error fetching other user data:', error);
    return null;
  }
};

export type Comment = {
  commentId: number;
  content: string;
  createdAt: string;
  userId: string;  
  profileImage?: string;  
  username: string; 
  name?: string;     
};
export const usePostsData = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch like count for a post
  const fetchLikeCount = async (postId: string): Promise<number> => {
    try {
      const response = await axios.get<{ likeCount: number }>(`http://${API_URL}/api/users/${userId}/posts/${postId}/countLikes`);
      return response.data.likeCount;
    } catch (err: any) {
      console.error('Failed to fetch like count:', err);
      return 0; // Default to 0 likes in case of error
    }
  };

  const fetchPosts = async () => {
    try {
      if (!userId) return;
      setLoading(true);

      // Fetch posts from the backend including the `isLiked` field
      const response = await axios.get<Post[]>(`http://${API_URL}/api/users/${userId}/posts`);
      const postsWithLikeCount = await Promise.all(
        response.data.map(async (post) => {
          const likeCount = await fetchLikeCount(post.postId);
          return { ...post, likes: likeCount };
        })
      );

      setPosts(postsWithLikeCount);  // Now includes `likes` count for each post
      setError(null);  // Clear any previous errors
    } catch (err: any) {
      setError(err as Error);
      console.error('Failed to fetch posts:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  return { posts, loading, error, fetchPosts };
};

export type ProfileParams = {
  userId: string;
  name: string;
  username: string;
  profilephoto_url: string;
  bio: string;
  createdAt: string;
};

export const fetchUsersChats = async (userId: string) => {
  try {

    const response = await axios.get(`http://${API_URL}/api/users/${userId}/chatrooms`, {
      params: { userId }
    });

    return response.data; // Return the parsed JSON data directly
  } catch (error) {
    
      console.error('Unexpected error fetching user chats:', error);
      return null;
  }
};


export const fetchUserStats = async (userId: string, setLoading: (loading: boolean) => void, setRefreshing: (refreshing: boolean) => void) => {
  setLoading(true); 
  setRefreshing(false); 

  try {
    const response = await axios.get(`http://${API_URL}/api/users/${userId}/stats`);
    const data = response.data;
    
    console.log(data);
    
    if (data && data.stats) {
      return data.stats; // Return the fetched stats
    } else {
      console.error('No user stats found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return null;
  } finally {
    setLoading(false); // Set loading to false when fetch is complete
  }
};


// Custom Hook to manage user stats and refresh functionality
export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState({ countPosts: 0, countFollowers: 0, countFollowing: 0 });
  const [loading, setLoading] = useState(true);  
  const [refreshing, setRefreshing] = useState(true);  
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = async () => {
    console.log("Fetching user stats..."); // Debugging
    try {
      const response = await axios.get(`http://${API_URL}/api/users/${userId}/stats`);
      console.log("API Response:", response.data); // Debugging
      const data = response.data;

      if (data && data.stats) {
        setStats(data.stats);  // Set stats if API call is successful
        setError(null);  // Clear error
      } else {
        setError('Failed to fetch user statistics');
      }
    } catch (err) {
      console.error('Error fetching user statistics:', err);
      setError('Error fetching user statistics');
    } finally {
      setLoading(false);  // Turn off loading after fetch
    }
  };

  const refreshStats = async () => {
    console.log("Refreshing stats...");  // Debugging
    setRefreshing(true);  // Set refreshing to true before fetching
    await fetchUserStats();  // Fetch fresh data
  };

  useEffect(() => {
    fetchUserStats();  // Fetch stats on initial mount
  }, [userId]);

  return { stats, loading, refreshing, error, refreshStats };
};

