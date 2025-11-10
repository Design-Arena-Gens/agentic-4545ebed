'use client';

import React from 'react';
import { usePlatform } from './PlatformContext';
import { IconFactory } from './IconFactory';

export const ModuleSummary = () => {
  const { modules, activeModuleId } = usePlatform();
  const currentModule = modules.find((module) => module.id === activeModuleId);

  if (!currentModule) return null;

  return (
    <section className="module-summary card">
      <header>
        <div className="icon">
          <IconFactory name={currentModule.icon} className="summary-icon" />
        </div>
        <div>
          <h2>{currentModule.name}</h2>
          <p>{currentModule.description}</p>
        </div>
        <div className="metric">
          <span>{currentModule.primaryMetric.label}</span>
          <strong>{currentModule.primaryMetric.value}</strong>
          <span className={currentModule.primaryMetric.trend >= 0 ? 'up' : 'down'}>
            {currentModule.primaryMetric.trend >= 0 ? '+' : ''}
            {currentModule.primaryMetric.trend}%
          </span>
        </div>
      </header>
      <div className="secondary-metrics">
        {currentModule.secondaryMetrics.map((metric) => (
          <div key={metric.label} className="metric-pill">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModuleSummary;
