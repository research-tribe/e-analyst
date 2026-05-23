import React, { useState } from 'react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  onMobileMenuToggle,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const notifications = [
    { id: 1, text: "FDI Inflows Q3 released: surge of +15% YoY logged in electronics.", time: "2 hrs ago", unread: true },
    { id: 2, text: "Policy cycle EV incentives active. Gigafactory allocation completed.", time: "1 day ago", unread: false },
    { id: 3, text: "GSDP updated to 8.2% following MoSPI revisions.", time: "3 days ago", unread: false }
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#f9f9ff] border-b border-[#c2c6d3] shadow-xs">
      {/* Brand Title / Hamburger controls */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu */}
        <button
          id="mobile-hamburger-btn"
          onClick={onMobileMenuToggle}
          className="md:hidden text-[#00417a] p-2 hover:bg-[#e7eeff] rounded-lg transition-colors focus:outline-none cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
            menu
          </span>
        </button>

        {/* Dynamic Title */}
        <div className="font-sans text-[20px] font-bold text-[#00417a] truncate tracking-tight">
          Tamil Nadu Economic Monitor
        </div>
      </div>

      {/* Center Subnav */}
      <nav className="hidden lg:flex gap-8 items-center">
        <button
          onClick={() => alert('Methodology Notes:\n- Data is calculated at Constant Prices (Base Year: 2011-12).\n- Fiscal representations are updated following RBI, MoSPI, and State Finance Department disclosures.')}
          className="font-sans text-[14px] text-[#424751] hover:text-[#00417a] transition-colors cursor-pointer font-medium bg-transparent border-none"
        >
          Methodology
        </button>
        <button
          onClick={() => alert('Economic Bulletins & Reports:\n- Q3 Fiscal Performance Analysis (PDF)\n- Annual State Economic Review (2023-24)\n- MSME Employment Catalyst Outcomes Report')}
          className="font-sans text-[14px] text-[#424751] hover:text-[#00417a] transition-colors cursor-pointer font-medium bg-transparent border-none"
        >
          Reports
        </button>
        <button
          onClick={() => alert('About this Monitor:\nCreated by the Tamil Nadu Economic Analysis Division to offer real-time insights for researchers, economists, and public policymakers tracking South Asia\'s industrial vanguard.')}
          className="font-sans text-[14px] text-[#424751] hover:text-[#00417a] transition-colors cursor-pointer font-medium bg-transparent border-none"
        >
          About
        </button>
      </nav>

      {/* Right Tools Row */}
      <div className="flex items-center gap-2">
        {/* Indicator Search bar */}
        <div className="relative hidden md:block">
          <input
            id="header-search-input"
            type="text"
            className="bg-[#f0f3ff] border border-[#c2c6d3] rounded px-3 py-1.5 pr-8 font-sans text-[13px] text-[#111c2d] placeholder-[#424751] focus:outline-none focus:border-[#00417a] focus:ring-1 focus:ring-[#00417a] w-48 transition-all"
            placeholder="Search indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-2 top-1.5 text-[#424751] pointer-events-none" style={{ fontSize: '18px' }}>
            search
          </span>
        </div>

        {/* Help tooltip toggle */}
        <div className="relative">
          <button
            id="header-help-btn"
            onClick={() => setHelpOpen(!helpOpen)}
            className="p-2 text-[#00417a] hover:bg-[#e7eeff] rounded-full transition-colors focus:outline-none cursor-pointer"
            title="Help Desk"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>help</span>
          </button>
          {helpOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-[#c2c6d3] shadow-md p-4 z-50">
              <h4 className="font-sans text-[14px] font-bold text-[#00417a] mb-1">Dashboard Help</h4>
              <p className="font-sans text-[12px] text-[#424751] leading-relaxed">
                Click tabs in the sidebar to review sector parameters. Use the **YoY / 5Y** toggle on summary cards or slide indicators in the comparative section to inspect twenty-year timelines.
              </p>
              <button
                onClick={() => setHelpOpen(false)}
                className="mt-3 text-[12px] text-[#00417a] font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Notifications Tray */}
        <div className="relative">
          <button
            id="header-notifications-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-[#00417a] hover:bg-[#e7eeff] rounded-full transition-colors relative focus:outline-none cursor-pointer"
            title="Sovereign Alerts"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-[#f9f9ff]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-[#c2c6d3] shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 bg-[#e7eeff] border-b border-[#c2c6d3] flex justify-between items-center">
                <span className="font-sans text-[13px] font-bold text-[#00417a]">Recent State Bulletins</span>
                <span className="font-sans text-[11px] text-[#424751]">3 Updates</span>
              </div>
              <ul className="divide-y divide-[#c2c6d3]/40">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`px-4 py-3 hover:bg-[#f0f3ff] transition-colors ${notif.unread ? 'bg-amber-50/40' : ''}`}>
                    <p className="font-sans text-[12px] text-[#111c2d] leading-normal">{notif.text}</p>
                    <span className="font-mono text-[10px] text-[#424751] mt-1 block">{notif.time}</span>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 border-t border-[#c2c6d3] bg-[#f9f9ff] text-center">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="font-sans text-[12px] text-[#00417a] font-bold hover:underline"
                >
                  Close Tray
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User initials profile mockup */}
        <div
          id="user-profile-avatar"
          onClick={() => alert(`Active Session:\n- Connected to Tamil Nadu Economic Core\n- Role: Economic Analyst\n- Email: ${localStorage.getItem('user_email') || 'monimation05@gmail.com'}`)}
          className="w-8 h-8 rounded-full bg-[#d8e3fb] border border-[#a5c8ff] flex items-center justify-center font-sans font-bold text-[#00417a] text-[12px] ml-2 cursor-pointer hover:scale-105 transition-transform"
          title="User Session Information"
        >
          TN
        </div>
      </div>
    </header>
  );
}
