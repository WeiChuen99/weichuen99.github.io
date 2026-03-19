import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FuelEntry } from '../types';

 function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
   return Object.fromEntries(
     Object.entries(obj).filter(([, value]) => value !== undefined)
   ) as T;
 }

export function useFuelEntries() {
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'fuelEntries'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entriesData: FuelEntry[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            carId: data.carId,
            userId: data.userId,
            date: data.date.toDate(),
            liters: data.liters,
            pricePerLiter: data.pricePerLiter,
            totalCost: data.totalCost,
            location: data.location,
            notes: data.notes,
            createdAt: data.createdAt.toDate(),
          };
        });
        setEntries(entriesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEntry = async (entry: Omit<FuelEntry, 'id' | 'createdAt'>) => {
    try {
      const payload = stripUndefined({
        ...entry,
        date: Timestamp.fromDate(entry.date),
        createdAt: Timestamp.fromDate(new Date()),
      });

      await addDoc(collection(db, 'fuelEntries'), payload);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add entry');
    }
  };

  const updateEntry = async (id: string, entry: Partial<FuelEntry>) => {
    try {
      const docRef = doc(db, 'fuelEntries', id);
      const updateData: Record<string, unknown> = stripUndefined({ ...entry });
      if (entry.date) {
        updateData.date = Timestamp.fromDate(entry.date);
      }

      await updateDoc(docRef, updateData);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update entry');
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fuelEntries', id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
