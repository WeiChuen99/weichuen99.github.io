import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../lib/constants';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'app');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<Settings>;
          setSettings({
            currency: data.currency ?? DEFAULT_SETTINGS.currency,
            monthlyBudget: data.monthlyBudget ?? DEFAULT_SETTINGS.monthlyBudget,
            perRefuelLimit: data.perRefuelLimit ?? DEFAULT_SETTINGS.perRefuelLimit,
            pricePerLiter: data.pricePerLiter ?? DEFAULT_SETTINGS.pricePerLiter,
          });
        } else {
          await setDoc(docRef, DEFAULT_SETTINGS);
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const docRef = doc(db, 'settings', 'app');
      const updated = { ...settings, ...newSettings };
      await setDoc(docRef, updated);
      setSettings(updated);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  return {
    settings,
    loading,
    updateSettings,
  };
}
