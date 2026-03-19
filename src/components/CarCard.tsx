import { Card, CardContent } from './ui/Card';
import type { CarStats, Car } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface CarCardProps {
  car: Car;
  stats: CarStats;
  currency: string;
}

export function CarCard({ car, stats, currency }: CarCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: car.color + '20' }}
            >
              {car.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{car.name}</h3>
              <p className="text-sm text-muted-foreground">
                {stats.refillCount} refill{stats.refillCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">
              {currency}{stats.totalSpent.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.totalLiters.toFixed(1)}L total
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.averageLiters.toFixed(1)}L avg
            </div>
          </div>
        </div>
        {stats.lastRefillDate && (
          <div className="mt-3 text-xs text-muted-foreground">
            Last refill: {formatDistanceToNow(stats.lastRefillDate, { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
