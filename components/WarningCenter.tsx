import React from 'react';
import { MOCK_WARNINGS } from '../constants';
import { WarningItem } from '../types';
import { Badge, Button } from './UI';
import { AlertTriangle, BellRing, CheckCircle, Send } from 'lucide-react';

export const WarningCenter: React.FC = () => {
  const handleSupervise = (id: string) => {
    const note = prompt("请输入下发给下级机构的督办指令：");
    if (note) {
      alert(`指令已下发: "${note}"。状态已更新为处理中。`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-red-200 rounded-full text-red-700"><AlertTriangle /></div>
            <div>
                <p className="text-sm text-red-600 font-medium">严重告警</p>
                <p className="text-2xl font-bold text-red-900">12</p>
            </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-yellow-200 rounded-full text-yellow-700"><BellRing /></div>
            <div>
                <p className="text-sm text-yellow-600 font-medium">待处理预警</p>
                <p className="text-2xl font-bold text-yellow-900">45</p>
            </div>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-green-200 rounded-full text-green-700"><CheckCircle /></div>
            <div>
                <p className="text-sm text-green-600 font-medium">今日已解决</p>
                <p className="text-2xl font-bold text-green-900">18</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">实时资源预警监控</h3>
        </div>
        <div className="divide-y divide-gray-200">
            {MOCK_WARNINGS.map(warning => (
                <div key={warning.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full ${warning.severity === 'High' ? 'bg-red-500' : warning.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{warning.title}</span>
                                <Badge type={warning.severity === 'High' ? 'danger' : warning.severity === 'Medium' ? 'warning' : 'neutral'}>
                                  {warning.severity === 'High' ? '高' : warning.severity === 'Medium' ? '中' : '低'}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {warning.institutionName} • <span className="text-xs">{warning.date}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-2 font-mono">ID: {warning.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {warning.status !== 'Resolved' ? (
                             <Button size="sm" onClick={() => handleSupervise(warning.id)}>
                                <Send className="w-3 h-3 mr-2" />
                                督办
                             </Button>
                        ) : (
                            <span className="text-sm text-green-600 font-medium flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1"/> 已解决
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};