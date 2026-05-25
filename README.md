# SocialApp

## Informasi Mahasiswa / Author

- Nama: Muhammad Prayogo Pangestu
- Nim : 2410501046
- Program Studi: D3 Sistem Informasi

## Deskripsi App

SocialApp merupakan aplikasi mobile social media sederhana berbasis React Native dan Expo yang mengintegrasikan berbagai native device features Android seperti:

- Camera integration
- Gallery upload
- Local notification
- Deep linking
- Persistent local storage
- Image sharing
- Location services

## Tech Stack

### Frontend
- React Native
- Expo SDK 54

### Navigation
- React Navigation
- Bottom Tabs Navigation

### Native Features
- expo-camera
- expo-image-picker
- expo-notifications
- expo-location
- expo-media-library
- expo-sharing
- expo-linking
- expo-file-system

### Storage
- AsyncStorage

### UI
- Expo Vector Icons
- React Native StyleSheet

## Features

### 1. Camera Integration
- Mengambil foto menggunakan kamera device
- Flip front/back camera
- Flash toggle
- Countdown capture
- Story preview
- Retake photo

### 2. Gallery Upload
- Upload gambar dari galeri
- Image preview
- Caption input

### 3. Local Notification
- Request notification permission
- Send local notification
- Notification listener

### 4. Persistent Storage
- Save post menggunakan AsyncStorage
- Load saved posts otomatis
- Delete saved posts

### 5. Media Library
- Save image ke gallery device

### 6. Deep Linking
- Open specific screen menggunakan URL scheme

Contoh:
```bash
socialapp://profile
```

## Screenshoot
### Home Screen
<img width="200" alt="WhatsApp Image 2026-05-25 at 20 37 28" src="https://github.com/user-attachments/assets/3bb55133-75d5-4adf-b829-a492fd3f3602" />

### Camera Screen
<img width="200" alt="WhatsApp Image 2026-05-25 at 20 37 29" src="https://github.com/user-attachments/assets/836ffe23-72b6-4b55-b3b9-e5414abdb982" />

### Profile Screen
<img width="200" alt="WhatsApp Image 2026-05-25 at 20 37 29 (1)" src="https://github.com/user-attachments/assets/5d8da5af-0e17-4cb6-a918-f81a99245f19" />

### Map Screen
<img width="200" alt="WhatsApp Image 2026-05-25 at 20 37 28 (1)" src="https://github.com/user-attachments/assets/cb672410-8dca-4221-a3db-d19dd18d0f80" />

## Cara Menjalankan
1. Clone Repository
git clone <repository-url>

2. Install Dependencies
```bash
npm install
```

3. Jalankan Expo
- npx expo start
- Lalu scan QR code menggunakan Expo Go.

## Important Notes

### Expo Notifications
Pada Expo SDK 53+:
Remote push notification tidak full support di Expo Go
Local notification masih dapat digunakan

### Media Library Limitation
Pada Android terbaru:
Full media library access membutuhkan development build
Namun fitur save image tetap dapat berjalan di Expo Go dengan beberapa keterbatasan

### Deep Linking Testing
Testing deep linking dapat dilakukan menggunakan:
npx uri-scheme open exp://127.0.0.1:8081/--/profile --android

### Cara Build APK (Optional)
Untuk full native feature support disarankan menggunakan development build:
npx expo run:android
atau menggunakan EAS Build:
eas build -p android
