import React from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';

const stats = [
  { label: 'Threats', value: 12, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Scans', value: 78, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Updates', value: 64, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Firewall', value: 90, colors: ['#00E0FF', '#38BDF8'] },
];

const items = [
  { label: 'Full scan', size: 'Recommended', icon: require('../assets/images/Group 101.png') },
  { label: 'Update signatures', size: 'Latest: today', icon: require('../assets/images/Group 100.png') },
  { label: 'Real-time protection', size: 'Enabled', icon: require('../assets/images/Group 99.png') },
  { label: 'Quarantine', size: '0 items', icon: require('../assets/images/Group 92.png') },
];

export default function AntivirusScreen() {
  return (
    <CleanerLikeScreen
      title="Antivirus"
      mainPercentTarget={82}
      centerNumber="100%"
      centerUnit="Safe"
      centerSub="Device status"
      stats={stats}
      items={items}
    />
  );
}


