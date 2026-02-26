import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Building2, AlertTriangle, FileCheck, ScanLine, 
  ChevronDown, ChevronRight, Bell, LogOut, Map, Search, User as UserIcon,
  Database, ScrollText, Activity, BadgeCheck, Scale, Settings, CheckSquare,
  Network, Wifi, Stethoscope, FileText, List, User, Smartphone
} from 'lucide-react';
import { AdminLevel, Region, User as UserType } from './types';
import { MOCK_USERS, MOCK_REGIONS, ROUTE_CONFIG } from './constants';
import { InstitutionManager } from './components/InstitutionManager';
import { WarningCenter } from './components/WarningCenter';
import { FinancialScan } from './components/FinancialScan';
import { ServiceSupervision, OperationSupervision, QualitySupervision } from './components/SupervisionViews';
import { ResourceSupervision } from './components/ResourceSupervision';
import { ProvincialDashboard, CityDashboard, CountyDashboard } from './components/Dashboards';
import { Button } from './components/UI';
import { MobileApp } from './components/MobileApp';

export default function App() {
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType>(MOCK_USERS.provinceAdmin);
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>(currentUser.regionCode);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({'system': true});

  useEffect(() => {
    setSelectedRegionCode(currentUser.regionCode);
    setCurrentRoute('/dashboard');
  }, [currentUser]);

  const activeRegion = useMemo(() => 
    MOCK_REGIONS.find(r => r.code === selectedRegionCode) || MOCK_REGIONS[0], 
    [selectedRegionCode]
  );

  const subRegions = useMemo(() => 
    MOCK_REGIONS.filter(r => r.parentCode === activeRegion.code),
    [activeRegion]
  );

  const menuItems = useMemo(() => 
    ROUTE_CONFIG.filter(route => {
      // 1. Explicit inclusion (New Logic)
      if (route.includeLevels) {
        return route.includeLevels.includes(currentUser.adminLevel);
      }
      // 2. Fallback to Min/Max logic
      if (route.minLevel !== undefined) {
         if (currentUser.adminLevel < route.minLevel) return false;
      }
      if (route.maxLevel !== undefined) {
         if (currentUser.adminLevel > route.maxLevel) return false;
      }
      return true;
    }),
    [currentUser]
  );

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderContent = () => {
    switch(currentRoute) {
      case '/dashboard':
        if (currentUser.adminLevel === AdminLevel.PROVINCE) return <ProvincialDashboard />;
        if (currentUser.adminLevel === AdminLevel.CITY) return <CityDashboard />;
        return <CountyDashboard />;
      
      case '/institution': return <InstitutionManager currentRegionCode={selectedRegionCode} />;
      case '/resources': return <ResourceSupervision />;
      case '/services': return <ServiceSupervision />;
      case '/operations': return <OperationSupervision activeRegion={activeRegion} />;
      case '/quality': return <QualitySupervision activeRegion={activeRegion} />;
      case '/finance': return <FinancialScan currentRegionCode={selectedRegionCode} activeRegion={activeRegion} />;
      
      default: return <ProvincialDashboard />;
    }
  };

  const renderIcon = (iconName: string, className: string) => {
      const icons: any = {
          LayoutDashboard, Building2, Database, ScrollText, Activity, BadgeCheck, Scale, Settings,
          User, FileText, List, Bell
      };
      const Icon = icons[iconName] || LayoutDashboard;
      return <Icon className={className} />;
  };

  // --- MOBILE MODE RENDERER ---
  if (isMobileMode) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
              <MobileApp onExitMobile={() => setIsMobileMode(false)} />
          </div>
      );
  }

  // --- DESKTOP MODE RENDERER ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F2A38] flex flex-col shadow-lg z-20 flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 bg-[#17212e]">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold shrink-0">省</div>
          <span className="text-white font-semibold tracking-wide text-sm truncate">省级远程医疗监管平台</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.key];
            const isActive = currentRoute === item.path || (hasChildren && item.children?.some(c => c.path === currentRoute));

            return (
              <div key={item.key}>
                  <button
                    onClick={() => {
                        if (hasChildren) {
                            toggleMenu(item.key);
                        } else {
                            setCurrentRoute(item.path);
                        }
                    }}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group
                      ${isActive && !hasChildren
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-400 hover:bg-[#2A3B4D] hover:text-white'
                      }`}
                  >
                    {renderIcon(item.icon, `mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`)}
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {hasChildren && (
                        isExpanded ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />
                    )}
                  </button>
                  
                  {/* Nested Sub-menu */}
                  {hasChildren && isExpanded && (
                      <div className="ml-4 pl-3 border-l border-gray-700 mt-1 space-y-1">
                          {item.children?.map(sub => (
                              <button
                                key={sub.key}
                                onClick={() => setCurrentRoute(sub.path)}
                                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors
                                  ${currentRoute === sub.path 
                                    ? 'text-blue-400 bg-[#2A3B4D]' 
                                    : 'text-gray-500 hover:text-gray-300'
                                  }`}
                              >
                                {renderIcon(sub.icon, "w-4 h-4 mr-2 opacity-70")}
                                {sub.label}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
            );
          })}
        </nav>

        {/* User Profile / Role Switcher */}
        <div className="p-4 bg-[#17212e] border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white shrink-0">
              {currentUser.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
             <button onClick={() => setCurrentUser(MOCK_USERS.provinceAdmin)} className="text-[10px] bg-gray-700 text-gray-300 p-1 rounded hover:bg-gray-600 transition-colors" title="切换至省级视角">省级</button>
             <button onClick={() => setCurrentUser(MOCK_USERS.cityAdmin)} className="text-[10px] bg-gray-700 text-gray-300 p-1 rounded hover:bg-gray-600 transition-colors" title="切换至市级视角">市级</button>
             <button onClick={() => setCurrentUser(MOCK_USERS.countyAdmin)} className="text-[10px] bg-gray-700 text-gray-300 p-1 rounded hover:bg-gray-600 transition-colors" title="切换至县级视角">县级</button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700 text-center">
            <a 
              href="https://tutu2momo.github.com/supervisorysystemweb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Network className="w-3 h-3" />
              项目主页
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight truncate">
               {currentRoute.includes('/system/') 
                 ? ROUTE_CONFIG.find(r => r.key === 'system')?.children?.find(c => c.path === currentRoute)?.label 
                 : menuItems.find(m => m.path === currentRoute)?.label || '综合监管'}
            </h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
             {/* Mobile Switch Button */}
             <button 
                onClick={() => setIsMobileMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
             >
                <Smartphone size={16} />
                移动端预览
             </button>

             <div className="relative">
                <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </div>
             <div className="h-6 w-px bg-gray-200"></div>
             <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
             </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}