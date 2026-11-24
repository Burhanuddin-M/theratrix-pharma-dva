import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theratrix.pharma',
  appName: 'Theratrix Pharmaceuticals',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#15171a',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#15171a',
      // Keep system status bar owned by the OS — do not draw under it.
      overlaysWebView: false,
    },
  },
};

export default config;
