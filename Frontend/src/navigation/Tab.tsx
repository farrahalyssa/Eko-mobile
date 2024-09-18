import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import Ionicons
import Home from '../screens/main/Home';
import Profile from '../screens/main/Profile';
import Search from '../screens/main/Search';
import Notification from '../screens/main/Notification';
import { TabParamList } from '../Types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
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
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'; // Initialize with a default value

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } 
          else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          else if(route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }
          else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>

      <Tab.Screen name="Home" component={Home} options={{ headerTitle: '', title: '' }} />
      <Tab.Screen name="Search" component={Search} options={{ headerTitle: '', title: '' }} />
      <Tab.Screen name="Notification" component={Notification} options={{ headerTitle: '', title: '' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false, title: '' }} />

    </Tab.Navigator>
  );
}
