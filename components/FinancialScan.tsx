import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRANSACTIONS, MOCK_INSTITUTIONS, MOCK_REGIONS, H2H_SERVICES, TOC_SERVICES, MOCK_DOCTORS } from '../constants';
import { Transaction, Institution, Region, AdminLevel } from '../types';
import { Table, Badge, Button, Modal } from './UI';
import { 
  Eye, FileText, Download, ChevronRight, ArrowLeft, 
  TrendingUp, PieChart, Wallet, CreditCard, Building2,
  Activity, ArrowUpRight, ArrowDownRight, Network, DollarSign,
  Filter, Calendar, Search, User, Stethoscope, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';

interface Props {
  currentRegionCode: string;
  activeRegion: Region;
}

// Helper: Determine Service Category
const getServiceCategory = (serviceName: string): 'H2H' | 'ToC' | 'Other' => {
  if (H2H_SERVICES.includes(serviceName)) return 'H2H';
  if (TOC_SERVICES.includes(serviceName)) return 'ToC';
  return 'Other';
};

const CATEGORY_LABELS = {
  'H2H': { label: '远程医疗 (机构-机构)', color: 'blue' },
  'ToC': { label: '互联网医疗 (机构-患者)', color: 'green' },
  'Other': { label: '其他服务', color: 'gray' },
};

// --- Transaction List Modal ---
interface TransactionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  institutionName: string;
}

const TransactionListModal: React.FC<TransactionListModalProps> = ({ isOpen, onClose, serviceName, institutionName }) => {
  const transactions = useMemo(() => {
    if (!isOpen) return [];
    return Array.from({ length: 15 }).map((_, i) => {
      const isMale = Math.random() > 0.5;
      const dept = ['心内科', '神经内科', '呼吸科', '骨科', '皮肤科'][Math.floor(Math.random() * 5)];
      const doc = MOCK_DOCTORS[Math.floor(Math.random() * MOCK_DOCTORS.length)];
      
      return {
        id: `T${Date.now()}-${i}`,
        patientName: isMale ? `张${i + 1}` : `李${i + 1}`,
        patientGender: isMale ? '男' : '女',
        patientAge: Math.floor(Math.random() * 60) + 10,
        dept: dept,
        doctorName: doc.name,
        serviceType: serviceName,
        price: Math.floor(Math.random() * 200) + 50,
        date: '2023-10-27 10:30',
        status: '已结算'
      };
    });
  }, [isOpen, serviceName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="业务消费流水详情" maxWidth="max-w-4xl">
       <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm flex gap-6 text-gray-600">
              <span>医疗机构: <b className="text-gray-900">{institutionName}</b></span>
              <span>业务类型: <b className="text-blue-600">{serviceName}</b></span>
          </div>
          <Table 
             rowKey="id"
             dataSource={transactions}
             columns={[
               { title: '流水号', render: (r:any) => <span className="font-mono text-xs text-gray-500">{r.id}</span> },
               { title: '患者姓名', render: (r:any) => (
                 <div className="flex items-center gap-1">
                   <User className="w-3 h-3 text-gray-400"/>
                   <span className="font-medium text-gray-700">{r.patientName}</span>
                 </div>
               )},
               { title: '性别/年龄', render: (r:any) => `${r.patientGender} / ${r.patientAge}岁` },
               { title: '科室', render: (r:any) => r.dept },
               { title: '执行医生', render: (r:any) => (
                 <div className="flex items-center gap-1">
                   <Stethoscope className="w-3 h-3 text-gray-400"/>
                   {r.doctorName}
                 </div>
               )},
               // REMOVED PRICE COLUMN AS REQUESTED
               { title: '时间', render: (r:any) => r.date },
               { title: '状态', render: (r:any) => <Badge type="success">{r.status}</Badge> },
             ]}
          />
       </div>
    </Modal>
  );
};


// --- Tier 1: Core Cockpit KPI Card ---
const KpiCard = ({ title, value, subText, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
     <div className="flex justify-between items-start">
        <div>
           <p className="text-gray-500 text-sm font-medium">{title}</p>
           <h3 className={`text-2xl font-bold text-gray-800 mt-2`}>{value}</h3>
        </div>
        <div className={`p-2 bg-${color}-50 rounded-lg text-${color}-600`}>
           <Icon className="w-6 h-6" />
        </div>
     </div>
     <div className="flex items-center text-xs mt-2">
        {trend && (
           <span className={`flex items-center font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} mr-2`}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1"/> : <ArrowDownRight className="w-3 h-3 mr-1"/>}
              {Math.abs(trend)}%
           </span>
        )}
        <span className="text-gray-400">{subText}</span>
     </div>
  </div>
);

// --- Tier 3: Institution Penetration View ---
const InstitutionPenetration = ({ institution, onClose }: { institution: Institution; onClose: () => void }) => {
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<string | null>(null);

  const financialReport = useMemo(() => {
     const seed = institution.id.charCodeAt(0);
     const services = [...H2H_SERVICES.slice(0, 8), ...TOC_SERVICES.slice(0, 6)];
     
     return services.map((svc, idx) => {
        const count = Math.floor((seed * (idx + 1) * 13) % 500) + 12;
        const price = Math.floor((seed * (idx + 1) * 7) % 300) + 50;
        
        // Mock Direction logic
        let direction: 'Income' | 'Expenditure' = 'Income';
        // Mock: Some H2H services are expenditures (referrals out, etc.)
        if (H2H_SERVICES.includes(svc) && (seed + idx) % 4 === 0) {
            direction = 'Expenditure';
        }

        return {
           id: `rpt-${idx}`,
           serviceName: svc,
           category: getServiceCategory(svc),
           direction: direction,
           count: count,
           price: price,
           total: count * price
        };
     }).sort((a, b) => b.total - a.total);
  }, [institution]);

  const totalIncome = financialReport.filter(r => r.direction === 'Income').reduce((acc, cur) => acc + cur.total, 0);
  const totalExpenditure = financialReport.filter(r => r.direction === 'Expenditure').reduce((acc, cur) => acc + cur.total, 0);
  const netIncome = totalIncome - totalExpenditure;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
       <TransactionListModal 
         isOpen={!!selectedServiceForDetail}
         onClose={() => setSelectedServiceForDetail(null)}
         serviceName={selectedServiceForDetail || ''}
         institutionName={institution.name}
       />

       {/* Header */}
       <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-1" /> 返回汇总
             </Button>
             <div className="h-8 w-px bg-gray-200"></div>
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold
                   ${institution.level.includes('三级') ? 'bg-indigo-600' : 'bg-blue-500'}`}>
                   <Building2 className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-gray-800">{institution.name}</h2>
                   <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Badge type="neutral">{institution.level}</Badge>
                      <span>|</span>
                      <span>财务穿透审计视图</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="flex gap-2">
             <Button variant="secondary"><Download className="w-4 h-4 mr-2"/> 导出审计报告</Button>
          </div>
       </div>

       {/* Analysis Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-500"/> 收入构成分析
             </h4>
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">总营收</span>
                    <span className="text-lg font-bold text-gray-900">¥{totalIncome.toLocaleString()}</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                       <span>远程医疗 (H2H)</span>
                       <span>65%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                       <span>互联网医疗 (ToC)</span>
                       <span>35%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
                    </div>
                 </div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-orange-500"/> 成本与利润概算
             </h4>
             <div className="flex items-center justify-around py-2">
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">28%</div>
                    <div className="text-xs text-gray-400 mt-1">人力成本占比</div>
                 </div>
                 <div className="w-px h-10 bg-gray-200"></div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">15%</div>
                    <div className="text-xs text-gray-400 mt-1">设施运维占比</div>
                 </div>
             </div>
             <div className="mt-4 p-3 bg-green-50 rounded border border-green-100 flex justify-between items-center">
                 <span className="text-sm font-medium text-green-700">预估净利润率</span>
                 <span className="text-lg font-bold text-green-700">57%</span>
             </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-500"/> 协作网络结算
             </h4>
             <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-600">上级转诊/会诊支出</span>
                     <span className="font-mono text-gray-900">- ¥45,200</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-600">下级接收/指导收入</span>
                     <span className="font-mono text-green-600 font-bold">+ ¥128,500</span>
                 </div>
                 <div className="pt-2 border-t border-gray-100">
                     <span className="text-xs text-gray-400">主要往来机构: 贵州省人民医院, 乌当区人民医院</span>
                 </div>
             </div>
          </div>
       </div>

       {/* Detail Table */}
       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">业务收支明细报表</h3>
              <div className="flex gap-2">
                 <Badge type="success">收入项</Badge>
                 <Badge type="danger">支出项</Badge>
              </div>
           </div>
           <Table
             rowKey="id"
             dataSource={financialReport}
             columns={[
               { title: '业务类型', render: (r: any) => (
                  <div>
                     <div className="font-medium text-gray-900">{r.serviceName}</div>
                     <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.category === 'H2H' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS]?.label}
                     </span>
                  </div>
               )},
               { title: '收支方向', render: (r: any) => (
                   <div className={`flex items-center gap-1 font-bold text-xs ${r.direction === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                       {r.direction === 'Income' ? <ArrowUpCircle className="w-3 h-3"/> : <ArrowDownCircle className="w-3 h-3"/>}
                       {r.direction === 'Income' ? '收入' : '支出'}
                   </div>
               )},
               { title: '计费次数', render: (r: any) => r.count.toLocaleString() },
               { title: '单次均价', render: (r: any) => `¥${r.price}` },
               { title: '总金额', render: (r: any) => (
                   <span className={`font-mono font-bold ${r.direction === 'Income' ? 'text-green-700' : 'text-red-700'}`}>
                       {r.direction === 'Income' ? '+' : '-'}¥{r.total.toLocaleString()}
                   </span> 
               )},
               { title: '占比 (收入)', render: (r: any) => {
                  if (r.direction === 'Expenditure') return <span className="text-gray-300 text-xs">-</span>;
                  const percent = (r.total / totalIncome) * 100;
                  return (
                      <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${r.category === 'H2H' ? 'bg-blue-500' : 'bg-green-500'}`} style={{width: `${percent}%`}}></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8">{percent.toFixed(0)}%</span>
                      </div>
                  );
               }},
               { title: '操作', render: (r:any) => (
                   <Button size="sm" variant="ghost" onClick={() => setSelectedServiceForDetail(r.serviceName)}>
                       <Eye className="w-3 h-3 mr-1"/> 查看详情
                   </Button>
               )}
             ]}
           />
           <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-6 items-center">
              <div className="text-right">
                  <span className="text-xs text-gray-500 block">总收入</span>
                  <span className="text-lg font-bold text-green-600">+¥{totalIncome.toLocaleString()}</span>
              </div>
              <div className="text-right">
                  <span className="text-xs text-gray-500 block">总支出</span>
                  <span className="text-lg font-bold text-red-600">-¥{totalExpenditure.toLocaleString()}</span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-right">
                  <span className="text-xs text-gray-500 block">净结余</span>
                  <span className="text-2xl font-bold text-blue-700">¥{netIncome.toLocaleString()}</span>
              </div>
           </div>
       </div>
    </div>
  );
};

export const FinancialScan: React.FC<Props> = ({ activeRegion }) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  
  // -- Region Filters State --
  const [filterRegion, setFilterRegion] = useState({ 
      province: '520000', 
      city: '', 
      county: '' 
  });
  
  useEffect(() => {
     const level = activeRegion.level;
     if (level === AdminLevel.PROVINCE) {
          setFilterRegion({ province: activeRegion.code, city: '', county: '' });
     } else if (level === AdminLevel.CITY) {
          setFilterRegion({ province: activeRegion.parentCode || '520000', city: activeRegion.code, county: '' });
     } else if (level === AdminLevel.COUNTY) {
          setFilterRegion({ province: '520000', city: activeRegion.parentCode || '', county: activeRegion.code });
     }
  }, [activeRegion]);

  const [filters, setFilters] = useState({
      category: 'All' as 'All' | 'H2H' | 'ToC',
      dateRange: 'month'
  });

  // -- Cascading Options --
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

  // --- Mock Aggregated Data Generation with INTERACTIVE FILTERING ---
  const aggregatedStats = useMemo(() => {
      const multiplier = activeRegion.level === AdminLevel.PROVINCE ? 100 : activeRegion.level === AdminLevel.CITY ? 20 : 5;
      
      const totalIncomeRaw = 12584000 * multiplier * 0.8;
      const totalVolumeRaw = 45200 * multiplier * 0.9;
      const instCount = MOCK_INSTITUTIONS.filter(i => i.regionCode.startsWith(activeRegion.code)).length * (activeRegion.level === AdminLevel.PROVINCE ? 15 : 1);
      
      // Interactive logic: Adjust totals based on category filter
      let displayIncome = totalIncomeRaw;
      let displayVolume = totalVolumeRaw;

      if (filters.category === 'H2H') {
          displayIncome = totalIncomeRaw * 0.65; // Mock: 65% is H2H
          displayVolume = totalVolumeRaw * 0.60;
      } else if (filters.category === 'ToC') {
          displayIncome = totalIncomeRaw * 0.35; // Mock: 35% is ToC
          displayVolume = totalVolumeRaw * 0.40;
      }

      return {
          totalIncome: displayIncome,
          totalVolume: displayVolume,
          avgFee: Math.floor(displayIncome / displayVolume),
          instCount,
          // Original totals needed for breakdowns
          rawIncome: totalIncomeRaw, 
          trend: 12.5
      };
  }, [activeRegion, filters.category]);

  // --- Sub-region List Logic with INTERACTIVE FILTERING ---
  const subRegionStats = useMemo(() => {
     const children = MOCK_REGIONS.filter(r => r.parentCode === currentRegionCode);
     const list = children.length > 0 ? children : MOCK_REGIONS.filter(r => r.code === currentRegionCode);

     return list.map(r => {
        const seed = r.code.charCodeAt(r.code.length - 1);
        // Base numbers for this region
        const baseVolume = Math.floor(aggregatedStats.rawIncome / 278 * (0.8 + (seed % 5)/10) / 100); // normalized
        const baseIncome = Math.floor(aggregatedStats.rawIncome / (list.length || 1) * (0.8 + (seed % 5)/10));
        
        const h2hIncome = baseIncome * 0.65;
        const tocIncome = baseIncome * 0.35;
        
        let rowIncome = baseIncome;
        let rowVolume = baseVolume;

        // Apply Filter to Row Data
        if (filters.category === 'H2H') {
            rowIncome = h2hIncome;
            rowVolume = baseVolume * 0.6;
        } else if (filters.category === 'ToC') {
            rowIncome = tocIncome;
            rowVolume = baseVolume * 0.4;
        }

        return {
            ...r,
            income: rowIncome,
            volume: rowVolume,
            h2hIncome,
            tocIncome,
            rawIncome: baseIncome // Keep total for percentage calculation if needed
        };
     }).sort((a, b) => b.income - a.income);
  }, [currentRegionCode, aggregatedStats, filters.category]);

  // --- Institution List Logic (Filtered) ---
  const filteredInstitutions = useMemo(() => {
     let insts = MOCK_INSTITUTIONS.filter(i => i.regionCode.startsWith(currentRegionCode));
     return insts.map(i => {
         const income = Math.floor(Math.random() * 500000) + 100000;
         return { ...i, income };
     }).sort((a, b) => b.income - a.income);
  }, [currentRegionCode]);

  // Dynamic Titles based on Filter
  const getIncomeTitle = () => {
      if (filters.category === 'H2H') return '远程医疗营收';
      if (filters.category === 'ToC') return '互联网医疗营收';
      return '全区总营收';
  };

  // Render
  if (selectedInstitution) {
      return <InstitutionPenetration institution={selectedInstitution} onClose={() => setSelectedInstitution(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 pb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Wallet className="text-blue-600"/> 财务监管
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    当前区域: <span className="font-bold text-gray-700">{activeRegion.name}</span> | 数据周期: 本月
                </p>
            </div>
            <div className="flex gap-3 items-center">
                <div className="flex items-center bg-gray-100 rounded-md p-1">
                    {['All', 'H2H', 'ToC'].map(c => (
                        <button
                            key={c}
                            onClick={() => setFilters(prev => ({ ...prev, category: c as any }))}
                            className={`px-3 py-1 text-xs font-medium rounded transition-all ${filters.category === c ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {c === 'All' ? '全部' : c === 'H2H' ? '远程医疗' : '互联网医疗'}
                        </button>
                    ))}
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400"/>
                    <select className="text-sm border-gray-300 border rounded px-2 py-1 bg-gray-50">
                        <option value="month">本月</option>
                        <option value="quarter">本季度</option>
                        <option value="year">本年度</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Region Filter Bar (New) */}
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-bold">行政区域筛选:</span>
            </div>
            <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50"
                value={filterRegion.province}
                onChange={(e) => handleRegionChange('province', e.target.value)}
                disabled
            >
                {provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
            <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50"
                value={filterRegion.city}
                onChange={(e) => handleRegionChange('city', e.target.value)}
            >
                <option value="">全部城市</option>
                {cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
            <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50"
                value={filterRegion.county}
                onChange={(e) => handleRegionChange('county', e.target.value)}
                disabled={!filterRegion.city}
            >
                <option value="">全部区县</option>
                {counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
         </div>
      </div>

      {/* 2. Tier 1: Core Cockpit KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <KpiCard 
            title={getIncomeTitle()}
            value={`¥${aggregatedStats.totalIncome.toLocaleString()}`} 
            subText="环比上月"
            trend={12.5}
            icon={DollarSign}
            color="blue"
         />
         <KpiCard 
            title="总服务单量" 
            value={aggregatedStats.totalVolume.toLocaleString()} 
            subText="笔交易"
            trend={5.2}
            icon={CreditCard}
            color="green"
         />
         <KpiCard 
            title="次均费用" 
            value={`¥${aggregatedStats.avgFee.toLocaleString()}`} 
            subText="元/次"
            trend={-1.2}
            icon={Activity}
            color="orange"
         />
         <KpiCard 
            title="参与结算机构" 
            value={aggregatedStats.instCount} 
            subText="家医疗机构"
            trend={0}
            icon={Building2}
            color="indigo"
         />
      </div>

      {/* 3. Tier 2: Breakdown Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Regional Analysis Table */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600"/> 区域财务分析明细
                  </h3>
                  <Badge type="neutral">下辖区域排名</Badge>
              </div>
              <Table
                 rowKey="code"
                 dataSource={subRegionStats}
                 columns={[
                     { title: '区域名称', render: (r: any) => <span className="font-bold text-gray-700">{r.name}</span> },
                     { title: filters.category === 'All' ? '总营收' : getIncomeTitle(), render: (r: any) => <span className="font-mono font-medium text-blue-600">¥{r.income.toLocaleString()}</span> },
                     { title: '服务量', render: (r: any) => r.volume.toLocaleString() },
                     { title: '构成', render: (r: any) => {
                         if (filters.category !== 'All') return <span className="text-gray-400 text-xs">-</span>;
                         return (
                             <div className="flex flex-col gap-1">
                                 <div className="flex h-2 w-24 rounded-full overflow-hidden bg-gray-100">
                                     <div className="bg-blue-500 h-full" style={{width: `${(r.h2hIncome / r.rawIncome)*100}%`}} title={`H2H: ¥${r.h2hIncome.toLocaleString()}`}></div>
                                     <div className="bg-green-500 h-full" style={{width: `${(r.tocIncome / r.rawIncome)*100}%`}} title={`ToC: ¥${r.tocIncome.toLocaleString()}`}></div>
                                 </div>
                                 <div className="flex gap-2 text-[9px] text-gray-400">
                                    <span className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"/>远程医疗</span>
                                    <span className="flex items-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"/>互联网医院</span>
                                 </div>
                             </div>
                         )
                     }},
                 ]}
              />
          </div>

          {/* Right: Institution List (Entry to Tier 3) */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600"/> 机构查询
                  </h3>
              </div>
              <div className="p-3 border-b border-gray-100">
                  <input placeholder="搜索机构名称..." className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="flex-1 overflow-y-auto">
                  {filteredInstitutions.map((inst, idx) => (
                      <div 
                        key={inst.id} 
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedInstitution(inst)}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{inst.name}</span>
                              <Badge type="neutral">{inst.level}</Badge>
                          </div>
                          <div className="flex justify-between items-end">
                              <div className="text-xs text-gray-500">{inst.address}</div>
                              <div className="text-right">
                                  <div className="text-xs text-gray-400">预估营收</div>
                                  <div className="font-bold text-gray-900 text-sm">¥{inst.income.toLocaleString()}</div>
                              </div>
                          </div>
                          <div className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
                              查看详细报表 <ChevronRight className="w-3 h-3 ml-1"/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};