'use client';

import React, { useRef, useState } from 'react';
import { usePlatform } from './PlatformContext';

export const BulkActions = () => {
  const { activeModuleId, importRecords, exportRecords, refreshDuplicates } = usePlatform();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importRecords(activeModuleId, file);
      setFeedback(`Imported ${file.name}`);
    } catch (error) {
      console.error(error);
      setFeedback('Failed to import file. Please check the format.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="bulk-actions card">
      <header>
        <div>
          <span className="badge">Bulk Ops</span>
          <h3>Automation Actions</h3>
        </div>
      </header>
      <div className="actions-grid">
        <button className="ghost" type="button" onClick={() => fileInputRef.current?.click()}>
          Import CSV / Excel
        </button>
        <button className="ghost" type="button" onClick={() => exportRecords(activeModuleId)}>
          Export Records
        </button>
        <button className="ghost" type="button" onClick={() => refreshDuplicates(activeModuleId)}>
          Detect Duplicates
        </button>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xls,.xlsx"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </section>
  );
};

export default BulkActions;
