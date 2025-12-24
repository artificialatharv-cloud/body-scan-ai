import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-soft">
          <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">Analyzing your images...</p>
        <p className="text-sm text-muted-foreground">
          This may take a few moments
        </p>
      </div>
    </div>
  );
};
