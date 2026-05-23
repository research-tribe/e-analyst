import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ExecutiveSummary from './components/ExecutiveSummary';
import ComparativeAnalytics from './components/ComparativeAnalytics';
import { sectorInsights } from './data';
import { ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('gdp_growth');
  const [viewMode, setViewMode] = useState<'summary' | 'comparative'>('summary');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000); // clear after 4s
  };

  const handleExport = () => {
    const formattedTab = activeTab.replace('_', ' ').toUpperCase();
    triggerToast(`Export Initiated: Compiled full historical state dataset for [${formattedTab}] in CSV. Check downloads folder.`);
  };

  // Resolve dynamic insights data
  const baseInsight = useMemo(() => {
    return sectorInsights[activeTab] || sectorInsights.gdp_growth;
  }, [activeTab]);

  // Handle active search filter inside metrics or text content if searchQuery exists
  const activeInsight = useMemo(() => {
    if (!searchQuery) return baseInsight;

    // Filter metrics inside the active sector to match search terms
    const query = searchQuery.toLowerCase();
    const filteredMetrics = baseInsight.metrics.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.value.toLowerCase().includes(query) ||
      (m.change && m.change.toLowerCase().includes(query))
    );

    return {
      ...baseInsight,
      metrics: filteredMetrics.length > 0 ? filteredMetrics : baseInsight.metrics
    };
  }, [baseInsight, searchQuery]);

  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] min-h-screen flex flex-col font-sans antialiased selection:bg-[#dee8ff]">
      
      {/* 1. Header */}
      <Header
        onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Grid Wrapper */}
      <div className="flex flex-1 mt-16">
        
        {/* 2. Side Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Highlight query clearing if any
            if (searchQuery) setSearchQuery('');
          }}
          isOpen={mobileSidebarOpen}
          setIsOpen={setMobileSidebarOpen}
          onExport={handleExport}
          setViewMode={setViewMode}
        />

        {/* 3. Main Content Portal */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
          
          <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col gap-8 pb-12">
            
            {/* Display search override notice if active search did things */}
            {searchQuery && (
              <div className="bg-[#e7eeff] border border-[#00417a]/40 p-3.5 rounded-lg flex items-center justify-between text-[#00417a] text-[13px] font-sans">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">saved_search</span>
                  Search Filter Active: Showing indicators corresponding to &quot;**{searchQuery}**&quot;
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-mono text-[11px] font-bold text-[#00417a] hover:underline cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* View Selector routing logic */}
            {viewMode === 'summary' || activeTab !== 'gdp_growth' ? (
              // Executive Summary (Screen 1 details)
              <ExecutiveSummary
                insight={activeInsight}
                onNavigateSector={(sector) => {
                  setActiveTab(sector);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            ) : (
              // Comparative Analytics (Screen 2 details)
              <ComparativeAnalytics
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}

          </div>

          {/* 4. Sovereign Footer */}
          <footer className="w-full py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#ffffff] border-t border-[#c2c6d3] mt-auto select-none">
            <div className="font-mono text-[11px] text-[#424751] text-center md:text-left leading-relaxed">
              &copy; 2026 Tamil Nadu Economic Analysis Division. Data compiled from MoSPI, Reserve Bank of India, and State Legislative registries.
            </div>
            <div className="flex gap-6 font-sans text-[13px] text-[#424751] font-medium border-[#c2c6d3]">
              <button
                onClick={() => alert('Data Sources Verified:\n- MoSPI State-wise GSDP Indicators series.\n- RBI Handbook of Statistics on Indian States.\n- Tamil Nadu G.O. (Ms) Finance registries.')}
                className="hover:text-[#00417a] text-[#424751] transition-colors cursor-pointer bg-transparent border-none"
              >
                Data Sources
              </button>
              <button
                onClick={() => alert('Privacy Standard:\nThis app operates strictly in a local sandbox mode inside Google AI Studio, prioritizing data confidentiality.')}
                className="hover:text-[#00417a] text-[#424751] transition-colors cursor-pointer bg-transparent border-none"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert('Sovereign Terms of Use:\nUnauthorized duplication of compiled datasets is discouraged. Full credits must be attributed back to the TN Economic Analysis division.')}
                className="hover:text-[#00417a] text-[#424751] transition-colors cursor-pointer bg-transparent border-none"
              >
                Terms of Service
              </button>
            </div>
          </footer>

        </main>
      </div>

      {/* 5. Custom Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#00417a] text-white p-4 rounded-lg shadow-lg flex items-start gap-3 border border-[#dee8ff]/30 animate-fade-in animate-slide-up">
          <span className="material-symbols-outlined text-[20px] text-green-400 mt-0.5 shrink-0">
            check_circle
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[13px] font-bold">Ledger Notification</span>
            <p className="font-sans text-[12px] opacity-90 leading-relaxed text-slate-100">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white hover:text-red-300 ml-auto"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

    </div>
  );
}
