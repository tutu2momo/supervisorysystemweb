// Administrative Hierarchy Levels
export enum AdminLevel {
  PROVINCE = 1, // Global View
  CITY = 2,     // City View
  COUNTY = 3,   // County View
  VILLAGE = 4   // Execution Unit
}

export interface Region {
  code: string;
  name: string;
  level: AdminLevel;
  parentCode: string | null;
}

export interface User {
  id: string;
  name: string;
  role: string;
  adminLevel: AdminLevel;
  regionCode: string; // The region this user belongs to
  avatar?: string;
}

export interface RouteConfig {
  key: string;
  path: string;
  label: string;
  icon: string;
  // Permissions
  minLevel?: AdminLevel; 
  maxLevel?: AdminLevel;
  includeLevels?: AdminLevel[]; // Explicitly allowed levels (overrides min/max if present)
  
  features?: string[];
  children?: RouteConfig[]; // Nested menu items
}

// Institution / Grid Management
export interface Department {
  name: string;
  supervisor: string;
  status: 'Active' | 'Inactive';
}

export interface Institution {
  id: string;
  name: string;
  type: 'Hospital' | 'HealthCenter' | 'VillageClinic';
  level: string; // Grade 3A, etc.
  regionCode: string;
  address: string;
  parentId?: string; // For Medical Alliance tree
  status: 'Active' | 'Inactive';
  qualifications?: string[]; // e.g. ["Medical License", "Radiology Permit"]
  departmentCount?: number; // Total supervised departments
  departments?: Department[]; // Detailed list
  contactPhone?: string;
  legalRepresentative?: string;
}

// Resource Supervision
export interface Doctor {
  id: string;
  name: string;
  title: '主任医师' | '副主任医师' | '主治医师' | '医师' | '医士'; 
  institutionName: string;
  institutionId?: string; // For filtering
  specialty: string;
  serviceCount: number;
  rating: number;
  certUrl?: string; // For certificate preview
  qualified: boolean;
}

export interface Patient {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  diagnosis: string; // Triage diagnosis
  visitDate: string;
  hospitalName: string;
  hospitalId: string;
  regionCode: string; // Where the patient is treated
  regionName: string;
  referralType?: 'Out' | 'In' | 'Local'; // Flow direction
}

// Operation Stats
export interface OperationStat {
  regionName: string;
  regionCode: string; // Added for linking
  parentCode: string | null; // Added for hierarchical filtering
  telemedicineCount: number;
  internetMedCount: number;
  totalWorkload: number;
}

// Warning Center
export interface WarningItem {
  id: string;
  title: string;
  type: 'CertExpired' | 'DeviceOffline' | 'StaffShortage';
  severity: 'High' | 'Medium' | 'Low';
  institutionName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Resolved';
}

// Financial
export interface Transaction {
  id: string;
  serviceName: string;
  institutionName: string;
  regionName: string; 
  regionCode: string; // Added for precise filtering
  amount: number;
  standardPrice: number;
  date: string;
  status: 'Normal' | 'Abnormal';
  patientName: string;
}

export interface RegionFinancialSummary {
  regionCode: string;
  regionName: string;
  parentCode: string | null;
  totalAmount: number;
  transactionCount: number;
  abnormalCount: number;
}