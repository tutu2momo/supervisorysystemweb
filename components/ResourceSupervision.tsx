import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS, MOCK_INSTITUTIONS, MOCK_REGIONS, MOCK_PATIENTS } from '../constants';
import { Table, Badge, Button, Modal } from './UI';
import { Doctor, Patient, AdminLevel } from '../types';
import { 
  Users, Stethoscope, Star, Activity,
  Search,
  Eye, FileText, Calendar, MapPin, UserSquare, ShieldCheck,
  Building2, Trophy, ArrowRightLeft, Percent, TrendingUp
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
  unit = "人"
}: { 
  data: { id: string; name: string; value: number }[]; 
  onBarClick: (id: string) => void; 
  activeId: string;
  color?: string;
  title: string;
  unit?: string;
}) => {
  const maxVal = Math.max(...data.map(d => d.value)) || 1;

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
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            点击图表筛选列表
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {data.length > 0 ? (
          data.map((item, index) => {
             const isActive = activeId === item.id;
             const percent = (item.value / maxVal) * 100;
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

// --- 4. Resource Supervision (Optimized) ---
export const ResourceSupervision = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'patients'>('doctors');
  const [filters, setFilters] = useState({
    province: '520000', // Default Guizhou
    city: '',
    county: '',
    hospitalId: '',
    dateStart: '',
    dateEnd: '',
    keyword: ''
  });
  const [previewCert, setPreviewCert] = useState<{name: string} | null>(null);

  // -- Cascading Select Options --
  const provinces = MOCK_REGIONS.filter(r => r.level === AdminLevel.PROVINCE);
  const cities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === filters.province), [filters.province]);
  const counties = useMemo(() => filters.city ? MOCK_REGIONS.filter(r => r.parentCode === filters.city) : [], [filters.city]);
  
  const hospitals = useMemo(() => {
    // Filter hospitals based on the lowest selected region
    const targetRegionCode = filters.county || filters.city || filters.province;
    return MOCK_INSTITUTIONS.filter(h => h.regionCode.startsWith(targetRegionCode));
  }, [filters.province, filters.city, filters.county]);

  // -- Ranking Data Logic --
  // Changed to Top 5 as requested
  
  // 1. Doctor Ranking
  const doctorRankingData = useMemo(() => {
    const targetRegionCode = filters.county || filters.city || filters.province;
    
    // Get all doctors in the current region scope (ignoring the specific hospital filter)
    const scopeDoctors = MOCK_DOCTORS.filter(d => {
       const inst = MOCK_INSTITUTIONS.find(i => i.id === d.institutionId);
       return inst && inst.regionCode.startsWith(targetRegionCode);
    });

    const counts: Record<string, { name: string, count: number }> = {};
    scopeDoctors.forEach(d => {
        if (!counts[d.institutionId || 'unknown']) {
            counts[d.institutionId || 'unknown'] = { name: d.institutionName, count: 0 };
        }
        counts[d.institutionId || 'unknown'].count++;
    });

    return Object.entries(counts)
      .map(([id, val]) => ({ id, name: val.name, value: val.count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // CHANGED: Top 5
  }, [filters.province, filters.city, filters.county]); 

  // 2. Hospital Ranking (Used in Patients View)
  const patientRankingData = useMemo(() => {
    const targetRegionCode = filters.county || filters.city || filters.province;
    
    const scopePatients = MOCK_PATIENTS.filter(p => p.regionCode.startsWith(targetRegionCode));

    const counts: Record<string, { name: string, count: number }> = {};
    scopePatients.forEach(p => {
        if (!counts[p.hospitalId]) {
            counts[p.hospitalId] = { name: p.hospitalName, count: 0 };
        }
        counts[p.hospitalId].count++;
    });

    return Object.entries(counts)
      .map(([id, val]) => ({ id, name: val.name, value: val.count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // CHANGED: Top 5
  }, [filters.province, filters.city, filters.county]);

  // 3. Sub-Region Patient Ranking (New Logic)
  const subRegionPatientData = useMemo(() => {
    const currentCode = filters.county || filters.city || filters.province;
    
    // Determine children regions
    let children = MOCK_REGIONS.filter(r => r.parentCode === currentCode);
    if (children.length === 0) {
        // Leaf level, maybe show self or stay empty
        children = MOCK_REGIONS.filter(r => r.code === currentCode);
    }

    const counts: Record<string, { name: string, count: number }> = {};
    children.forEach(c => counts[c.code] = { name: c.name, count: 0 });

    // Mock count aggregation (since mock patients are limited, we simulate distribution)
    MOCK_PATIENTS.forEach(p => {
        // Simplified: Assign random patients to subregions for visualization if exact match fails in mock
        const target = children.find(c => p.regionCode.startsWith(c.code)) || children[p.id.charCodeAt(0) % children.length];
        if (target && counts[target.code]) {
            counts[target.code].count++;
        }
    });

    return Object.entries(counts)
      .map(([id, val]) => ({ id, name: val.name, value: val.count }))
      .sort((a, b) => b.value - a.value);

  }, [filters.province, filters.city, filters.county]);


  // -- Filtered Lists Logic --
  const filteredDoctors = useMemo(() => {
    let list = MOCK_DOCTORS;
    if (filters.hospitalId) list = list.filter(d => d.institutionId === filters.hospitalId);
    else if (filters.county || filters.city || filters.province) {
       const targetHospitals = new Set(hospitals.map(h => h.id));
       list = list.filter(d => targetHospitals.has(d.institutionId || ''));
    }
    return list;
  }, [filters, hospitals]);

  const doctorStats = useMemo(() => {
    const total = filteredDoctors.length;
    const qualifiedCount = filteredDoctors.filter(d => d.qualified).length;
    const passRate = total > 0 ? ((qualifiedCount / total) * 100).toFixed(1) + '%' : '0%';
    
    // Dynamic Stat Calculations
    const seniorCount = filteredDoctors.filter(d => d.title === '主任医师' || d.title === '副主任医师').length;
    const seniorRatio = total > 0 ? ((seniorCount / total) * 100).toFixed(1) + '%' : '0%';
    
    const totalService = filteredDoctors.reduce((acc, curr) => acc + curr.serviceCount, 0);
    const avgService = total > 0 ? Math.floor(totalService / total).toLocaleString() : '0';

    // Title distribution
    const titles = {
      '主任医师': 0, '副主任医师': 0, '主治医师': 0, '医师': 0, '医士': 0
    };
    filteredDoctors.forEach(d => {
       if (d.title in titles) titles[d.title as keyof typeof titles]++;
    });

    return { total, passRate, titles, seniorRatio, avgService };
  }, [filteredDoctors]);

  const titleColors: Record<string, string> = {
    '主任医师': '#3B82F6', // Blue 500
    '副主任医师': '#6366F1', // Indigo 500
    '主治医师': '#8B5CF6', // Violet 500
    '医师': '#EC4899', // Pink 500
    '医士': '#9CA3AF'  // Gray 400
  };

  const filteredPatients = useMemo(() => {
    let list = MOCK_PATIENTS;
    if (filters.hospitalId) list = list.filter(p => p.hospitalId === filters.hospitalId);
    else if (filters.county || filters.city || filters.province) {
       const targetCode = filters.county || filters.city || filters.province;
       list = list.filter(p => p.regionCode.startsWith(targetCode));
    }

    if (filters.dateStart) list = list.filter(p => p.visitDate >= filters.dateStart);
    if (filters.dateEnd) list = list.filter(p => p.visitDate <= filters.dateEnd);
    if (filters.keyword) list = list.filter(p => p.name.includes(filters.keyword));
    return list;
  }, [filters]);

  const patientStats = useMemo(() => {
     const total = filteredPatients.length;
     // Mock Region Flow Logic
     const flow = {
        'Local': filteredPatients.filter(p => p.referralType === 'Local').length,
        'In': filteredPatients.filter(p => p.referralType === 'In').length,
        'Out': filteredPatients.filter(p => p.referralType === 'Out').length,
     };
     return { total, flow };
  }, [filteredPatients]);

  // -- Handlers --
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
        const next = { ...prev, [key]: value };
        // Reset children on parent change
        if (key === 'province') { next.city = ''; next.county = ''; next.hospitalId = ''; }
        if (key === 'city') { next.county = ''; next.hospitalId = ''; }
        if (key === 'county') { next.hospitalId = ''; }
        // Reset hospital if region changes
        if (['province', 'city', 'county'].includes(key)) { next.hospitalId = ''; }
        return next;
    });
  };

  const handleHospitalBarClick = (hospitalId: string) => {
    setFilters(prev => ({
      ...prev,
      hospitalId: prev.hospitalId === hospitalId ? '' : hospitalId
    }));
  };

  const handleSubRegionClick = (regionCode: string) => {
     const region = MOCK_REGIONS.find(r => r.code === regionCode);
     if (!region) return;

     if (region.level === AdminLevel.CITY) {
         setFilters(prev => ({ ...prev, city: region.code, county: '', hospitalId: '' }));
     } else if (region.level === AdminLevel.COUNTY) {
         setFilters(prev => ({ ...prev, county: region.code, hospitalId: '' }));
     }
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
           <MapPin className="w-4 h-4" />
           <span className="font-bold">区域筛选:</span>
        </div>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filters.province} onChange={e => handleFilterChange('province', e.target.value)}>
           {provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filters.city} onChange={e => handleFilterChange('city', e.target.value)} disabled={!filters.province}>
           <option value="">全部城市</option>
           {cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" value={filters.county} onChange={e => handleFilterChange('county', e.target.value)} disabled={!filters.city}>
           <option value="">全部区县</option>
           {counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
           <Building2 className="w-4 h-4" />
           <span className="font-bold">医院筛选:</span>
        </div>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 min-w-[200px]" value={filters.hospitalId} onChange={e => handleFilterChange('hospitalId', e.target.value)}>
           <option value="">全部医疗机构</option>
           {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {/* 2. Tabs Switcher */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button 
           onClick={() => setActiveTab('doctors')}
           className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'doctors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
           <Users className="w-4 h-4 inline-block mr-2" /> 医生资源列表
        </button>
        <button 
           onClick={() => setActiveTab('patients')}
           className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'patients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
           <UserSquare className="w-4 h-4 inline-block mr-2" /> 患者信息列表
        </button>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'doctors' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Row: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard label="医生总数" value={doctorStats.total} subtext="当前筛选范围" icon={Stethoscope} color="blue" />
               <StatCard label="资质合格率" value={doctorStats.passRate} subtext="执业证/资格证" icon={ShieldCheck} color="green" />
               <StatCard label="高级职称占比" value={doctorStats.seniorRatio} subtext="副高及以上" icon={Star} color="indigo" />
               <StatCard label="人均服务量" value={doctorStats.avgService} subtext="近12个月" icon={Activity} color="orange" />
            </div>

            {/* Middle Row: Charts (Left: Top 5, Right: Distribution) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[260px]">
               {/* Left: Ranking Chart (Top 5) */}
               <div className="lg:col-span-5 h-full">
                  <InteractiveRankingChart 
                     title="医院医生资源 TOP5" 
                     data={doctorRankingData} 
                     activeId={filters.hospitalId}
                     onBarClick={handleHospitalBarClick}
                     color="blue"
                  />
               </div>

               {/* Right: Distribution (NEW Donut Chart) */}
               <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                   <div className="flex justify-between items-center mb-4 shrink-0">
                      <div className="text-sm font-bold text-gray-800">医生职称分布概览</div>
                      <Badge type="neutral">实时数据</Badge>
                   </div>
                   <div className="flex-1 flex items-center justify-around">
                        {/* Donut Chart Implementation */}
                        {(() => {
                            const data = Object.entries(doctorStats.titles).map(([key, val]) => ({
                                label: key,
                                value: val as number,
                                color: titleColors[key] || '#9CA3AF'
                            })).sort((a,b) => b.value - a.value); // Sort for better visual
                            
                            const total = doctorStats.total;
                            let cumulativePercent = 0;

                            return (
                                <div className="flex items-center w-full gap-8 px-4">
                                    <div className="relative w-40 h-40 shrink-0">
                                         <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                            {data.map((item, i) => {
                                                const percent = total > 0 ? item.value / total : 0;
                                                const circumference = 2 * Math.PI * 40;
                                                const strokeDasharray = `${percent * circumference} ${circumference}`;
                                                const strokeDashoffset = -cumulativePercent * circumference;
                                                cumulativePercent += percent;
                                                return (
                                                    <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={item.color} strokeWidth="20" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all hover:opacity-80" />
                                                );
                                            })}
                                         </svg>
                                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                                             <span className="text-xs text-gray-400">总人数</span>
                                             <span className="text-xl font-bold text-gray-800">{total}</span>
                                         </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3">
                                         {data.map((item, i) => (
                                             <div key={i} className="flex items-center justify-between">
                                                 <div className="flex items-center gap-2">
                                                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                                                     <span className="text-sm text-gray-600">{item.label}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2">
                                                     <span className="font-bold text-gray-800">{item.value}</span>
                                                     <span className="text-xs text-gray-400 w-10 text-right">{total > 0 ? ((item.value/total)*100).toFixed(1) : 0}%</span>
                                                 </div>
                                             </div>
                                         ))}
                                    </div>
                                </div>
                            );
                        })()}
                   </div>
               </div>
            </div>

            {/* Bottom Row: List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">注册医师资源名录</h3>
                      {filters.hospitalId && (
                         <span className="text-xs text-blue-600 flex items-center mt-1">
                           已筛选: {MOCK_INSTITUTIONS.find(i => i.id === filters.hospitalId)?.name} 
                           <button onClick={() => handleFilterChange('hospitalId', '')} className="ml-2 underline opacity-70 hover:opacity-100">清除</button>
                         </span>
                      )}
                    </div>
                </div>
                <Table<Doctor>
                    rowKey="id"
                    dataSource={filteredDoctors}
                    columns={[
                    { title: '姓名', render: (r) => <span className="font-bold text-gray-900">{r.name}</span> },
                    { title: '职称', render: (r) => <Badge type="neutral">{r.title}</Badge> },
                    { title: '所属机构', render: (r) => r.institutionName },
                    { title: '专科方向', render: (r) => r.specialty },
                    { title: '累计服务量', render: (r) => r.serviceCount },
                    { title: '评分', render: (r) => <span className="text-orange-500 font-bold flex items-center">{r.rating} <Star className="w-3 h-3 ml-1 fill-current"/></span> },
                    { title: '资质状态', render: (r) => r.qualified ? <Badge type="success">合规</Badge> : <Badge type="danger">异常</Badge> },
                    { title: '操作', render: (r) => (
                        <Button size="sm" variant="ghost" onClick={() => setPreviewCert({ name: r.name })}>
                             <FileText className="w-3 h-3 mr-1"/> 查看资质
                        </Button>
                    )}
                    ]}
                />
            </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Top Row: KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="分级诊疗总人次" value={patientStats.total} subtext="本期累计" icon={Activity} color="purple" />
                <StatCard label="基层首诊率" value="62.5%" subtext="同比 +3.2%" icon={ArrowRightLeft} color="green" />
                <StatCard label="平均住院日" value="8.5天" subtext="同比 -0.5天" icon={Calendar} color="blue" />
                <StatCard label="患者满意度" value="98.2%" subtext="抽样调查" icon={Percent} color="orange" />
             </div>

            {/* Middle Row: Charts (Left: Visits, Right: Top 5) - SWAPPED */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[260px]">
               {/* Left: Sub-region Accumulation (Visits) */}
               <div className="lg:col-span-7 h-full">
                  <InteractiveRankingChart 
                     title="就诊患者数量" 
                     data={subRegionPatientData} 
                     activeId=""
                     onBarClick={handleSubRegionClick}
                     color="orange"
                     unit="人次"
                  />
               </div>

               {/* Right: Ranking Chart (Top 5) */}
               <div className="lg:col-span-5 h-full">
                  <InteractiveRankingChart 
                     title="医院接诊患者 TOP5" 
                     data={patientRankingData} 
                     activeId={filters.hospitalId}
                     onBarClick={handleHospitalBarClick}
                     color="green"
                     unit="人次"
                  />
               </div>
            </div>

            {/* Bottom Row: List with Filters */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <h3 className="font-bold text-gray-800">患者诊疗信息列表</h3>
                      {filters.hospitalId && (
                         <span className="text-xs text-green-600 flex items-center mt-1">
                           已筛选: {MOCK_INSTITUTIONS.find(i => i.id === filters.hospitalId)?.name} 
                           <button onClick={() => handleFilterChange('hospitalId', '')} className="ml-2 underline opacity-70 hover:opacity-100">清除</button>
                         </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                       <span className="text-xs text-gray-500">就诊时间:</span>
                       <input type="date" className="border border-gray-300 rounded px-2 py-1 text-xs" value={filters.dateStart} onChange={e => handleFilterChange('dateStart', e.target.value)} />
                       <span className="text-gray-400">-</span>
                       <input type="date" className="border border-gray-300 rounded px-2 py-1 text-xs" value={filters.dateEnd} onChange={e => handleFilterChange('dateEnd', e.target.value)} />
                       <div className="relative ml-2">
                          <input 
                            placeholder="搜索患者姓名..." 
                            className="border border-gray-300 rounded pl-8 pr-2 py-1 text-xs w-32" 
                            value={filters.keyword}
                            onChange={e => handleFilterChange('keyword', e.target.value)}
                          />
                          <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2" />
                       </div>
                       <Button size="sm">查询</Button>
                    </div>
                </div>
                <Table<Patient>
                    rowKey="id"
                    dataSource={filteredPatients}
                    columns={[
                    { title: '姓名', render: (r) => <span className="font-medium">{r.name}</span> },
                    { title: '性别', render: (r) => r.gender },
                    { title: '年龄', render: (r) => r.age },
                    { title: '初诊/分诊诊断', render: (r) => r.diagnosis },
                    { title: '就诊医院', render: (r) => r.hospitalName },
                    { title: '就诊日期', render: (r) => r.visitDate },
                    { title: '就诊区域', render: (r) => <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">{r.regionName}</span> },
                    { title: '流向类型', render: (r) => r.referralType === 'Out' ? <span className="text-orange-500 text-xs font-bold">转出</span> : r.referralType === 'In' ? <span className="text-blue-500 text-xs font-bold">转入</span> : <span className="text-green-500 text-xs">本地</span> },
                    ]}
                />
            </div>
        </div>
      )}

      {/* Cert Preview Modal */}
      <Modal isOpen={!!previewCert} onClose={() => setPreviewCert(null)} title="医师资质证书预览">
         <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded min-h-[300px]">
             <ShieldCheck className="w-16 h-16 text-blue-200 mb-4" />
             <div className="text-lg font-bold text-gray-700">{previewCert?.name} - 医师执业证书</div>
             <div className="text-sm text-gray-400 mt-2">证书编号: 11052000001****</div>
             <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg w-full h-48 flex items-center justify-center text-gray-400 text-sm">
                [ 证书扫描件预览图 ]
             </div>
         </div>
      </Modal>
    </div>
  );
};