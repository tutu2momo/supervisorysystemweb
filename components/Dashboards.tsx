import React from 'react';
import { Activity, Building2, Wifi, Signal, Trophy, TrendingUp } from 'lucide-react';
import { H2H_SERVICES, TOC_SERVICES } from '../constants';
import { Badge } from './UI';

// --- Shared Components ---

// 1. Compact Stat Card
const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between h-20 transition-all hover:shadow-md">
     <div>
        <div className="text-gray-500 text-xs font-medium">{title}</div>
        <div className="text-2xl font-bold text-gray-800 mt-0.5 leading-none">{value}</div>
        <div className="text-[10px] text-gray-400 mt-1">{sub}</div>
     </div>
     <div className={`p-2 bg-${color}-50 rounded-lg text-${color}-600`}>
        <Icon className="w-5 h-5" />
     </div>
  </div>
);

// 2. Service Card (Expanded grid)
interface ServiceCardProps {
  title: string;
  items: string[];
  baseColor: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, items, baseColor }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
       <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-gray-800 text-xs">{title}</h3>
          <Badge type="neutral">运行中</Badge>
       </div>
       <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto scrollbar-hide content-start">
          {items.map((item, idx) => {
            const networked = Math.floor(Math.random() * 50) + 20;
            const active = Math.floor(networked * 0.8);
            
            return (
              <div key={idx} className="flex flex-col px-2 py-1.5 rounded bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors h-11 justify-center">
                 <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[10px] font-bold text-gray-700 truncate w-20" title={item}>{item}</span>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${idx % 5 === 0 ? 'bg-red-400' : 'bg-green-400'}`} />
                 </div>
                 <div className="flex justify-between items-center text-[9px] text-gray-400 leading-none">
                    <span className="scale-90 origin-left">入:{networked}</span>
                    <span className={`scale-90 origin-right font-medium ${active < 10 ? 'text-red-500' : 'text-blue-600'}`}>运:{active}</span>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

// 3. Ranking Card (Compacted for bottom section)
const RankingCard = ({ title, data, color }: { title: string, data: {name: string, value: string}[], color: string }) => {
  const parseVal = (str: string) => parseInt(str.replace(/,/g, ''), 10) || 0;
  const maxVal = Math.max(...data.map(d => parseVal(d.value))) || 100;

  const getColorClass = (c: string) => {
      switch(c) {
          case 'blue': return 'bg-blue-500';
          case 'green': return 'bg-green-500';
          case 'orange': return 'bg-orange-500';
          default: return 'bg-blue-500';
      }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
       <div className={`px-3 py-2 border-b border-gray-100 bg-${color}-50/30 flex justify-between items-center shrink-0`}>
          <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
              <Trophy className={`w-3 h-3 text-${color}-600`} /> {title}
          </h3>
          <TrendingUp className="w-3 h-3 text-gray-400" />
       </div>
       <div className="p-3 flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-center">
          <div className="space-y-2">
              {data.map((item, idx) => {
                  const val = parseVal(item.value);
                  const percentage = Math.round((val / maxVal) * 100);

                  return (
                    <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-end text-xs leading-none">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold shrink-0 ${idx < 3 ? `bg-${color}-100 text-${color}-700` : 'bg-gray-100 text-gray-400'}`}>
                                    {idx + 1}
                                </span>
                                <span className="text-gray-700 truncate font-medium text-[11px]" title={item.name}>{item.name}</span>
                            </div>
                            <span className="font-mono font-bold text-gray-800 text-[11px]">{item.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${getColorClass(color)} transition-all duration-500`} 
                                style={{ width: `${percentage}%` }} 
                            />
                        </div>
                    </div>
                  );
              })}
          </div>
       </div>
    </div>
  );
};

// --- Reusable Dashboard Layout ---
interface DashboardProps {
  levelName: string;
  regionCode: string;
  connectRate: string;
  stats: {
    businessVol: string;
    instCount: string;
    internetHosp: string;
  }
}

const StandardDashboard: React.FC<DashboardProps> = ({ levelName, regionCode, connectRate, stats }) => {
  
  const RANK_DATA_TOTAL = [
      { name: '贵州省人民医院', value: '45,230' },
      { name: '遵义医科大学附属医院', value: '38,120' },
      { name: '贵阳市第一人民医院', value: '22,400' },
      { name: '六盘水市人民医院', value: '18,550' },
      { name: '安顺市人民医院', value: '15,300' },
  ];
  const RANK_DATA_REMOTE = [
      { name: '贵州省人民医院', value: '12,500' },
      { name: '遵义医科大学附属医院', value: '10,200' },
      { name: '贵阳市第二人民医院', value: '8,400' },
      { name: '黔东南州人民医院', value: '6,150' },
      { name: '毕节市第一人民医院', value: '5,800' },
  ];
  const RANK_DATA_INTERNET = [
      { name: '贵州医科大学附属医院', value: '28,900' },
      { name: '贵阳市妇幼保健院', value: '15,600' },
      { name: '贵州省骨科医院', value: '11,200' },
      { name: '遵义市第一人民医院', value: '9,800' },
      { name: '铜仁市人民医院', value: '7,450' },
  ];

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden p-1">
       {/* Header Section */}
       <div className="flex justify-between items-center border-b border-gray-200 pb-2 shrink-0 min-h-[50px]">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">{levelName}监管汇总驾驶舱</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">数据范围：{regionCode} | 实时监控</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1 rounded border border-blue-100">
             <Signal className="text-blue-600 w-4 h-4 animate-pulse" />
             <div className="text-right leading-none">
                <span className="text-lg font-bold text-blue-600 block">{connectRate}</span>
             </div>
          </div>
       </div>

       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          <StatCard title="业务总量" value={stats.businessVol} sub="本月累计" icon={Activity} color="blue" />
          <StatCard title="入网机构数" value={stats.instCount} sub="覆盖率 99%" icon={Building2} color="green" />
          <StatCard title="互联网医院数" value={stats.internetHosp} sub="累计服务310万人次" icon={Wifi} color="indigo" />
       </div>

       {/* Service Matrix - Increased Height to eliminate scrollbar (45%) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0 h-[45%] min-h-[250px]">
          <ServiceCard title="远程医疗服务 (机构-机构) 运行态势" items={H2H_SERVICES} baseColor="blue" />
          <ServiceCard title="互联网医疗业务 (机构-患者) 运行态势" items={TOC_SERVICES} baseColor="green" />
       </div>

       {/* Top 5 Rankings - Compacted to fit remaining space */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-0">
          <RankingCard title="医院业务总量 Top5" data={RANK_DATA_TOTAL} color="orange" />
          <RankingCard title="远程医疗服务 Top5" data={RANK_DATA_REMOTE} color="blue" />
          <RankingCard title="互联网医疗业务 Top5" data={RANK_DATA_INTERNET} color="green" />
       </div>
    </div>
  );
};

// --- 1. Provincial Dashboard ---
export const ProvincialDashboard = () => (
  <StandardDashboard 
    levelName="全省" 
    regionCode="贵州省 (520000)" 
    connectRate="98.5%"
    stats={{
      businessVol: "158,230",
      instCount: "1,245",
      internetHosp: "68"
    }}
  />
);

// --- 2. City Dashboard ---
export const CityDashboard = () => (
  <StandardDashboard 
    levelName="市级" 
    regionCode="贵阳市 (520100)" 
    connectRate="95.2%"
    stats={{
      businessVol: "68,400",
      instCount: "45",
      internetHosp: "12"
    }}
  />
);

// --- 3. County Dashboard ---
export const CountyDashboard = () => (
  <StandardDashboard 
    levelName="县级" 
    regionCode="南明区 (520102)" 
    connectRate="92.1%"
    stats={{
      businessVol: "4,102",
      instCount: "18",
      internetHosp: "3"
    }}
  />
);