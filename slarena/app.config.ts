import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "slarena",
  slug: "slarena",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    apiUrl: process.env.API_URL,
    socketUrl: process.env.SOCKET_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow $(name) to use your location."
      }
    ]
  ]
}); 