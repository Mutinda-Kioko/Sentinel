import React from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';

const stats = [
  { label: 'Threats', value: 12, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Scans', value: 78, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Updates', value: 64, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Firewall', value: 90, colors: ['#00E0FF', '#38BDF8'] },
];

const items = [
  { label: 'Full scan', size: 'Recommended', iconKey: 'group101' },
  { label: 'Update signatures', size: 'Latest: today', iconKey: 'group100' },
  { label: 'Real-time protection', size: 'Enabled', iconKey: 'group99' },
  { label: 'Quarantine', size: '0 items', iconKey: 'group92' },
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


