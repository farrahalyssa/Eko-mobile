import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { EXPO_PROJECT_ID } from '../../EXPO_PROJECT_ID'; // Replace with actual project ID

// Function to register the device for push notifications
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  // Ensure the app is running on a physical device
  if (!Device.isDevice) {
    alert('Must use a physical device for push notifications');
    return;
  }

  // Request notification permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notifications');
    return;
  }

  // Fetch the Expo Push Token for this device
  const token = (await Notifications.getExpoPushTokenAsync({ projectId: EXPO_PROJECT_ID })).data;
  console.log('Expo Push Token:', token);

  // Set up Android-specific notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Function to set up the global notification handler
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Function to handle notification responses when a user taps a notification
export function handleNotificationResponseListener() {
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
    // Handle the response here (e.g., navigate to a specific screen)
  });
}

// Function to clean up notification listeners
export function cleanupNotificationListeners(notificationListener: any, responseListener: any) {
  if (notificationListener.current) {
    Notifications.removeNotificationSubscription(notificationListener.current);
  }
  if (responseListener.current) {
    Notifications.removeNotificationSubscription(responseListener.current);
  }
}
