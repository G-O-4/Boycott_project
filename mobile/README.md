# Boycott Companion Mobile App

Flutter mobile application for the Boycott Companion platform.

## Tech Stack

- **Framework:** Flutter 3.x
- **State Management:** Riverpod
- **Navigation:** GoRouter
- **Networking:** Dio
- **Local Storage:** SharedPreferences + FlutterSecureStorage
- **Barcode Scanning:** mobile_scanner

## Features

- 📷 **Native Barcode Scanner** - Fast scanning with camera
- 🌐 **Bilingual** - Arabic and English support
- 📱 **Native Performance** - Smooth animations and interactions
- 🔒 **Secure Storage** - JWT tokens stored securely
- 🌙 **Dark Mode Ready** - Theme support (coming soon)

## Getting Started

### Prerequisites

- Flutter SDK 3.0+
- Dart SDK 3.0+
- Android Studio / Xcode
- Backend API running

### Installation

1. Install dependencies:
```bash
flutter pub get
```

2. Generate code (if needed):
```bash
flutter pub run build_runner build
```

3. Run on device/emulator:
```bash
flutter run
```

### Build for Release

**Android:**
```bash
flutter build apk --release
```

**iOS:**
```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── core/
│   ├── theme/          # App theme and colors
│   ├── router/         # GoRouter configuration
│   ├── l10n/           # Localization
│   ├── network/        # API client
│   ├── providers/      # Global providers
│   └── widgets/        # Shared widgets
├── features/
│   ├── home/           # Home screen
│   ├── scan/           # Barcode scanning
│   ├── product/        # Product details
│   ├── company/        # Company & ownership
│   ├── discover/       # Browse & categories
│   ├── community/      # Submissions & leaderboard
│   ├── profile/        # User profile & settings
│   ├── search/         # Search functionality
│   ├── auth/           # Login & registration
│   └── common/         # Shared feature components
└── main.dart           # Entry point
```

## Configuration

### API URL

Update the base URL in `lib/core/network/api_client.dart`:

```dart
static const String baseUrl = 'http://your-api-url/api';
```

### Fonts

The app uses Noto Kufi Arabic for Arabic text. Add font files to `assets/fonts/`.

## Permissions

### Android (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS (`ios/Runner/Info.plist`)
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required to scan product barcodes</string>
```

## License

ISC

