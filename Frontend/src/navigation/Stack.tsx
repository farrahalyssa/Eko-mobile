import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import TabNav from './Tab';
import AddPost from '../components/AddPost';
import Posts from '../components/AddPost'
import EditProfile from '../screens/Settings/EditProfile';
import PostDetails from '../screens/details/PostDetails';
import Likes from '../screens/details/Likes';
import ExternalProfile from '../screens/main/ExternalProfile';
import Connections from '../components/Connections';
import { StackParamList } from '../Types';
export default function StackNav(){
    const Stack = createStackNavigator();

    return (
        <NavigationContainer 
            
        >
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="TabNav" component={TabNav} options={{headerShown: false}}/>
                <Stack.Screen name="AddPost" component={AddPost} options={{headerShown: false}} />
                <Stack.Screen name="ExternalProfile" component={ExternalProfile} options={{headerShown: false}} />
                <Stack.Screen name="Posts" component={Posts} options={{headerShown: false}} />
                <Stack.Screen name="EditProfile" component={EditProfile}  options={{
                    title: 'Edit Profile',
                    headerBackTitle: ' ', 
                    headerStyle: { 
                    backgroundColor: 'transparent',
                    },
                    headerTintColor: '#646B4B',
                }} 
                />
                <Stack.Screen name="PostDetails" component={PostDetails} 
                options={{
                    title: '',
                    headerBackTitle: ' ', 
                    headerStyle: { 
                    backgroundColor: 'transparent',
                    },
                    headerTintColor: '#646B4B',
                }} 
                />
                 <Stack.Screen name="Connections" component={Connections}  options={{
                    title: 'Following' || 'Followers',
                    headerBackTitle: ' ', 
                    headerStyle: { 
                    backgroundColor: 'transparent',
                    },
                    headerTintColor: '#646B4B',
                }} 
                />
                <Stack.Screen name="Likes" component={Likes} 
                options={{
                    title: '',
                    headerBackTitle: ' ', 
                    headerStyle: { 
                    backgroundColor: 'transparent',
                    },
                    headerTintColor: '#646B4B',
                }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}