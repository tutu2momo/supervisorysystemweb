import React from 'react';
import { Table, Button, Badge } from './UI';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';

// --- Helper: Action Buttons ---
const OperationButtons = () => (
  <div className="flex gap-2">
    <Button size="sm" variant="ghost"><Eye className="w-3 h-3 mr-1" /> 查看</Button>
    <Button size="sm" variant="secondary"><Edit className="w-3 h-3 mr-1" /> 编辑</Button>
  </div>
);

// --- 1. User Authority Management ---
export const UserAuthView = () => {
  const data = [
    { id: 'U001', name: '张局长', role: '省级管理员', region: '浙江省', status: 'Active' },
    { id: 'U002', name: '李主任', role: '市级管理员', region: '杭州市', status: 'Active' },
    { id: 'U003', name: '王科长', role: '县级管理员', region: '西湖区', status: 'Locked' },
  ];

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">用户权限管理</h2>
          <Button><Plus className="w-4 h-4 mr-2"/>新增用户</Button>
       </div>
       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table 
            rowKey="id"
            dataSource={data}
            columns={[
              { title: '用户ID', render: (r:any) => r.id },
              { title: '姓名', render: (r:any) => <span className="font-medium">{r.name}</span> },
              { title: '角色', render: (r:any) => <Badge type="neutral">{r.role}</Badge> },
              { title: '所属区域', render: (r:any) => r.region },
              { title: '状态', render: (r:any) => <Badge type={r.status === 'Active' ? 'success' : 'danger'}>{r.status}</Badge> },
              { title: '操作', render: () => <OperationButtons /> }
            ]}
          />
       </div>
    </div>
  );
};

// --- 2. System Log Audit ---
export const SystemLogsView = () => {
  const data = [
    { id: 'L10239', user: '张局长', action: '审批机构变更', ip: '192.168.1.10', time: '2023-10-27 10:23:11' },
    { id: 'L10240', user: 'System', action: '每日数据同步', ip: '127.0.0.1', time: '2023-10-27 00:00:01' },
  ];

  return (
    <div className="space-y-4">
       <h2 className="text-xl font-bold text-gray-800">系统日志审计</h2>
       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table 
            rowKey="id"
            dataSource={data}
            columns={[
              { title: '日志ID', render: (r:any) => <span className="font-mono text-xs">{r.id}</span> },
              { title: '操作人', render: (r:any) => r.user },
              { title: '操作内容', render: (r:any) => r.action },
              { title: 'IP地址', render: (r:any) => r.ip },
              { title: '时间', render: (r:any) => r.time },
              { title: '操作', render: () => <Button size="sm" variant="ghost"><Eye className="w-3 h-3 mr-1" /> 详情</Button> }
            ]}
          />
       </div>
    </div>
  );
};

// --- 3. Dictionary Config ---
export const DictConfigView = () => {
  const data = [
    { id: 'D01', code: 'HOSP_LEVEL', name: '医院等级', count: 5, update: '2023-01-01' },
    { id: 'D02', code: 'SERVICE_TYPE', name: '服务类型', count: 13, update: '2023-05-20' },
  ];

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">字典参数配置</h2>
          <Button variant="secondary">刷新缓存</Button>
       </div>
       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table 
            rowKey="id"
            dataSource={data}
            columns={[
              { title: '字典代码', render: (r:any) => <span className="font-mono font-medium">{r.code}</span> },
              { title: '字典名称', render: (r:any) => r.name },
              { title: '条目数', render: (r:any) => r.count },
              { title: '最后更新', render: (r:any) => r.update },
              { title: '操作', render: () => <OperationButtons /> }
            ]}
          />
       </div>
    </div>
  );
};

// --- 4. Notification Center ---
export const NotificationView = () => {
  const data = [
    { id: 'N01', title: '关于系统停机维护的通知', type: '系统公告', date: '2023-10-25', status: 'Published' },
    { id: 'N02', title: '10月远程医疗质控考核提醒', type: '业务提醒', date: '2023-10-26', status: 'Draft' },
  ];

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">消息通知中心</h2>
          <Button><Plus className="w-4 h-4 mr-2"/>发布公告</Button>
       </div>
       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table 
            rowKey="id"
            dataSource={data}
            columns={[
              { title: '标题', render: (r:any) => r.title },
              { title: '类型', render: (r:any) => <Badge type="neutral">{r.type}</Badge> },
              { title: '发布日期', render: (r:any) => r.date },
              { title: '状态', render: (r:any) => <Badge type={r.status === 'Published' ? 'success' : 'warning'}>{r.status}</Badge> },
              { title: '操作', render: () => <OperationButtons /> }
            ]}
          />
       </div>
    </div>
  );
};