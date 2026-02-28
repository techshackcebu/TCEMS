# TCEMS Native Android App - Setup Instructions

## Quick Start

### What Was Done
Your Capacitor hybrid app has been successfully converted to a **fully native Android application**. Here's what changed:

## Key Changes Summary

### 1. ✅ Removed Capacitor Framework
- Deleted WebView from MainActivity
- Removed all Capacitor dependencies
- Removed Cordova plugin references

### 2. ✅ Added Native Architecture
- **MainActivity**: Now extends `AppCompatActivity` (native)
- **Fragments**: HomeFragment, CameraFragment, SettingsFragment
- **Navigation**: Jetpack Navigation with bottom nav menu
- **Material Design**: Modern Material 3 components

### 3. ✅ Replaced Capacitor Plugins
| Plugin | Replacement | File |
|--------|-------------|------|
| @capacitor/camera | CameraX | `ui/camera/CameraFragment.java` |
| @capacitor/filesystem | FileProvider | `data/FileManager.java` |
| @capacitor/preferences | DataStore | `data/PreferencesManager.java` |

### 4. ✅ Updated Dependencies
```
androidx.activity:activity:1.11.0
androidx.fragment:fragment:1.8.9
androidx.lifecycle:lifecycle-viewmodel:2.8.4
androidx.navigation:navigation-*:2.8.5
androidx.datastore:datastore-preferences:1.1.2
androidx.camera:camera-*:1.4.1
com.google.android.material:material:1.12.0
```

## Project Structure

```
android/
├── app/src/main/
│   ├── java/com/techshack/tcems/
│   │   ├── MainActivity.java
│   │   ├── data/
│   │   │   ├── FileManager.java (File I/O)
│   │   │   └── PreferencesManager.java (App Settings)
│   │   └── ui/
│   │       ├── home/HomeFragment.java
│   │       ├── camera/CameraFragment.java
│   │       └── settings/SettingsFragment.java
│   ├── res/
│   │   ├── layout/
│   │   │   ├── activity_main.xml
│   │   │   ├── fragment_home.xml
│   │   │   ├── fragment_camera.xml
│   │   │   └── fragment_settings.xml
│   │   ├── navigation/nav_graph.xml
│   │   ├── menu/bottom_nav_menu.xml
│   │   ├── drawable/ (ic_home.xml, ic_camera.xml, ic_settings.xml)
│   │   └── values/ (strings.xml, styles.xml)
│   └── AndroidManifest.xml (Updated with proper permissions)
├── build.gradle
├── settings.gradle
├── variables.gradle
└── NATIVE_MIGRATION_GUIDE.md
```

## To Build and Run

### Option 1: Using Android Studio (Recommended)
1. Open Android Studio
2. Open Project → Select the `android` folder
3. Wait for Gradle sync to complete
4. Click **Run** (green play button)
5. Select your device/emulator

### Option 2: Command Line
```powershell
cd C:\Users\TechShack\Desktop\TCEMS\android
./gradlew build          # Build APK
./gradlew installDebug   # Install to device
```

## Features

### 🏠 Home Screen
- Dashboard with quick stats
- Card-based layout
- Ready for customization

### 📸 Camera Screen
- Full CameraX integration
- Live camera preview
- Photo capture with auto-save
- Runtime permission handling

### ⚙️ Settings Screen
- Notification toggle
- Theme selection
- App preferences
- Data management

## Usage Examples

### Using FileManager (Filesystem Plugin Replacement)
```java
FileManager fileManager = FileManager.getInstance(context);

// Write file
byte[] data = "Hello World".getBytes();
File file = fileManager.writeFile("document.txt", data);

// Read file
byte[] content = fileManager.readFile("document.txt");

// List all files
List<String> files = fileManager.listFiles();

// Get shareable URI
Uri shareUri = fileManager.getFileUri("document.txt");

// Delete file
fileManager.deleteFile("document.txt");
```

### Using PreferencesManager (Preferences Plugin Replacement)
```java
PreferencesManager prefs = PreferencesManager.getInstance(context);

// Save preference
prefs.saveBoolean("notifications_enabled", true);
prefs.saveString("app_theme", "dark");

// Read preference
boolean notificationsEnabled = prefs.getBoolean("notifications_enabled", false);
String theme = prefs.getString("app_theme", "light");

// Clear all
prefs.clear();
```

## Permissions

Required permissions (already added to AndroidManifest.xml):
- `INTERNET` - Network communication
- `CAMERA` - Camera access
- `READ_EXTERNAL_STORAGE` - Read files
- `WRITE_EXTERNAL_STORAGE` - Write files
- `ACCESS_FINE_LOCATION` - GPS
- `ACCESS_COARSE_LOCATION` - Network location

Runtime permissions are handled automatically in fragments.

## Troubleshooting

### Gradle Build Errors
```powershell
# Clear cache and rebuild
rm -r .gradle
./gradlew clean build
```

### App Won't Install
```powershell
# Uninstall previous version
adb uninstall com.techshack.tcems

# Rebuild and install
./gradlew installDebug
```

### Missing Resources
- Ensure all drawable files exist in `res/drawable/`
- Check strings.xml has all required string entries
- Verify layout XML syntax

## Next Steps

### To Add More Features:

1. **Create new Fragment**
   ```java
   public class NewFragment extends Fragment {
       @Override
       public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
           return inflater.inflate(R.layout.fragment_new, container, false);
       }
   }
   ```

2. **Add to navigation graph** (`nav_graph.xml`)
   ```xml
   <fragment android:id="@+id/new_fragment" android:name="com.techshack.tcems.ui.new.NewFragment" />
   ```

3. **Add to bottom nav menu** (`bottom_nav_menu.xml`)
   ```xml
   <item android:id="@+id/new_fragment" android:title="@string/new_screen" />
   ```

### Add Database (Room):
```gradle
implementation "androidx.room:room-runtime:2.6.1"
annotationProcessor "androidx.room:room-compiler:2.6.1"
```

### Add Network (Retrofit):
```gradle
implementation "com.squareup.retrofit2:retrofit:2.10.0"
implementation "com.squareup.retrofit2:converter-gson:2.10.0"
```

## Important Files Modified

### Core Files
- ✏️ `MainActivity.java` - Now native (was BridgeActivity)
- ✏️ `activity_main.xml` - Replaced WebView with Navigation
- ✏️ `AndroidManifest.xml` - Added proper permissions
- ✏️ `build.gradle` - Updated dependencies
- ✏️ `settings.gradle` - Removed Capacitor modules

### New Files Created
- ✨ `HomeFragment.java`, `CameraFragment.java`, `SettingsFragment.java`
- ✨ `FileManager.java`, `PreferencesManager.java`
- ✨ Layout files (fragment_home.xml, etc.)
- ✨ Navigation graph and menu resources
- ✨ Icon drawables (ic_home.xml, etc.)

## Compilation Target Info
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 36 (Android 15)
- **Compile SDK**: 36
- **Java Compatibility**: 8+

## Support

For native Android development:
- Android Developer Docs: https://developer.android.com/docs
- Jetpack Compose: https://developer.android.com/jetpack/compose
- CameraX Tutorial: https://developer.android.com/training/camerax
- Navigation: https://developer.android.com/guide/navigation

---

**Status**: ✅ Ready for Development and Testing
**Version**: 1.0 Native
**Last Updated**: March 2026

