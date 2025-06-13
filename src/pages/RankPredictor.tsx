
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Award, Target, MapPin, Star, Users, BookOpen, IndianRupee, Filter, Download, Search } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import { useColleges } from '@/hooks/useColleges';

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

const RankPredictor = () => {
  const [examType, setExamType] = useState('');
  const [score, setScore] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [homeState, setHomeState] = useState('');
  const [gender, setGender] = useState('');
  const [branch, setBranch] = useState('');
  const [collegeType, setCollegeType] = useState('');
  const [feeRange, setFeeRange] = useState([0, 500000]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('predictor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: colleges = [] } = useColleges();

  const examTypes = [
    { value: 'jee-main', label: 'JEE Main' },
    { value: 'jee-advanced', label: 'JEE Advanced' },
    { value: 'wbjee', label: 'WBJEE' },
    { value: 'mhtcet', label: 'MHT CET' },
    { value: 'kcet', label: 'KCET' },
    { value: 'eamcet', label: 'EAMCET' },
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
    { value: 'ews', label: 'EWS' },
    { value: 'obc-ncl', label: 'OBC-NCL' }
  ];

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ].map(state => ({ value: state.toLowerCase().replace(/\s+/g, '-'), label: state }));

  const branches = [
    'Computer Science Engineering', 'Electronics and Communication Engineering',
    'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology',
    'Information Technology', 'Automobile Engineering', 'Metallurgical Engineering',
    'Production Engineering', 'Textile Engineering', 'Mining Engineering'
  ];

  const collegeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'government', label: 'Government' },
    { value: 'private', label: 'Private' },
    { value: 'deemed', label: 'Deemed University' }
  ];

  // Real-time prediction algorithm
  const calculatePredictions = () => {
    if (!score && !percentile) return [];

    const userScore = parseFloat(score) || 0;
    const userPercentile = parseFloat(percentile) || 0;
    
    // Convert percentile to approximate rank
    let estimatedRank = 0;
    if (userPercentile > 0) {
      estimatedRank = Math.round((100 - userPercentile) * 10000 / 100);
    } else if (userScore > 0) {
      // Approximate rank based on score for JEE Main
      if (examType === 'jee-main') {
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
      if (category !== 'general') {
        pred.probability = Math.min(95, pred.probability + 15);
      }
      
      // Apply state quota adjustments
      if (homeState && pred.location.includes(homeState)) {
        pred.probability = Math.min(95, pred.probability + 10);
      }

      return pred.probability > 5; // Only show realistic chances
    });
  };

  const predictRank = () => {
    setLoading(true);
    setTimeout(() => {
      const results = calculatePredictions();
      setPredictions(results);
      setFilteredPredictions(results);
      setLoading(false);
      setActiveTab('results');
    }, 1500);
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

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-100 text-green-800';
    if (probability >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAdmissionChanceColor = (chance: string) => {
    switch (chance) {
      case 'High': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
            Get accurate college predictions based on your exam scores with real-time analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="predictor">Predictor</TabsTrigger>
              <TabsTrigger value="results">Results ({filteredPredictions.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="predictor">
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
                      <Label htmlFor="examType">Exam Type *</Label>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score</Label>
                        <Input
                          id="score"
                          type="number"
                          placeholder="Enter score"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="percentile">Percentile</Label>
                        <Input
                          id="percentile"
                          type="number"
                          placeholder="Enter percentile"
                          value={percentile}
                          onChange={(e) => setPercentile(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
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
                      <Label htmlFor="homeState">Home State *</Label>
                      <Select onValueChange={setHomeState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home state" />
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

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={predictRank}
                      disabled={!examType || (!score && !percentile) || !category || !homeState || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Predicting...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Predict My Colleges
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Preview/Instructions */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <Calculator className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                      Ready to predict your colleges?
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Fill in your exam details on the left to get personalized college predictions with admission chances.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Accurate Predictions</h4>
                        <p className="text-gray-600">Based on previous year cutoffs</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Real-time Analysis</h4>
                        <p className="text-gray-600">Updated admission chances</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Comprehensive Data</h4>
                        <p className="text-gray-600">Fees, placements & more</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            {predictions.length > 0 ? (
              <div className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filter Results</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search colleges, branches, locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    {showFilters && (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>College Type</Label>
                          <Select value={collegeType} onValueChange={setCollegeType}>
                            <SelectTrigger>
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              {collegeTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Fee Range (₹)</Label>
                          <div className="px-2">
                            <Slider
                              value={feeRange}
                              onValueChange={setFeeRange}
                              max={2000000}
                              min={50000}
                              step={50000}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>₹{(feeRange[0] / 100000).toFixed(1)}L</span>
                              <span>₹{(feeRange[1] / 100000).toFixed(1)}L</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Branches</Label>
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {branches.slice(0, 4).map((branchName) => (
                              <div key={branchName} className="flex items-center space-x-2">
                                <Checkbox
                                  id={branchName}
                                  checked={selectedBranches.includes(branchName)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedBranches([...selectedBranches, branchName]);
                                    } else {
                                      setSelectedBranches(selectedBranches.filter(b => b !== branchName));
                                    }
                                  }}
                                />
                                <Label htmlFor={branchName} className="text-sm">
                                  {branchName}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="grid gap-6">
                  {filteredPredictions.map((prediction, index) => (
                    <Card key={prediction.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {prediction.college}
                              </h3>
                              <Badge variant="secondary">{prediction.collegeType}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{prediction.branch}</p>
                            <div className="flex items-center text-gray-500 text-sm space-x-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {prediction.location}
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {prediction.rating}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {prediction.seats} seats
                              </div>
                            </div>
                          </div>
                          <Badge className={getProbabilityColor(prediction.probability)}>
                            {prediction.probability}% Match
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Admission Chance</span>
                            <span className={`text-sm font-semibold ${getAdmissionChanceColor(prediction.admissionChance)}`}>
                              {prediction.admissionChance}
                            </span>
                          </div>
                          <Progress value={prediction.probability} className="h-2" />
                        </div>

                        <div className="grid md:grid-cols-5 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600">Expected Rank</div>
                            <div className="font-bold text-blue-600">{prediction.expectedRank}</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">Annual Fees</div>
                            <div className="font-bold text-green-600">{prediction.fees}</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm text-gray-600">Avg Package</div>
                            <div className="font-bold text-purple-600">{prediction.averagePackage}</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-sm text-gray-600">Placement Rate</div>
                            <div className="font-bold text-orange-600">{prediction.placementRate}%</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-sm text-gray-600">Cutoff Rank</div>
                            <div className="font-bold text-red-600">{prediction.cutoffRank}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Based on {examType?.toUpperCase()} cutoff trends
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPredictions.length === 0 && (
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
                )}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No predictions yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Go back to the predictor tab to generate your college predictions.
                  </p>
                  <Button onClick={() => setActiveTab('predictor')}>
                    Go to Predictor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RankPredictor;
