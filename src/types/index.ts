export interface Car {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
}

export interface FuelEntry {
  id: string;
  carId: string;
  userId: string;
  date: Date;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  location?: string;
  notes?: string;
  createdAt: Date;
}

export interface RefuelReceipt {
  id: string;
  date: Date;
  totalLiters: number;
  totalCost: number;
  pricePerLiter: number;
  carAId: string;
  carALiters: number;
  carACost: number;
  carBId: string;
  carBLiters: number;
  carBCost: number;
  notes?: string;
  createdAt: Date;
}

export interface Settings {
  currency: string;
  monthlyBudget: number;
  perRefuelLimit: number;
  pricePerLiter: number;
}

export interface RefuelSummaryStats {
  receiptCount: number;
  totalCost: number;
  totalLiters: number;
  averageCost: number;
  averageLiters: number;
}

export interface MonthlyBudgetStats {
  totalSpent: number;
  remainingBudget: number;
  percentUsed: number;
  receiptCount: number;
}

export interface CarStats {
  carId: string;
  carName: string;
  totalSpent: number;
  totalLiters: number;
  refillCount: number;
  averageLiters: number;
  lastRefillDate?: Date;
}
