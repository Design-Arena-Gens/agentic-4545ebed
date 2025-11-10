'use client';

import React from 'react';
import Image from 'next/image';
import { usePlatform } from './PlatformContext';
import { IconFactory } from './IconFactory';

const colorSwatches = [
  { hex: '#1D3557', label: 'Deep Trust' },
  { hex: '#457B9D', label: 'Digital Steel' },
  { hex: '#A8DADC', label: 'Future Mist' },
  { hex: '#F7FBFF', label: 'Nimbus White' },
  { hex: '#2EC4B6', label: 'Momentum Teal' }
];

export const Sidebar = () => {
  const { modules, activeModuleId, setActiveModuleId } = usePlatform();

  return (
    <aside className="card sidebar">
      <div className="sidebar-header">
        <Image
          src="/assets/assuresphere-logo.svg"
          alt="AssureSphere Logo"
          className="logo"
          width={64}
          height={64}
          priority
        />
        <div className="brand">
          <span className="brand-tag">AssureSphere</span>
          <h1>Insurance Intelligence Platform</h1>
          <p>
            Design language: Neo-skeuomorphic cards with soft gradients, layered depth, and high-contrast
            typography for trust and clarity.
          </p>
        </div>
      </div>

      <div className="palette">
        <span className="palette-title">Reliance Palette</span>
        <div className="swatches">
          {colorSwatches.map((swatch) => (
            <div key={swatch.hex} className="swatch">
              <span className="tone" style={{ backgroundColor: swatch.hex }} />
              <div>
                <strong>{swatch.label}</strong>
                <span>{swatch.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="module-nav">
        <span className="nav-title">Intelligent Modules</span>
        <div className="module-list">
          {modules.map((module) => (
            <button
              key={module.id}
              className={`module-button ${module.id === activeModuleId ? 'active' : ''}`}
              onClick={() => setActiveModuleId(module.id)}
            >
              <IconFactory name={module.icon} className="module-icon" />
              <div>
                <strong>{module.name}</strong>
                <span>{module.description}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
