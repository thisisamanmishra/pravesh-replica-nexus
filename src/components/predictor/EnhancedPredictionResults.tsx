import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Search, Download, TrendingUp, Award, Target } from 'lucide-react';
import EnhancedPredictionCard from './EnhancedPredictionCard';
import { PredictionResult } from '@/services/PredictionService';

interface EnhancedPredictionResultsProps {
  predictions: {
    safe: PredictionResult[];
    moderate: PredictionResult[];
    ambitious: PredictionResult[];
  };
  examType: string;
  onBackToPredictor: () => void;
}

const EnhancedPredictionResults = ({
  predictions,
  examType,
  onBackToPredictor
}: EnhancedPredictionResultsProps) => {
  const [activeTab, setActiveTab] = useState('safe');
  
  const totalPredictions = predictions.safe.length + predictions.moderate.length + predictions.ambitious.length;

  if (totalPredictions === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No predictions available
          </h3>
          <p className="text-gray-500 mb-4">
            Please check your input values and try again with valid scores or percentiles.
          </p>
          <Button onClick={onBackToPredictor}>
            Go Back to Predictor
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                Your College Predictions
              </CardTitle>
              <p className="text-blue-100">
                Based on {examType?.toUpperCase()} exam data • {totalPredictions} colleges found
              </p>
            </div>
            <div className="text-right">
              <Button 
                variant="outline" 
                onClick={onBackToPredictor}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                New Prediction
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{predictions.safe.length}</div>
            <div className="text-sm text-green-700">Safe Options</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{predictions.moderate.length}</div>
            <div className="text-sm text-yellow-700">Moderate Reach</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{predictions.ambitious.length}</div>
            <div className="text-sm text-red-700">Dream Colleges</div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="safe" className="text-sm">
              Safe ({predictions.safe.length})
            </TabsTrigger>
            <TabsTrigger value="moderate" className="text-sm">
              Moderate ({predictions.moderate.length})
            </TabsTrigger>
            <TabsTrigger value="ambitious" className="text-sm">
              Dream ({predictions.ambitious.length})
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>

        <TabsContent value="safe" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Safe Options (High Admission Chance)
            </h3>
            <p className="text-gray-600 text-sm">
              These colleges have a high probability of admission based on your rank. Consider these as your primary choices.
            </p>
          </div>
          
          {predictions.safe.length > 0 ? (
            <div className="grid gap-4">
              {predictions.safe.map((prediction) => (
                <EnhancedPredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  examType={examType}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No safe options found. Consider improving your rank or exploring other exam options.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="moderate" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">
              Moderate Reach (Moderate Admission Chance)
            </h3>
            <p className="text-gray-600 text-sm">
              These colleges require some luck but are within reach. Apply to a mix of these along with safe options.
            </p>
          </div>
          
          {predictions.moderate.length > 0 ? (
            <div className="grid gap-4">
              {predictions.moderate.map((prediction) => (
                <EnhancedPredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  examType={examType}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No moderate reach options found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ambitious" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Dream Colleges (Ambitious Choices)
            </h3>
            <p className="text-gray-600 text-sm">
              These are stretch goals. While chances are lower, don't hesitate to apply - you might get lucky!
            </p>
          </div>
          
          {predictions.ambitious.length > 0 ? (
            <div className="grid gap-4">
              {predictions.ambitious.map((prediction) => (
                <EnhancedPredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  examType={examType}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No ambitious options found within reasonable range.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Application Strategy Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Apply to a mix of safe, moderate, and dream colleges</li>
            <li>• Consider location preferences and fee structure</li>
            <li>• Check specific branch availability and placement records</li>
            <li>• Keep backup options ready for different counseling rounds</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPredictionResults;