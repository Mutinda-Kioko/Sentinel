import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from './contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import {
  getDeviceInfo,
  getLanguageName,
  subscribeNetworkStatus,
  getBatteryLevelPercent,
  getBrightnessPercent,
  getNotificationStatusFallback,
  fetchSettingsConfig,
  updateSettingsConfig,
} from './global';
// Notifications may not work in Expo Go, so we'll handle it conditionally
// We'll check for it dynamically instead of importing it

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // Real device settings state (values now come from global helpers, not demo)
  const [language, setLanguage] = useState('English');
  const [wifiStatus, setWifiStatus] = useState('Not connected');
  const [bluetoothStatus, setBluetoothStatus] = useState('Not connected');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [brightness, setBrightness] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deviceName, setDeviceName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [showMoreSettings, setShowMoreSettings] = useState(false); // For expandable dropdown

  useEffect(() => {
    let unsubscribeNetInfo = null;
    let batteryInterval = null;

    // Device info (real device values from global helpers)
    const info = getDeviceInfo();
    setDeviceName(info.name || '');
    setDeviceModel(info.model || '');

    // Language
    setLanguage(getLanguageName());

    // Network status
    unsubscribeNetInfo = subscribeNetworkStatus(state => {
      if (state.isWifi) {
        setWifiStatus(state.isConnected ? 'Connected' : 'Not connected');
      } else if (state.type === 'cellular') {
        setWifiStatus('Using mobile data');
      } else {
        setWifiStatus('Not connected');
      }
      // NOTE: Bluetooth is still a placeholder – requires a separate native module
      setBluetoothStatus('Not connected');
    });

    // Battery level (poll every 30s)
    const updateBattery = async () => {
      const level = await getBatteryLevelPercent();
      if (level !== null) setBatteryLevel(level);
    };
    updateBattery();
    batteryInterval = setInterval(updateBattery, 30000);

    // Brightness
    const updateBrightness = async () => {
      const level = await getBrightnessPercent();
      if (level !== null) setBrightness(level);
    };
    updateBrightness();

    // Notifications (fallback helper for now – real permissions can be added later)
    getNotificationStatusFallback().then(setNotificationsEnabled).catch(() => {
      setNotificationsEnabled(true);
    });

    // Load settings from backend (email, language override, notifications)
    const loadSettings = async () => {
      try {
        const s = await fetchSettingsConfig();
        if (typeof s.email === 'string') {
          setEmail(s.email);
        }
        if (typeof s.language === 'string') {
          setLanguage(s.language);
        }
        if (typeof s.notificationsEnabled === 'boolean') {
          setNotificationsEnabled(s.notificationsEnabled);
        }
      } catch (e) {
        console.log('Failed to load settings from backend', e);
      }
    };
    loadSettings();

    return () => {
      try {
        if (unsubscribeNetInfo && typeof unsubscribeNetInfo === 'function') {
          unsubscribeNetInfo();
        }
        if (batteryInterval) {
          clearInterval(batteryInterval);
        }
      } catch (_error) {
        // Cleanup error - ignore
      }
    };
  }, []);

  const pickImage = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload an image!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const openSystemSettings = async (settingType) => {
    try {
      if (Platform.OS === 'android') {
        // Android specific settings intent actions
        const androidSettings = {
          language: 'android.settings.LOCALE_SETTINGS',
          wifi: 'android.settings.WIFI_SETTINGS',
          bluetooth: 'android.settings.BLUETOOTH_SETTINGS',
          notifications: 'android.settings.APP_NOTIFICATION_SETTINGS',
          sound: 'android.settings.SOUND_SETTINGS',
          display: 'android.settings.DISPLAY_SETTINGS',
          battery: 'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
          privacy: 'android.settings.PRIVACY_SETTINGS',
          accessibility: 'android.settings.ACCESSIBILITY_SETTINGS',
          general: 'android.settings.SETTINGS',
        };
        
        const setting = androidSettings[settingType] || 'android.settings.SETTINGS';
        // Use intent URL format for Android
        const url = `intent:#Intent;action=${setting};end`;
        
        try {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            return;
          }
        } catch (_urlError) {
          // Continue to fallback
        }
      } else if (Platform.OS === 'ios') {
        // For iOS, we can try to open specific settings, but most require app-settings:
        // For system settings, we'll open the app settings page
        try {
          await Linking.openSettings();
          return;
        } catch (_iosError) {
          // Continue to fallback
        }
      }
      
      // Fallback: open app settings
      await Linking.openSettings();
    } catch (error) {
      console.log('Error opening settings:', error);
      // Final fallback: try to open app settings
      try {
        await Linking.openSettings();
      } catch (_fallbackError) {
        Alert.alert('Error', 'Unable to open settings. Please open settings manually.');
      }
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    headerTitle: { color: colors.text },
    cardProfile: { backgroundColor: colors.cardHighlight },
    profileName: { color: colors.text },
    profileSub: { color: colors.textSecondary },
    card: { backgroundColor: colors.card },
    cardHighlight: { backgroundColor: colors.card },
    darkModeCard: { backgroundColor: colors.card },
    darkModeLabel: { color: colors.text },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backHit}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={[styles.cardProfile, dynamicStyles.cardProfile]}>
          <TouchableOpacity activeOpacity={0.7} style={styles.profileTopRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickImage}
              style={[
                styles.profileAvatar,
                { borderColor: isDarkMode ? colors.border : '#E5E7EB', backgroundColor: isDarkMode ? colors.card : '#F3F4F6' }
              ]}
            >
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  style={styles.profileAvatarImage}
                />
              ) : (
                <Image
                  source={require('../assets/images/account.png')}
                  style={styles.profileAvatarImage}
                  tintColor={isDarkMode ? colors.text : undefined}
                />
              )}
              <View style={styles.editImageOverlay}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.profileTextBlock}>
              <Text style={[styles.profileName, dynamicStyles.profileName]}>
                {deviceName || 'Leila Souad'}
              </Text>
              <Text style={[styles.profileSub, dynamicStyles.profileSub]}>
                {deviceModel || 'id, media and shopping'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Email field */}
          <View style={[styles.emailRow, { borderTopColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.emailIcon} />
            {isEditingEmail ? (
              <TextInput
                style={[styles.emailInput, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor={colors.textMuted}
                autoFocus
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
            )}
            <TouchableOpacity
              onPress={async () => {
                if (isEditingEmail) {
                  // Saving email: update backend
                  try {
                    await updateSettingsConfig({ email });
                  } catch (e) {
                    console.log('Failed to update email in backend', e);
                  }
                }
                setIsEditingEmail(!isEditingEmail);
              }}
              style={styles.editButton}
            >
              <Ionicons
                name={isEditingEmail ? "checkmark" : "create-outline"}
                size={20}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Connectivity card */}
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingsRow icon="globe-outline" label="Language" value={language} onPress={() => openSystemSettings('language')} colors={colors} />
          <SettingsRow
            icon="wifi-outline"
            label="Wi‑Fi"
            value={wifiStatus}
            border
            onPress={() => openSystemSettings('wifi')}
            colors={colors}
          />
          <SettingsRow
            icon="bluetooth-outline"
            label="Bluetooth"
            value={bluetoothStatus}
            border
            onPress={() => openSystemSettings('bluetooth')}
            colors={colors}
          />
          <SettingsRow 
            icon="ellipsis-horizontal-circle-outline" 
            label="More" 
            onPress={() => setShowMoreSettings(!showMoreSettings)} 
            colors={colors}
            showChevron={true}
            chevronRotated={showMoreSettings}
          />
        </View>

        {/* Expandable More Settings */}
        {showMoreSettings && (
          <View style={[styles.card, dynamicStyles.card, styles.expandedMoreSettings]}>
            <SettingsRow
              icon="location-outline"
              label="Location"
              onPress={() => openSystemSettings('location')}
              colors={colors}
            />
            <SettingsRow
              icon="lock-closed-outline"
              label="Security & Lock Screen"
              border
              onPress={() => openSystemSettings('security')}
              colors={colors}
            />
            <SettingsRow
              icon="cloud-outline"
              label="Accounts & Sync"
              border
              onPress={() => openSystemSettings('accounts')}
              colors={colors}
            />
            <SettingsRow
              icon="apps-outline"
              label="Apps & Notifications"
              border
              onPress={() => openSystemSettings('apps')}
              colors={colors}
            />
            <SettingsRow
              icon="time-outline"
              label="Date & Time"
              border
              onPress={() => openSystemSettings('datetime')}
              colors={colors}
            />
            <SettingsRow
              icon="keyboard-outline"
              label="Keyboard & Input"
              border
              onPress={() => openSystemSettings('keyboard')}
              colors={colors}
            />
            <SettingsRow
              icon="language-outline"
              label="Backup & Reset"
              border
              onPress={() => openSystemSettings('backup')}
              colors={colors}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="About Phone"
              border
              onPress={() => openSystemSettings('about')}
              colors={colors}
            />
            <SettingsRow
              icon="help-circle-outline"
              label="Help & Support"
              border
              onPress={() => openSystemSettings('help')}
              colors={colors}
            />
            <SettingsRow
              icon="document-text-outline"
              label="Legal Information"
              border
              onPress={() => openSystemSettings('legal')}
              colors={colors}
            />
          </View>
        )}

        {/* Highlighted notifications block */}
        <View style={[styles.cardHighlight, dynamicStyles.cardHighlight]}>
          <SettingsRow 
            icon="notifications-outline" 
            label="Notifications" 
            value={notificationsEnabled ? 'Enabled' : 'Disabled'}
            onPress={() => openSystemSettings('notifications')} 
            colors={colors} 
          />
          <SettingsRow
            icon="volume-high-outline"
            label="Sound and Vibration"
            border
            onPress={() => openSystemSettings('sound')}
            colors={colors}
          />
          <SettingsRow 
            icon="color-palette-outline" 
            label="Display" 
            value={brightness !== null ? `${brightness}%` : undefined}
            onPress={() => openSystemSettings('display')} 
            colors={colors} 
          />
        </View>

        {/* General list */}
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingsRow icon="settings-outline" label="General" onPress={() => openSystemSettings('general')} colors={colors} />
          <SettingsRow
            icon="battery-charging-outline"
            label="Battery and Device care"
            value={batteryLevel !== null ? `${batteryLevel}%` : undefined}
            border
            onPress={() => openSystemSettings('battery')}
            colors={colors}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy and Security"
            border
            onPress={() => openSystemSettings('privacy')}
            colors={colors}
          />
          <SettingsRow icon="accessibility-outline" label="Accessibility" onPress={() => openSystemSettings('accessibility')} colors={colors} />
        </View>

        {/* Dark mode row */}
        <View style={[styles.darkModeCard, dynamicStyles.darkModeCard]}>
          <Text style={[styles.darkModeLabel, dynamicStyles.darkModeLabel]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={colors.switchThumb}
            trackColor={{ false: colors.switchTrack, true: colors.switchActive }}
          />
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backHit: {
    paddingVertical: 6,
    paddingRight: 6,
  },
  headerTitle: {
    marginLeft: 6,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  cardProfile: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB', // Will be overridden by theme
    backgroundColor: '#F3F4F6', // Will be overridden by theme
    position: 'relative',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00E0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileTextBlock: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  profileSub: {
    fontSize: 13,
    opacity: 0.7,
  },

  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  emailIcon: {
    marginRight: 14,
    opacity: 0.8,
  },
  emailText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  emailInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  editButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },

  card: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  cardHighlight: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  darkModeCard: {
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkModeLabel: {
    fontSize: 14,
  },
  expandedMoreSettings: {
    marginTop: -12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

function SettingsRow({ icon, label, value, border, onPress, colors, showChevron = true, chevronRotated = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        rowStyles.row,
        border && { borderBottomColor: colors.border },
        border && rowStyles.rowBorder,
      ]}
    >
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={18} color={colors.text} style={rowStyles.icon} />
        <Text style={[rowStyles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={rowStyles.right}>
        {value ? <Text style={[rowStyles.value, { color: colors.textSecondary }]}>{value}</Text> : null}
        {showChevron && (
          <Ionicons 
            name={chevronRotated ? "chevron-down" : "chevron-forward"} 
            size={16} 
            color={colors.textMuted}
            style={chevronRotated && rowStyles.chevronRotated}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    marginRight: 6,
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
});


