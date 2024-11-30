import * as React from 'react';
import { Progress } from 'rsuite';

export default function CircularWithValueLabel({ progress }) {
  
  const getColor = (value) => {
    if (value <= 30) return '#f04f43';
    if (value <= 70) return '#ffc107';
    if (value <= 90) return '#7bf37f';
    return '#2c9b90';
  };

  return <Progress.Circle percent={progress} strokeColor={getColor(progress)} strokeWidth={8} trailWidth={8} color={getColor(progress)} />;
}
