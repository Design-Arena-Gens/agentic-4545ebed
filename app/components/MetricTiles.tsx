'use client';

import React, { useMemo } from 'react';
import { usePlatform } from './PlatformContext';

export const MetricTiles = () => {
  const { modules } = usePlatform();
  const composite = useMemo(
    () =>
      modules.slice(0, 3).map((module) => ({
        title: module.primaryMetric.label,
        value: module.primaryMetric.value,
        trend: module.primaryMetric.trend,
        module: module.name
      })),
    [modules]
  );

  return (
    <div className="metric-tiles">
      {composite.map((metric) => (
        <div key={metric.title} className="metric-tile">
          <span>{metric.module}</span>
          <strong>{metric.value}</strong>
          <small>{metric.title}</small>
          <span className={metric.trend >= 0 ? 'trend-up' : 'trend-down'}>
            {metric.trend >= 0 ? '+' : ''}
            {metric.trend}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default MetricTiles;
