'use client';

import React from 'react';
import { usePlatform } from './PlatformContext';

export const DuplicatePanel = () => {
  const { activeModuleId, duplicateGroups, refreshDuplicates } = usePlatform();
  const groups = duplicateGroups[activeModuleId] ?? [];

  return (
    <section className="duplicate-panel card">
      <header>
        <div>
          <span className="badge">Clean Data</span>
          <h3>Duplicate Insights</h3>
        </div>
        <button className="ghost" type="button" onClick={() => refreshDuplicates(activeModuleId)}>
          Refresh
        </button>
      </header>
      {groups.length === 0 ? (
        <div className="empty-state">
          <strong>No duplicates detected.</strong>
          <span>Run detection after imports or major updates.</span>
        </div>
      ) : (
        <div className="duplicates-grid">
          {groups.map((group) => (
            <div key={`${group.fieldId}-${group.key}`} className="duplicate-card">
              <span className="field">{group.fieldLabel}</span>
              <strong>{group.key}</strong>
              <div className="records">
                {group.records.map((record) => (
                  <span key={record.id as string}>{record.id}</span>
                ))}
              </div>
              <button type="button" className="ghost">
                Merge Records
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DuplicatePanel;
