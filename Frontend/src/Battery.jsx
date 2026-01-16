import React from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';

const stats = [
  { label: 'Health', value: 92, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Charge', value: 65, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Temp', value: 48, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Cycles', value: 74, colors: ['#00E0FF', '#38BDF8'] },
];

const items = [
  { label: 'Battery health', size: 'Good', iconKey: 'group89' },
  { label: 'Optimize charging', size: 'On', iconKey: 'group90' },
  { label: 'Power saver', size: 'Off', iconKey: 'group91' },
  { label: 'App drainers', size: '3 apps', iconKey: 'group92' },
];

export default function Battery() {
  return (
    <CleanerLikeScreen
      title="Battery"
      mainPercentTarget={76}
      centerNumber="8h 12m"
      centerUnit="Left"
      centerSub="Estimated battery life"
      stats={stats}
      items={items}
    />
  );
}