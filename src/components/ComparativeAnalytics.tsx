import React, { useState, useMemo } from 'react';
import { 
  gdpHistoricalData, 
  infrastructureScores, 
  educationEnrolmentData, 
  defaultSectoralContribution 
} from '../data';
import { GDPSeriesPoint, SectorContribution } from '../types';

interface ComparativeAnalyticsProps {
  viewMode: 'summary' | 'comparative';
  setViewMode: (mode: 'summary' | 'comparative') => void;
}

export default function ComparativeAnalytics({
  viewMode,
  setViewMode
}: ComparativeAnalyticsProps) {
  // Filters States
  const [timeline, setTimeline] = useState<'all' | '10y' | '5y'>('all');
  const [adminTerm, setAdminTerm] = useState<'All' | 'A' | 'B' | 'C'>('All');
  
  // States selected for comparative averaging
  const [comparisonStates, setComparisonStates] = useState({
    gujarat: true,
    maharashtra: true,
    karnataka: true,
  });

  const [statesDropdownOpen, setStatesDropdownOpen] = useState(false);

  // Table sorting states
  const [sortField, setSortField] = useState<'sector' | 'share' | 'growth'>('share');
  const [sortAscending, setSortAscending] = useState(false);

  // Clickable drilldown details
  const [selectedSubSector, setSelectedSubSector] = useState<string | null>(null);

  // Filter comparison GDP data dynamically based on selections
  const filteredGDPData = useMemo(() => {
    let data = [...gdpHistoricalData];

    // Filter by timeline range
    if (timeline === '10y') {
      data = data.filter(d => d.year >= 2014);
    } else if (timeline === '5y') {
      data = data.filter(d => d.year >= 2019);
    }

    // Filter by government admin term
    if (adminTerm !== 'All') {
      data = data.filter(d => d.term === adminTerm);
    }

    // Adjust peer comparison line scale depending on active checkboxes (Gujarat, Maharashtra, Karnataka)
    const activeStatesCount = Object.values(comparisonStates).filter(Boolean).length;
    const factorMultiplier = activeStatesCount === 3 
      ? 1.0 
      : activeStatesCount === 2 
        ? 0.93 
        : activeStatesCount === 1 
          ? 0.81 
          : 0.6; // lower average if everything is disabled

    return data.map(d => ({
      ...d,
      averageOthers: Number((d.averageOthers * factorMultiplier).toFixed(2))
    }));
  }, [timeline, adminTerm, comparisonStates]);

  // Sectoral data sorting
  const sortedContributions = useMemo(() => {
    const list = [...defaultSectoralContribution];
    list.sort((a, b) => {
      let valA: any = a[sortField === 'sector' ? 'sector' : sortField === 'share' ? 'share' : 'yoyGrowth'];
      let valB: any = b[sortField === 'sector' ? 'sector' : sortField === 'share' ? 'share' : 'yoyGrowth'];
      
      if (typeof valA === 'string') {
        return sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAscending ? valA - valB : valB - valA;
    });
    return list;
  }, [sortField, sortAscending]);

  // Handle table header click to sort
  const triggerSort = (field: 'sector' | 'share' | 'growth') => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(false);
    }
  };

  // Live mouse hover tooltip inside line chart
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header with interactive tab toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c2c6d3] pb-4">
        <div>
          <h1 className="font-sans text-[28px] font-bold text-[#00417a]">Comparative Analytics Dashboard</h1>
          <p className="font-sans text-[14px] text-[#424751] mt-1">
            Evaluate Tamil Nadu&apos;s macroeconomic indicators against national averages and competitive industrial states.
          </p>
        </div>
        <div className="flex bg-[#dee8ff] p-1 rounded-lg self-start shrink-0">
          <button
            id="comp-mode-summary-btn"
            onClick={() => setViewMode('summary')}
            className={`px-3 py-1 text-[11px] font-mono font-medium rounded transition-all cursor-pointer ${
              viewMode === 'summary' ? 'bg-[#ffffff] text-[#00417a] shadow-sm' : 'text-[#424751] hover:text-[#00417a]'
            }`}
          >
            ← Summary View
          </button>
          <button
            id="comp-mode-comparative-btn"
            onClick={() => setViewMode('comparative')}
            className={`px-3 py-1 text-[11px] font-mono font-medium rounded transition-all cursor-pointer ${
              viewMode === 'comparative' ? 'bg-[#ffffff] text-[#00417a] shadow-sm' : 'text-[#424751] hover:text-[#00417a]'
            }`}
          >
            Comparative View
          </button>
        </div>
      </div>

      {/* 1. Filter Bar */}
      <div className="bg-[#ffffff] border border-[#c2c6d3] rounded-lg p-5 shadow-xs flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00417a]">filter_list</span>
          <h3 className="font-sans text-[18px] font-bold text-[#00417a]">Comparative Filters</h3>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Timeline Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
            <label className="font-mono text-[11px] font-bold text-[#424751]">Timeline</label>
            <select
              id="filter-timeline-select"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as any)}
              className="bg-[#f0f3ff] border border-[#c2c6d3] rounded px-2.5 py-1.5 font-sans text-[13px] text-[#111c2d] focus:border-[#00417a] focus:ring-0 cursor-pointer"
            >
              <option value="all">2004 - 2024 (20 Years)</option>
              <option value="10y">2014 - 2024 (10 Years)</option>
              <option value="5y">2019 - 2024 (5 Years)</option>
            </select>
          </div>

          {/* Government Administration Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[190px]">
            <label className="font-mono text-[11px] font-bold text-[#424751]">Government Administration</label>
            <select
              id="filter-admin-select"
              value={adminTerm}
              onChange={(e) => setAdminTerm(e.target.value as any)}
              className="bg-[#f0f3ff] border border-[#c2c6d3] rounded px-2.5 py-1.5 font-sans text-[13px] text-[#111c2d] focus:border-[#00417a] focus:ring-0 cursor-pointer"
            >
              <option value="All">All Legislative Terms</option>
              <option value="A">Term A (2006-2011)</option>
              <option value="B">Term B (2011-2021)</option>
              <option value="C">Term C (2021-Present)</option>
            </select>
          </div>

          {/* Comparison States Multiselect custom dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[210px] relative">
            <label className="font-mono text-[11px] font-bold text-[#424751]">Comparison States</label>
            <button
              id="filter-states-dropdown-btn"
              type="button"
              onClick={() => setStatesDropdownOpen(!statesDropdownOpen)}
              className="bg-[#f0f3ff] border border-[#c2c6d3] rounded px-2.5 py-1.5 font-sans text-[13px] text-[#111c2d] flex justify-between items-center cursor-pointer text-left w-full sm:w-56"
            >
              <span className="truncate">
                {Object.entries(comparisonStates)
                  .filter(([_, active]) => active)
                  .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
                  .join(', ') || 'No States Selected'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#424751] ml-2">
                arrow_drop_down
              </span>
            </button>

            {statesDropdownOpen && (
              <div className="absolute top-[58px] left-0 w-full sm:w-56 bg-white border border-[#c2c6d3] rounded shadow-lg p-3 z-50 flex flex-col gap-2">
                <span className="font-mono text-[10px] text-[#727782] uppercase mb-1">State Comparators</span>
                <label className="flex items-center gap-2 text-[13px] text-[#111c2d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={comparisonStates.maharashtra}
                    onChange={(e) => setComparisonStates({ ...comparisonStates, maharashtra: e.target.checked })}
                    className="rounded border-[#c2c6d3] text-[#00417a]"
                  />
                  Maharashtra (MH)
                </label>
                <label className="flex items-center gap-2 text-[13px] text-[#111c2d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={comparisonStates.gujarat}
                    onChange={(e) => setComparisonStates({ ...comparisonStates, gujarat: e.target.checked })}
                    className="rounded border-[#c2c6d3] text-[#00417a]"
                  />
                  Gujarat (GJ)
                </label>
                <label className="flex items-center gap-2 text-[13px] text-[#111c2d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={comparisonStates.karnataka}
                    onChange={(e) => setComparisonStates({ ...comparisonStates, karnataka: e.target.checked })}
                    className="rounded border-[#c2c6d3] text-[#00417a]"
                  />
                  Karnataka (KA)
                </label>
                <button
                  type="button"
                  onClick={() => setStatesDropdownOpen(false)}
                  className="mt-2 py-1 bg-[#00417a] text-white text-[11px] rounded font-bold hover:bg-[#0058a3]"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. State GDP Trends Line Chart */}
      <div className="bg-[#ffffff] border border-[#c2c6d3] rounded-lg shadow-xs p-6 flex flex-col justify-between h-[480px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-[#00417a] mb-1">
              State GDP Trends (Constant Prices)
            </h3>
            <p className="font-sans text-[13px] text-[#424751]">
              Analyzing Gross State Domestic Product trajectory (expressed in ₹ Lakh Crores) highlighted by administrative legislative periods.
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <span className="bg-[#505f76] text-white font-mono text-[10px] px-2 py-0.5 rounded leading-tight">Term A</span>
            <span className="bg-[#dee8ff] text-[#0b1c30] font-mono text-[10px] px-2 py-0.5 rounded border border-[#c2c6d3] leading-tight">Term B</span>
            <span className="bg-[#d4e3ff] text-[#004786] font-mono text-[10px] px-2 py-0.5 rounded leading-tight">Term C</span>
          </div>
        </div>

        {/* Shaded background regions for Legislative Terms */}
        <div className="flex-1 relative border-l border-b border-[#c2c6d3] h-64 mt-4">
          
          {/* Legislative Term Shade A (roughly Year 2004 to 2011) */}
          {adminTerm === 'All' && (
            <div className="absolute top-0 bottom-0 left-[0%] w-[35%] bg-[#ecf1ff] opacity-40 z-0 border-r border-dashed border-[#c2c6d3]/40">
              <span className="absolute top-2 left-2 font-mono text-[9px] font-bold text-[#505f76]">A</span>
            </div>
          )}
          {/* Legislative Term Shade B (roughly Year 2011 to 2021) */}
          {adminTerm === 'All' && (
            <div className="absolute top-0 bottom-0 left-[35%] w-[50%] bg-[#f0f3ff] opacity-60 z-0 border-r border-dashed border-[#c2c6d3]/40">
              <span className="absolute top-2 left-2 font-mono text-[9px] font-bold text-[#505f76]">B</span>
            </div>
          )}
          {/* Legislative Term Shade C (roughly Year 2021 to 2024) */}
          {adminTerm === 'All' && (
            <div className="absolute top-0 bottom-0 left-[85%] right-0 bg-[#e7eeff] opacity-40 z-0">
              <span className="absolute top-2 left-2 font-mono text-[9px] font-bold text-[#00417a]">C</span>
            </div>
          )}

          {/* SVG Line Chart */}
          <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {filteredGDPData.length > 1 && (
              <>
                {/* 1. Tamil Nadu solid path */}
                <path
                  d={filteredGDPData.reduce((acc, pt, idx) => {
                    const x = (idx / (filteredGDPData.length - 1)) * 100;
                    // Map ₹30L Cr to y=0, ₹0 to y=100
                    const y = 100 - (pt.tamilNadu / 30) * 100;
                    return acc + `${idx === 0 ? 'M' : 'L'}${x},${y}`;
                  }, '')}
                  fill="none"
                  stroke="#00417a"
                  strokeWidth="3"
                  className="transition-all duration-300 drop-shadow-md"
                />

                {/* 2. States Peer Average dashed path */}
                <path
                  d={filteredGDPData.reduce((acc, pt, idx) => {
                    const x = (idx / (filteredGDPData.length - 1)) * 100;
                    const y = 100 - (pt.averageOthers / 30) * 100;
                    return acc + `${idx === 0 ? 'M' : 'L'}${x},${y}`;
                  }, '')}
                  fill="none"
                  stroke="#727782"
                  strokeDasharray="4,4"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Interactive Hovver Dot & Dropdown Guidelines */}
                {hoverIndex !== null && filteredGDPData[hoverIndex] && (
                  (() => {
                    const pt = filteredGDPData[hoverIndex];
                    const x = (hoverIndex / (filteredGDPData.length - 1)) * 100;
                    const tnY = 100 - (pt.tamilNadu / 30) * 100;
                    const peerY = 100 - (pt.averageOthers / 30) * 100;
                    return (
                      <>
                        {/* Guideline line */}
                        <line x1={x} y1="0" x2={x} y2="100" stroke="#c2c6d3" strokeWidth="1" strokeDasharray="2,2" />
                        
                        {/* TN dot */}
                        <circle cx={x} cy={tnY} r="5.5" fill="#00417a" stroke="#ffffff" strokeWidth="2" />
                        
                        {/* Peer dot */}
                        <circle cx={x} cy={peerY} r="5.5" fill="#727782" stroke="#ffffff" strokeWidth="2" />
                      </>
                    );
                  })()
                )}
              </>
            )}
          </svg>

          {/* Hidden Mouse Interceptor zones for tooltip feedback */}
          <div className="absolute inset-0 z-20 flex">
            {filteredGDPData.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-full cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            ))}
          </div>

          {/* Interactive Mouse Hover Tooltip Box */}
          {hoverIndex !== null && filteredGDPData[hoverIndex] && (
            <div
              className={`absolute z-30 bg-white border border-[#c2c6d3] rounded shadow-md p-3 font-sans text-[12px] flex flex-col gap-1 pointer-events-none transition-all duration-100`}
              style={{
                left: `${Math.min(Math.max((hoverIndex / (filteredGDPData.length - 1)) * 100 - 8, 2), 75)}%`,
                top: '20%'
              }}
            >
              <span className="font-mono text-[11px] font-bold text-[#111c2d]">
                Year {filteredGDPData[hoverIndex].year}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00417a]" />
                <span className="font-medium text-[#00417a]">
                  Tamil Nadu: ₹{filteredGDPData[hoverIndex].tamilNadu}L Cr
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#424751]">
                <div className="w-2 h-2 rounded-full bg-[#727782]" />
                <span>
                  States Avg: ₹{filteredGDPData[hoverIndex].averageOthers}L Cr
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#727782] text-right">
                Term {filteredGDPData[hoverIndex].term} legislative
              </span>
            </div>
          )}

          {/* Y Axis Grid lines & Labels */}
          <div className="absolute top-0 bottom-0 -left-14 flex flex-col justify-between items-end font-mono text-[11px] font-medium text-[#424751] h-full pointer-events-none select-none">
            <span>₹30L Cr</span>
            <span>₹20L Cr</span>
            <span>₹10L Cr</span>
            <span>₹0 Cr</span>
          </div>

          {/* Axis Grid markings */}
          <div className="absolute top-0 left-0 right-0 h-0.5 border-t border-dashed border-[#c2c6d3]/40 pointer-events-none" />
          <div className="absolute top-[33.3%] left-0 right-0 h-0.5 border-t border-dashed border-[#c2c6d3]/40 pointer-events-none" />
          <div className="absolute top-[66.6%] left-0 right-0 h-0.5 border-t border-dashed border-[#c2c6d3]/40 pointer-events-none" />
        </div>

        {/* X Axis Labels */}
        <div className="mt-2.5 flex justify-between pl-2 font-mono text-[11px] font-medium text-[#424751] select-none">
          {filteredGDPData.length > 5 ? (
            <>
              <span>{filteredGDPData[0].year}</span>
              <span>{filteredGDPData[Math.floor(filteredGDPData.length * 0.25)].year}</span>
              <span>{filteredGDPData[Math.floor(filteredGDPData.length * 0.5)].year}</span>
              <span>{filteredGDPData[Math.floor(filteredGDPData.length * 0.75)].year}</span>
              <span>{filteredGDPData[filteredGDPData.length - 1].year}</span>
            </>
          ) : (
            filteredGDPData.map(d => <span key={d.year}>{d.year}</span>)
          )}
        </div>

        {/* Legend Indicator row */}
        <div className="mt-8 flex justify-center gap-8 font-mono text-[11px] font-medium text-[#111c2d]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00417a]" />
            <span>Tamil Nadu GSDP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-transparent border-2 border-dashed border-[#727782] flex items-center justify-center" />
            <span className="text-[#424751]">Average of Selected States</span>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Infrastructure Index Comparison */}
        <div className="bg-[#ffffff] border border-[#c2c6d3] rounded-lg shadow-xs p-5 flex flex-col h-[380px] justify-between">
          <div>
            <h3 className="font-sans text-[16px] font-bold text-[#00417a]">
              Infrastructure Index Comparison
            </h3>
            <p className="font-sans text-[12px] text-[#424751] mt-1">
              Composite scores based on power capacity, logistic network spans, and port throughput index.
            </p>
          </div>

          <div id="infra-bar-chart" className="flex-1 flex items-end justify-around border-b border-[#c2c6d3] pb-2 mt-6 relative">
            
            {/* Horizontal guide grids */}
            <div className="absolute bottom-[20%] left-0 right-0 border-b border-dashed border-[#c2c6d3]/30 pointer-events-none" />
            <div className="absolute bottom-[50%] left-0 right-0 border-b border-dashed border-[#c2c6d3]/30 pointer-events-none" />
            <div className="absolute bottom-[80%] left-0 right-0 border-b border-dashed border-[#c2c6d3]/30 pointer-events-none" />

            {infrastructureScores.map((infra) => {
              const isTN = infra.state === 'TN';
              const heightPercentage = infra.score;
              return (
                <div key={infra.state} className="flex flex-col items-center gap-2 group cursor-pointer w-12">
                  <div className="font-mono text-[10px] text-[#727782] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {infra.score} pts
                  </div>
                  <div
                    className={`w-full rounded-t transition-all duration-300 relative overflow-hidden
                      ${isTN ? 'bg-[#00417a] shadow-xs' : 'bg-[#b7c8e1] hover:bg-[#a5c8ff]'}`}
                    style={{ height: `${heightPercentage}%` }}
                  >
                    {/* Animated vertical load effect */}
                    <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                  </div>
                  <span className={`font-mono text-[11px] font-bold uppercase ${isTN ? 'text-[#00417a]' : 'text-[#424751]'}`}>
                    {infra.state}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="pt-2 text-center">
            <span className="font-sans text-[11px] text-[#727782]">Scores plotted on 100-point composite capacity benchmark</span>
          </div>
        </div>

        {/* Right: Higher Education Gross Enrolment */}
        <div className="bg-[#ffffff] border border-[#c2c6d3] rounded-lg shadow-xs p-5 flex flex-col h-[380px] justify-between">
          <div>
            <h3 className="font-sans text-[16px] font-bold text-[#00417a]">
              Higher Education Gross Enrolment
            </h3>
            <p className="font-sans text-[12px] text-[#424751] mt-1">
              Percentage of the eligible demographic registered in state higher educational organizations.
            </p>
          </div>

          <div id="education-horizontal-chart" className="flex-1 flex flex-col justify-around mt-6 pl-2 border-l border-[#c2c6d3]">
            {educationEnrolmentData.map((edu) => {
              const isTN = edu.state === 'TN';
              return (
                <div key={edu.state} className="flex items-center gap-4 group">
                  <span className={`w-8 font-mono text-[11px] font-bold uppercase transition-colors ${isTN ? 'text-[#00417a]' : 'text-[#424751]'}`}>
                    {edu.state}
                  </span>
                  
                  {/* Progress Bar Track */}
                  <div className="flex-1 h-6 bg-[#dee8ff] rounded-r relative overflow-hidden shadow-xs hover:border-[#00417a] border border-transparent transition-all">
                    <div
                      className={`absolute top-0 left-0 bottom-0 rounded-r transition-all duration-700
                        ${isTN ? 'bg-[#00417a]' : 'bg-[#505f76]'}`}
                      style={{ width: `${edu.percentage}%` }}
                    />
                    <div className="absolute inset-x-0 inset-y-0.5 flex items-center justify-end pr-2 pointer-events-none">
                      <span className="font-mono text-[10px] text-[#111c2d] font-bold leading-none bg-white/70 px-1.5 py-0.5 rounded shadow-xs">
                        {edu.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <span className="font-sans text-[11px] text-[#727782]">Latest census survey findings</span>
          </div>
        </div>
      </div>

      {/* 4. Drill-Down Table */}
      <div className="bg-[#ffffff] border border-[#c2c6d3] rounded-lg shadow-xs overflow-hidden">
        
        {/* Table header menu bar */}
        <div className="p-5 border-b border-[#c2c6d3] flex justify-between items-center bg-[#f9f9ff]">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-[#00417a]">
              Sectoral Contribution to GSDP
            </h3>
            <p className="font-sans text-[12px] text-[#424751] mt-1">
              Economic activity share and annual growth parameters. Click sector rows to drill down into structural drivers.
            </p>
          </div>
          <button
            onClick={() => {
              setSortField('share');
              setSortAscending(false);
              alert('Grid Resets complete: Sorted by descending GSDP share.');
            }}
            className="px-3 py-1.5 border border-[#c2c6d3] rounded hover:bg-[#e7eeff] text-[#424751] hover:text-[#00417a] transition-all flex items-center gap-1 cursor-pointer bg-white"
            title="Options Menu"
          >
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            <span className="font-sans text-[11px] font-bold">Options</span>
          </button>
        </div>

        {/* Dense Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f0f3ff] border-b border-[#c2c6d3] select-none text-[12px]">
                
                {/* Sector header (Clickable) */}
                <th
                  onClick={() => triggerSort('sector')}
                  className="py-3 px-6 font-mono font-bold text-[#424751] uppercase tracking-wider cursor-pointer hover:bg-[#dee8ff] hover:text-[#00417a] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sector</span>
                    {sortField === 'sector' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAscending ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>

                {/* Share header (Clickable) */}
                <th
                  onClick={() => triggerSort('share')}
                  className="py-3 px-6 font-mono font-bold text-[#424751] uppercase tracking-wider cursor-pointer hover:bg-[#dee8ff] hover:text-[#00417a] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Share of GSDP (%)</span>
                    {sortField === 'share' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAscending ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>

                {/* YoY Growth header (Clickable) */}
                <th
                  onClick={() => triggerSort('growth')}
                  className="py-3 px-6 font-mono font-bold text-[#424751] uppercase tracking-wider cursor-pointer hover:bg-[#dee8ff] hover:text-[#00417a] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>YoY Growth (%)</span>
                    {sortField === 'growth' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAscending ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>

                {/* Key Driver header */}
                <th className="py-3 px-6 font-mono font-bold text-[#424751] uppercase tracking-wider">
                  Key Driver &amp; Focus Focus
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="font-sans text-[14px] text-[#111c2d] divide-y divide-[#c2c6d3]/40">
              {sortedContributions.map((contrib) => {
                const isExpanded = selectedSubSector === contrib.sector;
                return (
                  <React.Fragment key={contrib.sector}>
                    <tr
                      onClick={() => setSelectedSubSector(isExpanded ? null : contrib.sector)}
                      className="hover:bg-[#f0f3ff] transition-colors cursor-pointer group select-none"
                    >
                      <td className="py-4 px-6 font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#dee8ff] flex items-center justify-center text-[#00417a] group-hover:bg-[#00417a] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px]">
                            {contrib.iconName}
                          </span>
                        </div>
                        <span className="font-bold text-[#00417a] group-hover:underline">
                          {contrib.sector}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold">
                        {contrib.share}%
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-[#0058a3] font-bold">
                        +{contrib.yoyGrowth}%
                      </td>
                      <td className="py-4 px-6 text-[#424751] text-[13px] flex items-center justify-between gap-2">
                        <span>{contrib.keyDriver}</span>
                        <span className="material-symbols-outlined text-[16px] text-[#727782] group-hover:text-[#00417a] transition-colors">
                          {isExpanded ? 'stat_minus_1' : 'stat_1'}
                        </span>
                      </td>
                    </tr>

                    {/* Drilled down Subsector Drawer Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={4} className="bg-[#f0f3ff] px-8 py-5 border-l-4 border-[#00417a] animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Panel 1: Structural Context */}
                            <div className="flex flex-col gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-[#00417a] uppercase tracking-wider">
                                Structural Analysis
                              </span>
                              <h4 className="font-sans text-[14px] font-bold text-[#111c2d] mb-1">
                                {contrib.sector} Context
                              </h4>
                              <p className="font-sans text-[12px] text-[#424751] leading-relaxed">
                                Under policy cycle projections, **{contrib.sector}** acts as a structural anchor, carrying a net GSDP slice of {contrib.share}%. Current allocations seek targeted employment multipliers.
                              </p>
                            </div>

                            {/* Panel 2: Catalyst Action Items */}
                            <div className="flex flex-col gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-[#00417a] uppercase tracking-wider">
                                Catalyst Milestones
                              </span>
                              <h4 className="font-sans text-[14px] font-bold text-[#111c2d] mb-1">
                                Key Legislative Drivers
                              </h4>
                              <p className="font-sans text-[12px] text-[#424751] leading-relaxed">
                                Core operations centered alongside *{contrib.keyDriver}*. State subsidies under write-ups seek to preserve stable growth levels exceeding 8.5% YoY.
                              </p>
                            </div>

                            {/* Panel 3: Technical Rating */}
                            <div className="bg-white border border-[#c2c6d3] p-4 rounded-lg flex flex-col justify-between">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[11px] font-bold text-[#505f76]">State rating</span>
                                <span className="inline-block bg-[#dee8ff] text-[#00417a] text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold">
                                  Grade A+ Alpha
                                </span>
                              </div>
                              <div className="text-[12px] text-[#111c2d] font-sans mt-2">
                                Projected trajectory remains highly robust, insulated from immediate macro fluctuations.
                              </div>
                              <button
                                onClick={() => alert(`Detailed ledger print triggered for ${contrib.sector}.`)}
                                className="mt-4 w-full py-1 text-[11px] text-center text-[#ffffff] bg-[#00417a] rounded hover:bg-[#0058a3] transition-colors"
                              >
                                Request Ledger Output
                              </button>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
