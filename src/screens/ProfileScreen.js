import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function ProfileScreen() {

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  // Pilih foto dari galeri
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Dibutuhkan',
          'Aplikasi membutuhkan akses galeri untuk upload foto.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled) {
        const selectedImage = result.assets[0];

        // Resize dan compress gambar
        const resizedImage =
          await ImageManipulator.manipulateAsync(
            selectedImage.uri,
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
        setImage(resizedImage.uri);
        console.log('Image selected:', resizedImage.uri);
      }
    } catch (error) {
      console.log('Gallery error:', error);
    }
  };

  // Simpan ke galeri
  const saveToGallery = async () => {
    if (!image) return;
    try {
      const permission =
        await MediaLibrary.requestPermissionsAsync(
          false,
          ['photo']
        );
      if (!permission.granted) {
        Alert.alert(
          'Permission Ditolak',
          'Akses media ditolak pada perangkat ini.'
        );
        return;
      }

      const asset =
        await MediaLibrary.createAssetAsync(image);

      let album =
        await MediaLibrary.getAlbumAsync('SocialApp');

      if (!album) {
        await MediaLibrary.createAlbumAsync(
          'SocialApp',
          asset,
          false
        );

      } else {
        await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
      }

      Alert.alert(
        'Berhasil',
        'Foto berhasil disimpan ke galeri.'
      );

    } catch (error) {
      console.log('Save error:', error);
      Alert.alert(
        'Expo Go Limitation',
        'Fitur simpan galeri dibatasi pada Expo Go Android terbaru. Gunakan development build untuk fitur penuh.'
      );
    }
  };

  // Share image
  const sharePost = async () => {
    if (!image) return;
    try {
      const available =
        await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          'Tidak Didukung',
          'Fitur share tidak tersedia di perangkat ini.'
        );
        return;
      }
      await Sharing.shareAsync(image, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Bagikan Post',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Create Post
      </Text>

      {/* Button pilih gambar */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          Choose From Gallery
        </Text>
      </TouchableOpacity>

      {/* Preview gambar */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.previewImage}
        />
      )}

      {/* Caption */}
      <TextInput
        placeholder='Write a caption...'
        placeholderTextColor='#999'
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {/* Fake profile */}
      {image && (
        <View style={styles.postCard}>
          <Text style={styles.username}>
            @aryo_yz
          </Text>

          <Image
            source={{ uri: image }}
            style={styles.postImage}
          />

          <Text style={styles.caption}>
            {caption || 'No caption'}
          </Text>

          <Text style={styles.likes}>
            ❤️ 128 likes
          </Text>
        </View>
      )}

      {/* Actions */}
      {image && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={saveToGallery}
          >
            <Text style={styles.buttonText}>
              Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={sharePost}
          >
            <Text style={styles.buttonText}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },

  uploadButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    color: '#fff',
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },

  postCard: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 20,
    marginBottom: 20,
  },

  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },

  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 12,
  },

  caption: {
    color: '#fff',
    marginBottom: 10,
  },

  likes: {
    color: '#94a3b8',
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});