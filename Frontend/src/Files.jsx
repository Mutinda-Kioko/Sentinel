import React, { useEffect, useState } from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';
import { fetchFilesConfig } from './global';

const DEFAULT_CONFIG = {
  title: 'Files',
  mainPercentTarget: 66,
  centerNumber: '11.2',
  centerUnit: 'GB',
  centerSub: 'total managed files',
};

const DEFAULT_STATS = [
  { label: 'Docs', value: 46, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Media', value: 63, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Downloads', value: 57, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Archives', value: 22, colors: ['#00E0FF', '#38BDF8'] },
];

const DEFAULT_ITEMS = [
  { label: 'Documents', size: '1.8 GB', iconKey: 'group89' },
  { label: 'Photos & videos', size: '6.4 GB', iconKey: 'group90' },
  { label: 'Downloads', size: '2.1 GB', iconKey: 'group91' },
  { label: 'Archives', size: '0.9 GB', iconKey: 'group92' },
];

export default function Files() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await fetchFilesConfig();
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
        console.log('Failed to load files config from backend', e);
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


