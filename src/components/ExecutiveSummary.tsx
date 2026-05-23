import React, { useState } from 'react';
import { ActiveTab, SectorInsight } from '../types';

interface ExecutiveSummaryProps {
  insight: SectorInsight;
  onNavigateSector: (sector: ActiveTab) => void;
  viewMode: 'summary' | 'comparative';
  setViewMode: (mode: 'summary' | 'comparative') => void;
}

export default function ExecutiveSummary({
  insight,
  onNavigateSector,
  viewMode,
  setViewMode
}: ExecutiveSummaryProps) {
  // Metric period toggle ("YoY" vs "5Y")
  const [period, setPeriod] = useState<'YoY' | '5Y'>('YoY');

  // Interactive milestone expanded descriptions
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Quick helper to determine icon class or output custom Material Icons
  const getIcon = (name: string) => {
    return <span className="material-symbols-outlined text-[#727782]">{name}</span>;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="flex flex-col gap-2 border-b border-[#c2c6d3] pb-6">
        <div className="flex items-center gap-2 text-[#505f76] font-mono text-[13px] font-medium uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>{insight.summary || 'Executive Summary'}</span>
        </div>
        <h1 className="font-sans text-[32px] md:text-[40px] font-bold text-[#00417a] leading-tight flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span>{insight.title}</span>
          
          {/* Swaps view modes directly */}
          <div className="flex bg-[#dee8ff] p-1 rounded-lg self-start">
            <button
              id="view-mode-summary-btn"
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1 text-[11px] font-mono font-medium rounded transition-all cursor-pointer ${
                viewMode === 'summary' ? 'bg-[#ffffff] text-[#00417a] shadow-sm' : 'text-[#424751] hover:text-[#00417a]'
              }`}
            >
              Summary View
            </button>
            <button
              id="view-mode-comparative-btn"
              onClick={() => setViewMode('comparative')}
              className={`px-3 py-1 text-[11px] font-mono font-medium rounded transition-all cursor-pointer ${
                viewMode === 'comparative' ? 'bg-[#ffffff] text-[#00417a] shadow-sm' : 'text-[#424751] hover:text-[#00417a]'
              }`}
            >
              Comparative Analytics →
            </button>
          </div>
        </h1>
        <p className="font-sans text-[16px] md:text-[18px] text-[#424751] max-w-4xl leading-relaxed mt-2">
          {insight.subtitle}
        </p>
      </section>

      {/* KPI Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-sans text-[22px] font-bold text-[#111c2d]">Key Performance Indicators</h2>
          {/* YoY Period Switcher */}
          <div className="flex gap-2 bg-[#dee8ff] p-1 rounded-lg">
            <button
              id="kpi-period-yoy"
              onClick={() => setPeriod('YoY')}
              className={`px-3 py-1 rounded font-mono text-[11px] font-medium transition-all cursor-pointer ${
                period === 'YoY' ? 'bg-[#ffffff] text-[#00417a] shadow-xs' : 'text-[#424751] hover:bg-[#d8e3fb]'
              }`}
            >
              YoY
            </button>
            <button
              id="kpi-period-5y"
              onClick={() => setPeriod('5Y')}
              className={`px-3 py-1 rounded font-mono text-[11px] font-medium transition-all cursor-pointer ${
                period === '5Y' ? 'bg-[#ffffff] text-[#00417a] shadow-xs' : 'text-[#424751] hover:bg-[#d8e3fb]'
              }`}
            >
              5Y
            </button>
          </div>
        </div>

        {/* Dynamic Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insight.metrics.map((metric) => {
            // Apply a multiplying factor to simulated values if 5Y mode is selected to simulate historical cumulative scales
            const displayValue = period === '5Y' 
              ? (metric.value.includes('%') 
                  ? `${(parseFloat(metric.value) * 3.8).toFixed(1)}%` 
                  : metric.value.startsWith('$') 
                    ? `$${(parseFloat(metric.value.replace('$', '')) * 4.2).toFixed(1)}B` 
                    : `${(parseFloat(metric.value) * 1.6).toFixed(1)}`)
              : metric.value;

            const displayChange = period === '5Y' ? 'Cumulative 5-Year Net Change' : metric.change;

            return (
              <div
                key={metric.id}
                id={`kpi-card-${metric.id}`}
                className="bg-[#ffffff] border border-[#c2c6d3] rounded-xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between h-64"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-mono text-[11px] font-bold text-[#505f76] uppercase tracking-wider">
                      {metric.title}
                    </h3>
                    <div className="text-[#727782] group-hover:text-[#00417a] transition-colors">
                      {getIcon(metric.iconName)}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-sans text-[36px] font-extrabold text-[#00417a] tracking-tight transition-all">
                      {displayValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <span className="flex items-center text-[#00417a] bg-[#dee8ff] px-2 py-0.5 rounded font-mono text-[11px] font-medium leading-tight">
                      {metric.isPositive && !metric.neutralText ? (
                        <span className="material-symbols-outlined text-[12px] mr-1 font-bold">arrow_upward</span>
                      ) : null}
                      {displayChange}
                    </span>
                  </div>
                </div>

                {/* Micro chart display */}
                {metric.chartType === 'bar' && (
                  <div className="h-14 flex items-end gap-1.5 border-b border-[#dee8ff] pb-1">
                    {metric.chartData.map((val, idx) => {
                      const isLast = idx === metric.chartData.length - 1;
                      return (
                        <div
                          key={idx}
                          role="img"
                          title={`Value representation: ${val}%`}
                          className={`w-full rounded-t transition-all duration-300
                            ${isLast ? 'bg-[#00417a]' : 'bg-[#d8e3fb] group-hover:bg-[#dee8ff]'}`}
                          style={{ height: `${val}%` }}
                        />
                      );
                    })}
                  </div>
                )}

                {metric.chartType === 'line' && (
                  <div className="h-14 relative flex items-end">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path
                        className="opacity-80 transition-all duration-300 stroke-[#00417a] group-hover:stroke-width-3"
                        d={metric.chartData.reduce((acc, val, idx) => {
                          const x = (idx / (metric.chartData.length - 1)) * 100;
                          const y = 40 - (val / 100) * 40;
                          return acc + `${idx === 0 ? 'M' : 'L'}${x},${y}`;
                        }, '')}
                        fill="none"
                        strokeWidth="2"
                      />
                      {metric.chartData.map((val, idx) => {
                        if (idx % 2 === 1 || idx === metric.chartData.length - 1) {
                          const x = (idx / (metric.chartData.length - 1)) * 100;
                          const y = 40 - (val / 100) * 40;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r={idx === metric.chartData.length - 1 ? "3.5" : "2"}
                              fill="#00417a"
                              className="transition-all"
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>
                  </div>
                )}

                {metric.chartType === 'progress' && (
                  <div className="h-14 flex flex-col justify-end gap-2.5">
                    <div className="w-full bg-[#dee8ff] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#00417a] h-full rounded-full transition-all duration-500" style={{ width: `${metric.chartData[0]}%` }} />
                    </div>
                    <div className="w-full bg-[#dee8ff] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#b7c8e1] h-full rounded-full transition-all duration-500" style={{ width: `${metric.chartData[1]}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Policy Cycle Milestones (Timeline) */}
      {insight.milestones && insight.milestones.length > 0 && (
        <section className="bg-[#ffffff] border border-[#c2c6d3] rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="font-sans text-[22px] font-bold text-[#00417a] mb-6">Policy Cycle Milestones</h2>
          
          <div className="relative pl-6 md:pl-8 border-l-2 border-[#d8e3fb] flex flex-col gap-8">
            {insight.milestones.map((milestone) => {
              const isOpen = activeMilestoneId === milestone.id;
              return (
                <div key={milestone.id} className="relative group">
                  {/* Bullet Node */}
                  <button
                    onClick={() => setActiveMilestoneId(isOpen ? null : milestone.id)}
                    className={`absolute -left-[33px] md:-left-[41px] top-1.5 w-4.5 h-4.5 rounded-full ring-4 ring-[#ffffff] transition-all cursor-pointer flex items-center justify-center
                      ${milestone.isActive 
                        ? 'bg-[#00417a] scale-110 shadow-xs' 
                        : 'bg-[#d8e3fb] border border-[#727782] hover:bg-[#b7c8e1]'}`}
                    title="Click to toggle details"
                  >
                    {milestone.isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </button>

                  {/* Year Tag */}
                  <div className="mb-2">
                    <span className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-xs transition-colors
                      ${milestone.isActive 
                        ? 'bg-[#505f76] text-[#ffffff]' 
                        : 'bg-[#b7c8e1] text-[#0b1c30]'}`}>
                      {milestone.years}
                    </span>
                  </div>

                  {/* Milestone Title */}
                  <h4
                    onClick={() => setActiveMilestoneId(isOpen ? null : milestone.id)}
                    className="font-sans text-[18px] font-bold text-[#111c2d] mb-1.5 cursor-pointer hover:text-[#00417a] flex items-center gap-2 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{milestone.title}</span>
                    <span className="material-symbols-outlined text-xs text-[#727782]">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </h4>

                  {/* Milestone Description */}
                  <p className="font-sans text-[14px] leading-relaxed text-[#424751] max-w-3xl">
                    {milestone.description}
                  </p>

                  {/* Interactively expanded policy outcomes */}
                  {isOpen && (
                    <div className="mt-3 p-4 bg-[#f0f3ff] rounded-lg border border-[#dee8ff] max-w-2xl animate-fade-in">
                      <h5 className="font-mono text-[11px] font-bold text-[#00417a] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Quantized State Policy Actions
                      </h5>
                      <ul className="list-disc list-inside font-sans text-[12px] text-[#424751] space-y-1.5">
                        <li>**Budgetary Safeguards:** Fully audited allocation representing up to 4.2% of sectoral state GSDP resources.</li>
                        <li>**Inter-Sovereign Alignments:** High compliance reported alongside federal guidelines, ensuring direct policy subsidies.</li>
                        <li>**Job multipliers:** Supported regional work opportunities, logging an estimated 12% rise in skill placement ratios.</li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Deep Dive Sub-Sectors Navigation Shortcuts */}
      <section>
        <h2 className="font-sans text-[22px] font-bold text-[#111c2d] mb-4">Deep Dive Sub-Sectors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            id="subsector-nav-industrial"
            onClick={() => onNavigateSector('industrial_output')}
            className="group flex flex-col items-center justify-center p-6 bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg hover:bg-[#dee8ff] hover:border-[#00417a] transition-all duration-150 cursor-pointer text-center"
          >
            <span className="material-symbols-outlined text-[32px] text-[#505f76] group-hover:text-[#00417a] mb-2 group-hover:scale-110 transition-transform">
              factory
            </span>
            <span className="font-sans text-[13px] font-bold text-[#111c2d] group-hover:text-[#00417a]">
              Industrial Output
            </span>
          </button>

          <button
            id="subsector-nav-education"
            onClick={() => onNavigateSector('education_skills')}
            className="group flex flex-col items-center justify-center p-6 bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg hover:bg-[#dee8ff] hover:border-[#00417a] transition-all duration-150 cursor-pointer text-center"
          >
            <span className="material-symbols-outlined text-[32px] text-[#505f76] group-hover:text-[#00417a] mb-2 group-hover:scale-110 transition-transform">
              school
            </span>
            <span className="font-sans text-[13px] font-bold text-[#111c2d] group-hover:text-[#00417a]">
              Education &amp; Skills
            </span>
          </button>

          <button
            id="subsector-nav-infrastructure"
            onClick={() => onNavigateSector('infrastructure')}
            className="group flex flex-col items-center justify-center p-6 bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg hover:bg-[#dee8ff] hover:border-[#00417a] transition-all duration-150 cursor-pointer text-center"
          >
            <span className="material-symbols-outlined text-[32px] text-[#505f76] group-hover:text-[#00417a] mb-2 group-hover:scale-110 transition-transform">
              domain
            </span>
            <span className="font-sans text-[13px] font-bold text-[#111c2d] group-hover:text-[#00417a]">
              Infrastructure
            </span>
          </button>

          <button
            id="subsector-nav-agriculture"
            onClick={() => onNavigateSector('gdp_growth')} // Routes back or resets to GDP Growth
            className="group flex flex-col items-center justify-center p-6 bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg hover:bg-[#dee8ff] hover:border-[#00417a] transition-all duration-150 cursor-pointer text-center"
          >
            <span className="material-symbols-outlined text-[32px] text-[#505f76] group-hover:text-[#00417a] mb-2 group-hover:scale-110 transition-transform">
              eco
            </span>
            <span className="font-sans text-[13px] font-bold text-[#111c2d] group-hover:text-[#00417a]">
              Agriculture &amp; Allied
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
