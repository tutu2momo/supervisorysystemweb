import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_INSTITUTIONS, MOCK_REGIONS } from '../constants';
import { Institution, Region, AdminLevel } from '../types';
import { Button, Table, Badge, Modal } from './UI';
import { 
  FileClock, Network, ShieldCheck, 
  Eye, ChevronDown, ChevronRight, Paperclip, Building,
  Grid, Info, Search, Filter
} from 'lucide-react';

interface Props {
  currentRegionCode: string;
}

type TabType = 'info' | 'alliance' | 'qualifications';

// --- 1. Dashboard Style Stats Cards ---
const InstitutionDashboardCards = ({ data }: { data: Institution[] }) => {
  const stats = useMemo(() => {
    const total = data.length;
    const l3 = data.filter(i => i.level.includes('三级')).length;
    const l2 = data.filter(i => i.level.includes('二级')).length;
    const l1 = total - l3 - l2;
    
    return { total, l3, l2, l1 };
  }, [data]);

  const Card = ({ title, count, total, color, icon: Icon }: any) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
         <div className={`absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-600`}>
            <Icon size={80} />
         </div>
         <div>
            <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold text-${color}-700`}>{count}</span>
                <span className="text-xs text-gray-400">家</span>
            </div>
            {title !== '机构总量' && (
                <div className="mt-2 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${color}-500`} style={{ width: `${percent}%` }}></div>
                </div>
            )}
            {title !== '机构总量' && <div className="text-[10px] text-gray-400 mt-1">占比 {percent}%</div>}
         </div>
         <div className={`p-3 bg-${color}-50 rounded-lg text-${color}-600 z-10`}>
            <Icon className="w-6 h-6" />
         </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card title="机构总量" count={stats.total} total={0} color="blue" icon={Building} />
      <Card title="三级医院" count={stats.l3} total={stats.total} color="indigo" icon={Info} />
      <Card title="二级医院" count={stats.l2} total={stats.total} color="green" icon={Network} />
      <Card title="基层/其他" count={stats.l1} total={stats.total} color="orange" icon={ShieldCheck} />
    </div>
  );
};

// --- 2. Detail Modal ---
const DetailModal = ({ isOpen, onClose, institution }: { isOpen: boolean, onClose: () => void, institution: Institution | null }) => {
  if (!institution) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="医疗机构详情" maxWidth="max-w-2xl">
       <div className="w-[600px] h-[600px] flex flex-col mx-auto">
          {/* Top Section: Basic Info */}
          <div className="shrink-0 bg-blue-50/50 p-6 rounded-t-lg border-b border-gray-100 flex gap-5">
             <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                <Building size={40} />
             </div>
             <div className="flex-1 space-y-2 min-w-0">
                <h3 className="text-xl font-bold text-gray-800 leading-tight break-words">{institution.name}</h3>
                <div className="flex flex-wrap gap-2">
                   <Badge type="neutral">{institution.level}</Badge>
                   <Badge type={institution.status === 'Active' ? 'success' : 'danger'}>
                      {institution.status === 'Active' ? '运营中' : '已停业'}
                   </Badge>
                   <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200 whitespace-nowrap">
                     {institution.type === 'Hospital' ? '综合医院' : '基层机构'}
                   </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                   <p>法人代表：<span className="text-gray-800 font-medium">{institution.legalRepresentative || '-'}</span></p>
                   <p>联系电话：<span className="text-gray-800 font-medium">{institution.contactPhone || '-'}</span></p>
                   <div className="col-span-2 flex gap-1 mt-1">
                      <span className="shrink-0">地址：</span>
                      <span className="text-gray-700 break-words leading-snug">{institution.address}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Middle Section: Stats */}
          <div className="grid grid-cols-3 divide-x border-b border-gray-100 bg-white shrink-0">
              <div className="p-3 text-center">
                  <div className="text-xs text-gray-400">监管科室</div>
                  <div className="text-lg font-bold text-gray-800">{institution.departmentCount || 0}</div>
              </div>
              <div className="p-3 text-center">
                  <div className="text-xs text-gray-400">资质证书</div>
                  <div className="text-lg font-bold text-gray-800">{institution.qualifications?.length || 0}</div>
              </div>
              <div className="p-3 text-center">
                  <div className="text-xs text-gray-400">违规记录</div>
                  <div className="text-lg font-bold text-green-600">0</div>
              </div>
          </div>

          {/* Bottom Section: Departments List */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4">
             <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Grid size={14} /> 纳入监管科室列表
             </h4>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {institution.departments && institution.departments.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {institution.departments.map((dept, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded border border-gray-200 text-center shadow-sm hover:shadow-md transition-all cursor-default group">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 truncate block" title={dept.name}>
                                    {dept.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Building size={32} className="mb-2 opacity-20"/>
                        <span className="text-xs">暂无详细科室数据</span>
                    </div>
                )}
             </div>
          </div>
       </div>
    </Modal>
  );
};

// --- Helper: Image Preview Modal ---
const ImagePreviewModal = ({ isOpen, onClose, imageUrl, title }: { isOpen: boolean, onClose: () => void, imageUrl: string, title: string }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded min-h-[300px]">
         <div className="w-full h-64 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500 flex-col">
            <ShieldCheck className="w-12 h-12 mb-2 text-gray-400" />
            <span>证照预览: {title}</span>
            <span className="text-xs mt-1 text-gray-400">(模拟图片展示)</span>
         </div>
         <a href="#" className="mt-4 text-blue-600 text-sm hover:underline flex items-center">
            <Paperclip className="w-3 h-3 mr-1" /> 下载原件
         </a>
      </div>
    </Modal>
  );
};

// --- 3. Enhanced Tree Item for Alliance ---
const TreeItem: React.FC<{ 
  node: Institution; 
  allNodes: Institution[]; 
  isRoot?: boolean; 
  onViewDetails: (node: Institution) => void;
}> = ({ node, allNodes, isRoot = false, onViewDetails }) => {
  const children = allNodes.filter(n => n.parentId === node.id);
  const [expanded, setExpanded] = useState(true); 

  return (
    <div className="relative">
      {!isRoot && (
         <>
           <div className="absolute -top-4 -left-5 w-px h-10 bg-gray-300 border-l border-dashed border-gray-300"></div>
           <div className="absolute top-6 -left-5 w-5 h-px bg-gray-300 border-t border-dashed border-gray-300"></div>
         </>
      )}

      <div className={`relative ${!isRoot ? 'ml-8 mb-4' : 'mb-6'}`}>
        <div 
            className={`bg-white border rounded-lg shadow-sm transition-all hover:shadow-md overflow-hidden w-full max-w-5xl cursor-pointer
                ${isRoot ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-200'}
            `}
            onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between p-3 bg-white">
            <div className="flex items-center gap-3 flex-1">
               <button 
                 className={`p-1 rounded hover:bg-gray-100 text-gray-500 transition-transform ${children.length === 0 ? 'invisible' : ''}`}
               >
                 {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
               </button>

               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm
                  ${node.type === 'Hospital' ? (isRoot ? 'bg-blue-600' : 'bg-indigo-500') : 'bg-green-500'}
               `}>
                  <Building size={16} />
               </div>
               
               <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{node.name}</span>
                    {isRoot && <Badge type="neutral">牵头单位</Badge>}
                    {!isRoot && <Badge type="success">附属单位</Badge>}
                  </div>
                  <span className="text-[10px] text-gray-400">{node.address}</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-xs font-medium text-gray-600">{node.level}</div>
                  <div className="text-[10px] text-gray-400">科室: {node.departmentCount || 0}</div>
               </div>
               <div className="h-8 w-px bg-gray-100 mx-2"></div>
               <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent collapse
                      onViewDetails(node);
                  }}
                  className="flex items-center gap-1"
                >
                  <Info size={14} />
                  详情
               </Button>
            </div>
          </div>
        </div>

        {expanded && children.length > 0 && (
          <div className="mt-4 border-l border-dashed border-gray-300 ml-[1.65rem] pl-6 pb-2">
            {children.map(child => (
              <TreeItem key={child.id} node={child} allNodes={allNodes} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const InstitutionManager: React.FC<Props> = ({ currentRegionCode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [previewImage, setPreviewImage] = useState<{url: string, title: string} | null>(null);

  // -- Info Tab Search --
  const [searchQuery, setSearchQuery] = useState('');

  // -- Qualifications Tab Filters --
  const [qualSearchQuery, setQualSearchQuery] = useState('');
  const [qualFilterRegion, setQualFilterRegion] = useState({
    province: '520000',
    city: '',
    county: ''
  });

  // Region Filters (For Info Tab)
  const [filterRegion, setFilterRegion] = useState({
    province: '520000',
    city: '',
    county: ''
  });

  // Sync prop change to filters
  useEffect(() => {
     // If user is city level, set city. If county, set county.
     const userRegion = MOCK_REGIONS.find(r => r.code === currentRegionCode);
     if (userRegion) {
        if (userRegion.level === AdminLevel.PROVINCE) {
           setFilterRegion({ province: userRegion.code, city: '', county: '' });
           setQualFilterRegion({ province: userRegion.code, city: '', county: '' });
        } else if (userRegion.level === AdminLevel.CITY) {
           setFilterRegion({ province: userRegion.parentCode || '520000', city: userRegion.code, county: '' });
           setQualFilterRegion({ province: userRegion.parentCode || '520000', city: userRegion.code, county: '' });
        } else if (userRegion.level === AdminLevel.COUNTY) {
           setFilterRegion({ province: '520000', city: userRegion.parentCode || '', county: userRegion.code });
           setQualFilterRegion({ province: '520000', city: userRegion.parentCode || '', county: userRegion.code });
        }
     }
  }, [currentRegionCode]);

  // Options
  const provinces = MOCK_REGIONS.filter(r => r.level === AdminLevel.PROVINCE);
  const cities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === filterRegion.province), [filterRegion.province]);
  const counties = useMemo(() => filterRegion.city ? MOCK_REGIONS.filter(r => r.parentCode === filterRegion.city) : [], [filterRegion.city]);

  // Qual Options
  const qualCities = useMemo(() => MOCK_REGIONS.filter(r => r.parentCode === qualFilterRegion.province), [qualFilterRegion.province]);
  const qualCounties = useMemo(() => qualFilterRegion.city ? MOCK_REGIONS.filter(r => r.parentCode === qualFilterRegion.city) : [], [qualFilterRegion.city]);


  // Filter Logic (Info Tab)
  const filteredData = useMemo(() => {
    const targetCode = filterRegion.county || filterRegion.city || filterRegion.province;
    let filtered = MOCK_INSTITUTIONS.filter(inst => inst.regionCode.startsWith(targetCode));
    
    if (searchQuery) {
        filtered = filtered.filter(inst => inst.name.includes(searchQuery));
    }
    return filtered;
  }, [filterRegion, searchQuery]);

  // Handle Region Change (Info Tab)
  const handleRegionChange = (key: 'province' | 'city' | 'county', val: string) => {
      setFilterRegion(prev => {
          const next = { ...prev, [key]: val };
          if (key === 'province') { next.city = ''; next.county = ''; }
          if (key === 'city') { next.county = ''; }
          return next;
      });
  };

  // Handle Region Change (Qual Tab)
  const handleQualRegionChange = (key: 'province' | 'city' | 'county', val: string) => {
      setQualFilterRegion(prev => {
          const next = { ...prev, [key]: val };
          if (key === 'province') { next.city = ''; next.county = ''; }
          if (key === 'city') { next.county = ''; }
          return next;
      });
  };

  // Dynamic Qualification List based on Institutions (Synced)
  const filteredQualList = useMemo(() => {
      const targetCode = qualFilterRegion.county || qualFilterRegion.city || qualFilterRegion.province;
      let list = MOCK_INSTITUTIONS.filter(inst => inst.regionCode.startsWith(targetCode));

      if (qualSearchQuery) {
          list = list.filter(inst => inst.name.includes(qualSearchQuery));
      }

      // Map to display format with mock license data, preserving 1:1 relationship with hospitals
      return list.map((inst, index) => {
           // Deterministic mock based on ID
           const seed = inst.id.charCodeAt(0);
           const isExpiring = (seed % 10) === 0; // 10% chance
           const expireDate = isExpiring ? '2023-11-15' : '2026-12-31';
           const certName = '医疗机构执业许可证';
           const certNo = `PDY${20230000 + index}`;

           return {
               id: inst.id,
               name: inst.name,
               level: inst.level,
               legal: inst.legalRepresentative || '张院长',
               cert: certName,
               certNo: certNo,
               expireDate: expireDate,
               status: isExpiring ? 'Expiring' : 'Normal',
               file: 'license.pdf'
           };
      });
  }, [qualFilterRegion, qualSearchQuery]);


  const renderFilterBar = () => (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="font-bold">行政区域筛选:</span>
        </div>
        <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filterRegion.province}
            onChange={(e) => handleRegionChange('province', e.target.value)}
            disabled // Fixed to Guizhou for mock
        >
            {provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            value={filterRegion.city}
            onChange={(e) => handleRegionChange('city', e.target.value)}
        >
            <option value="">全部城市</option>
            {cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            value={filterRegion.county}
            onChange={(e) => handleRegionChange('county', e.target.value)}
            disabled={!filterRegion.city}
        >
            <option value="">全部区县</option>
            {counties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <div className="ml-auto text-xs text-gray-400">
            匹配到 {filteredData.length} 家机构
        </div>
      </div>
  );

  // 1. Info Tab: Dashboard Cards + List
  const renderInfo = () => (
    <div className="space-y-4">
      {renderFilterBar()}
      <InstitutionDashboardCards data={filteredData} />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
           <div>
              <h3 className="font-bold text-gray-800">医疗机构监管列表</h3>
           </div>
           {/* REPLACED BUTTON WITH SEARCH INPUT */}
           <div className="flex items-center gap-2">
              <div className="relative">
                  <input 
                    type="text" 
                    placeholder="请输入医疗机构名称" 
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
              </div>
              <Button size="sm">查询</Button>
           </div>
        </div>
        <Table<Institution>
          rowKey="id"
          dataSource={filteredData}
          columns={[
            { title: '医疗机构名称', render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
            { title: '等级', render: (r) => <Badge type={r.level.includes('三级') ? 'success' : 'neutral'}>{r.level}</Badge> },
            { title: '所在区域', render: (r) => <span className="text-xs text-gray-500 font-mono">{r.address}</span> },
            { title: '监管科室', render: (r) => <span className="font-bold text-gray-700">{r.departmentCount || 0}</span>, width: '100px' },
            { title: '资质', render: (r) => (
               <div className="flex gap-1 flex-wrap max-w-[200px]">
                 {r.qualifications?.slice(0, 2).map((q, i) => <span key={i} className="text-[10px] bg-gray-100 border border-gray-200 px-1 rounded text-gray-600">{q}</span>)}
                 {(r.qualifications?.length || 0) > 2 && <span className="text-[10px] text-gray-400">+{ (r.qualifications?.length || 0) - 2 }</span>}
               </div>
            )},
            { title: '状态', render: (r) => <Badge type={r.status === 'Active' ? 'success' : 'danger'}>{r.status === 'Active' ? '正常' : '注销'}</Badge> },
            { title: '操作', render: (r) => (
              <Button size="sm" variant="ghost" onClick={() => setSelectedInst(r)}>
                <Eye className="w-3 h-3 mr-1" /> 详情
              </Button>
            )}
          ]}
        />
      </div>
    </div>
  );

  // 2. Alliance Info
  const rootNodes = useMemo(() => {
      const inViewIds = new Set(filteredData.map(d => d.id));
      return filteredData.filter(d => !d.parentId || !inViewIds.has(d.parentId));
  }, [filteredData]);

  const renderAlliance = () => (
    <div className="h-full flex flex-col space-y-4">
       {renderFilterBar()}
       <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">医联体架构展示</h3>
            <p className="text-sm text-gray-500 mt-1">当前区域内医联体层级分布 (点击详情查看医院信息)</p>
          </div>
          <Button variant="secondary"><Network className="w-4 h-4 mr-2"/> 导出架构图</Button>
       </div>
       <div className="flex-1 bg-gray-50/50 p-6 rounded-xl border border-gray-200 shadow-inner overflow-auto">
         <div className="pl-4 pt-4">
            {rootNodes.length > 0 ? rootNodes.map(root => (
                <TreeItem 
                key={root.id} 
                node={root} 
                allNodes={filteredData} 
                isRoot={!root.parentId}
                onViewDetails={(node) => setSelectedInst(node)}
                />
            )) : <div className="text-center text-gray-400 mt-10">当前筛选区域无医联体根节点数据</div>}
         </div>
       </div>
    </div>
  );

  // 3. Qualifications
  const renderQualifications = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between">
              <div>
                  <div className="text-red-500 text-xs font-bold uppercase">即将到期 (30天内)</div>
                  <div className="text-2xl font-bold text-red-700 mt-1">{filteredQualList.filter(q => q.status === 'Expiring').length}</div>
              </div>
              <ShieldCheck className="text-red-400 w-8 h-8" />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
              <div>
                  <div className="text-blue-500 text-xs font-bold uppercase">证照齐全</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">{filteredQualList.length}</div>
              </div>
              <ShieldCheck className="text-blue-400 w-8 h-8" />
          </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* ADDED FILTER BAR FOR QUALIFICATIONS */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
           <h3 className="font-bold text-gray-800 shrink-0">机构资质监管列表</h3>
           
           <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-gray-600">筛选:</span>
                    <select 
                        className="border border-gray-300 rounded px-2 py-1 bg-white"
                        value={qualFilterRegion.province}
                        disabled
                    >
                        {provinces.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                    <select 
                        className="border border-gray-300 rounded px-2 py-1 bg-white"
                        value={qualFilterRegion.city}
                        onChange={(e) => handleQualRegionChange('city', e.target.value)}
                    >
                        <option value="">全部城市</option>
                        {cities.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                    <select 
                        className="border border-gray-300 rounded px-2 py-1 bg-white"
                        value={qualFilterRegion.county}
                        onChange={(e) => handleQualRegionChange('county', e.target.value)}
                        disabled={!qualFilterRegion.city}
                    >
                        <option value="">全部区县</option>
                        {qualCounties.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                </div>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="搜索机构..." 
                        className="pl-7 pr-3 py-1 border border-gray-300 rounded text-xs w-40 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        value={qualSearchQuery}
                        onChange={(e) => setQualSearchQuery(e.target.value)}
                    />
                    <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1.5" />
                </div>
           </div>
        </div>

        <Table
          rowKey="id"
          dataSource={filteredQualList}
          columns={[
            { title: '机构名称', render: (r:any) => <span className="font-medium text-gray-900">{r.name}</span> },
            { title: '机构等级', render: (r:any) => <Badge type="neutral">{r.level}</Badge> },
            { title: '资质/许可证名称', render: (r:any) => (
                <div>
                    <div>{r.cert}</div>
                    <div className="text-[10px] text-gray-400">注册号: {r.certNo}</div>
                </div>
            )},
            { title: '法人代表', render: (r:any) => <span className="text-gray-600">{r.legal}</span> },
            { title: '有效期至', render: (r:any) => <span className={r.status === 'Expiring' ? 'text-red-600 font-bold' : 'text-gray-600'}>{r.expireDate}</span> },
            { title: '状态', render: (r:any) => r.status === 'Expiring' ? <Badge type="warning">即将到期</Badge> : <Badge type="success">正常</Badge> },
            { title: '附件', render: (r:any) => (
               <button 
                 className="flex items-center text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                 onClick={() => setPreviewImage({ url: 'mock_url', title: r.cert })}
               >
                  <Paperclip className="w-3 h-3 mr-1" /> 
                  查看原件
               </button>
            )},
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Detail Modal */}
      <DetailModal isOpen={!!selectedInst} onClose={() => setSelectedInst(null)} institution={selectedInst} />
      
      {/* Image Preview Modal */}
      <ImagePreviewModal 
        isOpen={!!previewImage} 
        onClose={() => setPreviewImage(null)} 
        imageUrl={previewImage?.url || ''} 
        title={previewImage?.title || ''} 
      />

      {/* Tabs Header */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit border border-gray-200">
        {[
          { id: 'info', label: '医疗机构信息', icon: FileClock },
          { id: 'alliance', label: '医联体架构展示', icon: Network },
          { id: 'qualifications', label: '资质管理', icon: ShieldCheck },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50/50 rounded-lg p-1 overflow-auto">
        {activeTab === 'info' && renderInfo()}
        {activeTab === 'alliance' && renderAlliance()}
        {activeTab === 'qualifications' && renderQualifications()}
      </div>
    </div>
  );
};