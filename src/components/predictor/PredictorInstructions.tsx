
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Award, TrendingUp, Users } from 'lucide-react';

const PredictorInstructions = () => {
  return (
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
  );
};

export default PredictorInstructions;
