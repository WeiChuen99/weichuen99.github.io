import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RefuelReceipt } from '../types';

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as T;
}

export function useRefuelReceipts() {
  const [receipts, setReceipts] = useState<RefuelReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'refuelReceipts'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: RefuelReceipt[] = snapshot.docs.map((d) => {
          const docData = d.data();
          return {
            id: d.id,
            userId: docData.userId,
            date: docData.date.toDate(),
            totalLiters: docData.totalLiters,
            totalCost: docData.totalCost,
            pricePerLiter: docData.pricePerLiter,
            carAId: docData.carAId,
            carALiters: docData.carALiters,
            carACost: docData.carACost,
            carBId: docData.carBId,
            carBLiters: docData.carBLiters,
            carBCost: docData.carBCost,
            location: docData.location,
            notes: docData.notes,
            createdAt: docData.createdAt.toDate(),
          };
        });

        setReceipts(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addReceipt = async (receipt: Omit<RefuelReceipt, 'id' | 'createdAt'>) => {
    try {
      const payload = stripUndefined({
        ...receipt,
        date: Timestamp.fromDate(receipt.date),
        createdAt: Timestamp.fromDate(new Date()),
      });

      await addDoc(collection(db, 'refuelReceipts'), payload);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to add refuel receipt'
      );
    }
  };

  const updateReceipt = async (id: string, receipt: Partial<RefuelReceipt>) => {
    try {
      const docRef = doc(db, 'refuelReceipts', id);
      const updateData: Record<string, unknown> = stripUndefined({ ...receipt });
      if (receipt.date) {
        updateData.date = Timestamp.fromDate(receipt.date);
      }
      await updateDoc(docRef, updateData);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to update refuel receipt'
      );
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'refuelReceipts', id));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to delete refuel receipt'
      );
    }
  };

  return {
    receipts,
    loading,
    error,
    addReceipt,
    updateReceipt,
    deleteReceipt,
  };
}
