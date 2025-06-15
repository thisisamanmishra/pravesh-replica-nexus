
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, Download, Search } from 'lucide-react';

interface ResultFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  collegeType: string;
  setCollegeType: (type: string) => void;
  feeRange: number[];
  setFeeRange: (range: number[]) => void;
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
}

const ResultFilters = ({
  searchQuery,
  setSearchQuery,
  collegeType,
  setCollegeType,
  feeRange,
  setFeeRange,
  selectedBranches,
  setSelectedBranches
}: ResultFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const collegeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'government', label: 'Government' },
    { value: 'private', label: 'Private' },
    { value: 'deemed', label: 'Deemed University' }
  ];

  const branches = [
    'Computer Science Engineering', 'Electronics and Communication Engineering',
    'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology',
    'Information Technology', 'Automobile Engineering', 'Metallurgical Engineering',
    'Production Engineering', 'Textile Engineering', 'Mining Engineering'
  ];

  return (
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
  );
};

export default ResultFilters;
