'use client';

import React, { useMemo, useState } from 'react';
import { usePlatform } from './PlatformContext';
import { ModuleRecord } from '../data/modules';

const tokenize = (query: string) =>
  query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const scoreRecord = (record: ModuleRecord, tokens: string[]) => {
  const haystack = Object.values(record)
    .map((value) => String(value).toLowerCase())
    .join(' ');
  let score = 0;
  tokens.forEach((token) => {
    if (haystack.includes(token)) {
      score += 1;
    }
  });
  return score;
};

export const NaturalLanguageSearch = () => {
  const { activeModuleId, records } = usePlatform();
  const [query, setQuery] = useState('');

  const result = useMemo(() => {
    const tokens = tokenize(query);
    if (!tokens.length) return [];
    const pool = records[activeModuleId] ?? [];
    return pool
      .map((record) => ({
        record,
        score: scoreRecord(record, tokens)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [query, records, activeModuleId]);

  return (
    <section className="nl-search card">
      <header>
        <div>
          <span className="badge">Natural Language</span>
          <h3>Smart Search</h3>
        </div>
      </header>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. show policies expiring in june or clients in enterprise segment"
      />
      {result.length > 0 && (
        <div className="search-results">
          {result.map(({ record }) => (
            <div key={record.id as string} className="result-item">
              <strong>{record.id}</strong>
              <span>{JSON.stringify(record)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NaturalLanguageSearch;
