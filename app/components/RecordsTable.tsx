'use client';

import React, { useMemo, useState } from 'react';
import { ModuleField, ModuleRecord } from '../data/modules';
import { usePlatform } from './PlatformContext';
import { nanoid } from '../lib/nanoid';

interface EditState {
  id: string;
  values: Record<string, string>;
}

export const RecordsTable = () => {
  const { activeModuleId, records, fields, deleteRecord, updateRecord, addRecord } = usePlatform();
  const moduleRecords = records[activeModuleId] ?? [];
  const moduleFields = useMemo(() => fields[activeModuleId] ?? [], [fields, activeModuleId]);
  const [editState, setEditState] = useState<EditState | null>(null);

  const headers = useMemo(() => moduleFields.map((field) => field), [moduleFields]);

  const beginEdit = (record: ModuleRecord) => {
    const values: Record<string, string> = {};
    headers.forEach((field) => {
      values[field.id] = String(record[field.id] ?? '');
    });
    setEditState({ id: record.id as string, values });
  };

  const cancelEdit = () => setEditState(null);

  const saveEdit = () => {
    if (!editState) return;
    const exists = moduleRecords.some((record) => record.id === editState.id);
    const payload = {
      id: editState.id,
      ...editState.values
    };
    if (exists) {
      updateRecord(activeModuleId, editState.id, payload);
    } else {
      addRecord(activeModuleId, payload);
    }
    setEditState(null);
  };

  return (
    <section className="records-table card">
      <header>
        <div>
          <span className="badge">Dynamic Data Grid</span>
          <h3>Module Records</h3>
        </div>
        <div className="actions">
          <button
            className="ghost"
            type="button"
            onClick={() =>
              beginEdit({
                id: nanoid(),
                ...Object.fromEntries(headers.map((field) => [field.id, '']))
              })
            }
          >
            Quick Add Blank Row
          </button>
        </div>
      </header>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              {headers.map((field) => (
                <th key={field.id}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {moduleRecords.map((record) => (
              <tr key={record.id as string}>
                <td>{record.id}</td>
                {headers.map((field) => (
                  <td key={`${record.id}-${field.id}`}>{record[field.id] as string}</td>
                ))}
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => beginEdit(record)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteRecord(activeModuleId, record.id as string)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editState && (
        <div className="edit-drawer">
          <div className="drawer-content">
            <h4>{moduleRecords.find((record) => record.id === editState.id) ? 'Edit Record' : 'Create Record'}</h4>
            <div className="drawer-grid">
              {headers.map((field) => (
                <label key={field.id}>
                  <span>{field.label}</span>
                  <input
                    value={editState.values[field.id] ?? ''}
                    onChange={(event) =>
                      setEditState((prev) =>
                        prev
                          ? {
                              ...prev,
                              values: {
                                ...prev.values,
                                [field.id]: event.target.value
                              }
                            }
                          : null
                      )
                    }
                  />
                </label>
              ))}
            </div>
            <div className="drawer-actions">
              <button type="button" className="ghost" onClick={cancelEdit}>
                Cancel
              </button>
              <button type="button" className="cta" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecordsTable;
