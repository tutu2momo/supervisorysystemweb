import React, { useState, useMemo } from 'react';
import { 
  Home, BarChart2, Building2, Bell, Search, 
  ChevronRight, ArrowUpRight, ArrowDownRight, 
  Activity, ShieldCheck, Wallet, MapPin, Filter,
  TrendingUp, Users, FileText, X, Layers, CreditCard,
  Network, Wifi, Stethoscope, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import { MOCK_INSTITUTIONS, MOCK_DOCTORS, MOCK_REGIONS, MOCK_USERS } from '../constants';
import { User as UserType } from '../types';
import { Badge } from './UI';

// --- UI Components for Mobile ---

const MobileCard = ({ children, className = "", onClick }: any) => (
  <div onClick={onClick} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform ${className}`}>
    {children}
  </div>
);

const MobileHeader = ({ title, user, onSwitchRole }: any) => (
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-between shrink-0">
    <h1 className="text-lg font-bold text-gray-900">{title}</h1>
    <div className="flex items-center gap-3">
        {/* Region/Role Switcher Moved Here */}
        <button 
            onClick={onSwitchRole}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
        >
            <MapPin size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-gray-700 max-w-[80px] truncate">
                {MOCK_REGIONS.find(r => r.code === user.regionCode)?.name || '切换区域'}
            </span>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1 animate-pulse"></span>
        </button>
    </div>
  </header>
);

const KPIBlock = ({ label, value, trend, trendVal, color = "blue", fullWidth = false, icon: Icon, subtext }: any) => (
  <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex justify-between items-start">
          <div className="text-xs text-gray-400">{label}</div>
          <div className={`p-1.5 rounded-md bg-${color}-50 text-${color}-600`}>
              {Icon ? <Icon size={14} /> : (color === 'blue' ? <Activity size={14}/> : color === 'green' ? <Users size={14}/> : <Wallet size={14}/>)}
          </div>
      </div>
      <div className="mt-2">
          <span className={`text-2xl font-bold text-gray-800`}>{value}</span>
      </div>
      {trend ? (
          <div className={`text-[10px] flex items-center mt-1 ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span className="ml-0.5">{trendVal} 环比</span>
          </div>
      ) : (subtext && <div className="text-[10px] text-gray-400 mt-1">{subtext}</div>)}
  </div>
);

const SectionTitle = ({ title, moreLink }: any) => (
  <div className="flex justify-between items-center px-1 mb-3 mt-5">
      <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
          {title}
      </h3>
      {moreLink && <span className="text-xs text-blue-500 font-medium flex items-center">查看更多 <ChevronRight size={12}/></span>}
  </div>
);

// --- Sub-Views ---

const MobileDashboard = ({ user }: { user: UserType }) => {
    return (
        <div className="p-4 space-y-4 pb-24">
            {/* 1. Welcome Banner */}
            <div className="bg-gradient-to-br from-[#1F2A38] to-[#2A3B4D] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
                <div className="relative z-10">
                    <p className="text-gray-300 text-xs mb-1">监管概览 · {user.role}</p>
                    <h2 className="text-xl font-bold mb-4">{MOCK_REGIONS.find(r => r.code === user.regionCode)?.name}数字监管驾驶舱</h2>
                    <div className="flex gap-6">
                        <div>
                            <p className="text-gray-400 text-[10px]">在线机构</p>
                            <p className="text-xl font-bold mt-0.5">1,245 <span className="text-xs font-normal text-gray-500">家</span></p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px]">接入医生</p>
                            <p className="text-xl font-bold mt-0.5">8,520 <span className="text-xs font-normal text-gray-500">人</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Core Metrics (Optimized) */}
            <div>
                <SectionTitle title="核心运营指标" />
                <div className="grid grid-cols-2 gap-3">
                    {/* NEW: Total Monthly Volume */}
                    <KPIBlock label="本月总业务量" value="158,230" trend="up" trendVal="12.5%" color="blue" fullWidth />
                    
                    <KPIBlock label="今日实时交易" value="3,421" trend="up" trendVal="5.2%" color="indigo" />
                    <KPIBlock label="患者满意度" value="98.5%" trend="up" trendVal="0.2%" color="green" />
                </div>
            </div>

            {/* 3. Replaced Warning Ticker with Quick Actions / Status */}
            <div>
                <SectionTitle title="监管状态概览" />
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><ShieldCheck size={16}/></div>
                        <span className="text-xs font-bold text-gray-700">资质合规</span>
                        <span className="text-[10px] text-green-600">100%</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Activity size={16}/></div>
                        <span className="text-xs font-bold text-gray-700">服务正常</span>
                        <span className="text-[10px] text-blue-600">运行中</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Wallet size={16}/></div>
                        <span className="text-xs font-bold text-gray-700">财务审计</span>
                        <span className="text-[10px] text-orange-600">本月正常</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MobileStats = () => {
    const [tab, setTab] = useState<'service'|'quality'|'finance'>('service');
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header + Search Combo Area - Fixed at top of this view */}
            <div className="bg-white border-b border-gray-100 shadow-sm shrink-0 z-30">
                {/* 1. Search Box (Directly Under Title) */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="搜索指标、科室或数据维度..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 text-sm rounded-lg pl-9 pr-3 py-2 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                {/* 2. Tab Navigation */}
                <div className="flex justify-around px-2 pt-1">
                    {[
                        {id: 'service', label: '服务监管'},
                        {id: 'quality', label: '质量监管'},
                        {id: 'finance', label: '财务监管'}
                    ].map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`pb-3 px-4 text-sm font-bold transition-all relative ${tab === t.id ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            {t.label}
                            {tab === t.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {tab === 'service' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                         {/* NEW: Key Metrics Grid */}
                         <div className="grid grid-cols-2 gap-3">
                             <KPIBlock label="本月业务总量" value="158,230" trend="up" trendVal="12.5%" color="blue" icon={Activity} />
                             <KPIBlock label="开通远程机构" value="1,245" subtext="覆盖率 100%" color="indigo" icon={Network} />
                             <KPIBlock label="注册互联网医院" value="68" trend="up" trendVal="+2" color="purple" icon={Wifi} />
                             <KPIBlock label="注册医生" value="8,520" subtext="活跃度 85%" color="orange" icon={Stethoscope} />
                         </div>

                         {/* Card 1: Fixed Height Chart Container */}
                         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[280px] flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold flex items-center"><Activity size={16} className="mr-2 text-blue-500"/>业务类型构成</h4>
                                <Badge type="neutral">本月</Badge>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-center gap-6">
                                {/* Simulated Charts/Bars */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">远程医疗 (B2B)</span>
                                        <span className="font-bold text-blue-600">65%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{width: '65%'}}></div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded">远程影像</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded">远程心电</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">互联网医院 (ToC)</span>
                                        <span className="font-bold text-green-600">35%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{width: '35%'}}></div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded">视频问诊</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded">慢病复诊</span>
                                    </div>
                                </div>
                            </div>
                         </div>

                         {/* Card 2: Top List with Fixed Height */}
                         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[320px] flex flex-col">
                            <h4 className="text-sm font-bold mb-3 flex items-center shrink-0"><TrendingUp size={16} className="mr-2 text-orange-500"/>业务量排名 TOP 5</h4>
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                                {[
                                    {name: '贵州省人民医院', val: '45,230', pct: 90},
                                    {name: '遵义医科大学附属医院', val: '38,120', pct: 75},
                                    {name: '贵阳市第一人民医院', val: '22,400', pct: 50},
                                    {name: '六盘水市人民医院', val: '18,550', pct: 40},
                                    {name: '安顺市人民医院', val: '15,300', pct: 30}
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${idx < 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{idx+1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-700 truncate">{item.name}</span>
                                                <span className="font-mono font-bold text-gray-900">{item.val}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-400" style={{width: `${item.pct}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                )}
                {tab === 'quality' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {/* High Quality Overview Card */}
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-5 rounded-xl text-white flex justify-between items-center shadow-lg h-[140px]">
                             <div>
                                 <p className="text-orange-100 text-xs font-medium">全省服务质量综合评分</p>
                                 <h2 className="text-4xl font-bold mt-2">4.85</h2>
                                 <div className="flex mt-2 text-yellow-300 gap-0.5">
                                    {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                                 </div>
                             </div>
                             <div className="text-right">
                                 <div className="text-orange-100 text-xs">好评率</div>
                                 <div className="text-xl font-bold">98.5%</div>
                                 <div className="text-orange-100 text-xs mt-2">差评率</div>
                                 <div className="text-xl font-bold">0.2%</div>
                             </div>
                        </div>

                        {/* Recent Reviews List - Fixed Height */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
                            <div className="flex justify-between items-center mb-3 shrink-0">
                                <h4 className="text-sm font-bold text-gray-800">最新评价反馈</h4>
                                <span className="text-xs text-gray-400">实时更新</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {[
                                    {tag: '服务态度', color: 'red', content: '医生回复非常敷衍，三句话就结束了问诊。', hosp: '贵州医科大学附属医院', time: '10分钟前', score: 1},
                                    {tag: '等待时间', color: 'orange', content: '等待专家接诊时间超过30分钟，没有提前通知。', hosp: '南明区花果园社区卫生服务中心', time: '2小时前', score: 2},
                                    {tag: '技术故障', color: 'gray', content: '视频画面卡顿，声音听不清楚。', hosp: '乌当区人民医院', time: '5小时前', score: 2},
                                    {tag: '非常满意', color: 'green', content: '医生非常专业，解答很耐心！', hosp: '贵州省人民医院', time: '1天前', score: 5},
                                    {tag: '非常满意', color: 'green', content: '远程会诊很方便，不用跑省城了。', hosp: '遵义医科大学附属医院', time: '1天前', score: 5},
                                ].map((review, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge type={review.score < 3 ? 'danger' : 'success'}>{review.tag}</Badge>
                                            <span className="text-[10px] text-gray-400">{review.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-700 font-medium my-2 line-clamp-2">"{review.content}"</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{review.hosp}</span>
                                            <div className="flex text-orange-400 text-[10px]">
                                                {review.score} ★
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'finance' && (
                     <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3 h-[100px]">
                            <KPIBlock label="本月总营收" value="¥15.8万" trend="up" trendVal="12%" color="blue" />
                            <KPIBlock label="次均费用" value="¥124" trend="down" trendVal="2%" color="green" />
                        </div>

                        {/* Financial Breakdown - Fixed Height */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[320px] flex flex-col">
                            <h4 className="text-sm font-bold mb-4 flex items-center shrink-0"><Wallet size={16} className="mr-2 text-purple-500"/>收支结构分析</h4>
                            
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center justify-around mb-6">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-1">总收入</div>
                                        <div className="text-xl font-bold text-green-600">+45.2万</div>
                                        <div className="w-16 h-1 bg-green-200 rounded-full mx-auto mt-2"></div>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-1">总支出</div>
                                        <div className="text-xl font-bold text-red-600">-28.1万</div>
                                        <div className="w-16 h-1 bg-red-200 rounded-full mx-auto mt-2"></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-xs text-gray-600">净结余</span>
                                        <span className="text-sm font-bold text-blue-700">¥17.1万 (37.8%)</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-xs text-gray-600">人力成本占比</span>
                                        <span className="text-sm font-bold text-gray-700">28.5%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Chart Placeholder */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[200px] flex flex-col">
                             <h4 className="text-sm font-bold mb-2 text-gray-800">近6个月营收趋势</h4>
                             <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                                {[40, 55, 45, 60, 75, 80].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full bg-blue-500 rounded-t" style={{height: `${h}%`}}></div>
                                        <span className="text-[10px] text-gray-400">{i+5}月</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

const MobileInstitutions = () => {
    const [search, setSearch] = useState('');
    
    // Stats Calculation matching Web Logic
    const stats = useMemo(() => {
        const total = MOCK_INSTITUTIONS.length;
        const l3 = MOCK_INSTITUTIONS.filter(i => i.level.includes('三级')).length;
        const l2 = MOCK_INSTITUTIONS.filter(i => i.level.includes('二级')).length;
        const l1 = total - l3 - l2;
        return { total, l3, l2, l1 };
    }, []);

    // Simulating rich Web-like institution data
    const richInsts = MOCK_INSTITUTIONS.map(inst => ({
        ...inst,
        docCount: Math.floor(Math.random() * 200) + 50,
        serviceVol: Math.floor(Math.random() * 5000) + 1000,
        qualCount: (inst.qualifications?.length || 0),
        status: inst.status === 'Active' ? '运营中' : '已停业'
    })).filter(i => i.name.includes(search));

    const StatCardMini = ({ label, val, color, icon: Icon }: any) => (
        <div className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 flex items-center justify-between`}>
            <div>
                <div className={`text-[10px] text-${color}-600 mb-0.5`}>{label}</div>
                <div className={`text-lg font-bold text-${color}-800`}>{val}</div>
            </div>
            <Icon className={`text-${color}-400 w-5 h-5`} />
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Area */}
            <div className="bg-white border-b border-gray-100 z-30">
                {/* Search */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="搜索医疗机构名称..."
                            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                     <StatCardMini label="机构总量" val={stats.total} color="blue" icon={Building2} />
                     <StatCardMini label="三级医院" val={stats.l3} color="indigo" icon={Info} />
                     <StatCardMini label="二级医院" val={stats.l2} color="purple" icon={Network} />
                     <StatCardMini label="基层/其他" val={stats.l1} color="green" icon={ShieldCheck} />
                </div>
            </div>

            {/* Detailed List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {richInsts.map(inst => (
                    <MobileCard key={inst.id} className="flex flex-col gap-3">
                        <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                            <div className="flex-1 mr-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{inst.name}</h4>
                                    <span className={`w-2 h-2 rounded-full ${inst.status === '运营中' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </div>
                                <div className="flex gap-2">
                                    <Badge type={inst.level.includes('三级') ? 'success' : 'neutral'}><span className="scale-90">{inst.level}</span></Badge>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">{inst.type === 'Hospital' ? '综合医院' : '基层机构'}</span>
                                </div>
                            </div>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${inst.level.includes('三级') ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                <Building2 size={16}/>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 py-2 bg-gray-50 rounded-lg border border-gray-100">
                             <div className="text-center border-r border-gray-200">
                                 <div className="text-[10px] text-gray-400 mb-0.5">监管科室</div>
                                 <div className="font-bold text-gray-800 text-sm">{inst.departmentCount}</div>
                             </div>
                             <div className="text-center border-r border-gray-200">
                                 <div className="text-[10px] text-gray-400 mb-0.5">注册医生</div>
                                 <div className="font-bold text-gray-800 text-sm">{inst.docCount}</div>
                             </div>
                             <div className="text-center">
                                 <div className="text-[10px] text-gray-400 mb-0.5">资质证书</div>
                                 <div className="font-bold text-blue-600 text-sm">{inst.qualCount}</div>
                             </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center text-gray-500 gap-1 truncate max-w-[200px]">
                                <MapPin size={12} /> {inst.address}
                            </div>
                            <div className="flex items-center text-blue-600 font-medium active:opacity-70">
                                查看详情 <ChevronRight size={14} />
                            </div>
                        </div>
                    </MobileCard>
                ))}
            </div>
        </div>
    );
};

// --- MAIN MOBILE APP CONTAINER ---

export const MobileApp = ({ onExitMobile }: { onExitMobile: () => void }) => {
  const [activeTab, setActiveTab] = useState<'home'|'stats'|'insts'>('home');
  const [currentUser, setCurrentUser] = useState<UserType>(MOCK_USERS.provinceAdmin);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getPageTitle = () => {
      switch(activeTab) {
          case 'home': return '监管驾驶舱';
          case 'stats': return '数据统计';
          case 'insts': return '机构名录';
          default: return '';
      }
  };

  const switchRole = (user: UserType) => {
      setCurrentUser(user);
      setRoleMenuOpen(false);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden text-slate-900 border-x border-gray-200">
      
      {/* Role/Region Switcher Drawer (Top Right Trigger) */}
      {roleMenuOpen && (
          <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end animate-in fade-in duration-200">
              <div className="bg-white w-full rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">切换行政区域/层级</h3>
                      <button onClick={()=>setRoleMenuOpen(false)}><X className="text-gray-400"/></button>
                  </div>
                  <div className="space-y-3">
                      <button onClick={()=>switchRole(MOCK_USERS.provinceAdmin)} className="w-full p-4 rounded-xl bg-blue-50 text-blue-700 font-bold text-left flex justify-between items-center border border-blue-100">
                          <div>
                              <div className="text-sm">贵州省 (省级)</div>
                              <div className="text-[10px] text-blue-500 mt-0.5">辖区内机构: 12,450 家</div>
                          </div>
                          {currentUser.id === 'u1' && <Badge type="success">当前</Badge>}
                      </button>
                      <button onClick={()=>switchRole(MOCK_USERS.cityAdmin)} className="w-full p-4 rounded-xl bg-gray-50 text-gray-700 font-medium text-left flex justify-between items-center border border-gray-100">
                          <div>
                              <div className="text-sm">贵阳市 (市级)</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">辖区内机构: 450 家</div>
                          </div>
                          {currentUser.id === 'u2' && <Badge type="success">当前</Badge>}
                      </button>
                      <button onClick={()=>switchRole(MOCK_USERS.countyAdmin)} className="w-full p-4 rounded-xl bg-gray-50 text-gray-700 font-medium text-left flex justify-between items-center border border-gray-100">
                          <div>
                              <div className="text-sm">南明区 (县级)</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">辖区内机构: 128 家</div>
                          </div>
                          {currentUser.id === 'u3' && <Badge type="success">当前</Badge>}
                      </button>
                  </div>
                  <button onClick={onExitMobile} className="w-full mt-3 py-3 border border-red-200 text-red-600 rounded-xl font-medium">
                      退出移动端预览
                  </button>
                  <a href="https://tutu2momo.github.com/supervisorysystemweb" target="_blank" rel="noopener noreferrer" className="w-full mt-3 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium flex items-center justify-center gap-2">
                      <Network size={16} />
                      访问项目主页
                  </a>
              </div>
          </div>
      )}

      {/* Header with Switcher Trigger */}
      <MobileHeader title={getPageTitle()} user={currentUser} onSwitchRole={() => setRoleMenuOpen(true)} />

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && <div className="h-full overflow-y-auto"><MobileDashboard user={currentUser} /></div>}
          {activeTab === 'stats' && <MobileStats />}
          {activeTab === 'insts' && <MobileInstitutions />}
      </main>

      {/* Bottom Navigation (Optimized: 3 Tabs Grid) */}
      <nav className="h-[80px] bg-white border-t border-gray-200 grid grid-cols-3 items-start pt-2 pb-8 shrink-0 z-50">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">首页</span>
          </button>
          
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'stats' ? 'text-blue-600' : 'text-gray-400'}`}>
              <BarChart2 size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">数据</span>
          </button>
          
          <button onClick={() => setActiveTab('insts')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'insts' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Building2 size={24} strokeWidth={activeTab === 'insts' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">机构</span>
          </button>
      </nav>
    </div>
  );
};