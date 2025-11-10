'use client';

import React, { useMemo } from 'react';
import { ModuleDefinition } from '../data/modules';

export const SuggestionChips = ({ module }: { module?: ModuleDefinition }) => {
  const display = useMemo(() => {
    if (!module) return [];
    return module.aiPrompts.slice(0, 2);
  }, [module]);

  if (!module) return null;

  return (
    <div className="suggestion-chips">
      {display.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="ghost"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              void navigator.clipboard.writeText(prompt);
            }
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
