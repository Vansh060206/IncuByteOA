import type { PurchaseHistory } from '../types';

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: 'system' | 'purchase' | 'restock' | 'create' | 'update' | 'delete';
}

const STORAGE_PURCHASES_KEY = 'autovault_purchases_v1';
const STORAGE_ACTIVITY_KEY = 'autovault_activity_v1';
const SEED_FLAG_KEY = 'autovault_seeded_v1';

const INITIAL_PURCHASES: PurchaseHistory[] = [
  {
    id: 'p-1',
    userId: 'u-1',
    vehicleId: 'v-1',
    quantity: 1,
    purchaseDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    vehicle: {
      id: 'v-1',
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any
  },
  {
    id: 'p-2',
    userId: 'u-2',
    vehicleId: 'v-2',
    quantity: 1,
    purchaseDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    vehicle: {
      id: 'v-2',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 26000,
      quantity: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any
  },
  {
    id: 'p-3',
    userId: 'u-3',
    vehicleId: 'v-3',
    quantity: 1,
    purchaseDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    vehicle: {
      id: 'v-3',
      make: 'Tesla',
      model: 'Model Y',
      category: 'SUV',
      price: 48990,
      quantity: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any
  }
];

const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'a-1',
    time: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 mins ago
    message: 'System database sync with Supabase completed.',
    type: 'system'
  },
  {
    id: 'a-2',
    time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    message: 'Customer completed purchase of Toyota Corolla.',
    type: 'purchase'
  },
  {
    id: 'a-3',
    time: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // 6 hours ago
    message: 'Admin restocked 5 units of Toyota Corolla.',
    type: 'restock'
  },
  {
    id: 'a-4',
    time: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    message: 'Customer completed purchase of Honda Civic.',
    type: 'purchase'
  },
  {
    id: 'a-5',
    time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), // 18 hours ago
    message: 'New model Tesla Model Y added to catalog.',
    type: 'create'
  }
];

export const initTelemetryStore = () => {
  const seeded = localStorage.getItem(SEED_FLAG_KEY);
  if (!seeded) {
    localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(INITIAL_PURCHASES));
    localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(INITIAL_ACTIVITY));
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  }
};

export const getPurchaseHistory = (): PurchaseHistory[] => {
  initTelemetryStore();
  try {
    const data = localStorage.getItem(STORAGE_PURCHASES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addPurchase = (purchase: Omit<PurchaseHistory, 'id' | 'purchaseDate'>) => {
  initTelemetryStore();
  const purchases = getPurchaseHistory();
  const newEntry: PurchaseHistory = {
    ...purchase,
    id: `p-${Date.now()}`,
    purchaseDate: new Date().toISOString()
  };
  purchases.unshift(newEntry);
  localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(purchases));
  return newEntry;
};

export const getActivityLogs = (): ActivityLog[] => {
  initTelemetryStore();
  try {
    const data = localStorage.getItem(STORAGE_ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addActivityLog = (message: string, type: ActivityLog['type']) => {
  initTelemetryStore();
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `a-${Date.now()}`,
    time: new Date().toISOString(),
    message,
    type
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(logs));
  return newLog;
};
