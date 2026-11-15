import React from 'react';
import { ClipboardPlus, CalendarDays, AlertTriangle, BarChart3 } from 'lucide-react';
import { UserAccount } from '../types';

export type TabType = 'pengajuan' | 'jadwal' | 'temuan' | 'dash';

interface NavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  pendingJadwalCount?: number;
  temuanCount?: number;
  currentUser?: UserAccount;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  pendingJadwalCount = 0,
  temuanCount = 0,
  currentUser,
}) => {
  const isStaff = currentUser?.role === 'STAFF_BC';

  const allTabs: Array<{ id: TabType; label: string; shortLabel: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'pengajuan',
      label: '1. Input Pengajuan',
      shortLabel: 'Pengajuan',
      icon: <ClipboardPlus className="w-4 h-4" />,
    },
    {
      id: 'jadwal',
      label: '2. Jadwal Monitoring',
      shortLabel: 'Jadwal',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: pendingJadwalCount > 0 ? pendingJadwalCount : undefined,
    },
    {
      id: 'temuan',
      label: '3. Temuan Lapangan',
      shortLabel: 'Temuan',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: temuanCount > 0 ? temuanCount : undefined,
    },
    {
      id: 'dash',
      label: '4. Dashboard',
      shortLabel: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  // Staff BC cannot view Dashboard
  const tabs = isStaff ? allTabs.filter((t) => t.id !== 'dash') : allTabs;


  return (
    <>
      {/* Desktop & Tablet Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-[65px] z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all touch-manipulation cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-900 bg-slate-50/80 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      tab.id === 'temuan' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Bar for Ergonomic Thumb Access */}
      <nav aria-label="Navigasi Mobile" className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-40 px-2 py-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 touch-manipulation relative active:scale-95 ${
                isActive
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-300 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'text-blue-400 bg-blue-500/15' : 'text-slate-400'
                  }`}
                >
                  {tab.icon}
                </div>
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 px-1 min-w-[14px] h-[14px] text-[8px] font-black bg-rose-500 text-white rounded-full flex items-center justify-center border border-slate-900 leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
