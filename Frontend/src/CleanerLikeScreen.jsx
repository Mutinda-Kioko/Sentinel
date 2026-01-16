import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';

import Group89Icon from '../assets/images/Group 89.svg';
import Group90Icon from '../assets/images/Group 90.svg';
import Group91Icon from '../assets/images/Group 91.svg';
import Group92Icon from '../assets/images/Group 92.svg';
import Group99Icon from '../assets/images/Group 99.svg';
import Group100Icon from '../assets/images/Group 100.svg';
import Group101Icon from '../assets/images/Group 101.svg';

const ICONS = {
  group89: Group89Icon,
  group90: Group90Icon,
  group91: Group91Icon,
  group92: Group92Icon,
  group99: Group99Icon,
  group100: Group100Icon,
  group101: Group101Icon,
};

const RING_SIZE = 260;
const STROKE_WIDTH = 28;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;

const MINI_SIZE = 70;
const MINI_STROKE = 10;
const MINI_RADIUS = (MINI_SIZE - MINI_STROKE) / 2;

const DEFAULT_STATS = [
  { label: 'Memory', value: 87, colors: ['#A855FF', '#22D3EE'] },
  { label: 'Ram', value: 50, colors: ['#A855FF', '#38BDF8'] },
  { label: 'Battery', value: 37, colors: ['#4F46E5', '#22D3EE'] },
  { label: 'Apps', value: 70, colors: ['#A855FF', '#22D3EE'] },
];

const DEFAULT_ITEMS = [
  { label: 'Big files', size: '2.05 GB', iconKey: 'group89' },
  { label: 'Audio & video', size: '3.87 GB', iconKey: 'group90' },
  { label: 'Apps uninstallation', size: '4.37 GB', iconKey: 'group91' },
  { label: 'Junk & caches', size: '8.65 GB', iconKey: 'group92' },
];

export default function CleanerLikeScreen({
  title = 'Cleaner',
  mainPercentTarget = 80,
  centerNumber = '12.7',
  centerUnit = 'GB',
  centerSub = 'can be cleaned out',
  stats = DEFAULT_STATS,
  items = DEFAULT_ITEMS,
  defaultActiveLabel = null, // No item highlighted by default
}) {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [mainPercent, setMainPercent] = useState(0);
  const [statPercents, setStatPercents] = useState(() =>
    Object.fromEntries(stats.map(s => [s.label, 0]))
  );
  const [activeItemLabel, setActiveItemLabel] = useState(defaultActiveLabel || null);

  useEffect(() => {
    // Reset progress when data changes
    setMainPercent(0);
    setStatPercents(Object.fromEntries(stats.map(s => [s.label, 0])));

    const duration = 900;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t * (3 - 2 * t);

      setMainPercent(mainPercentTarget * eased);
      setStatPercents(Object.fromEntries(stats.map(s => [s.label, s.value * eased])));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Small delay to ensure state is reset before animation starts
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 50);

    return () => clearTimeout(timeout);
  }, [mainPercentTarget, stats]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backHit}>
          <Text style={[styles.backText, { color: colors.text }]}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main ring */}
      <View style={styles.topSection}>
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
              strokeDashoffset={2 * Math.PI * RADIUS * (1 - mainPercent / 100)}
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
            <Text style={[styles.centerNumber, { color: colors.text }]}>{centerNumber}</Text>
            <Text style={[styles.centerUnit, { color: colors.accent }]}>{centerUnit}</Text>
            <Text style={[styles.centerSub, { color: colors.textSecondary }]}>{centerSub}</Text>
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
            <View style={styles.deviceHandle} />
          </View>

          {/* Mini rings */}
          <View style={styles.miniRow}>
            {stats.map(stat => (
              <View key={stat.label} style={styles.miniItem}>
                <Svg width={MINI_SIZE} height={MINI_SIZE} viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}>
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
                      2 * Math.PI * MINI_RADIUS * (1 - (statPercents[stat.label] || 0) / 100)
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
            {items.map((item, index) => {
              const isActive = activeItemLabel === item.label;
              // Safely get icon component - ensure it's a valid React component
              let IconComponent = ICONS.group89; // default fallback
              
              // Convert iconKey to string if it's a number
              const iconKeyStr = item.iconKey ? String(item.iconKey) : null;
              
              if (iconKeyStr && ICONS[iconKeyStr]) {
                const candidate = ICONS[iconKeyStr];
                // Verify it's actually a component (function or class/object with render method)
                if (typeof candidate === 'function') {
                  IconComponent = candidate;
                } else if (candidate && typeof candidate === 'object') {
                  // Check if it's a React component (has $$typeof or default export)
                  if (candidate.$$typeof || candidate.default) {
                    IconComponent = candidate.default || candidate;
                  }
                }
              }
              
              return (
                <TouchableOpacity
                  key={item.label || `item-${index}`}
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
                      {typeof IconComponent === 'function' ? (
                        <IconComponent
                          width={24}
                          height={24}
                          color={colors.accent}
                        />
                      ) : null}
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
    textAlign: 'center',
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
    backgroundColor: '#5B606F',
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
  listLabel: {
    fontSize: 13,
  },
  listSize: {
    fontSize: 12,
  },
});


