import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';
import { fetchLandingConfig } from './global';

const FEATURES = [
  { label: 'Cleaner', iconName: 'trash-outline', route: '/cleaner', isSvg: false },
  { label: 'Antivirus', iconName: 'shield-outline', route: '/antivirus-detail', isSvg: false },
  { label: 'Battery', iconName: 'battery-half-outline', route: '/battery', isSvg: false },
  { label: 'Data', iconName: 'server-outline', route: '/data', isSvg: false },
  { label: 'Security', iconName: 'rocket-outline', route: '/security', isSvg: false },
  { label: 'Files', iconName: 'document-text-outline', route: '/files', isSvg: false },
];

const RING_SIZE = 340;
const STROKE_WIDTH = 28;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Landing() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  // Start at 0 and animate up to a target value from backend
  const [progress, setProgress] = useState(0);
  const [targetPercent, setTargetPercent] = useState(85); // Default fallback
  const [selectedFeature, setSelectedFeature] = useState(null); // No button highlighted by default

  // Fetch optimization percentage from backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await fetchLandingConfig();
        if (typeof cfg?.optimizationPercent === 'number') {
          setTargetPercent(cfg.optimizationPercent);
        }
      } catch (e) {
        console.log('Failed to load landing config from backend', e);
        // Keep default 85% if backend fails
      }
    };
    loadConfig();
  }, []);

  // Animate progress based on target from backend
  useEffect(() => {
    const TARGET_PROGRESS = targetPercent / 100;
    const STEP = 0.01;
    const INTERVAL = 40;

    // Reset progress when target changes
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(p => {
        const next = p + STEP;
        if (next >= TARGET_PROGRESS) {
          clearInterval(timer);
          return TARGET_PROGRESS;
        }
        return next;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [targetPercent]);

  const percentage = Math.round(progress * 100);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top settings icon */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings" size={24} color={colors.accent} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      {/* Floating dots */}
      <View pointerEvents="none" style={styles.dotsLayer}>
        <View style={[styles.dot, { top: 70, left: 50, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        <View style={[styles.dot, { top: 120, right: 60, backgroundColor: colors.dotPurple, shadowColor: colors.dotPurple }]} />
        <View style={[styles.dot, { top: 220, left: 80, backgroundColor: colors.dotBlue, shadowColor: colors.dotBlue }]} />
        <View style={[styles.dot, { top: 260, right: 40, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />

        {/* Extra dots for a fuller, well‑spread glow */}
        <View style={[styles.dot, { top: 160, left: 150, backgroundColor: colors.dotBlue, shadowColor: colors.dotBlue }]} />
        <View style={[styles.dot, { top: 190, right: 140, backgroundColor: colors.dotPurple, shadowColor: colors.dotPurple }]} />
        <View style={[styles.dot, { top: 40, right: 110, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        <View style={[styles.dot, { top: 300, left: 40, backgroundColor: colors.dotBlue, shadowColor: colors.dotBlue }]} />
        <View style={[styles.dot, { top: 110, left: 220, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        <View style={[styles.dot, { top: 60, left: 140, backgroundColor: colors.dotPurple, shadowColor: colors.dotPurple }]} />
        <View style={[styles.dot, { top: 260, left: 200, backgroundColor: colors.dotBlue, shadowColor: colors.dotBlue }]} />
        <View style={[styles.dot, { top: 320, right: 90, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        <View style={[styles.dot, { top: 340, left: 120, backgroundColor: colors.dotPurple, shadowColor: colors.dotPurple }]} />

        {/* Dots below the ring */}
        <View style={[styles.dot, { top: 380, left: 60, backgroundColor: colors.dotBlue, shadowColor: colors.dotBlue }]} />
        <View style={[styles.dot, { top: 400, right: 70, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        <View style={[styles.dot, { top: 430, left: 180, backgroundColor: colors.dotPurple, shadowColor: colors.dotPurple }]} />
      </View>

      {/* Ring */}
      <View style={styles.ringContainer}>
        <View style={styles.ringGlow}>
          <View style={[styles.ringBase, { backgroundColor: isDarkMode ? '#02040A' : '#F9FAFB' }]}>
            <Svg
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            >
              <Defs>
                <LinearGradient
                  id="ringGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#00E0FF" />
                  <Stop offset="55%" stopColor="#2D7CFF" />
                  <Stop offset="100%" stopColor="#7B2BFF" />
                </LinearGradient>
              </Defs>

              {/* Background track */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={colors.ringBackground}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              {/* Progress arc */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke="url(#ringGradient)"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              />

              {/* Inner glow dots around optimize button */}
              <Circle
                cx={RING_SIZE / 2 - 40}
                cy={RING_SIZE / 2 - 10}
                r={6}
                fill="#2DF0FF"
                opacity={0.9}
              />
              <Circle
                cx={RING_SIZE / 2 + 38}
                cy={RING_SIZE / 2 - 18}
                r={5}
                fill="#8A4DFF"
                opacity={0.8}
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2 + 32}
                r={4}
                fill="#256BFF"
                opacity={0.85}
              />
            </Svg>

            {/* Percentage label above the button */}
            <Text style={[styles.percentageText, { color: colors.text }]}>{percentage}%</Text>

            {/* Optimize button */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.optimizeButton, { backgroundColor: colors.button, borderColor: colors.buttonBorder, shadowColor: colors.button }]}
              onPress={() => router.push('/antivirus')}
            >
              <Text style={styles.optimizeText}>OPTIMIZE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom panel with frame */}
      <View style={styles.bottomCardFrame}>
        <View style={[styles.bottomCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.deviceTop}>
            <View style={[styles.deviceHandle, { backgroundColor: colors.textMuted }]} />
          </View>

          <View style={styles.grid}>
            {FEATURES.map(item => {
              const active = item.label === selectedFeature;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedFeature(item.label);
                    if (item.route) router.push(item.route);
                  }}
                  style={[
                    styles.tile,
                    {
                      backgroundColor: item.label === 'Cleaner' && isDarkMode
                        ? '#020611'
                        : item.label === 'Cleaner' && !isDarkMode
                        ? '#E0F2FE'
                        : isDarkMode
                        ? '#020611'
                        : '#FFFFFF',
                      borderColor: isDarkMode ? '#1B2130' : '#E5E7EB',
                    },
                    active && {
                      backgroundColor: isDarkMode ? '#111827' : '#F3F4F6',
                      borderColor: isDarkMode ? '#1B2130' : '#D1D5DB',
                    },
                    active && styles.tileActive,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={item.iconName}
                      size={44}
                      color={isDarkMode
                        ? (active ? colors.accent : colors.textSecondary)
                        : '#7B2BFF' // Purple in light mode
                      }
                    />
                  </View>
                  <Text style={[
                    styles.tileText,
                    {
                      color: isDarkMode
                        ? (active ? colors.text : colors.textSecondary)
                        : '#7B2BFF' // Purple in light mode
                    },
                    active && styles.tileTextActive
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const TILE = 96;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  /* Floating dots */
  dotsLayer: { ...StyleSheet.absoluteFillObject },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOpacity: 1,
    shadowRadius: 14,
  },

  topBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },

  /* Ring */
  ringContainer: { marginTop: 60 },
  ringGlow: {
    shadowColor: '#00E0FF',
    shadowOpacity: 0.75,
    shadowRadius: 40,
  },
  ringBase: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: '#02040A', // Keep dark for ring base to maintain contrast
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentageText: {
    position: 'absolute',
    top: RING_SIZE / 2 - 80, // move it above the center (and above the button)
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
  },

  optimizeButton: {
    position: 'absolute',
    paddingHorizontal: 46,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  optimizeText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  /* Bottom card frame */
  bottomCardFrame: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 0,
  },

  /* Inner device card */
  bottomCard: {
    paddingTop: 14,
    paddingBottom: 52,
    paddingHorizontal: 24,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 4,
    shadowOpacity: 0.95,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -14 },
  },
  deviceTop: {
    alignItems: 'center',
    marginBottom: "30%",
  },
  deviceHandle: {
    width: 80,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#5B606F',
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginTop: -40, // lift icons without moving the outer frame
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  tileActive: {
    borderWidth: 1.5,
    shadowColor: '#00E0FF',
    shadowOpacity: 1,
  },

  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tileText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  tileTextActive: {
    // color handled inline
  },
});
