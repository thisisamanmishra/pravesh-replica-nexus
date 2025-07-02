
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WbjeeCollegeData } from "@/services/WbjeeDataService";

interface WbjeeCollegeCardProps {
  college: WbjeeCollegeData;
  userRank: number;
  category: string;
  domicile: string;
}

export default function WbjeeCollegeCard({ college, userRank, category, domicile }: WbjeeCollegeCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">{college.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {college.branches.map((branch, idx) => {
            const latestCutoff = branch.cutoffs[0]; // Already sorted by round
            const admissionChance = userRank <= latestCutoff.closing_rank * 0.7 ? 'High' : 
                                  userRank <= latestCutoff.closing_rank * 0.9 ? 'Moderate' : 'Low';
            
            return (
              <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                    <p className="text-sm text-gray-600">
                      Round {latestCutoff.round} • {latestCutoff.year}
                    </p>
                  </div>
                  <Badge 
                    variant={admissionChance === 'High' ? 'default' : 
                            admissionChance === 'Moderate' ? 'secondary' : 'outline'}
                    className={
                      admissionChance === 'High' ? 'bg-green-100 text-green-800' :
                      admissionChance === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {admissionChance} Chance
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Opening Rank:</span>
                    <span className="ml-2 font-medium">{latestCutoff.opening_rank}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Closing Rank:</span>
                    <span className="ml-2 font-medium">{latestCutoff.closing_rank}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Your Rank:</span>
                    <span className="ml-2 font-medium text-blue-600">{userRank}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium">{latestCutoff.category}</span>
                  </div>
                </div>

                {userRank <= latestCutoff.closing_rank && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                    ✅ You are eligible! Your rank {userRank} is within the cutoff range.
                  </div>
                )}
                
                {userRank > latestCutoff.closing_rank && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                    ❌ Your rank {userRank} is above the cutoff of {latestCutoff.closing_rank}.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
