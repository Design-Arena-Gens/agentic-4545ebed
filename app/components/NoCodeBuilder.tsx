'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableField } from './SortableField';
import { FieldType, ModuleField } from '../data/modules';
import { usePlatform } from './PlatformContext';

const fieldTypes: { label: string; value: FieldType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Currency', value: 'currency' },
  { label: 'Date', value: 'date' },
  { label: 'Status', value: 'status' },
  { label: 'Number', value: 'number' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Select', value: 'select' }
];

export const NoCodeBuilder = () => {
  const { activeModuleId, fields, reorderFields, updateField, addField, deleteField } = usePlatform();
  const moduleFields = useMemo(() => fields[activeModuleId] ?? [], [fields, activeModuleId]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [optionsInput, setOptionsInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const startIndex = moduleFields.findIndex((field) => field.id === activeId);
    const endIndex = moduleFields.findIndex((field) => field.id === overId);
    reorderFields(activeModuleId, startIndex, endIndex);
  };

  const createField = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 24);
    const field: ModuleField = {
      id: `${id}-${Date.now().toString(36)}`,
      label: newFieldLabel,
      type: newFieldType,
      options:
        newFieldType === 'select'
          ? optionsInput
              .split(',')
              .map((option) => option.trim())
              .filter(Boolean)
          : undefined
    };
    addField(activeModuleId, field);
    setNewFieldLabel('');
    setOptionsInput('');
  };

  const fieldPreview = useMemo(
    () =>
      moduleFields.slice(0, 3).map((field) => ({
        label: field.label,
        type: field.type
      })),
    [moduleFields]
  );

  return (
    <section className="nocode-builder card">
      <header>
        <div>
          <span className="badge">No-Code Builder</span>
          <h3>Design Data Model</h3>
        </div>
        <div className="preview">
          {fieldPreview.map((field) => (
            <span key={field.label}>{field.label}</span>
          ))}
        </div>
      </header>
      <div className="builder-columns">
        <div className="field-list">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={moduleFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              {moduleFields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onRemove={() => deleteField(activeModuleId, field.id)}
                  onUpdate={(updates) => updateField(activeModuleId, field.id, updates)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <form className="field-creator" onSubmit={createField}>
          <label>
            Field Label
            <input
              value={newFieldLabel}
              placeholder="e.g. Broker Reference"
              onChange={(event) => setNewFieldLabel(event.target.value)}
            />
          </label>
          <label>
            Field Type
            <select value={newFieldType} onChange={(event) => setNewFieldType(event.target.value as FieldType)}>
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          {newFieldType === 'select' && (
            <label>
              Options (comma separated)
              <textarea
                value={optionsInput}
                placeholder="Option A, Option B, Option C"
                onChange={(event) => setOptionsInput(event.target.value)}
              />
            </label>
          )}
          <button type="submit" className="cta">
            Add Field
          </button>
        </form>
      </div>
    </section>
  );
};

export default NoCodeBuilder;
