import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { EXPO_PROJECT_ID } from '../../EXPO_PROJECT_ID';
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission to receive notifications was not granted');
    return;
  }

  const projectId = EXPO_PROJECT_ID;
  if (!projectId) {
    throw new Error('Project ID is not set');
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('Expo push token:', token);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function handleNotificationResponseListener() {
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Response:', response);
  });
}
