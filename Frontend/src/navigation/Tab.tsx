import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed
import { TouchableOpacity, View } from 'react-native';
import Home from '../screens/main/Home';
import Profile from '../screens/main/Profile';
import Search from '../screens/main/Search';
import Notification from '../screens/main/Notification';
import { TabParamList } from '../Types'; // Ensure you have TabParamList defined
import { NavigationProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: '#CFE1D0',
        tabBarInactiveTintColor: '#646B4B',
        headerStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: '8%',
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'; // Default value

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={({ navigation }) => ({
          headerTitle: '',
          title: '',
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <TouchableOpacity>
                <Ionicons name="log-out-outline" size={24} color="#646B4B" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#646B4B" style={{ marginRight: 15 }} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Tab.Screen name="Search" component={Search} options={{ headerTitle: '', title: '' }} />
      <Tab.Screen name="Notification" component={Notification} options={{ headerTitle: '', title: '' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false, title: '' }} />
    </Tab.Navigator>
  );
}
