import { useRef, useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

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
          <Text style={styles.buttonText}>
            Flip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={startCountdown}
        >
          <Text style={styles.buttonText}>
            Capture
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
        >
          <Text style={styles.buttonText}>
            Flash
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      {photo && (
        <View style={styles.previewContainer}>

          <Text style={styles.previewTitle}>
            Story Preview
          </Text>

          <Image
            source={{ uri: photo }}
            style={styles.previewImage}
          />
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
    bottom: 260,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  captureButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 50,
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
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#111',
  },

  previewTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
});