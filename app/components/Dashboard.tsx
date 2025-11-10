'use client';

import React from 'react';
import Sidebar from './Sidebar';
import ModuleSummary from './ModuleSummary';
import RecordForm from './RecordForm';
import RecordsTable from './RecordsTable';
import NoCodeBuilder from './NoCodeBuilder';
import BulkActions from './BulkActions';
import DuplicatePanel from './DuplicatePanel';
import NaturalLanguageSearch from './NaturalLanguageSearch';
import OcrPanel from './OcrPanel';
import AIAssistantPanel from './AIAssistantPanel';
import ChatbotConsole from './ChatbotConsole';
import MetricTiles from './MetricTiles';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <MetricTiles />
        <ModuleSummary />
        <div className="grid-two">
          <RecordForm />
          <NoCodeBuilder />
        </div>
        <div className="grid-two">
          <BulkActions />
          <DuplicatePanel />
        </div>
        <RecordsTable />
        <div className="grid-three">
          <NaturalLanguageSearch />
          <OcrPanel />
          <ChatbotConsole />
        </div>
        <AIAssistantPanel />
      </main>
    </div>
  );
};

export default Dashboard;
