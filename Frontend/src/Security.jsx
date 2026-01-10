import React, { useEffect, useState } from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';
import { fetchSecurityConfig } from './global';

const DEFAULT_CONFIG = {
  title: 'Security',
  mainPercentTarget: 74,
  centerNumber: '12',
  centerUnit: 'Checks',
  centerSub: 'security items monitored',
};

const DEFAULT_STATS = [
  { label: 'Permissions', value: 72, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Safe web', value: 88, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Passwords', value: 54, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'App lock', value: 41, colors: ['#00E0FF', '#38BDF8'] },
];

const DEFAULT_ITEMS = [
  { label: 'Permission audit', size: '12 apps', iconKey: 'group89' },
  { label: 'Safe browsing', size: 'On', iconKey: 'group100' },
  { label: 'Password check', size: '3 alerts', iconKey: 'group101' },
  { label: 'App lock', size: 'Off', iconKey: 'group92' },
];

export default function Security() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await fetchSecurityConfig();
        if (cfg?.summary) {
          setConfig(prev => ({
            ...prev,
            mainPercentTarget: cfg.summary.mainPercentTarget ?? prev.mainPercentTarget,
            centerNumber: cfg.summary.centerNumber ?? prev.centerNumber,
            centerUnit: cfg.summary.centerUnit ?? prev.centerUnit,
            centerSub: cfg.summary.centerSub ?? prev.centerSub,
          }));
        }
        if (Array.isArray(cfg?.stats) && cfg.stats.length) {
          setStats(cfg.stats);
        }
        if (Array.isArray(cfg?.items) && cfg.items.length) {
          setItems(cfg.items);
        }
      } catch (e) {
        console.log('Failed to load security config from backend', e);
      }
    };
    loadConfig();
  }, []);

  return (
    <CleanerLikeScreen
      title={config.title}
      mainPercentTarget={config.mainPercentTarget}
      centerNumber={config.centerNumber}
      centerUnit={config.centerUnit}
      centerSub={config.centerSub}
      stats={stats}
      items={items}
    />
  );
}