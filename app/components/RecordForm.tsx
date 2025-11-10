'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ModuleField } from '../data/modules';
import { usePlatform } from './PlatformContext';
import { nanoid } from '../lib/nanoid';
import { SuggestionChips } from './SuggestionChips';

const emptyForType = (type: ModuleField['type']) => {
  switch (type) {
    case 'currency':
      return '';
    case 'status':
      return '';
    default:
      return '';
  }
};

export const RecordForm = () => {
  const { fields, activeModuleId, modules, addRecord, records } = usePlatform();
  const moduleFields = useMemo(() => fields[activeModuleId] ?? [], [fields, activeModuleId]);
  const [formState, setFormState] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {};
    moduleFields.forEach((field) => {
      state[field.id] = emptyForType(field.type);
    });
    return state;
  });

  useEffect(() => {
    const state: Record<string, string> = {};
    moduleFields.forEach((field) => {
      state[field.id] = emptyForType(field.type);
    });
    setFormState(state);
  }, [moduleFields]);

  const currentModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId),
    [modules, activeModuleId]
  );

  const suggestions = useMemo(() => {
    const existing = records[activeModuleId] ?? [];
    const map: Record<string, string[]> = {};
    moduleFields.forEach((field) => {
      const values = Array.from(
        new Set(
          existing
            .map((record) => record[field.id])
            .filter(Boolean)
            .map((value) => String(value))
        )
      ).slice(0, 6);
      map[field.id] = values;
    });
    return map;
  }, [moduleFields, records, activeModuleId]);

  const handleChange = (fieldId: string, value: string) => {
    setFormState((prev) => ({ ...prev, [fieldId]: value }));
  };

  const smartId = useMemo(() => `${activeModuleId}-${Date.now().toString(36)}`, [activeModuleId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentModule) return;
    const filledRecord = {
      id: nanoid(),
      ...formState
    };
    addRecord(activeModuleId, filledRecord);
    setFormState(() => {
      const state: Record<string, string> = {};
      moduleFields.forEach((field) => {
        state[field.id] = emptyForType(field.type);
      });
      return state;
    });
  };

  return (
    <section className="record-form card">
      <header>
        <div>
          <span className="badge">Smart Capture</span>
          <h3>Create Entry</h3>
        </div>
        <div className="auto-id">Suggested ID: {smartId}</div>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {moduleFields.map((field) => (
            <div key={field.id} className="form-field">
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              <FieldInput
                field={field}
                value={formState[field.id] ?? ''}
                onChange={(value) => handleChange(field.id, value)}
                suggestions={suggestions[field.id] ?? []}
              />
            </div>
          ))}
        </div>
        <footer>
          <SuggestionChips module={currentModule} />
          <button className="cta" type="submit">
            Add Record
          </button>
        </footer>
      </form>
    </section>
  );
};

const FieldInput = ({
  field,
  value,
  onChange,
  suggestions
}: {
  field: ModuleField;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}) => {
  if (field.type === 'select' && field.options) {
    return (
      <div className="input-with-suggestions">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">Choose...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <AutoFill suggestions={suggestions} onSelect={onChange} />
      </div>
    );
  }

  const inputType = field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text';

  return (
    <div className="input-with-suggestions">
      <input
        type={inputType}
        value={value}
        placeholder={`Enter ${field.label.toLowerCase()}`}
        onChange={(event) => onChange(event.target.value)}
      />
      <AutoFill suggestions={suggestions} onSelect={onChange} />
    </div>
  );
};

const AutoFill = ({
  suggestions,
  onSelect
}: {
  suggestions: string[];
  onSelect: (value: string) => void;
}) => {
  if (!suggestions.length) return null;
  return (
    <div className="auto-fill">
      {suggestions.map((suggestion) => (
        <button key={suggestion} type="button" onClick={() => onSelect(suggestion)}>
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default RecordForm;
