import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import * as Notifications from 'expo-notifications';

import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
          title: 'SocialApp Notification',
          body: 'Ini adalah notifikasi lokal dari SocialApp.',
          sound: true,
          data: {
            screen: 'Home',
          },
        },
        trigger: null,
      });
      Alert.alert(
        'Success',
        'Notification berhasil dikirim.'
      );
    } catch (error) {
      console.log(
        'Notification error:',
        error
      );
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
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        SocialApp
      </Text>

      <Text style={styles.subtitle}>
        Mobile Native Features Integration
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={sendNotification}
      >
        <Text style={styles.buttonText}>
          Send Test Notification
        </Text>
      </TouchableOpacity>

      {/* Permission Status */}
      <View style={styles.statusContainer}>

        <Text style={styles.statusText}>
          Notification Permission:
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

      {/* Features */}
      <View style={styles.featureContainer}>
        <View style={styles.featureCard}>
          <Ionicons
            name='camera'
            size={28}
            color='#2563eb'
          />

          <Text style={styles.featureTitle}>
            Camera Integration
          </Text>

        </View>

        <View style={styles.featureCard}>
          <Ionicons
            name='images'
            size={28}
            color='#2563eb'
          />
          <Text style={styles.featureTitle}>
            Gallery Upload
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons
            name='map'
            size={28}
            color='#2563eb'
          />
          <Text style={styles.featureTitle}>
            Nearby Users Map
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons
            name='notifications'
            size={28}
            color='#2563eb'
          />

          <Text style={styles.featureTitle}>
            Local Notification
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons
            name='folder'
            size={28}
            color='#2563eb'
          />

          <Text style={styles.featureTitle}>
            Persistent Storage
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons
            name='link'
            size={28}
            color='#2563eb'
          />

          <Text style={styles.featureTitle}>
            Deep Linking
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },

  featureContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,

    backgroundColor: '#1e293b',

    padding: 18,

    borderRadius: 18,
  },

  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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