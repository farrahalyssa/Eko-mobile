import React, { useEffect, useRef } from 'react';
import StackNav from './src/navigation/Stack';
import { registerForPushNotificationsAsync, setupNotificationHandler, handleNotificationResponseListener, cleanupNotificationListeners } from './src/screens/main/NotificationServer';
import * as Notifications from 'expo-notifications';

export default function App() {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    async function setupNotifications() {
      setupNotificationHandler();

      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('Expo Push Token:', token);
        // Optionally, send the token to your backend
      }

      // Set up listeners for notifications
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      responseListener.current = handleNotificationResponseListener();
    }

    setupNotifications();

    return () => {
      cleanupNotificationListeners(notificationListener, responseListener);
    };
  }, []);

  return <StackNav />;
}
