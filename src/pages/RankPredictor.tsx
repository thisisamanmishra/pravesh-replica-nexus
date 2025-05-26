
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Award, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';

const RankPredictor = () => {
  const [examType, setExamType] = useState('');
  const [score, setScore] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const examTypes = [
    { value: 'jee-main', label: 'JEE Main' },
    { value: 'jee-advanced', label: 'JEE Advanced' },
    { value: 'neet', label: 'NEET' },
    { value: 'cat', label: 'CAT' },
    { value: 'gate', label: 'GATE' },
    { value: 'cet', label: 'CET' }
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'obc', label: 'OBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'ews', label: 'EWS' }
  ];

  const states = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'west-bengal', label: 'West Bengal' }
  ];

  const predictRank = () => {
    setLoading(true);
    
    // Simulate prediction calculation
    setTimeout(() => {
      const mockPredictions = [
        {
          college: 'IIT Delhi',
          branch: 'Computer Science Engineering',
          probability: 85,
          expectedRank: '1-500',
          cutoff: score >= '300' ? 'Likely' : 'Difficult',
          fees: '₹8.5L'
        },
        {
          college: 'IIT Bombay',
          branch: 'Electrical Engineering',
          probability: 75,
          expectedRank: '500-1000',
          cutoff: score >= '280' ? 'Likely' : 'Difficult',
          fees: '₹8.5L'
        },
        {
          college: 'IIT Madras',
          branch: 'Mechanical Engineering',
          probability: 90,
          expectedRank: '800-1200',
          cutoff: score >= '250' ? 'Likely' : 'Moderate',
          fees: '₹8.5L'
        },
        {
          college: 'NIT Trichy',
          branch: 'Computer Science Engineering',
          probability: 95,
          expectedRank: '1200-2000',
          cutoff: 'High Chance',
          fees: '₹5.5L'
        },
        {
          college: 'IIIT Hyderabad',
          branch: 'Information Technology',
          probability: 80,
          expectedRank: '2000-3000',
          cutoff: 'High Chance',
          fees: '₹12L'
        }
      ];
      
      setPredictions(mockPredictions);
      setLoading(false);
    }, 2000);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-100 text-green-800';
    if (probability >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Rank Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Predict your rank and get personalized college recommendations based on your exam scores
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Enter Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam.value} value={exam.value}>
                          {exam.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score">Your Score/Percentile</Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="Enter your score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Home State</Label>
                  <Select onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((st) => (
                        <SelectItem key={st.value} value={st.value}>
                          {st.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={predictRank}
                  disabled={!examType || !score || !category || !state || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Predicting...' : 'Predict My Rank'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {predictions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold">Your Predictions</h2>
                </div>

                {predictions.map((prediction, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {prediction.college}
                          </h3>
                          <p className="text-gray-600">{prediction.branch}</p>
                        </div>
                        <Badge className={getProbabilityColor(prediction.probability)}>
                          {prediction.probability}% Chance
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600">Expected Rank</div>
                          <div className="font-bold text-blue-600">{prediction.expectedRank}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">Admission Status</div>
                          <div className="font-bold text-green-600">{prediction.cutoff}</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm text-gray-600">Annual Fees</div>
                          <div className="font-bold text-purple-600">{prediction.fees}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.probability}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Award className="w-8 h-8 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-2">
                          Pro Tip
                        </h3>
                        <p className="text-blue-800">
                          These predictions are based on previous year's data and trends. 
                          Actual results may vary. We recommend applying to a mix of safe, 
                          moderate, and reach colleges to maximize your chances.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {predictions.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to predict your rank?
                  </h3>
                  <p className="text-gray-500">
                    Fill in your details on the left to get personalized college predictions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankPredictor;
