import { AdminLevel, Region, RouteConfig, User, Institution, WarningItem, Transaction, Doctor, Patient, OperationStat, RegionFinancialSummary } from './types';

// --- Hierarchy Mock Data (Guizhou) ---
export const MOCK_REGIONS: Region[] = [
  // Level 1: Province
  { code: '520000', name: '贵州省', level: AdminLevel.PROVINCE, parentCode: null },
  
  // Level 2: Cities
  { code: '520100', name: '贵阳市', level: AdminLevel.CITY, parentCode: '520000' },
  { code: '520300', name: '遵义市', level: AdminLevel.CITY, parentCode: '520000' },
  { code: '520200', name: '六盘水市', level: AdminLevel.CITY, parentCode: '520000' },
  { code: '520400', name: '安顺市', level: AdminLevel.CITY, parentCode: '520000' },
  
  // Level 3: Counties (Under Guiyang 520100)
  { code: '520102', name: '南明区', level: AdminLevel.COUNTY, parentCode: '520100' },
  { code: '520103', name: '云岩区', level: AdminLevel.COUNTY, parentCode: '520100' },
  { code: '520111', name: '花溪区', level: AdminLevel.COUNTY, parentCode: '520100' },
  { code: '520112', name: '乌当区', level: AdminLevel.COUNTY, parentCode: '520100' },

  // Level 4: Villages/Townships (Under Nanming 520102)
  { code: '520102001', name: '花果园街道', level: AdminLevel.VILLAGE, parentCode: '520102' },
  { code: '520102002', name: '太慈桥街道', level: AdminLevel.VILLAGE, parentCode: '520102' },
  { code: '520102003', name: '湘雅街道', level: AdminLevel.VILLAGE, parentCode: '520102' },
  { code: '520102004', name: '中曹司街道', level: AdminLevel.VILLAGE, parentCode: '520102' },
];

export const H2H_SERVICES = [
  '远程会诊', '远程影像', '远程心电', '远程病理', '远程重症监护', 
  '远程卒中', '远程超声示教', '远程查房', '远程双向转诊', 
  '远程医学教育', '远程手术示教', '远程门诊', '远程检验质控',
  '远程消毒供应', '远程康复指导'
];

export const TOC_SERVICES = [
  '远程探视', '慢病复诊', '诊后随访', '在线咨询', '医学科普', 
  '处方共享及配送', '公共卫生随访', '远程胎心监测', 'AI辅助诊疗',
  '心理咨询', '居家护理预约', '母婴保健指导', '报告解读', '健康档案查询'
];

// --- Route Configuration (Optimized for Guizhou Requirements) ---
export const ROUTE_CONFIG: RouteConfig[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    label: '监管汇总驾驶舱',
    icon: 'LayoutDashboard',
    includeLevels: [AdminLevel.PROVINCE, AdminLevel.CITY, AdminLevel.COUNTY, AdminLevel.VILLAGE],
  },
  {
    key: 'institution', 
    path: '/institution',
    label: '机构监管',
    icon: 'Building2',
    // Only Province (City removed as per request)
    includeLevels: [AdminLevel.PROVINCE],
  },
  {
    key: 'resources', 
    path: '/resources',
    label: '资源监管',
    icon: 'Database', 
    // Only Province (City removed as per request)
    includeLevels: [AdminLevel.PROVINCE],
  },
  {
    key: 'services', 
    path: '/services',
    label: '服务监管',
    icon: 'ScrollText',
    // Only Province (City removed as per request)
    includeLevels: [AdminLevel.PROVINCE],
  },
  {
    key: 'operations', 
    path: '/operations',
    label: '基本运行情况监管', 
    icon: 'Activity',
    // Province, City, County
    includeLevels: [AdminLevel.PROVINCE, AdminLevel.CITY, AdminLevel.COUNTY],
  },
  {
    key: 'quality', 
    path: '/quality',
    label: '服务质量监管',
    icon: 'BadgeCheck',
    // Province, City, County
    includeLevels: [AdminLevel.PROVINCE, AdminLevel.CITY, AdminLevel.COUNTY],
  },
  {
    key: 'finance', 
    path: '/finance',
    label: '财务监管',
    icon: 'Scale',
    // Province, City, County
    includeLevels: [AdminLevel.PROVINCE, AdminLevel.CITY, AdminLevel.COUNTY],
  }
];

// --- Mock Users ---
export const MOCK_USERS: Record<string, User> = {
  provinceAdmin: {
    id: 'u1',
    name: '李局长',
    role: '省级管理员',
    adminLevel: AdminLevel.PROVINCE,
    regionCode: '520000',
  },
  cityAdmin: {
    id: 'u2',
    name: '王主任',
    role: '市级管理员',
    adminLevel: AdminLevel.CITY,
    regionCode: '520100', // 贵阳市
  },
  countyAdmin: {
    id: 'u3',
    name: '陈科长',
    role: '县级管理员',
    adminLevel: AdminLevel.COUNTY,
    regionCode: '520102', // 南明区
  },
};

// --- Mock Institutions (Restricted to 10 items) ---
export const MOCK_INSTITUTIONS: Institution[] = [
  // --- LEAD HOSPITAL (1) ---
  { 
    id: 'h1', 
    name: '贵州省人民医院', 
    type: 'Hospital', 
    level: '三级甲等', 
    regionCode: '520000', 
    address: '贵阳市中山东路1号', 
    status: 'Active', 
    qualifications: ['医疗执业许可证', '放射诊疗许可证', '互联网医院执照'],
    departmentCount: 45,
    contactPhone: '0851-88888888',
    legalRepresentative: '张院长',
    departments: [
      { name: '心血管内科', supervisor: '李主任', status: 'Active' },
      { name: '神经外科', supervisor: '王主任', status: 'Active' },
      { name: '远程医学中心', supervisor: '陈主任', status: 'Active' },
      { name: '呼吸与危重症医学科', supervisor: '刘主任', status: 'Active' },
      { name: '消化内科', supervisor: '赵主任', status: 'Active' },
      { name: '肾内科', supervisor: '孙主任', status: 'Active' },
      { name: '内分泌科', supervisor: '周主任', status: 'Active' },
      { name: '血液内科', supervisor: '吴主任', status: 'Active' }
    ]
  },
  // --- 4 AFFILIATES (Under h1 - Explicitly named as requested) ---
  { id: 'h3', name: '贵阳市第一人民医院 (医联体成员)', type: 'Hospital', level: '三级甲等', regionCode: '520100', address: '贵阳市博爱路97号', parentId: 'h1', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 32 },
  { id: 'h20', name: '贵阳市第四人民医院 (医联体成员)', type: 'Hospital', level: '三级乙等', regionCode: '520100', address: '贵阳市南明区', parentId: 'h1', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 25 },
  { id: 'h7', name: '贵阳市云岩区人民医院 (医联体成员)', type: 'Hospital', level: '二级甲等', regionCode: '520103', address: '云岩区北京路', parentId: 'h1', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 20 },
  { id: 'h22', name: '乌当区人民医院 (医联体成员)', type: 'Hospital', level: '二级乙等', regionCode: '520112', address: '乌当区', parentId: 'h1', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 15 },
  // --- 5 OTHERS ---
  { id: 'h2', name: '贵州医科大学附属医院', type: 'Hospital', level: '三级甲等', regionCode: '520000', address: '贵阳市贵医街28号', status: 'Active', qualifications: ['医疗执业许可证', '放射诊疗许可证'], departmentCount: 52 },
  { id: 'h4', name: '遵义医科大学附属医院', type: 'Hospital', level: '三级甲等', regionCode: '520300', address: '遵义市大连路149号', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 48 },
  { id: 'h_new_1', name: '贵阳市第二人民医院', type: 'Hospital', level: '三级甲等', regionCode: '520100', address: '贵阳市观山湖区金阳南路547号', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 38 },
  { id: 'h_new_2', name: '贵阳市妇幼保健院', type: 'Hospital', level: '三级甲等', regionCode: '520100', address: '贵阳市瑞金南路63号', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 30 },
  { id: 'h_new_3', name: '贵州省肿瘤医院', type: 'Hospital', level: '三级甲等', regionCode: '520000', address: '贵阳市北京西路1号', status: 'Active', qualifications: ['医疗执业许可证'], departmentCount: 28 }
];

// ... (Rest of the file remains unchanged) ...
export const MOCK_DOCTORS: Doctor[] = [
  // H1: Guizhou Provincial (12 docs)
  { id: 'd1', name: '刘伟', title: '主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '心内科', serviceCount: 1540, rating: 4.9, qualified: true },
  { id: 'd101', name: '张华', title: '主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '神经内科', serviceCount: 1420, rating: 4.8, qualified: true },
  { id: 'd102', name: '李明', title: '副主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '呼吸科', serviceCount: 1280, rating: 4.9, qualified: true },
  { id: 'd103', name: '赵丽', title: '副主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '内分泌', serviceCount: 1150, rating: 4.7, qualified: true },
  { id: 'd104', name: '王强', title: '主治医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '急诊科', serviceCount: 2100, rating: 4.8, qualified: true },
  { id: 'd105', name: '孙红', title: '主治医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '儿科', serviceCount: 980, rating: 4.9, qualified: true },
  { id: 'd106', name: '周涛', title: '医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '全科', serviceCount: 850, rating: 4.6, qualified: true },
  { id: 'd107', name: '吴军', title: '主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '骨科', serviceCount: 1600, rating: 4.9, qualified: true },
  { id: 'd108', name: '郑勇', title: '副主任医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '普外科', serviceCount: 1320, rating: 4.8, qualified: true },
  { id: 'd109', name: '冯萍', title: '主治医师', institutionName: '贵州省人民医院', institutionId: 'h1', specialty: '妇产科', serviceCount: 1050, rating: 4.7, qualified: true },
  
  // H2: Med University (9 docs)
  { id: 'd7', name: '孙梅', title: '副主任医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '妇科', serviceCount: 890, rating: 4.9, qualified: true },
  { id: 'd201', name: '钱学森', title: '主任医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '肿瘤科', serviceCount: 1800, rating: 5.0, qualified: true },
  { id: 'd202', name: '李四光', title: '副主任医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '胸外科', serviceCount: 950, rating: 4.8, qualified: true },
  { id: 'd203', name: '华罗庚', title: '主治医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '皮肤科', serviceCount: 1200, rating: 4.7, qualified: true },
  { id: 'd204', name: '竺可桢', title: '医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '眼科', serviceCount: 600, rating: 4.6, qualified: true },
  { id: 'd205', name: '茅以升', title: '主任医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '骨科', serviceCount: 1550, rating: 4.9, qualified: true },
  { id: 'd206', name: '童第周', title: '副主任医师', institutionName: '贵州医科大学附属医院', institutionId: 'h2', specialty: '泌尿外科', serviceCount: 1100, rating: 4.8, qualified: true },
  
  // H3: Guiyang First (6 docs)
  { id: 'd2', name: '陈红', title: '副主任医师', institutionName: '贵阳市第一人民医院', institutionId: 'h3', specialty: '呼吸科', serviceCount: 920, rating: 4.8, qualified: true },
  { id: 'd301', name: '林巧稚', title: '主任医师', institutionName: '贵阳市第一人民医院', institutionId: 'h3', specialty: '妇产科', serviceCount: 1300, rating: 5.0, qualified: true },
  { id: 'd302', name: '张孝骞', title: '主治医师', institutionName: '贵阳市第一人民医院', institutionId: 'h3', specialty: '消化内科', serviceCount: 880, rating: 4.7, qualified: true },
  { id: 'd303', name: '汤飞凡', title: '医师', institutionName: '贵阳市第一人民医院', institutionId: 'h3', specialty: '感染科', serviceCount: 540, rating: 4.6, qualified: true },
  { id: 'd304', name: '黄家驷', title: '副主任医师', institutionName: '贵阳市第一人民医院', institutionId: 'h3', specialty: '胸外科', serviceCount: 1020, rating: 4.9, qualified: true },
  
  // H4: Zunyi Med (5 docs)
  { id: 'd4', name: '赵强', title: '主任医师', institutionName: '遵义医科大学附属医院', institutionId: 'h4', specialty: '神经外科', serviceCount: 1100, rating: 4.9, qualified: true },
  { id: 'd401', name: '吴阶平', title: '副主任医师', institutionName: '遵义医科大学附属医院', institutionId: 'h4', specialty: '泌尿外科', serviceCount: 980, rating: 4.8, qualified: true },
  { id: 'd402', name: '诸福棠', title: '主治医师', institutionName: '遵义医科大学附属医院', institutionId: 'h4', specialty: '儿科', serviceCount: 1450, rating: 4.9, qualified: true },
  
  // H20: Guiyang Fourth (3 docs)
  { id: 'd3', name: '张建国', title: '主治医师', institutionName: '贵阳市第四人民医院', institutionId: 'h20', specialty: '全科', serviceCount: 2300, rating: 5.0, qualified: true },
  { id: 'd501', name: '马海德', title: '副主任医师', institutionName: '贵阳市第四人民医院', institutionId: 'h20', specialty: '皮肤科', serviceCount: 760, rating: 4.7, qualified: true },

  // Others (1-2 docs)
  { id: 'd5', name: '王敏', title: '医师', institutionName: '贵阳市云岩区人民医院', institutionId: 'h7', specialty: '儿科', serviceCount: 450, rating: 4.7, qualified: true },
  { id: 'd6', name: '李强', title: '医士', institutionName: '乌当区人民医院', institutionId: 'h22', specialty: '急诊', serviceCount: 320, rating: 4.6, qualified: true },
  { id: 'd8', name: '周杰', title: '主治医师', institutionName: '贵阳市第二人民医院', institutionId: 'h_new_1', specialty: '骨科', serviceCount: 670, rating: 4.8, qualified: true },
];

export const MOCK_PATIENTS: Patient[] = [
  // H1: Provincial Hospital (12 patients)
  { id: 'p1', name: '张三', gender: '男', age: 45, diagnosis: '高血压', visitDate: '2023-10-25', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p101', name: '李一', gender: '女', age: 55, diagnosis: '冠心病', visitDate: '2023-10-25', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p102', name: '王二', gender: '男', age: 60, diagnosis: '糖尿病', visitDate: '2023-10-26', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },
  { id: 'p103', name: '赵三', gender: '女', age: 35, diagnosis: '甲亢', visitDate: '2023-10-26', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Out' },
  { id: 'p104', name: '孙四', gender: '男', age: 70, diagnosis: '慢阻肺', visitDate: '2023-10-27', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p105', name: '周五', gender: '女', age: 28, diagnosis: '胃炎', visitDate: '2023-10-27', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },
  { id: 'p106', name: '吴六', gender: '男', age: 40, diagnosis: '肝炎', visitDate: '2023-10-28', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p107', name: '郑七', gender: '女', age: 50, diagnosis: '胆结石', visitDate: '2023-10-28', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Out' },
  { id: 'p108', name: '冯八', gender: '男', age: 65, diagnosis: '肾结石', visitDate: '2023-10-29', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p109', name: '陈九', gender: '女', age: 30, diagnosis: '贫血', visitDate: '2023-10-29', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },
  { id: 'p110', name: '褚十', gender: '男', age: 48, diagnosis: '骨折', visitDate: '2023-10-30', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p111', name: '卫十一', gender: '女', age: 58, diagnosis: '关节炎', visitDate: '2023-10-30', hospitalName: '贵州省人民医院', hospitalId: 'h1', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },

  // H2: Med Univ (9 patients)
  { id: 'p4', name: '赵六', gender: '女', age: 28, diagnosis: '甲状腺结节', visitDate: '2023-10-27', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Out' },
  { id: 'p201', name: '蒋十二', gender: '男', age: 42, diagnosis: '肺癌', visitDate: '2023-10-25', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p202', name: '沈十三', gender: '女', age: 38, diagnosis: '乳腺癌', visitDate: '2023-10-26', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },
  { id: 'p203', name: '韩十四', gender: '男', age: 55, diagnosis: '胃癌', visitDate: '2023-10-27', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p204', name: '杨十五', gender: '女', age: 60, diagnosis: '结肠癌', visitDate: '2023-10-28', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Out' },
  { id: 'p205', name: '朱十六', gender: '男', age: 45, diagnosis: '肝癌', visitDate: '2023-10-29', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p206', name: '秦十七', gender: '女', age: 32, diagnosis: '宫颈癌', visitDate: '2023-10-30', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },
  { id: 'p207', name: '尤十八', gender: '男', age: 68, diagnosis: '食管癌', visitDate: '2023-10-31', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
  { id: 'p208', name: '许十九', gender: '女', age: 52, diagnosis: '卵巢癌', visitDate: '2023-11-01', hospitalName: '贵州医科大学附属医院', hospitalId: 'h2', regionCode: '520000', regionName: '贵州省直辖', referralType: 'Local' },

  // H3: Guiyang First (6 patients)
  { id: 'p2', name: '李四', gender: '女', age: 32, diagnosis: '上呼吸道感染', visitDate: '2023-10-26', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'Local' },
  { id: 'p301', name: '何二十', gender: '男', age: 25, diagnosis: '肺炎', visitDate: '2023-10-26', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'Local' },
  { id: 'p302', name: '吕廿一', gender: '女', age: 29, diagnosis: '支气管炎', visitDate: '2023-10-27', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'Out' },
  { id: 'p303', name: '施廿二', gender: '男', age: 35, diagnosis: '哮喘', visitDate: '2023-10-28', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'In' },
  { id: 'p304', name: '张廿三', gender: '女', age: 40, diagnosis: '肺结核', visitDate: '2023-10-29', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'Local' },
  { id: 'p305', name: '孔廿四', gender: '男', age: 45, diagnosis: '肺气肿', visitDate: '2023-10-30', hospitalName: '贵阳市第一人民医院', hospitalId: 'h3', regionCode: '520100', regionName: '贵阳市', referralType: 'In' },

  // H4: Zunyi Med (5 patients)
  { id: 'p3', name: '王五', gender: '男', age: 67, diagnosis: '冠心病', visitDate: '2023-10-24', hospitalName: '遵义医科大学附属医院', hospitalId: 'h4', regionCode: '520300', regionName: '遵义市', referralType: 'Local' },
  { id: 'p401', name: '曹廿五', gender: '女', age: 62, diagnosis: '脑梗死', visitDate: '2023-10-25', hospitalName: '遵义医科大学附属医院', hospitalId: 'h4', regionCode: '520300', regionName: '遵义市', referralType: 'In' },
  { id: 'p402', name: '严廿六', gender: '男', age: 70, diagnosis: '脑出血', visitDate: '2023-10-26', hospitalName: '遵义医科大学附属医院', hospitalId: 'h4', regionCode: '520300', regionName: '遵义市', referralType: 'Local' },
  { id: 'p403', name: '华廿七', gender: '女', age: 55, diagnosis: '帕金森', visitDate: '2023-10-27', hospitalName: '遵义医科大学附属医院', hospitalId: 'h4', regionCode: '520300', regionName: '遵义市', referralType: 'Out' },
  { id: 'p404', name: '金廿八', gender: '男', age: 60, diagnosis: '癫痫', visitDate: '2023-10-28', hospitalName: '遵义医科大学附属医院', hospitalId: 'h4', regionCode: '520300', regionName: '遵义市', referralType: 'In' },

  // Others
  { id: 'p6', name: '周八', gender: '女', age: 41, diagnosis: '乳腺增生', visitDate: '2023-10-26', hospitalName: '贵阳市妇幼保健院', hospitalId: 'h_new_2', regionCode: '520100', regionName: '贵阳市', referralType: 'Local' },
  { id: 'p12', name: '吴十', gender: '男', age: 38, diagnosis: '骨折', visitDate: '2023-10-25', hospitalName: '贵阳市第二人民医院', hospitalId: 'h_new_1', regionCode: '520100', regionName: '贵阳市', referralType: 'Local' },
  { id: 'p5', name: '孙七', gender: '男', age: 55, diagnosis: '腰椎间盘突出', visitDate: '2023-10-25', hospitalName: '贵阳市第四人民医院', hospitalId: 'h20', regionCode: '520102', regionName: '南明区', referralType: 'In' },
  { id: 'p7', name: '郑十一', gender: '女', age: 22, diagnosis: '急性肠胃炎', visitDate: '2023-10-29', hospitalName: '贵阳市云岩区人民医院', hospitalId: 'h7', regionCode: '520103', regionName: '云岩区', referralType: 'Local' },
  { id: 'p8', name: '王十二', gender: '男', age: 70, diagnosis: '慢性支气管炎', visitDate: '2023-10-28', hospitalName: '乌当区人民医院', hospitalId: 'h22', regionCode: '520112', regionName: '乌当区', referralType: 'Out' },
  { id: 'p11', name: '周九', gender: '女', age: 52, diagnosis: '肺部结节', visitDate: '2023-10-28', hospitalName: '贵州省肿瘤医院', hospitalId: 'h_new_3', regionCode: '520000', regionName: '贵州省直辖', referralType: 'In' },
];

export const MOCK_OPERATIONS: OperationStat[] = [
  // ... (Same as before)
  // Level 2 Data (Cities - Visible to Province)
  { regionName: '贵阳市', regionCode: '520100', parentCode: '520000', telemedicineCount: 6500, internetMedCount: 15000, totalWorkload: 21500 },
  { regionName: '遵义市', regionCode: '520300', parentCode: '520000', telemedicineCount: 5200, internetMedCount: 11500, totalWorkload: 16700 },
  { regionName: '六盘水市', regionCode: '520200', parentCode: '520000', telemedicineCount: 3800, internetMedCount: 8800, totalWorkload: 12600 },
  { regionName: '安顺市', regionCode: '520400', parentCode: '520000', telemedicineCount: 3100, internetMedCount: 7200, totalWorkload: 10300 },

  // Level 3 Data (Counties - Visible to City Guiyang 520100)
  { regionName: '南明区', regionCode: '520102', parentCode: '520100', telemedicineCount: 2200, internetMedCount: 5500, totalWorkload: 7700 },
  { regionName: '云岩区', regionCode: '520103', parentCode: '520100', telemedicineCount: 2100, internetMedCount: 5100, totalWorkload: 7200 },
  { regionName: '花溪区', regionCode: '520111', parentCode: '520100', telemedicineCount: 1500, internetMedCount: 3200, totalWorkload: 4700 },
  { regionName: '乌当区', regionCode: '520112', parentCode: '520100', telemedicineCount: 700, internetMedCount: 1200, totalWorkload: 1900 },

  // Level 4 Data (Townships/Villages - Visible to County Nanming 520102)
  { regionName: '花果园街道', regionCode: '520102001', parentCode: '520102', telemedicineCount: 850, internetMedCount: 2100, totalWorkload: 2950 },
  { regionName: '太慈桥街道', regionCode: '520102002', parentCode: '520102', telemedicineCount: 600, internetMedCount: 1500, totalWorkload: 2100 },
  { regionName: '湘雅街道', regionCode: '520102003', parentCode: '520102', telemedicineCount: 450, internetMedCount: 1100, totalWorkload: 1550 },
  { regionName: '中曹司街道', regionCode: '520102004', parentCode: '520102', telemedicineCount: 300, internetMedCount: 800, totalWorkload: 1100 },
];

export const MOCK_FINANCIAL_SUMMARIES: RegionFinancialSummary[] = [
  // ... (Same as before)
  { regionCode: '520100', regionName: '贵阳市', parentCode: '520000', totalAmount: 452000.00, transactionCount: 1250, abnormalCount: 12 },
  { regionCode: '520300', regionName: '遵义市', parentCode: '520000', totalAmount: 385000.00, transactionCount: 980, abnormalCount: 5 },
  { regionCode: '520200', regionName: '六盘水市', parentCode: '520000', totalAmount: 310000.00, transactionCount: 850, abnormalCount: 8 },
  { regionCode: '520102', regionName: '南明区', parentCode: '520100', totalAmount: 125000.00, transactionCount: 420, abnormalCount: 6 },
  { regionCode: '520103', regionName: '云岩区', parentCode: '520100', totalAmount: 118000.00, transactionCount: 390, abnormalCount: 4 },
  { regionCode: '520111', regionName: '花溪区', parentCode: '520100', totalAmount: 85000.00, transactionCount: 210, abnormalCount: 2 },
  { regionCode: '520102001', regionName: '花果园街道', parentCode: '520102', totalAmount: 45000.00, transactionCount: 150, abnormalCount: 3 },
  { regionCode: '520102002', regionName: '太慈桥街道', parentCode: '520102', totalAmount: 32000.00, transactionCount: 110, abnormalCount: 1 },
  { regionCode: '520102003', regionName: '湘雅街道', parentCode: '520102', totalAmount: 28000.00, transactionCount: 90, abnormalCount: 2 },
];

export const MOCK_WARNINGS: WarningItem[] = [
  { id: 'w1', title: '全科医生执业证即将过期', type: 'CertExpired', severity: 'High', institutionName: '南明区花果园社区卫生服务中心', date: '2023-11-05', status: 'Pending' },
  { id: 'w2', title: '远程心电接收端离线', type: 'DeviceOffline', severity: 'Medium', institutionName: '花果园第二卫生室', date: '2023-11-06', status: 'Processing' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', serviceName: '远程心电分析', institutionName: '南明区花果园社区卫生服务中心', regionName: '花果园街道', regionCode: '520102001', amount: 150.00, standardPrice: 50.00, date: '2023-10-26 10:30', status: 'Abnormal', patientName: '张三' },
  { id: 't4', serviceName: '远程心电分析', institutionName: '南明区太慈桥社区卫生服务中心', regionName: '太慈桥街道', regionCode: '520102002', amount: 55.00, standardPrice: 50.00, date: '2023-10-26 15:45', status: 'Normal', patientName: '赵六' },
  { id: 't2', serviceName: '远程专家会诊', institutionName: '贵阳市第一人民医院', regionName: '贵阳市', regionCode: '520103', amount: 300.00, standardPrice: 300.00, date: '2023-10-26 11:15', status: 'Normal', patientName: '李四' },
  { id: 't3', serviceName: '影像云诊断', institutionName: '遵义医科大学附属医院', regionName: '遵义市', regionCode: '520300', amount: 85.00, standardPrice: 80.00, date: '2023-10-26 14:20', status: 'Normal', patientName: '王五' },
  { id: 't5', serviceName: '专家视频问诊', institutionName: '贵州省人民医院', regionName: '贵阳市', regionCode: '520100', amount: 1200.00, standardPrice: 500.00, date: '2023-10-26 09:00', status: 'Abnormal', patientName: '钱七' },
];