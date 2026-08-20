// config.js
import { Platform } from 'react-native';

// Replace with your computer's local Wi-Fi IPv4 address for physical testing devices
//const DEV_MACHINE_IP = 'hyperpure.petconnectnow.com';
 const DEV_MACHINE_IP = 'localhost'
const PORT = '5000';

export const API_BASE_URL = Platform.select({
  // Web browser targets your local machine directly
  //web: `http://localhost:${PORT}/api/stocks`,
  web: `http://${DEV_MACHINE_IP}:${PORT}/api/stocks`,
  
  // Android Emulator uses a dedicated internal gateway IP to access the host loopback
  android: `http://10.0.2.2:${PORT}/api/stocks`,
  
  // iOS Simulator can use localhost, but physical devices require the Wi-Fi IP address
  ios: `http://${DEV_MACHINE_IP}:${PORT}/api/stocks`,
  
  // Fallback default
  default: `http://${DEV_MACHINE_IP}:${PORT}/api/stocks`,
});
