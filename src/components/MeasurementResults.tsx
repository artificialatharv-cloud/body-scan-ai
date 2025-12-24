import { AlertTriangle, Ruler, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeasurementData {
  estimated_height_cm?: number;
  shoulder_width_cm?: number;
  chest_cm?: number;
  hip_cm?: number;
  arm_length_cm?: number;
  leg_length_cm?: number;
  accuracy_note?: string;
  warning?: string;
}

interface MeasurementResultsProps {
  data: MeasurementData;
}

const measurementLabels: Record<string, { label: string; icon: string }> = {
  estimated_height_cm: { label: 'Estimated Height', icon: '📏' },
  shoulder_width_cm: { label: 'Shoulder Width', icon: '💪' },
  chest_cm: { label: 'Chest', icon: '👕' },
  hip_cm: { label: 'Hip', icon: '🧍' },
  arm_length_cm: { label: 'Arm Length', icon: '💪' },
  leg_length_cm: { label: 'Leg Length', icon: '🦵' },
};

export const MeasurementResults = ({ data }: MeasurementResultsProps) => {
  const measurements = Object.entries(data).filter(
    ([key]) => key !== 'accuracy_note' && key !== 'warning' && measurementLabels[key]
  );

  return (
    <div className="animate-slide-up space-y-6">
      {data.warning && (
        <div className="flex items-start gap-3 rounded-xl bg-warning-bg p-4 border border-warning/30">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning-foreground">Warning</p>
            <p className="text-sm text-warning-foreground/80">{data.warning}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {measurements.map(([key, value], index) => (
          <div
            key={key}
            className={cn(
              'group relative overflow-hidden rounded-xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-soft hover:-translate-y-1',
              'border border-border/50'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-lg">{measurementLabels[key]?.icon}</span>
                <span className="text-sm font-medium">
                  {measurementLabels[key]?.label}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground font-display">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">cm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.accuracy_note && (
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">{data.accuracy_note}</p>
        </div>
      )}
    </div>
  );
};
