
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target } from 'lucide-react';

interface PredictorFormProps {
  onPredict: (formData: FormData) => void;
  loading: boolean;
}

interface FormData {
  examType: string;
  score: string;
  percentile: string;
  category: string;
  homeState: string;
  gender: string;
}

const PredictorForm = ({ onPredict, loading }: PredictorFormProps) => {
  const [examType, setExamType] = useState('');
  const [score, setScore] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('');
  const [homeState, setHomeState] = useState('');
  const [gender, setGender] = useState('');

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
    { value: 'obc-ncl', label: 'OBC-NCL' },
    { value: 'tuition-fee-waiver', label: 'Tuition Fee Waiver' }
  ];

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ].map(state => ({ value: state.toLowerCase().replace(/\s+/g, '-'), label: state }));

  const handleSubmit = () => {
    const formData: FormData = {
      examType,
      score,
      percentile,
      category,
      homeState,
      gender
    };
    onPredict(formData);
  };

  return (
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
          onClick={handleSubmit}
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
  );
};

export default PredictorForm;
