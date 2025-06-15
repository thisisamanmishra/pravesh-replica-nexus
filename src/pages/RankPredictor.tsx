import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PredictorForm from '@/components/predictor/PredictorForm';
import PredictorInstructions from '@/components/predictor/PredictorInstructions';
import ResultFilters from '@/components/predictor/ResultFilters';
import PredictionResults from '@/components/predictor/PredictionResults';
import WbjeePredictorForm from '@/components/predictor/WbjeePredictorForm';
import WbjeePredictionResults from '@/components/predictor/WbjeePredictionResults';

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

interface FormData {
  examType: string;
  score: string;
  percentile: string;
  category: string;
  homeState: string;
  gender: string;
}

const RankPredictor = () => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('predictor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [collegeType, setCollegeType] = useState('');
  const [feeRange, setFeeRange] = useState([0, 500000]);
  const [examType, setExamType] = useState('');
  const [wbjeePrediction, setWbjeePrediction] = useState<any>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>("jee-main");

  // Real-time prediction algorithm
  const calculatePredictions = (formData: FormData) => {
    if (!formData.score && !formData.percentile) return [];

    const userScore = parseFloat(formData.score) || 0;
    const userPercentile = parseFloat(formData.percentile) || 0;
    
    // Convert percentile to approximate rank
    let estimatedRank = 0;
    if (userPercentile > 0) {
      estimatedRank = Math.round((100 - userPercentile) * 10000 / 100);
    } else if (userScore > 0) {
      // Approximate rank based on score for JEE Main
      if (formData.examType === 'jee-main') {
        estimatedRank = Math.max(1, Math.round((300 - userScore) * 3000));
      } else {
        estimatedRank = Math.max(1, Math.round((userScore / 300) * 100000));
      }
    }

    // Generate realistic college predictions
    const mockPredictions: PredictionResult[] = [
      {
        id: '1',
        college: 'Indian Institute of Technology Delhi',
        branch: 'Computer Science Engineering',
        location: 'New Delhi',
        probability: Math.max(10, Math.min(95, 100 - (estimatedRank / 1000))),
        admissionChance: estimatedRank < 500 ? 'High' : estimatedRank < 2000 ? 'Moderate' : 'Low',
        expectedRank: '1-500',
        cutoffRank: 400,
        fees: '₹8.5L',
        rating: 4.8,
        category: 'Engineering',
        collegeType: 'Government',
        seats: 120,
        placementRate: 98,
        averagePackage: '₹25L'
      },
      {
        id: '2',
        college: 'Indian Institute of Technology Bombay',
        branch: 'Electronics Engineering',
        location: 'Mumbai',
        probability: Math.max(8, Math.min(90, 95 - (estimatedRank / 1000))),
        admissionChance: estimatedRank < 800 ? 'High' : estimatedRank < 3000 ? 'Moderate' : 'Low',
        expectedRank: '500-1000',
        cutoffRank: 750,
        fees: '₹8.5L',
        rating: 4.9,
        category: 'Engineering',
        collegeType: 'Government',
        seats: 85,
        placementRate: 97,
        averagePackage: '₹28L'
      },
      {
        id: '3',
        college: 'NIT Trichy',
        branch: 'Computer Science Engineering',
        location: 'Tiruchirappalli',
        probability: Math.max(15, Math.min(98, 110 - (estimatedRank / 800))),
        admissionChance: estimatedRank < 2000 ? 'High' : estimatedRank < 5000 ? 'Moderate' : 'Low',
        expectedRank: '1200-2500',
        cutoffRank: 2200,
        fees: '₹5.5L',
        rating: 4.6,
        category: 'Engineering',
        collegeType: 'Government',
        seats: 150,
        placementRate: 95,
        averagePackage: '₹18L'
      },
      {
        id: '4',
        college: 'BITS Pilani',
        branch: 'Computer Science Engineering',
        location: 'Pilani',
        probability: Math.max(20, Math.min(85, 90 - (estimatedRank / 2000))),
        admissionChance: estimatedRank < 5000 ? 'High' : estimatedRank < 15000 ? 'Moderate' : 'Low',
        expectedRank: '3000-8000',
        cutoffRank: 6500,
        fees: '₹19L',
        rating: 4.5,
        category: 'Engineering',
        collegeType: 'Private',
        seats: 200,
        placementRate: 92,
        averagePackage: '₹16L'
      },
      {
        id: '5',
        college: 'VIT Vellore',
        branch: 'Information Technology',
        location: 'Vellore',
        probability: Math.max(25, Math.min(90, 95 - (estimatedRank / 3000))),
        admissionChance: estimatedRank < 10000 ? 'High' : estimatedRank < 25000 ? 'Moderate' : 'Low',
        expectedRank: '5000-15000',
        cutoffRank: 12000,
        fees: '₹7.8L',
        rating: 4.3,
        category: 'Engineering',
        collegeType: 'Private',
        seats: 180,
        placementRate: 88,
        averagePackage: '₹12L'
      },
      {
        id: '6',
        college: 'SRM Institute of Science and Technology',
        branch: 'Computer Science Engineering',
        location: 'Chennai',
        probability: Math.max(30, Math.min(95, 100 - (estimatedRank / 4000))),
        admissionChance: estimatedRank < 15000 ? 'High' : estimatedRank < 35000 ? 'Moderate' : 'Low',
        expectedRank: '8000-25000',
        cutoffRank: 20000,
        fees: '₹9.5L',
        rating: 4.1,
        category: 'Engineering',
        collegeType: 'Private',
        seats: 250,
        placementRate: 85,
        averagePackage: '₹10L'
      }
    ];

    return mockPredictions.filter(pred => {
      // Apply category-based adjustments
      if (formData.category !== 'general') {
        pred.probability = Math.min(95, pred.probability + 15);
      }
      
      // Apply state quota adjustments
      if (formData.homeState && pred.location.includes(formData.homeState)) {
        pred.probability = Math.min(95, pred.probability + 10);
      }

      return pred.probability > 5; // Only show realistic chances
    });
  };

  const handlePredict = (formData: FormData) => {
    setLoading(true);
    setExamType(formData.examType);
    
    setTimeout(() => {
      const results = calculatePredictions(formData);
      setPredictions(results);
      setFilteredPredictions(results);
      setLoading(false);
      setActiveTab('results');
    }, 1500);
  };

  // Main handler for WBJEE form
  const handleWbjeePredict = (form: { rank: string; category: string; domicile: string }) => {
    setLoading(true);
    setTimeout(() => {
      setWbjeePrediction({
        rank: Number(form.rank),
        category: form.category,
        domicile: form.domicile,
      });
      setLoading(false);
      setActiveTab('results');
    }, 1200);
  };

  // Real-time filtering
  useEffect(() => {
    let filtered = predictions;

    if (searchQuery) {
      filtered = filtered.filter(pred => 
        pred.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pred.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pred.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBranches.length > 0) {
      filtered = filtered.filter(pred => selectedBranches.includes(pred.branch));
    }

    if (collegeType && collegeType !== 'all') {
      filtered = filtered.filter(pred => 
        pred.collegeType.toLowerCase() === collegeType.toLowerCase()
      );
    }

    filtered = filtered.filter(pred => {
      const feeValue = parseFloat(pred.fees.replace(/[₹L,]/g, '')) * 100000;
      return feeValue >= feeRange[0] && feeValue <= feeRange[1];
    });

    setFilteredPredictions(filtered);
  }, [searchQuery, selectedBranches, collegeType, feeRange, predictions]);

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
            Get accurate college predictions based on your exam scores with real-time analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="predictor">Predictor</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="predictor">
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
                  {/* Show custom forms based on selected exam */}
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
          </TabsContent>

          <TabsContent value="results">
            {(selectedExamType === "wbjee" && wbjeePrediction) ? (
              <WbjeePredictionResults
                userRank={wbjeePrediction.rank}
                category={wbjeePrediction.category}
                domicile={wbjeePrediction.domicile}
              />
            ) : (
              <div>
                {/* fallback/results for JEE etc */}
                <PredictionResults
                  predictions={predictions}
                  filteredPredictions={filteredPredictions}
                  examType={examType}
                  onBackToPredictor={() => setActiveTab('predictor')}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RankPredictor;
