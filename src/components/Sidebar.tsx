import { useState } from 'react';
import { LayoutDashboard, BookMarked, UserCheck, Sun, Moon, GraduationCap, Calendar, Activity, LogOut, PanelLeftOpen, PanelLeftClose, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDayTime: boolean;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'Subjects', icon: BookMarked },
  { id: 'exams', label: 'Exams', icon: Calendar },
  { id: 'grades', label: 'Grades', icon: GraduationCap },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
];

type SidebarMode = 'collapsed' | 'hover' | 'locked';

export function Sidebar({ activeTab, onTabChange, isDayTime, onLogout }: SidebarProps) {
  const [mode, setMode] = useState<SidebarMode>('hover');
  const [isHovered, setIsHovered] = useState(false);
  
  const isExpanded = mode === 'locked' || (mode === 'hover' && isHovered);
  
  const cycleMode = () => {
    if (mode === 'hover') setMode('locked');
    else if (mode === 'locked') setMode('collapsed');
    else setMode('hover');
  };
  
  const getModeIcon = () => {
    if (mode === 'locked') return Lock;
    if (mode === 'collapsed') return PanelLeftClose;
    return Unlock;
  };
  
  const getModeLabel = () => {
    if (mode === 'locked') return 'Locked Open';
    if (mode === 'collapsed') return 'Collapsed';
    return 'Auto Expand';
  };
  
  const ModeIcon = getModeIcon();

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen p-4 flex flex-col z-30 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-32'
      }`}
      onMouseEnter={() => mode === 'hover' && setIsHovered(true)}
      onMouseLeave={() => mode === 'hover' && setIsHovered(false)}
    >
      <div className={`rounded-3xl border shadow-2xl p-4 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
        isExpanded 
          ? 'glass-card border-white/20' 
          : 'bg-gradient-to-b from-teal-500/20 via-cyan-500/15 to-blue-500/20 backdrop-blur-xl border-teal-400/30'
      }`}>
        
        {/* Mode Toggle Button */}
        <div className="relative z-10 mb-4">
          <button
            onClick={cycleMode}
            className={`group w-full flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all duration-300 ${
              isExpanded 
                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-400/30' 
                : 'bg-white/5 hover:bg-white/10 border border-white/20'
            }`}
            title={getModeLabel()}
          >
            <ModeIcon className={`h-4 w-4 transition-all duration-300 ${
              isExpanded ? 'text-teal-300' : 'text-white/70 group-hover:text-white'
            }`} />
            {isExpanded && (
              <span className="text-xs text-white/80 font-medium">{getModeLabel()}</span>
            )}
            {isExpanded && (
              <div className="ml-auto flex gap-1">
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${mode === 'hover' ? 'bg-yellow-400 scale-125' : 'bg-white/20'}`} />
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${mode === 'locked' ? 'bg-green-400 scale-125' : 'bg-white/20'}`} />
                <span className={`w-1.5 h-1.5 rounded-full transition-all bg-white/20`} />
              </div>
            )}
          </button>
        </div>

        {/* Logo Section */}
        <div className={`relative z-10 mb-6 transition-all duration-300`}>
          {isExpanded ? (
            // Expanded Logo
            <div className="flex items-center gap-3 animate-slideInLeft">
              <div className="rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 w-12 h-12 flex items-center justify-center shadow-lg">
                <svg className="text-white h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21 L9 15 L12 18 L6 24 Z" fill="currentColor" opacity="0.9"/>
                  <rect x="10" y="3" width="3" height="14" rx="1.5" transform="rotate(45 11.5 10)" fill="currentColor" opacity="0.95"/>
                  <line x1="11" y1="8" x2="13" y2="10" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="12" y1="7" x2="14" y2="9" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="13" y1="6" x2="15" y2="8" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <path d="M8.5 15.5 L11.5 18.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl text-white leading-tight">
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold tracking-wider">
                    SPOP
                  </span>
                </h1>
                <p className="text-[10px] text-white/60 tracking-wide">Special Operations</p>
              </div>
            </div>
          ) : (
            // Collapsed Logo - Refined
            <div className="flex flex-col items-center gap-2 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 w-16 h-16 flex items-center justify-center shadow-xl shadow-teal-500/30 ring-2 ring-teal-400/20">
                <svg className="text-white h-9 w-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21 L9 15 L12 18 L6 24 Z" fill="currentColor" opacity="0.9"/>
                  <rect x="10" y="3" width="3" height="14" rx="1.5" transform="rotate(45 11.5 10)" fill="currentColor" opacity="0.95"/>
                  <line x1="11" y1="8" x2="13" y2="10" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="12" y1="7" x2="14" y2="9" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <line x1="13" y1="6" x2="15" y2="8" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                  <path d="M8.5 15.5 L11.5 18.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
                </svg>
              </div>
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative group">
                {isExpanded ? (
                  // Expanded Navigation Item
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/40 to-cyan-500/40 text-white shadow-lg shadow-teal-500/20 border border-teal-400/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-teal-300' : ''}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ) : (
                  // Collapsed Navigation Item - Beautiful Cards
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex flex-col items-center gap-2 py-3.5 px-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-b from-teal-500/30 to-cyan-500/30 shadow-xl shadow-teal-500/20 border-2 border-teal-400/50 scale-105'
                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-white/20 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-teal-400/30 to-cyan-400/30' 
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-teal-300' : 'text-white/70 group-hover:text-white'}`} />
                    </div>
                    <span className={`text-[10px] font-medium tracking-wide ${
                      isActive ? 'text-teal-300' : 'text-white/60 group-hover:text-white/80'
                    }`}>
                      {item.label.split(' ')[0]}
                    </span>
                  </button>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900/95 backdrop-blur-md text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 border border-teal-400/40 shadow-2xl shadow-teal-500/30">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900/95" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className={`my-4 relative z-10 transition-all duration-300 ${
          isExpanded 
            ? 'border-t border-white/10' 
            : 'h-0.5 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent rounded-full'
        }`} />

        {/* Time Indicator */}
        <div className="relative z-10 mb-3">
          {isExpanded ? (
            // Expanded Time Indicator
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              {isDayTime ? (
                <>
                  <div className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 w-10 h-10 flex items-center justify-center">
                    <Sun className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Day Mode</p>
                    <p className="text-[10px] text-white/50">6 AM - 6 PM</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 flex items-center justify-center">
                    <Moon className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Night Mode</p>
                    <p className="text-[10px] text-white/50">6 PM - 6 AM</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Collapsed Time Indicator - Refined
            <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-white/5 border-2 border-white/10">
              {isDayTime ? (
                <>
                  <div className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <Sun className="text-white h-6 w-6" />
                  </div>
                  <span className="text-[9px] text-white/60 font-medium tracking-wider">DAY</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Moon className="text-white h-6 w-6" />
                  </div>
                  <span className="text-[9px] text-white/60 font-medium tracking-wider">NIGHT</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        {onLogout && (
          <div className="relative z-10">
            {isExpanded ? (
              <Button
                onClick={onLogout}
                className="w-full h-11 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </Button>
            ) : (
              <Button
                onClick={onLogout}
                className="w-full h-16 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-2 border-red-400/30 hover:border-red-400/50 rounded-2xl flex flex-col gap-1.5 py-3"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-[9px] font-medium tracking-wider">EXIT</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
