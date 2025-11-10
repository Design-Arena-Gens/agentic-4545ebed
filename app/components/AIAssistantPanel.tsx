'use client';

import React, { useMemo, useState } from 'react';
import { usePlatform } from './PlatformContext';
import { ModuleRecord } from '../data/modules';

const summariseRecords = (records: ModuleRecord[]): string => {
  if (!records.length) return 'Add data to unlock AI insights for this module.';
  const preview = records
    .slice(0, 3)
    .map((record) => `${record.id}: ${Object.values(record).slice(1, 4).join(' • ')}`)
    .join('\n');
  return `Detected ${records.length} records. Highlighting first entries:\n${preview}`;
};

export const AIAssistantPanel = () => {
  const { modules, activeModuleId, records } = usePlatform();
  const activeModule = modules.find((item) => item.id === activeModuleId);
  const [response, setResponse] = useState('');

  const playbooks = useMemo(() => activeModule?.playbooks ?? [], [activeModule]);

  const runInsight = (prompt: string) => {
    const dataset = records[activeModuleId] ?? [];
    const summary = summariseRecords(dataset);
    const crafted = `Prompt: ${prompt}\n\n${summary}`;
    setResponse(crafted);
  };

  if (!activeModule) return null;

  return (
    <section className="ai-panel card">
      <header>
        <div>
          <span className="badge">AI Co-Pilot</span>
          <h3>Insight Launcher</h3>
        </div>
      </header>
      <div className="prompt-grid">
        {activeModule.aiPrompts.map((prompt) => (
          <button key={prompt} className="ghost" type="button" onClick={() => runInsight(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <div className="playbook-grid">
        {playbooks.map((playbook) => (
          <div key={playbook} className="playbook-card">
            <strong>{playbook}</strong>
            <span>Launch templated flow for {activeModule.name.toLowerCase()} teams.</span>
          </div>
        ))}
      </div>
      {response && (
        <div className="ai-response">
          <textarea value={response} readOnly rows={6} />
        </div>
      )}
    </section>
  );
};

export default AIAssistantPanel;
