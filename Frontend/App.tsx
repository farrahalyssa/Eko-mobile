import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform } from 'react-native';
import StackNav from './src/navigation/Stack';
import { registerForPushNotificationsAsync, setupNotificationHandler, handleNotificationResponseListener } from './src/navigation/notifications/NotificationService';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    setupNotificationHandler();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    responseListener.current = handleNotificationResponseListener();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <StackNav />;
}
