import React, { useEffect, useState } from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';
import { fetchDataConfig } from './global';

const DEFAULT_CONFIG = {
  title: 'Data',
  mainPercentTarget: 68,
  centerNumber: '3.2',
  centerUnit: 'GB',
  centerSub: 'used today',
};

const DEFAULT_STATS = [
  { label: 'Usage', value: 58, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Background', value: 32, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Roaming', value: 12, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Wi-Fi', value: 84, colors: ['#00E0FF', '#38BDF8'] },
];

const DEFAULT_ITEMS = [
  { label: 'Data usage', size: '3.2 GB today', iconKey: 'group90' },
  { label: 'Background apps', size: '5 apps', iconKey: 'group91' },
  { label: 'Roaming control', size: 'On', iconKey: 'group99' },
  { label: 'Wi-Fi security', size: 'Good', iconKey: 'group92' },
];

export default function Data() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await fetchDataConfig();
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
        console.log('Failed to load data config from backend', e);
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