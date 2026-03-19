import type { Car, User, Settings } from '../types';

export const CARS: Car[] = [
  { id: 'x', name: 'X', color: '#3b82f6', icon: '🚗' },
  { id: 'c', name: 'C', color: '#ef4444', icon: '🚙' },
  { id: 'mv', name: 'Mv', color: '#10b981', icon: '🚐' },
  { id: 'p', name: 'P', color: '#f59e0b', icon: '🚕' },
  { id: 'm', name: 'M', color: '#8b5cf6', icon: '🚘' },
  { id: 'rr', name: 'RR', color: '#ec4899', icon: '🏎️' },
];

export const USERS: User[] = [
  { id: 'c', name: 'C' },
  { id: 'z', name: 'Z' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'p', name: 'P' },
];

export const DEFAULT_SETTINGS: Settings = {
  currency: 'RM',
  monthlyBudget: 1200,
  perRefuelLimit: 50,
  pricePerLiter: 2.05,
};
