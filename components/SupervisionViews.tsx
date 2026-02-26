import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_DOCTORS, MOCK_OPERATIONS, MOCK_INSTITUTIONS, MOCK_REGIONS, MOCK_PATIENTS, H2H_SERVICES, TOC_SERVICES } from '../constants';
import { Table, Badge, Button, Modal } from './UI';
import { Region, Doctor, Patient, AdminLevel, OperationStat, Institution } from '../types';
import { 
  Users, Stethoscope, Star, Activity, BarChart2, 
  Search, MessageSquareWarning, ClipboardList, Download,
  Eye, Edit, FileText, Filter, Calendar, MapPin, UserSquare, ShieldCheck,
  Building2, Trophy, ArrowRightLeft, Percent, CheckCircle, TrendingUp,
  LayoutGrid, List, Wifi, Network, ChevronDown, ChevronUp, ExternalLink,
  ThumbsDown, AlertCircle, Smile, Frown, Meh, ThumbsUp
} from 'lucide-react';

// --- Shared: Stat Card ---
const StatCard = ({ label, value, subtext, icon: Icon, color = "blue" }: any) => (
  <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between`}>
     <div>
        <div className="text-gray-500 text-xs font-medium">{label}</div>
        <div className={`text-2xl font-bold text-${color}-700 mt-1`}>{value}</div>
        {subtext && <div className="text-[10px] text-gray-400 mt-1">{subtext}</div>}
     </div>
     <div className={`p-2.5 bg-${color}-50 rounded-full text-${color}-600`}>
        <Icon className="w-5 h-5" />
     </div>
  </div>
);

// --- Shared: Interactive Ranking Chart ---
const InteractiveRankingChart = ({ 
  data, 
  onBarClick, 
  activeId, 
  color = "blue", 
  title,
  unit = "人",
  rightElement
}: { 
  data: { id: string; name: string; value: number | string }[]; 
  onBarClick: (id: string) => void; 
  activeId: string;
  color?: string;
  title: string;
  unit?: string;
  rightElement?: React.ReactNode;
}) => {
  const parseVal = (v: number | string) => typeof v === 'string' ? parseFloat(v) : v;
  const maxVal = Math.max(...data.map(d => parseVal(d.value))) || 1;

  const getColorClasses = (isActive: boolean) => {
    if (isActive) {
      if (color === 'blue') return 'bg-blue-600';
      if (color === 'green') return 'bg-green-600';
      if (color === 'orange') return 'bg-orange-500';
      return 'bg-blue-600';
    }
    if (color === 'blue') return 'bg-blue-400 group-hover:bg-blue-500';
    if (color === 'green') return 'bg-green-400 group-hover:bg-green-500';
    if (color === 'orange') return 'bg-orange-400 group-hover:bg-orange-500';
    return 'bg-blue-400 group-hover:bg-blue-500';
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
           <Trophy className={`w-4 h-4 text-${color}-600`} />
           {title}
        </h3>
        {rightElement || (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                Top 10
            </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {data.length > 0 ? (
          data.map((item, index) => {
             const isActive = activeId === item.id;
             const val = parseVal(item.value);
             const percent = (val / maxVal) * 100;
             return (
               <div 
                 key={item.id} 
                 className={`group cursor-pointer transition-all ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                 onClick={() => onBarClick(item.id)}
               >
                 <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className={`flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold shrink-0 
                         ${index < 3 ? `bg-${color}-100 text-${color}-700` : 'bg-gray-100 text-gray-500'}
                       `}>
                         {index + 1}
                       </span>
                       <span className={`truncate font-medium ${isActive ? `text-${color}-700 font-bold` : 'text-gray-700'}`} title={item.name}>
                         {item.name}
                       </span>
                    </div>
                    <span className="font-mono font-bold text-gray-900">{item.value} <span className="text-[10px] font-normal text-gray-400">{unit}</span></span>
                 </div>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getColorClasses(isActive)}`}
                      style={{ width: `${percent}%` }}
                    />
                 </div>
               </div>
             );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">暂无排名数据</div>
        )}
      </div>
    </div>
  );
};

// --- 5. Service Supervision (Optimized) ---
export const ServiceSupervision = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'details'>('stats');
  const [filterRegion, setFilterRegion] = useState({ province: '520000', city: '', county: '' });
  
  const provinces = MOCK_REGIONS.filter(r => r.level === AdminLevel.PROVINCE);
  const cities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === filterRegion.province), [filterRegion.province]);
  const counties = useMemo(() => filterRegion.city ? MOCK_REGIONS.filter(r => r.parentCode === filterRegion.city) : [], [filterRegion.city]);

  const handleRegionChange = (key: 'province' | 'city' | 'county', val: string) => {
      setFilterRegion(prev => {
          const next = { ...prev, [key]: val };
          if (key === 'province') { next.city = ''; next.county = ''; }
          if (key === 'city') { next.county = ''; }
          return next;
      });
  };

  const currentRegionCode = filterRegion.county || filterRegion.city || filterRegion.province;
  const filteredInsts = useMemo(() => MOCK_INSTITUTIONS.filter(inst => inst.regionCode.startsWith(currentRegionCode)), [currentRegionCode]);

  // --- STATS VIEW LOGIC ---
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<{name: string, type: string} | null>(null);
  const [modalChartType, setModalChartType] = useState<'volume' | 'doctors'>('volume');
  const [selectedHospitalDetail, setSelectedHospitalDetail] = useState<{id: string, name: string} | null>(null);

  // Rankings state for Main View
  const [h2hRankType, setH2hRankType] = useState<'inst' | 'doc'>('inst');
  const [tocRankType, setTocRankType] = useState<'inst' | 'doc'>('inst');

  const serviceStatsData = useMemo(() => {
     const generateStats = (services: string[], type: string) => services.map((s, i) => {
        const seed = s.charCodeAt(0) + filteredInsts.length; 
        const instCount = Math.ceil(filteredInsts.length * ((seed % 80 + 20) / 100)); 
        const docCount = instCount * (seed % 5 + 2);
        return { id: `${type}-${i}`, name: s, type: type, instCount: instCount, docCount: docCount, totalVolume: instCount * (seed % 50 + 100) };
     }).sort((a, b) => b.instCount - a.instCount);
     return { h2h: generateStats(H2H_SERVICES, 'H2H'), toc: generateStats(TOC_SERVICES, 'ToC') };
  }, [filteredInsts]);

  // -- Main View Rankings Data --
  const getRankings = (type: 'H2H' | 'ToC', rankType: 'inst' | 'doc') => {
      if (rankType === 'inst') {
          // Mock Inst Data
          return filteredInsts.map((inst, i) => ({
              id: inst.id,
              name: inst.name,
              value: Math.floor(Math.random() * 5000) + (type === 'H2H' ? 2000 : 1000)
          })).sort((a,b) => (b.value as number) - (a.value as number)).slice(0, 10);
      } else {
          // Mock Doc Data
          return MOCK_DOCTORS.map((doc, i) => ({
              id: doc.id,
              // Full institution name displayed
              name: `${doc.name} (${doc.institutionName})`,
              value: Math.floor(Math.random() * 800) + 100
          })).sort((a,b) => (b.value as number) - (a.value as number)).slice(0, 10);
      }
  };

  // Mock data for the new ranking section
  const RANK_DATA_TOTAL = [
      { id: 'h1', name: '贵州省人民医院', value: 45230 },
      { id: 'h4', name: '遵义医科大学附属医院', value: 38120 },
      { id: 'h3', name: '贵阳市第一人民医院', value: 22400 },
      { id: 'h20', name: '六盘水市人民医院', value: 18550 },
      { id: 'h5', name: '安顺市人民医院', value: 15300 },
  ];
  const RANK_DATA_REMOTE = [
      { id: 'h1', name: '贵州省人民医院', value: 12500 },
      { id: 'h4', name: '遵义医科大学附属医院', value: 10200 },
      { id: 'h_new_1', name: '贵阳市第二人民医院', value: 8400 },
      { id: 'h_other1', name: '黔东南州人民医院', value: 6150 },
      { id: 'h_other2', name: '毕节市第一人民医院', value: 5800 },
  ];
  const RANK_DATA_INTERNET = [
      { id: 'h2', name: '贵州医科大学附属医院', value: 28900 },
      { id: 'h_new_2', name: '贵阳市妇幼保健院', value: 15600 },
      { id: 'h_new_3', name: '贵州省骨科医院', value: 11200 },
      { id: 'h_other3', name: '遵义市第一人民医院', value: 9800 },
      { id: 'h_other4', name: '铜仁市人民医院', value: 7450 },
  ];

  // --- MODAL LOGIC ---
  const serviceDetailData = useMemo(() => {
      if (!selectedServiceForModal) return null;
      const seed = selectedServiceForModal.name.charCodeAt(0);
      const hospitals = filteredInsts.map((inst, i) => {
          const hasService = (seed + i) % 3 !== 0; 
          if (!hasService) return null;
          const volume = Math.floor(Math.random() * 1000) + 50;
          const doctors = Math.floor(Math.random() * 20) + 2;
          return { ...inst, serviceStats: { volume, doctors } };
      }).filter(Boolean) as (Institution & { serviceStats: { volume: number, doctors: number } })[];
      
      const sortedByVolume = [...hospitals].sort((a, b) => b.serviceStats.volume - a.serviceStats.volume);
      const sortedByDoctors = [...hospitals].sort((a, b) => b.serviceStats.doctors - a.serviceStats.doctors);

      return { 
          hospitals: sortedByVolume, // Default list order
          top10Volume: sortedByVolume.slice(0, 10).map(h => ({ id: h.id, name: h.name, value: h.serviceStats.volume })),
          top10Doctors: sortedByDoctors.slice(0, 10).map(h => ({ id: h.id, name: h.name, value: h.serviceStats.doctors }))
      };
  }, [selectedServiceForModal, filteredInsts]);

  const hospitalServiceDetails = useMemo(() => {
      if (!selectedHospitalDetail) return null;
      const activeH2H = H2H_SERVICES.filter((_, i) => (selectedHospitalDetail.id.charCodeAt(0) + i) % 2 === 0);
      const activeToC = TOC_SERVICES.filter((_, i) => (selectedHospitalDetail.id.charCodeAt(0) + i) % 3 === 0);
      const depts = [{ name: '心内科', count: 12 }, { name: '呼吸科', count: 8 }, { name: '神经内科', count: 15 }, { name: '普外科', count: 10 }, { name: '儿科', count: 6 }, { name: '皮肤科', count: 4 }].sort((a, b) => b.count - a.count);
      return { h2h: activeH2H, toc: activeToC, depts: depts };
  }, [selectedHospitalDetail]);

  // --- DETAILS VIEW LOGIC ---
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (id: string) => {
      const newSet = new Set(expandedRows);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      setExpandedRows(newSet);
  };

  // Helper for toggle in chart
  const ChartToggle = ({ type, onChange }: any) => (
      <div className="flex bg-gray-100 rounded p-0.5 text-[10px]">
          <button 
            className={`px-2 py-0.5 rounded transition-all ${type === 'inst' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
            onClick={(e) => { e.stopPropagation(); onChange('inst'); }}
          >按机构</button>
          <button 
            className={`px-2 py-0.5 rounded transition-all ${type === 'doc' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
            onClick={(e) => { e.stopPropagation(); onChange('doc'); }}
          >按医生</button>
      </div>
  );

  const ModalChartToggle = ({ type, onChange }: any) => (
      <div className="flex bg-gray-100 rounded p-0.5 text-[10px]">
          <button 
            className={`px-2 py-0.5 rounded transition-all ${type === 'volume' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
            onClick={(e) => { e.stopPropagation(); onChange('volume'); }}
          >按业务量</button>
          <button 
            className={`px-2 py-0.5 rounded transition-all ${type === 'doctors' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
            onClick={(e) => { e.stopPropagation(); onChange('doctors'); }}
          >按开通医生数</button>
      </div>
  );

  const renderStatsView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="开通远程医疗机构数" value={filteredInsts.length} subtext="覆盖率 100%" icon={Network} color="blue" />
          <StatCard label="注册互联网医院数" value={filteredInsts.filter(i => i.level === '三级甲等').length} subtext="累计服务 300万+" icon={Wifi} color="purple" />
          <StatCard label="活跃注册医生" value={MOCK_DOCTORS.length * 5} subtext="本月活跃 > 60%" icon={Users} color="indigo" />
          <StatCard label="本月服务总量" value={(filteredInsts.length * 1520).toLocaleString()} subtext="环比 +12.5%" icon={Activity} color="green" />
       </div>

       {/* 2. SECTION: H2H Telemedicine */}
       <div className="space-y-4">
           <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
               <Network className="w-5 h-5 text-blue-600"/>
               <h3 className="text-lg font-bold text-gray-800">远程医疗业务监管 (B2B)</h3>
               <Badge type="neutral">机构间协作</Badge>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Service Matrix */}
                <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm font-bold text-gray-700 mb-4 flex justify-between">
                        <span>业务分类一览</span>
                        <span className="text-xs text-gray-400 font-normal">点击业务查看开通详情</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {serviceStatsData.h2h.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => { setModalChartType('volume'); setSelectedServiceForModal(item); }}
                                className="flex flex-col items-center justify-center p-3 rounded bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-all text-center group h-24"
                            >
                                <div className="text-sm font-bold text-gray-800 group-hover:text-blue-700 mb-1">{item.name}</div>
                                <div className="text-[10px] text-gray-500">
                                    <span className="font-medium text-blue-600">{item.instCount}</span> 机构 / <span className="font-medium text-blue-600">{item.docCount}</span> 医生
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Ranking */}
                <div className="lg:col-span-1 h-[320px]">
                    <InteractiveRankingChart 
                        title="远程医疗业务排名" 
                        data={getRankings('H2H', h2hRankType)}
                        activeId=""
                        onBarClick={() => {}}
                        color="blue"
                        unit={h2hRankType === 'inst' ? "单" : "单"}
                        rightElement={<ChartToggle type={h2hRankType} onChange={setH2hRankType} />}
                    />
                </div>
           </div>
       </div>

       {/* 3. SECTION: ToC Internet Hospital */}
       <div className="space-y-4">
           <div className="flex items-center gap-2 border-b border-gray-200 pb-2 pt-2">
               <Wifi className="w-5 h-5 text-green-600"/>
               <h3 className="text-lg font-bold text-gray-800">互联网医院业务监管 (ToC)</h3>
               <Badge type="neutral">面向患者服务</Badge>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Service Matrix */}
                <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm font-bold text-gray-700 mb-4 flex justify-between">
                        <span>业务分类一览</span>
                        <span className="text-xs text-gray-400 font-normal">点击业务查看开通详情</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {serviceStatsData.toc.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => { setModalChartType('volume'); setSelectedServiceForModal(item); }}
                                className="flex flex-col items-center justify-center p-3 rounded bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-300 transition-all text-center group h-24"
                            >
                                <div className="text-sm font-bold text-gray-800 group-hover:text-green-700 mb-1">{item.name}</div>
                                <div className="text-[10px] text-gray-500">
                                    <span className="font-medium text-green-600">{item.instCount}</span> 机构 / <span className="font-medium text-green-600">{item.docCount}</span> 医生
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Ranking */}
                <div className="lg:col-span-1 h-[320px]">
                    <InteractiveRankingChart 
                        title="互联网业务排名" 
                        data={getRankings('ToC', tocRankType)}
                        activeId=""
                        onBarClick={() => {}}
                        color="green"
                        unit={tocRankType === 'inst' ? "单" : "单"}
                        rightElement={<ChartToggle type={tocRankType} onChange={setTocRankType} />}
                    />
                </div>
           </div>
       </div>

       {/* 4. SECTION: Comprehensive Rankings (New) */}
       <div className="space-y-4 pt-4 border-t border-gray-200">
           <div className="flex items-center gap-2 mb-4">
               <Trophy className="w-5 h-5 text-orange-600"/>
               <h3 className="text-lg font-bold text-gray-800">医疗机构业务量综合排名</h3>
               <Badge type="neutral">TOP 5</Badge>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[320px]">
                <InteractiveRankingChart 
                    title="医院业务总量 Top5" 
                    data={RANK_DATA_TOTAL}
                    activeId=""
                    onBarClick={() => {}}
                    color="orange"
                    unit="单"
                    rightElement={null}
                />
                <InteractiveRankingChart 
                    title="远程医疗服务 Top5" 
                    data={RANK_DATA_REMOTE}
                    activeId=""
                    onBarClick={() => {}}
                    color="blue"
                    unit="单"
                    rightElement={null}
                />
                <InteractiveRankingChart 
                    title="互联网医疗业务 Top5" 
                    data={RANK_DATA_INTERNET}
                    activeId=""
                    onBarClick={() => {}}
                    color="green"
                    unit="单"
                    rightElement={null}
                />
           </div>
       </div>
    </div>
  );

  const renderDetailsView = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
       <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">各医疗机构服务开通情况明细</h3>
          <div className="flex gap-2"><input placeholder="搜索机构名称..." className="border border-gray-300 rounded px-2 py-1 text-sm"/><Button size="sm">查询</Button></div>
       </div>
       <div className="overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 w-10"></th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">医疗机构</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">开通服务数</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">开通医生数</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInsts.map(inst => {
                // Mock data for inline expansion based on ID seed
                const seed = inst.id.charCodeAt(0);
                const mockH2H = H2H_SERVICES.filter((_, i) => (seed + i) % 3 === 0).slice(0, 5);
                const mockToC = TOC_SERVICES.filter((_, i) => (seed + i) % 4 === 0).slice(0, 4);

                return (
                  <React.Fragment key={inst.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4"><button onClick={() => toggleRow(inst.id)} className="text-gray-400 hover:text-blue-600">{expandedRows.has(inst.id) ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</button></td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{inst.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{mockH2H.length + mockToC.length} 项</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{(seed % 50) + 10} 人</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedHospitalDetail({id: inst.id, name: inst.name})}>
                           查看明细
                        </Button>
                      </td>
                    </tr>
                    {expandedRows.has(inst.id) && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={5} className="px-6 py-4 border-b border-gray-100 shadow-inner">
                           <div className="flex flex-col gap-3 pl-8">
                              <div className="flex items-start gap-4">
                                 <span className="text-xs font-bold text-blue-600 shrink-0 w-24">远程医疗 (B2B):</span>
                                 <div className="flex flex-wrap gap-2">
                                    {mockH2H.map(s => <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded">{s}</span>)}
                                    {mockH2H.length === 0 && <span className="text-xs text-gray-400">-</span>}
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <span className="text-xs font-bold text-green-600 shrink-0 w-24">互联网医院 (ToC):</span>
                                 <div className="flex flex-wrap gap-2">
                                    {mockToC.map(s => <span key={s} className="text-[10px] px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 rounded">{s}</span>)}
                                    {mockToC.length === 0 && <span className="text-xs text-gray-400">-</span>}
                                 </div>
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
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
         <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Filter className="w-4 h-4" /><span className="font-bold">行政区域:</span></div>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.province} disabled>{provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.city} onChange={(e) => handleRegionChange('city', e.target.value)}><option value="">全部城市</option>{cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.county} onChange={(e) => handleRegionChange('county', e.target.value)} disabled={!filterRegion.city}><option value="">全部区县</option>{counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
         </div>
         <div className="flex space-x-1 bg-gray-100 p-1 rounded w-fit self-start"><button onClick={() => setActiveTab('stats')} className={`flex items-center px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTab === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid className="w-3 h-3 mr-1.5" /> 业务概览统计</button><button onClick={() => setActiveTab('details')} className={`flex items-center px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTab === 'details' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><List className="w-3 h-3 mr-1.5" /> 服务明细列表</button></div>
      </div>
      
      <div className="min-h-[500px]">
        {activeTab === 'stats' ? renderStatsView() : renderDetailsView()}
      </div>

      {/* Level 1 Modal: Service Detail Drill Down */}
      <Modal 
         isOpen={!!selectedServiceForModal} 
         onClose={() => setSelectedServiceForModal(null)} 
         title={selectedServiceForModal ? `${selectedServiceForModal.name} - 业务开展详情` : '详情'}
         maxWidth="max-w-4xl"
        >
           {serviceDetailData && (
               <div className="flex flex-col gap-6 min-h-[500px]">
                   <div className="h-[280px]">
                        <InteractiveRankingChart 
                            title={`开通【${selectedServiceForModal?.name}】业务医院 Top 10`} 
                            data={modalChartType === 'volume' ? serviceDetailData.top10Volume : serviceDetailData.top10Doctors}
                            activeId=""
                            onBarClick={() => {}}
                            color={selectedServiceForModal?.type === 'H2H' ? 'blue' : 'green'}
                            unit={modalChartType === 'volume' ? "单" : "人"}
                            rightElement={<ModalChartToggle type={modalChartType} onChange={setModalChartType} />}
                        />
                   </div>
                   <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h4 className="font-bold text-gray-800 text-sm">全部开通机构列表 ({serviceDetailData.hospitals.length})</h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">机构名称</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">等级</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500">业务量</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500">注册医生</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500">操作</th></tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">{serviceDetailData.hospitals.map(h => (<tr key={h.id} className="hover:bg-gray-50"><td className="px-4 py-2 text-sm text-gray-900">{h.name}</td><td className="px-4 py-2"><Badge type="neutral">{h.level}</Badge></td><td className="px-4 py-2 text-sm text-right font-mono">{h.serviceStats.volume}</td><td className="px-4 py-2 text-sm text-right font-mono">{h.serviceStats.doctors}</td><td className="px-4 py-2 text-center"><button className="text-blue-600 hover:underline text-xs" onClick={() => setSelectedHospitalDetail({id: h.id, name: h.name})}>查看医疗机构详情</button></td></tr>))}</tbody>
                            </table>
                        </div>
                   </div>
               </div>
           )}
       </Modal>

       {/* Level 2 Modal: Hospital Specific Service & Dept Breakdown (Shared) */}
       <Modal isOpen={!!selectedHospitalDetail} onClose={() => setSelectedHospitalDetail(null)} title={selectedHospitalDetail ? `${selectedHospitalDetail.name} - 业务与医生分布` : '机构详情'} maxWidth="max-w-2xl">
         {hospitalServiceDetails && (
            <div className="space-y-6">
                <div><h4 className="text-sm font-bold text-gray-800 mb-2 border-l-4 border-blue-500 pl-2">已开通业务列表</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="mb-3"><span className="text-xs text-blue-600 font-bold mb-1 block">远程医疗 (B2B)</span><div className="flex flex-wrap gap-2">{hospitalServiceDetails.h2h.map((s, i) => (<span key={i} className="text-xs bg-white border border-blue-100 text-gray-700 px-2 py-1 rounded shadow-sm">{s}</span>))}</div></div>
                        <div><span className="text-xs text-green-600 font-bold mb-1 block">互联网医院 (ToC)</span><div className="flex flex-wrap gap-2">{hospitalServiceDetails.toc.map((s, i) => (<span key={i} className="text-xs bg-white border border-green-100 text-gray-700 px-2 py-1 rounded shadow-sm">{s}</span>))}</div></div>
                    </div>
                </div>
                <div><h4 className="text-sm font-bold text-gray-800 mb-2 border-l-4 border-indigo-500 pl-2">注册医生科室分布</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">科室名称</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500">注册医生数</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-1/2">占比条</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{hospitalServiceDetails.depts.map((d, i) => (<tr key={i}><td className="px-4 py-2 text-sm text-gray-800">{d.name}</td><td className="px-4 py-2 text-sm text-right font-mono font-medium">{d.count}</td><td className="px-4 py-2"><div className="h-2 bg-indigo-50 rounded-full overflow-hidden w-full"><div className="h-full bg-indigo-500" style={{width: `${(d.count / hospitalServiceDetails.depts[0].count) * 100}%`}}></div></div></td></tr>))}</tbody></table>
                    </div>
                </div>
            </div>
         )}
       </Modal>
    </div>
  );
};

// --- 6. Operation Supervision ---
export const OperationSupervision = ({ activeRegion }: { activeRegion: Region }) => {
  const [filterRegion, setFilterRegion] = useState({ province: '520000', city: '', county: '' });

  useEffect(() => {
    if (activeRegion.level === AdminLevel.PROVINCE) setFilterRegion({ province: activeRegion.code, city: '', county: '' });
    else if (activeRegion.level === AdminLevel.CITY) setFilterRegion({ province: activeRegion.parentCode || '520000', city: activeRegion.code, county: '' });
    else if (activeRegion.level === AdminLevel.COUNTY) setFilterRegion({ province: '520000', city: activeRegion.parentCode || '', county: activeRegion.code });
  }, [activeRegion]);

  const provinces = MOCK_REGIONS.filter(r => r.level === AdminLevel.PROVINCE);
  const cities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === filterRegion.province), [filterRegion.province]);
  const counties = useMemo(() => filterRegion.city ? MOCK_REGIONS.filter(r => r.parentCode === filterRegion.city) : [], [filterRegion.city]);

  const handleRegionChange = (key: 'province' | 'city' | 'county', val: string) => {
      setFilterRegion(prev => {
          const next = { ...prev, [key]: val };
          if (key === 'province') { next.city = ''; next.county = ''; }
          if (key === 'city') { next.county = ''; }
          return next;
      });
  };

  const currentLevelCode = filterRegion.county || filterRegion.city || filterRegion.province;
  const operationalData = useMemo(() => {
      let data = MOCK_OPERATIONS.filter(op => op.parentCode === currentLevelCode);
      if (data.length === 0) data = MOCK_OPERATIONS.filter(op => op.regionCode === currentLevelCode);
      return data.sort((a, b) => b.totalWorkload - a.totalWorkload);
  }, [currentLevelCode]);

  const stats = useMemo(() => operationalData.reduce((acc, curr) => ({ total: acc.total + curr.totalWorkload, tele: acc.tele + curr.telemedicineCount, net: acc.net + curr.internetMedCount }), { total: 0, tele: 0, net: 0 }), [operationalData]);

  const handleDrillDown = (code: string) => {
      const region = MOCK_REGIONS.find(r => r.code === code);
      if (!region) return;
      if (region.level === AdminLevel.CITY) setFilterRegion(prev => ({ ...prev, city: code, county: '' }));
      else if (region.level === AdminLevel.COUNTY) setFilterRegion(prev => ({ ...prev, county: code }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Filter className="w-4 h-4" /><span className="font-bold">行政区域筛选:</span></div>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.province} onChange={(e) => handleRegionChange('province', e.target.value)} disabled>{provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.city} onChange={(e) => handleRegionChange('city', e.target.value)} disabled={activeRegion.level >= AdminLevel.CITY && activeRegion.code !== filterRegion.city}><option value="">全部城市</option>{cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filterRegion.county} onChange={(e) => handleRegionChange('county', e.target.value)} disabled={!filterRegion.city || (activeRegion.level >= AdminLevel.COUNTY && activeRegion.code !== filterRegion.county)}><option value="">全部区县</option>{counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
            <div className="ml-auto text-xs text-gray-400">当前范围包含 {operationalData.length} 个子区域</div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="区域业务总量" value={stats.total.toLocaleString()} subtext="本月累计 (人次)" icon={Activity} color="blue" />
          <StatCard label="远程医疗业务量" value={stats.tele.toLocaleString()} subtext="机构间协作 (H2H)" icon={Network} color="indigo" />
          <StatCard label="互联网医疗业务量" value={stats.net.toLocaleString()} subtext="面向患者 (ToC)" icon={Wifi} color="green" />
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
           <div className="lg:col-span-1 h-full"><InteractiveRankingChart title="下辖区域业务量排名" data={operationalData.map(d => ({ id: d.regionCode, name: d.regionName, value: d.totalWorkload }))} activeId="" onBarClick={handleDrillDown} color="blue" unit="人次" /></div>
           <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0"><h3 className="font-bold text-gray-800">区域运行数据明细</h3><Button size="sm" variant="ghost"><Download className="w-4 h-4 mr-1"/> 导出数据</Button></div>
                <div className="flex-1 overflow-auto"><Table<OperationStat> rowKey="regionCode" dataSource={operationalData} columns={[{ title: '区域名称', render: (r) => <span className="font-bold text-gray-800">{r.regionName}</span> }, { title: '远程医疗量', render: (r) => r.telemedicineCount.toLocaleString() }, { title: '互联网医疗量', render: (r) => r.internetMedCount.toLocaleString() }, { title: '总业务负荷', render: (r) => <span className="text-blue-600 font-bold">{r.totalWorkload.toLocaleString()}</span> }, { title: '环比增长', render: () => <span className="text-red-500 text-xs flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +5.2%</span> }, { title: '占比', render: (r) => <span className="text-xs text-gray-500">{stats.total > 0 ? (r.totalWorkload / stats.total * 100).toFixed(1) : 0}%</span> }]} /></div>
           </div>
       </div>
    </div>
  );
};

// --- 7. Quality Supervision (REVAMPED) ---
export const QualitySupervision = ({ activeRegion }: { activeRegion?: Region }) => {
   const issues = [ { id: 'Q001', title: '部分心电图上传图像模糊', hosp: '花果园第二卫生室', date: '2023-10-25', status: 'Pending' }, { id: 'Q002', title: '会诊申请资料不全', hosp: '乌当区人民医院', date: '2023-10-26', status: 'Resolved' } ];
   const negativeReviews = [ { id: 'R001', service: '远程专家会诊', tag: 'waiting_time', content: '等待专家接诊时间超过30分钟，没有提前通知。', hosp: '南明区花果园社区卫生服务中心', score: 2, date: '2023-10-27' }, { id: 'R002', service: '互联网门诊', tag: 'attitude', content: '医生回复非常敷衍，三句话就结束了问诊。', hosp: '贵州医科大学附属医院', score: 1, date: '2023-10-26' }, { id: 'R003', service: '远程影像诊断', tag: 'tech_issue', content: '系统卡顿严重，影像加载不出来。', hosp: '乌当区人民医院', score: 2, date: '2023-10-25' } ];
   const tagMap: any = { 'waiting_time': { label: '候诊时间长', color: 'bg-orange-100 text-orange-700' }, 'attitude': { label: '服务态度差', color: 'bg-red-100 text-red-700' }, 'tech_issue': { label: '技术故障', color: 'bg-gray-100 text-gray-700' } };
   const hospitalRankings = [ { id: 'h1', name: '贵州省人民医院', value: '4.92' }, { id: 'h2', name: '遵义医科大学附属医院', value: '4.88' }, { id: 'h3', name: '贵阳市第一人民医院', value: '4.85' }, { id: 'h4', name: '六盘水市人民医院', value: '4.79' }, { id: 'h5', name: '安顺市人民医院', value: '4.75' } ];
   const businessRankings = [ { id: 'b1', name: '远程病理诊断', value: '4.95' }, { id: 'b2', name: '远程影像诊断', value: '4.90' }, { id: 'b3', name: '专家视频问诊', value: '4.82' }, { id: 'b4', name: '慢病续方', value: '4.76' }, { id: 'b5', name: '远程心电分析', value: '4.65' } ];

   // Enhanced mock data with parentCode for hierarchical filtering
   const reviewStatsMock = [
       { id: '520000', name: '贵州省', level: '省级', parentCode: null, good: 158200, bad: 2340, rate: '98.5%' },
       { id: '520100', name: '贵阳市', level: '市级', parentCode: '520000', good: 68400, bad: 1200, rate: '98.3%' },
       { id: '520300', name: '遵义市', level: '市级', parentCode: '520000', good: 52100, bad: 850, rate: '98.4%' },
       { id: '520200', name: '六盘水市', level: '市级', parentCode: '520000', good: 28500, bad: 210, rate: '99.3%' },
       { id: '520400', name: '安顺市', level: '市级', parentCode: '520000', good: 15300, bad: 120, rate: '99.2%' },
       { id: '520102', name: '南明区', level: '县级', parentCode: '520100', good: 15200, bad: 320, rate: '97.9%' },
       { id: '520103', name: '云岩区', level: '县级', parentCode: '520100', good: 14800, bad: 280, rate: '98.1%' },
       { id: '520111', name: '花溪区', level: '县级', parentCode: '520100', good: 9500, bad: 150, rate: '98.4%' },
       { id: '520112', name: '乌当区', level: '县级', parentCode: '520100', good: 8900, bad: 110, rate: '98.7%' },
       // Township Data (Level 4)
       { id: '520102001', name: '花果园街道', level: '乡镇级', parentCode: '520102', good: 4200, bad: 120, rate: '97.2%' },
       { id: '520102002', name: '太慈桥街道', level: '乡镇级', parentCode: '520102', good: 3100, bad: 80, rate: '97.5%' },
       { id: '520102003', name: '湘雅街道', level: '乡镇级', parentCode: '520102', good: 2800, bad: 60, rate: '97.9%' },
       { id: '520102004', name: '中曹司街道', level: '乡镇级', parentCode: '520102', good: 1500, bad: 20, rate: '98.6%' },
   ];

   const [activeTab, setActiveTab] = useState<'region' | 'business'>('region');
   const [filterRegion, setFilterRegion] = useState({ province: '520000', city: '', county: '' });
   
   // New state for Review Modal
   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

   useEffect(() => {
    if (activeRegion) {
      if (activeRegion.level === AdminLevel.PROVINCE) setFilterRegion({ province: activeRegion.code, city: '', county: '' });
      else if (activeRegion.level === AdminLevel.CITY) setFilterRegion({ province: activeRegion.parentCode || '520000', city: activeRegion.code, county: '' });
      else if (activeRegion.level === AdminLevel.COUNTY) setFilterRegion({ province: '520000', city: activeRegion.parentCode || '', county: activeRegion.code });
    }
   }, [activeRegion]);

   const provinces = MOCK_REGIONS.filter(r => r.level === AdminLevel.PROVINCE);
   const cities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === filterRegion.province), [filterRegion.province]);
   const counties = useMemo(() => filterRegion.city ? MOCK_REGIONS.filter(r => r.parentCode === filterRegion.city) : [], [filterRegion.city]);

   const handleRegionChange = (key: 'province' | 'city' | 'county', val: string) => {
      setFilterRegion(prev => {
          const next = { ...prev, [key]: val };
          if (key === 'province') { next.city = ''; next.county = ''; }
          if (key === 'city') { next.county = ''; }
          return next;
      });
   };

   const currentLevelCode = filterRegion.county || filterRegion.city || filterRegion.province;
   const filteredReviewStats = useMemo(() => {
       // Filter logic: Show direct children of current selection based on parentCode
       let data = reviewStatsMock.filter(r => r.parentCode === currentLevelCode);
       // Fallback for empty (e.g. searching lowest level), just show self to avoid empty state if preferred, or keep empty
       if (data.length === 0) {
           data = reviewStatsMock.filter(r => r.id === currentLevelCode);
       }
       return data;
   }, [currentLevelCode]);

   const reviewSummary = useMemo(() => ({ good: filteredReviewStats.reduce((acc, r) => acc + r.good, 0), bad: filteredReviewStats.reduce((acc, r) => acc + r.bad, 0) }), [filteredReviewStats]);
   const sampleCount = 1500; 

   // Expanded Mock Reviews for Modal
   const allNegativeReviews = [
       ...negativeReviews,
       { id: 'R004', service: '慢病复诊', tag: 'attitude', content: '医生未仔细询问病情就直接开药。', hosp: '遵义医科大学附属医院', score: 1, date: '2023-10-24' },
       { id: 'R005', service: '远程会诊', tag: 'waiting_time', content: '连接超时多次，体验很差。', hosp: '六盘水市人民医院', score: 2, date: '2023-10-23' },
       { id: 'R006', service: '在线咨询', tag: 'tech_issue', content: '视频画面卡顿，声音听不清楚。', hosp: '安顺市人民医院', score: 2, date: '2023-10-22' },
       { id: 'R007', service: '专家视频问诊', tag: 'attitude', content: '感觉医生很不耐烦。', hosp: '贵阳市第一人民医院', score: 1, date: '2023-10-21' },
   ];

   return (
    <div className="space-y-6 animate-in fade-in duration-300">
       
       {/* Review List Modal */}
       <Modal 
         isOpen={isReviewModalOpen} 
         onClose={() => setIsReviewModalOpen(false)} 
         title="全部差评记录" 
         maxWidth="max-w-3xl"
       >
           <div className="space-y-4">
               {allNegativeReviews.map(review => (
                   <div key={review.id} className="border border-red-50 bg-red-50/10 rounded-lg p-4 hover:bg-red-50/30 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-3">
                               <span className={`text-xs px-2 py-0.5 rounded border ${tagMap[review.tag]?.color || 'bg-gray-100'}`}>
                                   {tagMap[review.tag]?.label || review.tag}
                               </span>
                               <span className="text-sm font-bold text-gray-700">{review.service}</span>
                           </div>
                           <div className="flex text-orange-400">
                               {[...Array(5)].map((_, i) => (
                                   <Star key={i} className={`w-3 h-3 ${i < review.score ? 'fill-current' : 'text-gray-300'}`} />
                               ))}
                           </div>
                       </div>
                       <p className="text-sm text-gray-800 mb-3">{review.content}</p>
                       <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-dashed border-gray-200">
                           <div className="flex items-center gap-2">
                               <Building2 className="w-3 h-3" />
                               <span>{review.hosp}</span>
                           </div>
                           <span>{review.date}</span>
                       </div>
                   </div>
               ))}
           </div>
       </Modal>

       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-center border-r border-gray-200 pr-6"><span className="text-sm text-gray-500 font-medium">区域服务质量评分</span><div className="flex items-baseline gap-1 mt-1"><span className="text-4xl font-bold text-orange-500">4.85</span><span className="text-sm text-gray-400">/ 5.0</span></div><div className="flex gap-1 mt-2">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}</div></div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="w-20 text-xs text-gray-500">五星好评率</span><div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: '85%'}}></div></div><span className="text-xs font-bold text-gray-700">85%</span></div>
                    <div className="flex items-center gap-2"><span className="w-20 text-xs text-gray-500">差评率</span><div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-400" style={{width: '2%'}}></div></div><span className="text-xs font-bold text-gray-700">2%</span></div>
                    <div className="flex items-center gap-2 pt-1"><span className="text-xs text-gray-400">抽样样本量: </span><span className="text-xs font-bold text-gray-600">{sampleCount}</span></div>
                </div>
            </div>
            <div className="text-right"><Button variant="secondary"><Download className="w-4 h-4 mr-2"/> 导出质量报告</Button></div>
       </div>

       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
               <h3 className="font-bold text-gray-800 flex items-center gap-2"><MessageSquareWarning className="w-4 h-4 text-blue-600"/> 各级区域评价数据统计</h3>
               <div className="flex gap-2 text-xs">
                    <select className="border border-gray-300 rounded px-2 py-1 bg-white" value={filterRegion.province} disabled>{provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
                    <select className="border border-gray-300 rounded px-2 py-1 bg-white" value={filterRegion.city} onChange={(e) => handleRegionChange('city', e.target.value)} disabled={activeRegion && activeRegion.level >= AdminLevel.CITY && activeRegion.code !== filterRegion.city}><option value="">全部城市</option>{cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
                    <select className="border border-gray-300 rounded px-2 py-1 bg-white" value={filterRegion.county} onChange={(e) => handleRegionChange('county', e.target.value)} disabled={!filterRegion.city || (activeRegion && activeRegion.level >= AdminLevel.COUNTY && activeRegion.code !== filterRegion.county)}><option value="">全部区县</option>{counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
               </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
               <div className="col-span-1 p-6 flex flex-col justify-center space-y-6 bg-gray-50/50">
                   <div className="flex items-center gap-4"><div className="p-3 bg-green-100 rounded-full text-green-600"><ThumbsUp className="w-6 h-6"/></div><div><div className="text-sm text-gray-500 font-medium">好评总数</div><div className="text-2xl font-bold text-green-700">{reviewSummary.good.toLocaleString()}</div></div></div>
                   <div className="flex items-center gap-4"><div className="p-3 bg-red-100 rounded-full text-red-600"><ThumbsDown className="w-6 h-6"/></div><div><div className="text-sm text-gray-500 font-medium">差评总数</div><div className="text-2xl font-bold text-red-700">{reviewSummary.bad.toLocaleString()}</div></div></div>
                   <div className="pt-2 border-t border-gray-200">
                       <div className="flex justify-between text-xs text-gray-500 mb-1"><span>当前视图好评率</span><span>{reviewSummary.good + reviewSummary.bad > 0 ? ((reviewSummary.good / (reviewSummary.good + reviewSummary.bad)) * 100).toFixed(1) : 0}%</span></div>
                       <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{width: `${reviewSummary.good + reviewSummary.bad > 0 ? (reviewSummary.good / (reviewSummary.good + reviewSummary.bad) * 100) : 0}%`}}></div></div>
                   </div>
               </div>
               <div className="col-span-3 p-0">
                   <div className="max-h-[300px] overflow-y-auto">
                       <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50 sticky top-0"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域/机构名称</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">行政级别</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">好评数</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">差评数</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">评价分布</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">好评率</th></tr></thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                               {filteredReviewStats.length > 0 ? filteredReviewStats.map(stat => {
                                   const total = stat.good + stat.bad;
                                   const goodPercent = total > 0 ? (stat.good / total) * 100 : 0;
                                   return (
                                       <tr key={stat.id} className="hover:bg-gray-50">
                                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.name}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge type="neutral">{stat.level}</Badge></td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">{stat.good.toLocaleString()}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">{stat.bad.toLocaleString()}</td>
                                           <td className="px-6 py-4 whitespace-nowrap"><div className="w-full h-2 bg-red-100 rounded-full overflow-hidden flex"><div className="h-full bg-green-500" style={{width: `${goodPercent}%`}} title={`好评: ${goodPercent.toFixed(1)}%`}></div></div></td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-800">{stat.rate}</td>
                                       </tr>
                                   )
                               }) : (
                                   <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">当前层级无下级区域/机构数据</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
           <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Trophy className="w-4 h-4 text-orange-600"/> 评分排行榜</h3><div className="flex bg-gray-200 rounded p-0.5 text-xs"><button className={`px-3 py-1 rounded transition-colors ${activeTab === 'region' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`} onClick={() => setActiveTab('region')}>按医院</button><button className={`px-3 py-1 rounded transition-colors ${activeTab === 'business' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`} onClick={() => setActiveTab('business')}>按业务</button></div></div>
               <div className="flex-1 overflow-hidden p-2"><InteractiveRankingChart title={activeTab === 'region' ? "医疗机构满意度排名 TOP5" : "业务类型满意度排名 TOP5"} data={activeTab === 'region' ? hospitalRankings : businessRankings} activeId="" onBarClick={() => {}} color="orange" unit="分" /></div>
           </div>
           <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><h3 className="font-bold text-gray-800 flex items-center gap-2"><ThumbsDown className="w-4 h-4 text-red-600"/> 差评记录分析</h3><Badge type="neutral">最近30天</Badge></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">{negativeReviews.map(review => (<div key={review.id} className="border border-red-50 bg-red-50/20 rounded-lg p-3 hover:bg-red-50/50 transition-colors"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><span className={`text-[10px] px-1.5 py-0.5 rounded border ${tagMap[review.tag]?.color || 'bg-gray-100'}`}>{tagMap[review.tag]?.label || review.tag}</span><span className="text-xs font-bold text-gray-700">{review.service}</span></div><div className="flex text-orange-400">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.score ? 'fill-current' : 'text-gray-300'}`} />))}</div></div><p className="text-sm text-gray-800 mb-2">{review.content}</p><div className="flex justify-between items-center text-xs text-gray-400"><span>{review.hosp}</span><span>{review.date}</span></div></div>))}
                <div className="text-center pt-2">
                    {/* UPDATED BUTTON WITH ONCLICK */}
                    <button 
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => setIsReviewModalOpen(true)}
                    >
                        查看全部差评记录 &gt;
                    </button>
                </div></div>
           </div>
       </div>
    </div>
   );
};