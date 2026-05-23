import { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import MapView, { Marker, Circle,} from 'react-native-maps';

import * as Location from 'expo-location';

export default function MapScreen() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    let subscription;
    const getLocation = async () => {
      try {
        // Request permission
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(
            'Izin lokasi diperlukan untuk melihat nearby users.'
          );
          return;
        }

        // Ambil lokasi pertama
        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        setLocation(currentLocation.coords);

        // Dummy nearby users
        generateNearbyUsers(currentLocation.coords);

        // Tracking realtime
        subscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              distanceInterval: 10,
            },
            (updatedLocation) => {
              setLocation(updatedLocation.coords);
              generateNearbyUsers(updatedLocation.coords);
            }
          );
      } catch (error) {
        console.log('Location error:', error);

        setErrorMsg(
          'Terjadi kesalahan saat mengambil lokasi.'
        );
      }
    };
    getLocation();
    // Cleanup watcher
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Generate nearby users dummy
  const generateNearbyUsers = (coords) => {
    const users = [
      {
        id: 1,
        username: 'Rafi',
        latitude: coords.latitude + 0.001,
        longitude: coords.longitude + 0.001,
      },
      {
        id: 2,
        username: 'Dina',
        latitude: coords.latitude - 0.0015,
        longitude: coords.longitude + 0.001,
      },
      {
        id: 3,
        username: 'Kevin',
        latitude: coords.latitude + 0.0012,
        longitude: coords.longitude - 0.0015,
      },
    ];
    setNearbyUsers(users);
  };

  // Loading
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        {errorMsg ? (
          <Text style={styles.errorText}>
            {errorMsg}
          </Text>
        ) : (
          <>
            <ActivityIndicator
              size='large'
              color='#2563eb'
            />

            <Text style={styles.loadingText}>
              Mengambil lokasi...
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}

        showsUserLocation={true}

        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* Marker user */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title='Posisi Saya'
          description='Lokasi saat ini'
        />

        {/* Nearby users */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}

            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}

            title={user.username}

            description='Nearby User'
          />
        ))}

        {/* Radius */}
        <Circle
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}

          radius={200}

          fillColor='rgba(37,99,235,0.15)'

          strokeColor='#2563eb'

          strokeWidth={2}
        />

      </MapView>

      {/* Top Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          Nearby Users
        </Text>

        <Text style={styles.infoSubtitle}>
          {nearbyUsers.length} users nearby
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },

  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },

  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },

  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,

    backgroundColor: 'rgba(15,23,42,0.92)',

    padding: 16,

    borderRadius: 18,
  },

  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  infoSubtitle: {
    color: '#cbd5e1',
    marginTop: 4,
  },
});