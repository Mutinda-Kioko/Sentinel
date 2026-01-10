import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';
import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';

// Backend base URL - automatically detects platform
// Android emulator uses 10.0.2.2 to access host machine's localhost
// iOS simulator can use localhost
// For physical devices, replace with your computer's local IP (e.g., 'http://192.168.1.100:4000/api')
const getApiBaseUrl = () => {
  // You can override this with an environment variable if needed
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator special IP that maps to host's localhost
      return 'http://10.0.2.2:4000/api';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://localhost:4000/api';
    }
  }
  // Production or fallback - replace with your actual backend URL
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// -------- Generic HTTP helpers (for your own backend APIs) --------

export async function apiGet(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GET ${url} failed with status ${res.status}`);
  }
  return res.json();
}

export async function apiPost(path, body = {}, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`POST ${url} failed with status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API POST error for ${url}:`, error.message);
    throw error;
  }
}

export async function apiPut(path, body = {}, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`PUT ${url} failed with status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API PUT error for ${url}:`, error.message);
    throw error;
  }
}

// -------- Device / system info helpers (real phone data) --------

export function getDeviceInfo() {
  // These values come from the real device (no demo values)
  return {
    name: Device.deviceName || '',
    model: Device.modelName || '',
    osVersion: Device.osVersion || '',
    brand: Device.brand || '',
  };
}

export function getLanguageName() {
  try {
    const locales = Localization.getLocales();
    if (!locales || locales.length === 0) return 'English';

    const locale = locales[0];
    const languageCode = locale.languageCode || 'en';
    const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
    const langName = languageNames.of(languageCode);
    return langName ? langName.charAt(0).toUpperCase() + langName.slice(1) : 'English';
  } catch (_e) {
    return 'English';
  }
}

export function subscribeNetworkStatus(callback) {
  // callback gets { type, isConnected, isWifi }
  const unsubscribe = NetInfo.addEventListener(state => {
    const info = {
      type: state?.type,
      isConnected: !!state?.isConnected,
      isWifi: state?.type === 'wifi',
    };
    callback(info);
  });
  return unsubscribe;
}

export async function getBatteryLevelPercent() {
  try {
    const level = await Battery.getBatteryLevelAsync();
    if (typeof level === 'number') {
      return Math.round(level * 100);
    }
  } catch (_e) {
    // ignore
  }
  return null;
}

export async function getBrightnessPercent() {
  try {
    const level = await Brightness.getBrightnessAsync();
    if (typeof level === 'number') {
      return Math.round(level * 100);
    }
  } catch (_e) {
    // ignore
  }
  return null;
}

// NOTE: expo-notifications is limited in Expo Go; for real devices / dev builds,
// you can move full notification permission logic here later.
export async function getNotificationStatusFallback() {
  // For now, return true so UI shows "Enabled"
  return true;
}

// -------- High-level feature APIs (Cleaner, Files, Data, Security, Antivirus, Settings) --------

export function fetchCleanerConfig() {
  return apiGet('/cleaner');
}

export function fetchFilesConfig() {
  return apiGet('/files');
}

export function fetchDataConfig() {
  return apiGet('/data');
}

export function fetchSecurityConfig() {
  return apiGet('/security');
}

export function fetchAntivirusConfig() {
  return apiGet('/antivirus');
}

export function fetchSettingsConfig() {
  return apiGet('/settings');
}

export function updateSettingsConfig(partial) {
  return apiPut('/settings', partial);
}


