import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';
import { fetchCleanerConfig } from './global';

const RING_SIZE = 260;
const STROKE_WIDTH = 28;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;

const MINI_SIZE = 70;
const MINI_STROKE = 10;
const MINI_RADIUS = (MINI_SIZE - MINI_STROKE) / 2;
const MAIN_PERCENT_DEFAULT = 80; // fallback if backend unreachable

const STATS_DEFAULT = [
  { label: 'Memory', value: 87, colors: ['#A855FF', '#22D3EE'] },
  { label: 'Ram', value: 50, colors: ['#A855FF', '#38BDF8'] },
  { label: 'Battery', value: 37, colors: ['#4F46E5', '#22D3EE'] },
  { label: 'Apps', value: 70, colors: ['#A855FF', '#22D3EE'] },
];

const ITEMS_DEFAULT = [
  {
    label: 'Big files',
    size: '2.05 GB',
    iconKey: 'group89',
  },
  {
    label: 'Audio & video',
    size: '3.87 GB',
    iconKey: 'group90',
  },
  {
    label: 'Apps uninstallation',
    size: '4.37 GB',
    iconKey: 'group91',
  },
  {
    label: 'Junk & caches',
    size: '8.65 GB',
    iconKey: 'group92',
  },
];

const ICONS = {
  group89: require('../assets/images/Group 89.png'),
  group90: require('../assets/images/Group 90.png'),
  group91: require('../assets/images/Group 91.png'),
  group92: require('../assets/images/Group 92.png'),
};

export default function Cleaner() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [mainTarget, setMainTarget] = useState(MAIN_PERCENT_DEFAULT);
  const [mainPercent, setMainPercent] = useState(0);
  const [stats, setStats] = useState(STATS_DEFAULT);
  const [items, setItems] = useState(ITEMS_DEFAULT);
  const [statPercents, setStatPercents] = useState(() =>
    Object.fromEntries(STATS_DEFAULT.map(s => [s.label, 0]))
  );
  const [activeItemLabel, setActiveItemLabel] = useState(null); // No item highlighted by default

  useEffect(() => {
    // Load configuration from backend (real data controlled in backend)
    const loadConfig = async () => {
      try {
        const cfg = await fetchCleanerConfig();
        if (cfg?.summary) {
          setMainTarget(cfg.summary.mainPercentTarget ?? MAIN_PERCENT_DEFAULT);
        }
        if (Array.isArray(cfg?.stats) && cfg.stats.length) {
          setStats(cfg.stats);
          setStatPercents(
            Object.fromEntries(cfg.stats.map(s => [s.label, 0]))
          );
        }
        if (Array.isArray(cfg?.items) && cfg.items.length) {
          setItems(cfg.items);
        }
      } catch (e) {
        // If backend fails, stay on defaults
        console.log('Failed to load cleaner config from backend', e);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    const duration = 900;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const t = Math.min(1, (now - start) / duration);
      // ease-in-out
      const eased = t * t * (3 - 2 * t);

      setMainPercent(mainTarget * eased);
      setStatPercents(
        Object.fromEntries(stats.map(s => [s.label, s.value * eased]))
      );

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [mainTarget, stats]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backHit}>
          <Text style={[styles.backText, { color: colors.text }]}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cleaner</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main ring */}
      <View style={styles.topSection}>
        {/* Floating dots around the main ring */}
        <View pointerEvents="none" style={styles.dotsLayer}>
          <View style={[styles.dot, { top: 10, left: 40, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 24, right: 38, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 120, left: 18, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 140, right: 24, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 80, left: 140, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        </View>

        <View style={styles.mainRingWrapper}>
          <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
            <Defs>
              <LinearGradient id="cleanerMain" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00E0FF" />
                <Stop offset="50%" stopColor="#00C3FF" />
                <Stop offset="100%" stopColor="#7B2BFF" />
              </LinearGradient>
            </Defs>

            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={colors.ringTrack}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="url(#cleanerMain)"
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={2 * Math.PI * RADIUS}
              strokeDashoffset={
                2 * Math.PI * RADIUS * (1 - mainPercent / 100)
              }
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />

            {/* Accent dots around main ring */}
            <Circle
              cx={RING_SIZE / 2 - RADIUS + 26}
              cy={RING_SIZE / 2 - 14}
              r={5}
              fill="#00E0FF"
              opacity={0.95}
            />
            <Circle
              cx={RING_SIZE / 2 + RADIUS - 30}
              cy={RING_SIZE / 2 - 32}
              r={4}
              fill="#38BDF8"
              opacity={0.9}
            />
            <Circle
              cx={RING_SIZE / 2 + 10}
              cy={RING_SIZE / 2 + RADIUS - 22}
              r={4}
              fill="#7B2BFF"
              opacity={0.9}
            />
          </Svg>

          <View style={styles.centerInfo}>
            <Text style={[styles.centerNumber, { color: colors.text }]}>12.7</Text>
            <Text style={[styles.centerUnit, { color: colors.accent }]}>GB</Text>
            <Text style={[styles.centerSub, { color: colors.textSecondary }]}>can be cleaned out</Text>
          </View>
        </View>

        {/* Legend */}
          <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>Used</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accentSecondary }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>Deletable</Text>
          </View>
        </View>
      </View>

      {/* Bottom device card */}
      <View style={styles.bottomCardFrame}>
        <View style={[styles.bottomCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.deviceTop}>
            <View style={[styles.deviceHandle, { backgroundColor: colors.textMuted }]} />
          </View>

          {/* Mini rings */}
          <View style={styles.miniRow}>
          {stats.map(stat => (
              <View key={stat.label} style={styles.miniItem}>
                <Svg
                  width={MINI_SIZE}
                  height={MINI_SIZE}
                  viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}
                >
                  <Defs>
                    <LinearGradient id={`mini-${stat.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor={stat.colors[0]} />
                      <Stop offset="100%" stopColor={stat.colors[1]} />
                    </LinearGradient>
                  </Defs>
                  <Circle
                    cx={MINI_SIZE / 2}
                    cy={MINI_SIZE / 2}
                    r={MINI_RADIUS}
                    stroke={colors.ringTrack}
                    strokeWidth={MINI_STROKE}
                    fill="none"
                  />
                  <Circle
                    cx={MINI_SIZE / 2}
                    cy={MINI_SIZE / 2}
                    r={MINI_RADIUS}
                    stroke={`url(#mini-${stat.label})`}
                    strokeWidth={MINI_STROKE}
                    strokeDasharray={2 * Math.PI * MINI_RADIUS}
                    strokeDashoffset={
                      2 * Math.PI * MINI_RADIUS *
                      (1 - (statPercents[stat.label] || 0) / 100)
                    }
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${MINI_SIZE / 2} ${MINI_SIZE / 2})`}
                  />
                </Svg>
                <View style={styles.miniCenter}>
                  <Text style={[styles.miniValue, { color: colors.text }]}>{stat.value}%</Text>
                </View>
                <Text style={[styles.miniLabel, { color: colors.text }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* List items */}
          <View style={styles.list}>
            {items.map(item => {
              const isActive = activeItemLabel === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.9}
                  onPress={() => setActiveItemLabel(item.label)}
                  style={[
                    styles.listRow,
                    { backgroundColor: colors.card },
                    isActive && { backgroundColor: colors.cardHighlight, borderColor: colors.border },
                    isActive && styles.listRowActive,
                  ]}
                >
                  <View style={styles.listLeft}>
                    <View style={styles.listIconCircle}>
                      <Image
                        source={item.icon || ICONS[item.iconKey] || ICONS.group89}
                        style={styles.listIconImage}
                        tintColor={colors.accent}
                      />
                    </View>
                    <Text style={[styles.listLabel, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <Text style={[styles.listSize, { color: colors.textSecondary }]}>{item.size}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
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
  backText: {
    fontSize: 22,
  },
  headerTitle: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginTop: -4,
  },
  dotsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  mainRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  centerUnit: {
    fontSize: 14,
    marginTop: 2,
  },
  centerSub: {
    fontSize: 12,
    marginTop: 6,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },

  bottomCardFrame: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  bottomCard: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 4,
    paddingTop: 18,
    paddingHorizontal: 18,
  },
  deviceTop: {
    alignItems: 'center',
    marginBottom: 14,
  },
  deviceHandle: {
    width: 90,
    height: 4,
    borderRadius: 99,
  },

  miniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  miniItem: {
    alignItems: 'center',
  },
  miniCenter: {
    position: 'absolute',
    top: (MINI_SIZE - 20) / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  miniValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  miniLabel: {
    marginTop: 6,
    fontSize: 11,
  },

  list: {
    marginTop: 8,
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  listRowActive: {
    borderWidth: 1,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#41C6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  listLabel: {
    fontSize: 13,
  },
  listSize: {
    fontSize: 12,
  },
});
