import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Star, Users, TrendingUp, Award, Info } from 'lucide-react';
import { PredictionResult } from '@/services/PredictionService';

interface EnhancedPredictionCardProps {
  prediction: PredictionResult;
  examType: string;
}

const EnhancedPredictionCard = ({ prediction, examType }: EnhancedPredictionCardProps) => {
  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-100 text-green-800 border-green-300';
    if (probability >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getAdmissionChanceColor = (chance: string) => {
    switch (chance) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCollegeTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'bg-blue-100 text-blue-800';
      case 'Private': return 'bg-purple-100 text-purple-800';
      case 'Deemed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                {prediction.college}
              </h3>
              <Badge className={getCollegeTypeColor(prediction.collegeType)}>
                {prediction.collegeType}
              </Badge>
            </div>
            
            <p className="text-lg font-semibold text-blue-600 mb-2">{prediction.branch}</p>
            
            <div className="flex items-center text-gray-500 text-sm space-x-4 mb-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {prediction.location}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {prediction.rating}/5
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {prediction.seats} seats
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={`${getProbabilityColor(prediction.probability)} border font-bold text-lg px-3 py-1`}>
              {prediction.probability}%
            </Badge>
            <div className={`text-sm font-semibold mt-1 px-2 py-1 rounded ${getAdmissionChanceColor(prediction.admissionChance)}`}>
              {prediction.admissionChance} Chance
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Admission Probability</span>
            <span className="text-sm text-gray-600">{prediction.probability}%</span>
          </div>
          <Progress value={prediction.probability} className="h-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Your Rank</div>
            <div className="font-bold text-blue-600 text-sm">{prediction.expectedRank}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Cutoff Rank</div>
            <div className="font-bold text-red-600 text-sm">{prediction.cutoffRank}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Annual Fees</div>
            <div className="font-bold text-green-600 text-sm">{prediction.fees}</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Avg Package</div>
            <div className="font-bold text-purple-600 text-sm">{prediction.averagePackage}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{prediction.reason}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {prediction.placementRate}% placed
            </div>
            <div className="text-xs">
              Based on {examType?.toUpperCase()} cutoff data
            </div>
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPredictionCard;