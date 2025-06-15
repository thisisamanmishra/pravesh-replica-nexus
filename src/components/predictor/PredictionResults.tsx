
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Search } from 'lucide-react';
import PredictionCard from './PredictionCard';

interface PredictionResult {
  id: string;
  college: string;
  branch: string;
  location: string;
  probability: number;
  admissionChance: 'High' | 'Moderate' | 'Low';
  expectedRank: string;
  cutoffRank: number;
  fees: string;
  rating: number;
  category: string;
  collegeType: 'Government' | 'Private';
  seats: number;
  placementRate: number;
  averagePackage: string;
}

interface PredictionResultsProps {
  predictions: PredictionResult[];
  filteredPredictions: PredictionResult[];
  examType: string;
  onBackToPredictor: () => void;
}

const PredictionResults = ({
  predictions,
  filteredPredictions,
  examType,
  onBackToPredictor
}: PredictionResultsProps) => {
  if (predictions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No predictions yet
          </h3>
          <p className="text-gray-500 mb-4">
            Go back to the predictor tab to generate your college predictions.
          </p>
          <Button onClick={onBackToPredictor}>
            Go to Predictor
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredPredictions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No colleges found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredPredictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          prediction={prediction}
          examType={examType}
        />
      ))}
    </div>
  );
};

export default PredictionResults;
