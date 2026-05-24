import { useState, useEffect } from 'react';

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
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { savePosts, loadPosts, deletePosts,} from '../utils/fileSystem';

export default function ProfileScreen() {

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);

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

  const saveCurrentPost = async () => {
    if (!image) {
      Alert.alert(
        'Tidak Ada Post',
        'Pilih gambar terlebih dahulu.'
      );
      return;
    }

    try {
      const newPost = {
        id: Date.now(),
        image,
        caption,
        createdAt: new Date().toISOString(),
      };

      const updatedPosts = [
        newPost,
        ...savedPosts,
      ];

      setSavedPosts(updatedPosts);
      await savePosts(updatedPosts);
      Alert.alert(
        'Berhasil',
        'Post berhasil disimpan ke local storage.'
      );
    } catch (error) {
      console.log('Save current post error:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const posts = await loadPosts();
    setSavedPosts(posts);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name='images'
          size={32}
          color='#2563eb'
        />

        <Text style={styles.title}>
          Create Post
        </Text>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
      >
        <Ionicons
          name='image'
          size={22}
          color='#fff'
        />

        <Text style={styles.buttonText}>
          Choose From Gallery
        </Text>
      </TouchableOpacity>

      {/* Preview */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.previewImage}
        />
      )}

      {/* Caption */}
      <TextInput
        placeholder='Write a caption...'
        placeholderTextColor='#94a3b8'
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {/* Preview Card */}
      {image && (
        <View style={styles.postCard}>
          <View style={styles.profileRow}>
            <Ionicons
              name='person-circle'
              size={42}
              color='#2563eb'
            />

            <View>
              <Text style={styles.username}>
                aryo_yz
              </Text>

              <Text style={styles.postTime}>
                Just now
              </Text>
            </View>
          </View>

          <Image
            source={{ uri: image }}
            style={styles.postImage}
          />

          <Text style={styles.caption}>
            {caption || 'No caption'}
          </Text>

          <View style={styles.likeRow}>
            <Ionicons
              name='heart'
              size={18}
              color='#ef4444'
            />

            <Text style={styles.likes}>
              128 likes
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {image && (
        <>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={saveToGallery}
            >

              <Ionicons
                name='download'
                size={20}
                color='#fff'
              />

              <Text style={styles.buttonText}>
                Save
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={sharePost}
            >

              <Ionicons
                name='share-social'
                size={20}
                color='#fff'
              />
              <Text style={styles.buttonText}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={saveCurrentPost}
            >

              <Ionicons
                name='folder'
                size={20}
                color='#fff'
              />

              <Text style={styles.buttonText}>
                Save Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={async () => {
                await deletePosts();
                setSavedPosts([]);
                Alert.alert(
                  'Deleted',
                  'Semua post berhasil dihapus.'
                );
              }}
            >
              <Ionicons
                name='trash'
                size={20}
                color='#fff'
              />

              <Text style={styles.buttonText}>
                Delete All
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Saved Posts */}
      <View style={styles.savedHeader}>
        <Ionicons
          name='folder-open'
          size={26}
          color='#2563eb'
        />

        <Text style={styles.savedTitle}>
          Saved Posts
        </Text>
      </View>

      {savedPosts.map((post) => (
        <View
          key={post.id}
          style={styles.savedPostCard}
        >
          <Image
            source={{ uri: post.image }}
            style={styles.savedPostImage}
          />

          <View style={styles.savedPostContent}>
            <Text style={styles.savedCaption}>
              {post.caption || 'No caption'}
            </Text>

            <Text style={styles.savedDate}>
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}
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
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
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

  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  savedTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  savedPostCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
  },

  savedPostImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 10,
  },

  savedCaption: {
    color: '#fff',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },

  postTime: {
    color: '#94a3b8',
    fontSize: 13,
  },

  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },

  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },

  savedPostContent: {
    marginTop: 10,
  },

  savedDate: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 12,
  },
});