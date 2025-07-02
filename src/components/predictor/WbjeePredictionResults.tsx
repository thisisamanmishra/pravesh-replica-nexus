
import { useState, useEffect } from "react";
import { wbjeeDataService, WbjeeCollegeData } from "@/services/WbjeeDataService";
import WbjeeCollegeCard from "./WbjeeCollegeCard";

interface WbjeePredictionResultsProps {
  userRank: number;
  category: string;
  domicile: string;
}

export default function WbjeePredictionResults({ userRank, category, domicile }: WbjeePredictionResultsProps) {
  const [colleges, setColleges] = useState<WbjeeCollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching predictions for:', { userRank, category, domicile });
        const predictions = await wbjeeDataService.getPredictions(userRank, category, domicile);
        
        console.log('Predictions received:', predictions.length);
        setColleges(predictions);
        
        if (predictions.length === 0) {
          setError('No eligible colleges found for your rank and category. Try checking with a higher rank range or different category.');
        }
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load college predictions. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (userRank > 0) {
      fetchPredictions();
    }
  }, [userRank, category, domicile]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading WBJEE college predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Prediction Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-yellow-800 font-semibold mb-2">No Predictions Found</h3>
          <p className="text-yellow-600">
            No eligible colleges found for rank {userRank} in {category} category ({domicile}).
            <br />
            <br />
            Try checking with:
            <br />
            • A higher rank range
            <br />
            • Different category
            <br />
            • Check if your rank is within WBJEE 2024 range
          </p>
        </div>
      </div>
    );
  }

  const totalBranches = colleges.reduce((sum, college) => sum + college.branches.length, 0);

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-800 mb-2">
          WBJEE College Predictions for Rank {userRank}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Category:</span>
            <span className="ml-2">{category}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Domicile:</span>
            <span className="ml-2">{domicile}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Eligible Options:</span>
            <span className="ml-2">{colleges.length} colleges, {totalBranches} branches</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {colleges.map((college, index) => (
          <WbjeeCollegeCard
            key={index}
            college={college}
            userRank={userRank}
            category={category}
            domicile={domicile}
          />
        ))}
      </div>

      <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Important Notes:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Predictions are based on WBJEE 2024 cutoff data</li>
          <li>Actual cutoffs may vary each year based on factors like seat availability, difficulty level, and number of applicants</li>
          <li>Consider applying to colleges across different probability ranges (High, Moderate, Low chance)</li>
          <li>Verify the latest information from official WBJEE counseling website before making final decisions</li>
        </ul>
      </div>
    </div>
  );
}
