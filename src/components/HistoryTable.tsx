import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Label } from './ui/Label';
import type { RefuelReceipt } from '../types';
import { CARS } from '../lib/constants';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface HistoryTableProps {
  receipts: RefuelReceipt[];
  currency: string;
  onDelete: (id: string) => Promise<void>;
}

export function HistoryTable({ receipts, currency, onDelete }: HistoryTableProps) {
  const [filterCar, setFilterCar] = useState('all');

  const filteredReceipts = receipts.filter((r) => {
    if (filterCar !== 'all' && r.carAId !== filterCar && r.carBId !== filterCar) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await onDelete(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refuel History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <Label htmlFor="filter-car">Filter by Car</Label>
              <Select
                id="filter-car"
                value={filterCar}
                onChange={(e) => setFilterCar(e.target.value)}
              >
                <option value="all">All Cars</option>
                {CARS.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.icon} {car.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredReceipts.length} of {receipts.length} receipts
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Cars</th>
                  <th className="pb-2 font-semibold text-right">Total Liters</th>
                  <th className="pb-2 font-semibold text-right">Price/L</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                  <th className="pb-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => {
                    const carA = CARS.find((c) => c.id === r.carAId);
                    const carB = CARS.find((c) => c.id === r.carBId);
                    return (
                      <tr key={r.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{format(r.date, 'dd MMM yyyy')}</td>
                        <td className="py-3">
                          <div className="text-xs">
                            <div>
                              {carA?.icon} {carA?.name}: {r.carALiters.toFixed(2)}L ({currency}{r.carACost.toFixed(2)})
                            </div>
                            <div>
                              {carB?.icon} {carB?.name}: {r.carBLiters.toFixed(2)}L ({currency}{r.carBCost.toFixed(2)})
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right">{r.totalLiters.toFixed(2)}</td>
                        <td className="py-3 text-right">
                          {currency}{r.pricePerLiter.toFixed(3)}
                        </td>
                        <td className="py-3 text-right font-semibold">
                          {currency}{r.totalCost.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(r.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
