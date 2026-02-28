import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techshack.tcems',
  appName: 'TCEMS',
  webDir: 'dist',
  backgroundColor: '#0D0D0D',
  server: {
    androidScheme: 'https'
  }
};

export default config;
