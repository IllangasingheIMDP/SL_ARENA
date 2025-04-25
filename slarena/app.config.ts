import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || 'slarena',
  slug: config.slug || 'slarena',
  version: config.version || '1.0.0',
  extra: {
    apiUrl: process.env.API_URL,
    socketUrl: process.env.SOCKET_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
}); 