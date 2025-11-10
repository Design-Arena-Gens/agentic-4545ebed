'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import {
  ModuleDefinition,
  ModuleField,
  ModuleRecord,
  modules as defaultModules
} from '../data/modules';
import { detectDuplicates, DuplicateGroup } from '../lib/deduplicate';
import { exportToCsv, parseCsvFile, parseExcelFile } from '../lib/importExport';

export interface PlatformContextValue {
  modules: ModuleDefinition[];
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  records: Record<string, ModuleRecord[]>;
  fields: Record<string, ModuleField[]>;
  addRecord: (moduleId: string, record: ModuleRecord) => void;
  updateRecord: (moduleId: string, recordId: string, updates: ModuleRecord) => void;
  deleteRecord: (moduleId: string, recordId: string) => void;
  importRecords: (moduleId: string, file: File) => Promise<void>;
  exportRecords: (moduleId: string) => void;
  addField: (moduleId: string, field: ModuleField) => void;
  updateField: (moduleId: string, fieldId: string, updates: Partial<ModuleField>) => void;
  deleteField: (moduleId: string, fieldId: string) => void;
  reorderFields: (moduleId: string, startIndex: number, endIndex: number) => void;
  duplicateGroups: Record<string, DuplicateGroup[]>;
  refreshDuplicates: (moduleId: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const LOCAL_STORAGE_KEY = 'assuresphere-platform-state-v1';

type PersistedState = {
  records: Record<string, ModuleRecord[]>;
  fields: Record<string, ModuleField[]>;
};

const usePersistentState = () => {
  const readState = useCallback((): PersistedState | null => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as PersistedState;
    } catch (error) {
      console.warn('Failed to parse stored state', error);
      return null;
    }
  }, []);

  const writeState = useCallback((state: PersistedState) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, []);

  return { readState, writeState };
};

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { readState, writeState } = usePersistentState();
  const persisted = useMemo(() => readState(), [readState]);

  const defaultRecords = useMemo(() => {
    const map: Record<string, ModuleRecord[]> = {};
    defaultModules.forEach((module) => {
      map[module.id] = module.sampleRecords;
    });
    return map;
  }, []);

  const defaultFields = useMemo(() => {
    const map: Record<string, ModuleField[]> = {};
    defaultModules.forEach((module) => {
      map[module.id] = module.fields;
    });
    return map;
  }, []);

  const [activeModuleId, setActiveModuleId] = useState<string>(defaultModules[0]?.id ?? '');
  const [records, setRecords] = useState<Record<string, ModuleRecord[]>>(
    persisted?.records ?? defaultRecords
  );
  const [fields, setFields] = useState<Record<string, ModuleField[]>>(
    persisted?.fields ?? defaultFields
  );
  const [duplicateGroups, setDuplicateGroups] = useState<Record<string, DuplicateGroup[]>>({});

  useEffect(() => {
    try {
      writeState({ records, fields });
    } catch (error) {
      console.warn('Failed to persist state', error);
    }
  }, [records, fields, writeState]);

  const modules = useMemo<ModuleDefinition[]>(() => defaultModules, []);

  const addRecord = useCallback((moduleId: string, record: ModuleRecord) => {
    setRecords((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] ?? []), record]
    }));
  }, []);

  const updateRecord = useCallback(
    (moduleId: string, recordId: string, updates: ModuleRecord) => {
      setRecords((prev) => ({
        ...prev,
        [moduleId]: (prev[moduleId] ?? []).map((item) =>
          item.id === recordId ? { ...item, ...updates } : item
        )
      }));
    },
    []
  );

  const deleteRecord = useCallback((moduleId: string, recordId: string) => {
    setRecords((prev) => ({
      ...prev,
      [moduleId]: (prev[moduleId] ?? []).filter((item) => item.id !== recordId)
    }));
  }, []);

  const importRecords = useCallback(async (moduleId: string, file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let imported: ModuleRecord[] = [];

    if (extension === 'csv') {
      imported = await parseCsvFile(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      imported = await parseExcelFile(file);
    } else {
      throw new Error('Unsupported file format');
    }

    setRecords((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] ?? []), ...imported]
    }));
  }, []);

  const exportRecords = useCallback(
    (moduleId: string) => {
      const data = records[moduleId] ?? [];
      void exportToCsv(data, `${moduleId}-records`);
    },
    [records]
  );

  const addField = useCallback((moduleId: string, field: ModuleField) => {
    setFields((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] ?? []), field]
    }));
  }, []);

  const updateField = useCallback(
    (moduleId: string, fieldId: string, updates: Partial<ModuleField>) => {
      setFields((prev) => ({
        ...prev,
        [moduleId]: (prev[moduleId] ?? []).map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }));
    },
    []
  );

  const deleteField = useCallback((moduleId: string, fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [moduleId]: (prev[moduleId] ?? []).filter((field) => field.id !== fieldId)
    }));
  }, []);

  const reorderFields = useCallback((moduleId: string, startIndex: number, endIndex: number) => {
    setFields((prev) => {
      const cloned = [...(prev[moduleId] ?? [])];
      const [removed] = cloned.splice(startIndex, 1);
      cloned.splice(endIndex, 0, removed);
      return {
        ...prev,
        [moduleId]: cloned
      };
    });
  }, []);

  const refreshDuplicates = useCallback(
    (moduleId: string) => {
      const moduleRecords = records[moduleId] ?? [];
      const moduleFields = fields[moduleId] ?? [];
      const duplicates = detectDuplicates(moduleRecords, moduleFields);
      setDuplicateGroups((prev) => ({ ...prev, [moduleId]: duplicates }));
    },
    [records, fields]
  );

  const value = useMemo<PlatformContextValue>(
    () => ({
      modules,
      activeModuleId,
      setActiveModuleId,
      records,
      fields,
      addRecord,
      updateRecord,
      deleteRecord,
      importRecords,
      exportRecords,
      addField,
      updateField,
      deleteField,
      reorderFields,
      duplicateGroups,
      refreshDuplicates
    }),
    [
      modules,
      activeModuleId,
      records,
      fields,
      addRecord,
      updateRecord,
      deleteRecord,
      importRecords,
      exportRecords,
      addField,
      updateField,
      deleteField,
      reorderFields,
      duplicateGroups,
      refreshDuplicates
    ]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return context;
};
