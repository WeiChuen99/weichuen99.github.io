import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import type { Settings } from '../types';

interface SettingsEditorProps {
  settings: Settings;
  onUpdate: (settings: Settings) => Promise<void>;
}

export function SettingsEditor({ settings, onUpdate }: SettingsEditorProps) {
  const [currency, setCurrency] = useState(settings.currency);
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [perRefuelLimit, setPerRefuelLimit] = useState(settings.perRefuelLimit.toString());
  const [pricePerLiter, setPricePerLiter] = useState(settings.pricePerLiter.toString());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await onUpdate({
        currency,
        monthlyBudget: parseFloat(monthlyBudget),
        perRefuelLimit: parseFloat(perRefuelLimit),
        pricePerLiter: parseFloat(pricePerLiter),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Failed to update settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="RM"
                required
              />
              <p className="text-xs text-muted-foreground">
                Currency symbol used throughout the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                min="0"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Total budget for fuel expenses per month (e.g., 1200 for RM1200)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perRefuelLimit">Per Refuel Limit (Liters)</Label>
              <Input
                id="perRefuelLimit"
                type="number"
                step="0.1"
                min="0"
                value={perRefuelLimit}
                onChange={(e) => setPerRefuelLimit(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum total liters allowed per refuel receipt (e.g., 50 for 50L). A warning will be shown if exceeded.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerLiter">Default Price per Liter ({currency}/L)</Label>
              <Input
                id="pricePerLiter"
                type="number"
                step="0.01"
                min="0"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Default fuel price per liter used for auto-calculation in the Add Refuel form (e.g., 2.05 for RM2.05/L)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
            {success && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
