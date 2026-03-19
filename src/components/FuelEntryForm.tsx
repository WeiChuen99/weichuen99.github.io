import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Label } from './ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { CARS } from '../lib/constants';
import { allocateCosts } from '../lib/calculations';
import type { RefuelReceipt, Settings } from '../types';

interface FuelEntryFormProps {
  onSubmit: (receipt: Omit<RefuelReceipt, 'id' | 'createdAt'>) => Promise<void>;
  settings: Settings;
}

export function FuelEntryForm({ onSubmit, settings }: FuelEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCost, setTotalCost] = useState('');

  const [carAId, setCarAId] = useState(CARS[0].id);
  const [carBId, setCarBId] = useState(CARS[1]?.id ?? CARS[0].id);
  const [carAPercentage, setCarAPercentage] = useState(50); // Slider percentage for Car A (0-100)

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const parsedTotalCost = totalCost ? parseFloat(totalCost) : 0;
  
  // Calculate total liters from cost and price per liter
  const totalLiters = parsedTotalCost > 0 ? parsedTotalCost / settings.pricePerLiter : 0;
  
  // Distribute liters based on slider percentage
  const parsedALiters = (totalLiters * carAPercentage) / 100;
  const parsedBLiters = totalLiters - parsedALiters;

  const allocation = allocateCosts(parsedTotalCost, parsedALiters, parsedBLiters);
  const exceedsLimit = totalLiters > settings.perRefuelLimit;
  const sameCarSelected = carAId === carBId;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (sameCarSelected) {
      alert('Car A and Car B must be different.');
      return;
    }

    if (totalLiters <= 0) {
      alert('Please enter a valid total cost.');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await onSubmit({
        date: new Date(date),
        totalLiters: allocation.totalLiters,
        totalCost: parsedTotalCost,
        pricePerLiter: allocation.pricePerLiter,
        carAId,
        carALiters: parsedALiters,
        carACost: allocation.carACost,
        carBId,
        carBLiters: parsedBLiters,
        carBCost: allocation.carBCost,
        notes: notes || undefined,
      });

      setTotalCost('');
      setCarAPercentage(50);
      setNotes('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Failed to add entry: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Refuel Receipt (2 Cars)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total-cost">Receipt Total Cost ({settings.currency})</Label>
              <Input
                id="total-cost"
                type="number"
                step="0.01"
                min="0"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Total Liters (limit: {settings.perRefuelLimit}L)</Label>
              <Input type="text" value={totalLiters.toFixed(2)} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Default Price per Liter ({settings.currency}/L)</Label>
              <Input
                type="text"
                value={settings.pricePerLiter.toFixed(3)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="car-a">Car A</Label>
                <Select
                  id="car-a"
                  value={carAId}
                  onChange={(e) => setCarAId(e.target.value)}
                  required
                >
                  {CARS.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.icon} {car.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="car-b">Car B</Label>
                <Select
                  id="car-b"
                  value={carBId}
                  onChange={(e) => setCarBId(e.target.value)}
                  required
                >
                  {CARS.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.icon} {car.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Distribute Liters Between Cars</Label>
                <span className="text-sm text-muted-foreground">
                  {parsedALiters.toFixed(1)}L / {parsedBLiters.toFixed(1)}L
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={carAPercentage}
                onChange={(e) => setCarAPercentage(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${carAPercentage}%, #94a3b8 ${carAPercentage}%, #94a3b8 100%)`
                }}
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900">Car A</div>
                  <div className="text-blue-700">{parsedALiters.toFixed(2)}L</div>
                  <div className="text-blue-600">{settings.currency}{allocation.carACost.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-900">Car B</div>
                  <div className="text-slate-700">{parsedBLiters.toFixed(2)}L</div>
                  <div className="text-slate-600">{settings.currency}{allocation.carBCost.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {sameCarSelected && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              <div>❌ Error: Car A and Car B must be different.</div>
            </div>
          )}

          {exceedsLimit && !sameCarSelected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
              <div>⚠️ Warning: Total liters ({totalLiters.toFixed(2)}L) exceeds the per-refuel limit of {settings.perRefuelLimit}L.</div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes - Optional</Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Entry'}
            </Button>
            {success && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Entry added successfully!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
