import React, { useState } from 'react';
import { Text, SafeAreaView, View, TextInput, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../Types'; // Ensure the TabParamList includes ExternalProfile
import { API_URL } from '../../API_URL';
// Define the navigation prop type
type SearchNavigationProp = StackNavigationProp<StackParamList, 'ExternalProfile'>;

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigation = useNavigation<SearchNavigationProp>(); // Use navigation hook with types

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    setError('');  // Reset error message
    
    if (text.length > 2) {  // Start searching when query is longer than 2 characters
      setLoading(true);
      try {
        const response = await fetch(`http://${API_URL}/api/search?query=${text}`);
        const data = await response.json();

        if (response.ok) {
          console.log(data.users);
          setResults(data.users);  // Set search results
        } else {
          setError('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Error fetching search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ExternalProfile', {
          userId: item.userId,
          name: item.name,
          username: item.username,
          profilephoto_url: item.profileImage,
          bio: item.bio,
          createdAt: item.created_at
        });
      }}
    >
      <View style={styles.resultItem}>
        {item.profilephoto_url ? (
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} resizeMode="cover" />
        ) : (
          <Ionicons style={[styles.profileImage, { width: 60, height: 60 }]} name="person-circle" size={60} color="#CFE1D0" />
        )}
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultUsername}>@{item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Use ListHeaderComponent to place the search bar at the top of FlatList
  const renderHeader = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : results.length === 0 && searchQuery.length > 2 ? (
        <Text style={styles.subtext}>No results found</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.userId.toString()}
          ListHeaderComponent={renderHeader}  // Add the search bar at the top
        />
      )}
    </SafeAreaView>
  );
}

// Example styles (replace with your actual styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  resultTextContainer: {
    flexDirection: 'column',
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultUsername: {
    fontSize: 16,
    color: '#555',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
