import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

import * as Notifications from 'expo-notifications';

import * as Device from 'expo-device';

export default function HomeScreen() {

  const [notificationPermission, setNotificationPermission] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Request permission
  const requestNotificationPermission = async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert(
          'Perangkat Tidak Didukung',
          'Notification hanya berjalan di device asli.'
        );
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Ditolak',
          'Akses notification diperlukan untuk menerima notifikasi.'
        );
        return;
      }

      setNotificationPermission(true);
      console.log('Notification permission granted');
    } catch (error) {
      console.log('Notification permission error:', error);
    }
  };

  // Send local notification
  const sendNotification = async () => {
    if (!notificationPermission) {
      Alert.alert(
        'Permission Dibutuhkan',
        'Aktifkan permission notification terlebih dahulu.'
      );
      return;
    }
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Message 📩',
          body: 'Aryo mengirim pesan baru.',
          data: {
            screen: 'Home',
          },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
          channelId: 'default',
        },
      });
      Alert.alert(
        'Notification Scheduled',
        'Notification akan muncul dalam 5 detik.'
      );
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync(
        'default',
        {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        }
      );
    }
    requestNotificationPermission();

    // Saat notif diterima
    notificationListener.current =
      Notifications.addNotificationReceivedListener(

        (notification) => {

          console.log(
            'Notification received:',
            notification
          );
        }
      );

    // Saat notif ditekan
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(

        (response) => {

          console.log(
            'Notification tapped:',
            response
          );
        }
      );

    // Cleanup listener
    return () => {

      notificationListener.current?.remove();

      responseListener.current?.remove();
    };

  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        SocialApp Notifications
      </Text>

      <Text style={styles.subtitle}>
        Test local push notification feature
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={sendNotification}
      >
        <Text style={styles.buttonText}>
          Send Test Notification
        </Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>

        <Text style={styles.statusText}>
          Permission:
        </Text>

        <Text
          style={[
            styles.statusValue,
            {
              color:
                notificationPermission
                  ? '#22c55e'
                  : '#ef4444',
            },
          ]}
        >
          {notificationPermission
            ? 'Granted'
            : 'Not Granted'}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    color: '#cbd5e1',
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 16,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  statusContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },

  statusText: {
    color: '#fff',
    fontSize: 16,
  },

  statusValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});