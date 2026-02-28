# TCEMS Deployment Checklist

## Quick Start

1. Generate keystore
2. Build release APK/Bundle
3. Test on device
4. Upload to Play Store
5. Monitor & launch

## Commands

```
# Step 1: Keystore
keytool -genkey -v -keystore tcems-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias tcems-key-alias

# Step 2: Build
./gradlew bundleRelease

# Step 3: Upload to Play Console
# Go to: https://play.google.com/console
# Upload: app/build/outputs/bundle/release/app-release.aab

# Step 4: Launch
# Review & publish in Play Console
```

## Timeline
- Day 1: Build & test
- Day 2: Setup Play Console
- Day 3: Upload
- Day 4: Appears in store (24 hours)

**Read DEPLOYMENT_GUIDE.md for full details!**

