
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PredictorInstructions from '@/components/predictor/PredictorInstructions';
import WbjeePredictorForm from '@/components/predictor/WbjeePredictorForm';
import WbjeePredictionResults from '@/components/predictor/WbjeePredictionResults';

const RankPredictor = () => {
  const [loading, setLoading] = useState(false);
  const [wbjeePrediction, setWbjeePrediction] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleWbjeePredict = (form: { rank: string; category: string; domicile: string }) => {
    setLoading(true);
    setTimeout(() => {
      setWbjeePrediction({
        rank: Number(form.rank),
        category: form.category,
        domicile: form.domicile,
      });
      setLoading(false);
      setShowResults(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">WBJEE College Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate college predictions based on your WBJEE rank with real-time analysis using actual cutoff data
          </p>
        </div>

        {!showResults ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <WbjeePredictorForm onPredict={handleWbjeePredict} loading={loading} />
            </div>
            <div className="lg:col-span-2">
              <PredictorInstructions />
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowResults(false)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ← Back to Predictor
            </button>
            <WbjeePredictionResults
              userRank={wbjeePrediction.rank}
              category={wbjeePrediction.category}
              domicile={wbjeePrediction.domicile}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RankPredictor;
