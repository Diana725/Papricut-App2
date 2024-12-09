import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'papricut.app.mobile',
  appName: 'Papricut',
  webDir: 'www',
  bundledWebRuntime: false,
  ios: {
    icon: 'resources/ios/icon/ios_icon.png',  // Update if necessary
  },
  server: {
    androidScheme: 'https'
  },
  plugins: {
	SplashScreen: {
    backgroundColor: "#d3378d",
    splashFullScreen: true,
    splashImmersive: true,
		launchAutoHide: false,
		androidSplashResourceName: 'custom_splash',
	},
},
};

export default config;
