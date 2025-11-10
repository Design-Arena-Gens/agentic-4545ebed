'use client';

import {
  ArrowPathIcon,
  BanknotesIcon,
  BoltIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import React from 'react';

const iconMap = {
  ArrowPathIcon,
  BanknotesIcon,
  BoltIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  UsersIcon
};

export const IconFactory = ({
  name,
  className
}: {
  name: string;
  className?: string;
}) => {
  const Component = (iconMap as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Component) return null;
  return <Component className={className} />;
};
