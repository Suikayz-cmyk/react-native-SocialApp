import { useRef, useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CameraView, useCameraPermissions,} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [countdown, setCountdown] = useState(null);
  const cameraRef = useRef(null);
  const countdownRef = useRef(null);

  // Cleanup interval saat keluar screen
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Ambil foto
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      // Resize dan compress gambar
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        picture.uri,
        [
          {
            resize: {
              width: 800,
            },
          },
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      setPhoto(resizedPhoto.uri);
      console.log('Photo saved:', resizedPhoto.uri);
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  // Countdown 
  const startCountdown = () => {
    let timer = 3;
    setCountdown(timer);
    countdownRef.current = setInterval(() => {
      timer--;
      if (timer > 0) {
        setCountdown(timer);
      } else {
        clearInterval(countdownRef.current);
        setCountdown(null);
         takePicture();
      }
    }, 1000);
  };

  // Flip kamera
  const toggleCamera = () => {
    setFacing(current =>
      current === 'back' ? 'front' : 'back'
    );
  };

  // Toggle flash
  const toggleFlash = () => {
    setFlash(current =>
      current === 'off' ? 'on' : 'off'
    );
  };

  const clearPhoto = () => {
    setPhoto(null);
  };

  // Permission 
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Aplikasi membutuhkan akses kamera
          untuk membuat story.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Izinkan Kamera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

return (
  <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {/* Countdown */}
      {countdown && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {countdown}
          </Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCamera}
        >
          <Ionicons
            name='camera-reverse'
            size={24}
            color='#fff'
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={startCountdown}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
        >
          <Ionicons
            name={
              flash === 'on'
                ? 'flash'
                : 'flash-off'
            }
            size={24}
            color='#fff'
          />

        </TouchableOpacity>
      </View>

      {/* Preview */}
      {photo && (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              Story Preview
            </Text>

            <TouchableOpacity
              onPress={clearPhoto}
            >
              <Ionicons
                name='close-circle'
                size={28}
                color='#fff'
              />
            </TouchableOpacity>

          </View>

          <Image
            source={{ uri: photo }}
            style={styles.previewImage}
          />

          <TouchableOpacity
            style={styles.retakeButton}
            onPress={clearPhoto}
          >
            <Ionicons
              name='camera'
              size={20}
              color='#fff'
            />
            <Text style={styles.buttonText}>
              Retake
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  controlButton: {
    width: 58,
    height: 58,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButton: {
    width: 86,
    height: 86,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#ef4444',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  countdownContainer: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
  },

  countdownText: {
    color: '#fff',
    fontSize: 80,
    fontWeight: 'bold',
  },

  previewContainer: {
    position: 'absolute',
    bottom: 130,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 24,
    padding: 16,
  },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  previewTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
  },

  retakeButton: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});