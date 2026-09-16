/**
 * RoR Enterprise Suite - Core Data Contracts & Operational Models
 * System Version: 2.4.0-PROD
 * Architecture: SQLite (ror_system.db) + REST API + Offline-First LocalStorage
 */

export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskStatus = 'completed' | 'in-progress' | 'pending' | 'scheduled';
export type ShiftType = 'morning' | 'evening';
export type MenuClassType = 'stars' | 'puzzles' | 'plowhorses' | 'dogs';
export type RoasterySaleType = 'wholesale' | 'retail';

// 1. Operational 40-Task Model
export interface OperationalTask {
    id: number;
    week: number;
    task: string;
    cat: string;
    status: TaskStatus;
    responsible: string;
    dueDate?: string;
    completedAt?: string;
    notes?: string;
}

// 2. Café Bar Shift Report (Aref & Elem)
export interface CafeShiftLog {
    id: number;
    date: string;
    shift: string; // e.g., 'صباحي (عارف)' or 'مسائي (علم)'
    barista: 'عارف' | 'علم' | string;
    cups: number;
    desserts: number;
    revenue: number;
    tickets: number;
    avgTicket: number;
    notes: string;
    createdAt?: string;
}

// 3. Roastery Batch & B2B Invoice Record
export interface RoasteryBatchLog {
    id: number;
    date: string;
    client: string;
    roastProfile?: string;
    greenKg: number;
    roastedKg: number;
    roastLossPct: number; // Guardrail flag if > 18%
    pricePerKg: number;
    type: RoasterySaleType;
    paid: number;
    pending: number;
    status: 'مكتمل' | 'معلق' | 'ملغي';
    notes?: string;
}

// 4. Waste Tracking Record
export interface WasteLog {
    id: number;
    date: string;
    category: 'coffee' | 'milk' | 'pastry' | 'consumables' | string;
    item: string;
    quantity: number;
    unit: 'كجم' | 'لتر' | 'قطعة' | 'علبة';
    costSAR: number;
    reason: string;
    reportedBy: string;
    shift: ShiftType;
    createdAt?: string;
}

// 5. Menu Engineering Item
export interface MenuItem {
    id?: number;
    name: string;
    category: string;
    price: number;
    cost: number;
    contributionMargin: number; // price - cost
    contributionPct: number;    // ((price - cost) / price) * 100
    popularity: number;         // 1 to 10 scale
    classType: MenuClassType;
    label: string;
    badge: string;
    icon: string;
}

// 6. Break-Even Configuration & Metrics
export interface BreakevenConfig {
    monthlyFixedCosts: number;
    variableCostRatio: number; // e.g. 0.45 (45%)
    avgCupPrice: number;       // e.g. 20 SAR
    dailyTargetRevenue?: number;
}

// 7. Department Custom Task
export interface DepartmentTask {
    id: string;
    deptKey: string;
    title: string;
    assignedTo: string;
    priority: PriorityLevel;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
}

// 8. Organizational Role Assignment
export interface OrgRoleAssignment {
    id: string; // position ID, e.g., 'ops-roaster'
    holder: string;
    startDate: string;
    salary: number;
    assignedAt: string;
}

// 9. Development Pipeline & SOPs
export interface DevInitiative {
    id: number;
    category: 'training' | 'sop' | 'automation' | 'innovation';
    title: string;
    description: string;
    progressPct: number;
    owner: string;
    targetDate: string;
    status: 'planned' | 'in-progress' | 'completed';
}

// 10. Financial Commitments
export interface FinancialCommitment {
    id: number;
    title: string;
    amount: number;
    dueDate: string;
    paymentMethod: string;
    status: 'paid' | 'pending' | 'upcoming';
    type: 'fixed' | 'variable';
}
