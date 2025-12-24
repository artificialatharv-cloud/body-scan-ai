import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { MeasurementResults } from '@/components/MeasurementResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Ruler, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const API_ENDPOINT = 'https://anonymousananta-hybrid-pose-body-measurement.hf.space/measure_3pose';

const Index = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [standingImage, setStandingImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MeasurementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const allImagesSelected = frontImage && sideImage && standingImage;

  const handleMeasure = async () => {
    if (!allImagesSelected) {
      toast({
        title: 'Missing Images',
        description: 'Please upload all three images before measuring.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('front', frontImage);
    formData.append('side', sideImage);
    formData.append('standing', standingImage);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: 'Measurement Complete',
        description: 'Your body measurements have been estimated successfully.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Measurement Failed',
        description: 'Could not process the images. Please ensure all images are clear, well-lit, and show full body poses.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFrontImage(null);
    setSideImage(null);
    setStandingImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
              <Ruler className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Body Measure AI
              </h1>
              <p className="text-xs text-muted-foreground">Pose-based estimation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Analysis
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            AI-Based Full Body Measurement Estimation
            <span className="text-primary"> (Approximate)</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload three full-body images from different angles. Our AI will analyze your pose and estimate your body measurements in centimeters.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto max-w-3xl mb-10">
          <div className="flex items-start gap-3 rounded-xl bg-accent/50 p-4 border border-border/50">
            <AlertCircle className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Disclaimer: </span>
              Measurements are approximate and based on pose estimation from RGB images. Accuracy may vary with image quality.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        {!results && (
          <div className="mx-auto max-w-5xl animate-fade-in">
            <div className="rounded-2xl bg-card border border-border/50 p-6 lg:p-8 shadow-card">
              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Upload Your Images
                </h3>
                <p className="text-sm text-muted-foreground">
                  For best results, use well-lit, full-body photos where your entire body is visible. Wear fitted clothing for more accurate measurements.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <ImageUploader
                  label="Front View"
                  description="Face the camera directly"
                  viewType="front"
                  onImageSelect={setFrontImage}
                  selectedFile={frontImage}
                />
                <ImageUploader
                  label="Side View"
                  description="Stand sideways to camera"
                  viewType="side"
                  onImageSelect={setSideImage}
                  selectedFile={sideImage}
                />
                <ImageUploader
                  label="Standing View"
                  description="Natural standing pose"
                  viewType="standing"
                  onImageSelect={setStandingImage}
                  selectedFile={standingImage}
                />
              </div>

              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleMeasure}
                    disabled={!allImagesSelected}
                    className="min-w-[200px]"
                  >
                    <Ruler className="h-5 w-5" />
                    Measure Body
                  </Button>
                </div>
              )}

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-4 border border-destructive/30">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Error</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl bg-card border border-border/50 p-6 lg:p-8 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    Your Measurements
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated body measurements based on pose analysis
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Measure Again
                </Button>
              </div>

              <MeasurementResults data={results} />
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mx-auto max-w-3xl mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            This app is for demonstration and educational purposes only. Images are not stored.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
