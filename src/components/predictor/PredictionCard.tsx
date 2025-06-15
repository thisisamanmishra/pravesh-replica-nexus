
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Star, Users } from 'lucide-react';

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

interface PredictionCardProps {
  prediction: PredictionResult;
  examType: string;
}

const PredictionCard = ({ prediction, examType }: PredictionCardProps) => {
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
  );
};

export default PredictionCard;
