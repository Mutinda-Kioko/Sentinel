import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';
import { fetchAntivirusConfig } from './global';

const RING_SIZE = 260;
const STROKE_WIDTH = 16;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;

const ICONS = {
  group101: require('../assets/images/Group 101.png'),
  group100: require('../assets/images/Group 100.png'),
  group99: require('../assets/images/Group 99.png'),
};

const ROWS_DEFAULT = [
  { label: 'Full Scan', iconKey: 'group101' },
  { label: 'Update', iconKey: 'group100' },
  { label: 'Settings', iconKey: 'group99' },
];

export default function Antivirus() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState(0.82);
  const [rows, setRows] = useState(ROWS_DEFAULT);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await fetchAntivirusConfig();
        if (typeof cfg?.ringTargetPercent === 'number') {
          setTarget(cfg.ringTargetPercent / 100);
        }
        if (Array.isArray(cfg?.rows) && cfg.rows.length) {
          setRows(cfg.rows);
        }
      } catch (e) {
        console.log('Failed to load antivirus config from backend', e);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const duration = 900;
    const start = Date.now();

    const tick = () => {
      const now = Date.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t * (3 - 2 * t);
      setProgress(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target]);

  const circumference = 2 * Math.PI * RADIUS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backHit}>
          <Text style={[styles.backText, { color: colors.text }]}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Antivirus</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Top card with rings */}
      <View style={[styles.topCard, { backgroundColor: isDarkMode ? '#021A5A' : '#E0F2FE' }]}>
        {/* Floating dots */}
        <View pointerEvents="none" style={styles.dotsLayer}>
          <View style={[styles.dot, { top: 38, left: 32, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 54, right: 28, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 140, left: 18, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 160, right: 40, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
          <View style={[styles.dot, { top: 94, left: 150, backgroundColor: colors.dotCyan, shadowColor: colors.dotCyan }]} />
        </View>

        <View style={styles.ringsWrapper}>
          <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
            {/* Outer background ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={isDarkMode ? '#021331' : '#BFDBFE'}
              strokeWidth={STROKE_WIDTH + 4}
              fill="none"
            />
            {/* Middle ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS - 16}
              stroke={isDarkMode ? '#062D7A' : '#93C5FD'}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Inner ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS - 32}
              stroke={isDarkMode ? '#193D9B' : '#60A5FA'}
              strokeWidth={STROKE_WIDTH - 2}
              fill="none"
            />

            {/* Animated bright outline */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={colors.accent}
              strokeWidth={4}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>

          {/* Check icon */}
          <View style={styles.checkWrapper}>
            <View style={[styles.checkCircle, { backgroundColor: isDarkMode ? '#0D2A6A' : '#DBEAFE', borderColor: colors.accent }]}>
              <Image
                source={require('../assets/images/Vector.png')}
                style={styles.checkIcon}
                resizeMode="contain"
                tintColor={isDarkMode ? '#FFFFFF' : '#111827'}
              />
            </View>
          </View>
        </View>

        {/* Text */}
        <View style={styles.statusTextBlock}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>Your Phone Is Protected</Text>
          <Text style={[styles.statusSub, { color: colors.textSecondary }]}>Last scan : 2 days ago</Text>
        </View>

        {/* Quick scan button */}
        <TouchableOpacity activeOpacity={0.9} style={[styles.quickScanBtn, { backgroundColor: colors.button, shadowColor: colors.button }]}>
          <Text style={styles.quickScanText}>QUICK SCAN</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom list */}
      <View style={[styles.bottomListCard, { backgroundColor: colors.background }]}>
        {rows.map(row => (
          <TouchableOpacity key={row.label} activeOpacity={0.7} style={[styles.row, { backgroundColor: colors.card }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconOuter, { borderColor: colors.accent }]}>
                <Image
                  source={ICONS[row.iconKey] || ICONS.group101}
                  style={styles.rowIconImage}
                  resizeMode="contain"
                  tintColor={colors.accent}
                />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{row.label}</Text>
            </View>
            <Text style={[styles.rowArrow, { color: colors.text }]}>{'›'}</Text>
          </TouchableOpacity>
        ))}
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
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 6,
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

  topCard: {
    marginTop: 6,
    marginHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  dotsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  ringsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 36,
    height: 36,
  },

  statusTextBlock: {
    marginTop: 18,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusSub: {
    marginTop: 4,
    fontSize: 12,
  },

  quickScanBtn: {
    marginTop: 26,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  quickScanText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  bottomListCard: {
    flex: 1,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconImage: {
    width: 18,
    height: 18,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowArrow: {
    fontSize: 22,
  },
});


