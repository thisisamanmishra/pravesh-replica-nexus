
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PredictorForm from '@/components/predictor/PredictorForm';
import PredictorInstructions from '@/components/predictor/PredictorInstructions';
import EnhancedPredictionResults from '@/components/predictor/EnhancedPredictionResults';
import WbjeePredictorForm from '@/components/predictor/WbjeePredictorForm';
import WbjeePredictionResults from '@/components/predictor/WbjeePredictionResults';
import { PredictionService, PredictionInput } from '@/services/PredictionService';

const RankPredictor = () => {
  const [predictions, setPredictions] = useState<{
    safe: any[];
    moderate: any[];
    ambitious: any[];
  }>({ safe: [], moderate: [], ambitious: [] });
  
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState('');
  const [wbjeePrediction, setWbjeePrediction] = useState<any>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>("jee-main");
  const [showResults, setShowResults] = useState(false);

  const handlePredict = (formData: any) => {
    setLoading(true);
    setExamType(formData.examType);
    
    setTimeout(() => {
      const input: PredictionInput = {
        examType: formData.examType,
        score: formData.score,
        percentile: formData.percentile,
        category: formData.category,
        homeState: formData.homeState,
        gender: formData.gender
      };

      const results = PredictionService.getRecommendations(input);
      setPredictions(results);
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

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
            <h1 className="text-4xl font-bold text-gray-900">College Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate college predictions based on your exam scores with real-time analysis using actual cutoff data
          </p>
        </div>

        {!showResults ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <label htmlFor="exams" className="block font-medium text-gray-700 mb-1">Exam Type *</label>
                <select
                  id="exams"
                  value={selectedExamType}
                  onChange={e => setSelectedExamType(e.target.value)}
                  className="w-full rounded px-3 py-2 border border-gray-300 mb-4"
                >
                  <option value="jee-main">JEE Main</option>
                  <option value="jee-advanced">JEE Advanced</option>
                  <option value="wbjee">WBJEE</option>
                </select>
                
                {selectedExamType === "wbjee" ? (
                  <WbjeePredictorForm onPredict={handleWbjeePredict} loading={loading} />
                ) : (
                  <PredictorForm onPredict={handlePredict} loading={loading} />
                )}
              </div>
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
            {(selectedExamType === "wbjee" && wbjeePrediction) ? (
              <WbjeePredictionResults
                userRank={wbjeePrediction.rank}
                category={wbjeePrediction.category}
                domicile={wbjeePrediction.domicile}
              />
            ) : (
              <EnhancedPredictionResults
                predictions={predictions}
                examType={examType}
                onBackToPredictor={() => setShowResults(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankPredictor;
