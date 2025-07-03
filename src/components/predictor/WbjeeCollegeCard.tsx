
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WbjeeCollegeData } from "@/services/WbjeeDataService";

interface WbjeeCollegeCardProps {
  college: WbjeeCollegeData;
  userRank: number;
  category: string;
  domicile: string;
}

export default function WbjeeCollegeCard({ college }: WbjeeCollegeCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">{college.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {college.branches.map((branch, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
