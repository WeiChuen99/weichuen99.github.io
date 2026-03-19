import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import type { MonthlyBudgetStats } from '../types';
import { format } from 'date-fns';

interface MonthlyBudgetProps {
  stats: MonthlyBudgetStats;
  currency: string;
}

export function MonthlyBudget({ stats, currency }: MonthlyBudgetProps) {
  const statusColor = 
    stats.percentUsed < 70 ? 'bg-green-500' :
    stats.percentUsed < 90 ? 'bg-yellow-500' : 'bg-red-500';

  const statusTextColor = 
    stats.percentUsed < 70 ? 'text-green-600' :
    stats.percentUsed < 90 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget - {format(new Date(), 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold">
              {currency}{stats.totalSpent.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              of {currency}{(stats.totalSpent + stats.remainingBudget).toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${statusColor}`}
              style={{ width: `${Math.min(stats.percentUsed, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold">{stats.receiptCount}</div>
              <div className="text-xs text-muted-foreground">Receipts</div>
            </div>
            <div>
              <div className={`text-2xl font-semibold ${statusTextColor}`}>
                {currency}{stats.remainingBudget.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div>
              <div className={`text-2xl font-semibold ${statusTextColor}`}>
                {stats.percentUsed.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Used</div>
            </div>
          </div>

          {stats.percentUsed >= 90 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              ⚠️ Warning: You've used {stats.percentUsed.toFixed(0)}% of your monthly budget!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
