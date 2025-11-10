'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ModuleField } from '../data/modules';

export const SortableField = ({
  field,
  onRemove,
  onUpdate
}: {
  field: ModuleField;
  onRemove: () => void;
  onUpdate: (updates: Partial<ModuleField>) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-field">
      <button type="button" className="drag-handle" {...attributes} {...listeners}>
        ≡
      </button>
      <div className="field-detail">
        <strong>{field.label}</strong>
        <span>{field.type}</span>
      </div>
      <div className="field-actions">
        <button type="button" onClick={onRemove}>
          Remove
        </button>
        <button
          type="button"
          onClick={() => onUpdate({ required: !field.required })}
          className={field.required ? 'active' : ''}
        >
          {field.required ? 'Required' : 'Optional'}
        </button>
      </div>
    </div>
  );
};

export default SortableField;
