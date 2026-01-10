import React from 'react';
import CleanerLikeScreen from './CleanerLikeScreen';

const stats = [
  { label: 'Health', value: 92, colors: ['#22D3EE', '#7B2BFF'] },
  { label: 'Charge', value: 65, colors: ['#00E0FF', '#38BDF8'] },
  { label: 'Temp', value: 48, colors: ['#256BFF', '#7B2BFF'] },
  { label: 'Cycles', value: 74, colors: ['#00E0FF', '#38BDF8'] },
];

const items = [
  { label: 'Battery health', size: 'Good', icon: require('../assets/images/Group 89.png') },
  { label: 'Optimize charging', size: 'On', icon: require('../assets/images/Group 90.png') },
  { label: 'Power saver', size: 'Off', icon: require('../assets/images/Group 91.png') },
  { label: 'App drainers', size: '3 apps', icon: require('../assets/images/Group 92.png') },
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