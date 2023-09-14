import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studyplan.julesgrc0',
  appName: 'studyplan',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_launcher_round",
      iconColor: "#000000",
    },
  }
};

export default config;
