import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pharma.dva',
  appName: 'Pharma DVA',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#3D2463',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#3D2463',
    },
  },
};

export default config;
