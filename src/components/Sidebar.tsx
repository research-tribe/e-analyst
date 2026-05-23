import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onExport: () => void;
  setViewMode: (mode: 'summary' | 'comparative') => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onExport,
  setViewMode
}: SidebarProps) {
  const tabs = [
    { id: 'gdp_growth', label: 'GDP & Growth', icon: 'show_chart' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'domain' },
    { id: 'education_skills', label: 'Education & Skills', icon: 'school' },
    { id: 'public_health', label: 'Public Health', icon: 'medical_services' },
    { id: 'industrial_output', label: 'Industrial Output', icon: 'factory' }
  ] as const;

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // Automatically route to 'summary' for non gdp-growth tabs to avoid empty views,
    // or keep comparative context if preferred. We force summary when switching to other sectors to match screenshot layout
    if (tabId !== 'gdp_growth') {
      setViewMode('summary');
    }
    setIsOpen(false); // Close on mobile navigation
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col bg-[#f0f3ff] border-r border-[#c2c6d3] transition-transform duration-200 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Title Block */}
        <div className="p-6 border-b border-[#c2c6d3]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0058a3] rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffffff]" style={{ fontSize: '24px' }}>
                account_balance
              </span>
            </div>
            <div>
              <h2 className="font-sans text-[16px] leading-[20px] font-bold text-[#00417a] truncate">
                Economic Indicators
              </h2>
              <p className="font-mono text-[11px] font-medium tracking-wider text-[#424751] uppercase">
                Sectoral Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-[13px] font-medium transition-all duration-150 text-left cursor-pointer
                      ${
                        isActive
                          ? 'text-[#00417a] font-bold border-r-4 border-[#00417a] bg-[#dee8ff]'
                          : 'text-[#424751] hover:bg-[#e7eeff] hover:text-[#00417a]'
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined shrink-0 ${
                        isActive ? 'text-[#00417a]' : 'text-[#424751]'
                      }`}
                      style={{ fontSize: '20px' }}
                    >
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions Section */}
        <div className="p-6 mt-auto border-t border-[#c2c6d3]/60 flex flex-col gap-4">
          <button
            id="export-dataset-btn"
            onClick={onExport}
            className="w-full py-2.5 px-4 bg-[#00417a] text-white font-sans text-[13px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#0058a3] transition-colors shadow-xs active:bg-[#001c3a]"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export Dataset
          </button>

          <div className="flex justify-around items-center pt-2">
            <button
              id="sidebar-settings-btn"
              onClick={() => alert('Settings menu: Change regional preferences, baseline GDP model configurations (Constant vs Current prices), or toggle chart projection algorithms.')}
              className="text-[#424751] hover:text-[#00417a] transition-colors flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none p-1"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-sans text-[11px] tracking-tight">Settings</span>
            </button>
            <button
              id="sidebar-support-btn"
              onClick={() => alert('Economic Monitor Support:\n- Documentation: Click Methodology in the header.\n- Data Inquiries: support.economics@tn.gov.in\n- Current Cycle: Term C Projection Baseline v2.4')}
              className="text-[#424751] hover:text-[#00417a] transition-colors flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none p-1"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
              <span className="font-sans text-[11px] tracking-tight">Support</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
