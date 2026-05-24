import * as FileSystem from 'expo-file-system/legacy';

const POSTS_FILE = FileSystem.documentDirectory + 'posts.json';

// Save posts
export const savePosts = async (posts) => {
  try {
    await FileSystem.writeAsStringAsync(
      POSTS_FILE,
      JSON.stringify(posts),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    console.log('Posts saved');
  } catch (error) {
    console.log('Save posts error:', error);
  }
};

// Load posts
export const loadPosts = async () => {
  try {
    const fileInfo =
      await FileSystem.getInfoAsync(POSTS_FILE);
    // File belum ada
    if (!fileInfo.exists) {
      return [];
    }
    const content =
      await FileSystem.readAsStringAsync(
        POSTS_FILE
      );
    return JSON.parse(content);
  } catch (error) {
    console.log('Load posts error:', error);
    return [];
  }
};

// Delete posts
export const deletePosts = async () => {
  try {
    await FileSystem.deleteAsync(
      POSTS_FILE,
      {
        idempotent: true,
      }
    );
    console.log('Posts deleted');
  } catch (error) {
    console.log('Delete posts error:', error);
  }
};