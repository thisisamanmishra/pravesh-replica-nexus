
import { useState } from 'react';
import { Search, Filter, MapPin, Star, BookOpen, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [feeRange, setFeeRange] = useState([0, 1000000]);

  const colleges = [
    {
      id: 1,
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
      ranking: "#1",
      category: "Engineering",
      fees: "₹2.5L - 8L",
      cutoff: "JEE Advanced Rank 1-500",
      courses: 45,
      students: "8000+",
      type: "Public",
      established: 1961
    },
    {
      id: 2,
      name: "All India Institute of Medical Sciences",
      location: "New Delhi",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
      ranking: "#1",
      category: "Medical",
      fees: "₹1.3L - 5L",
      cutoff: "NEET Score 720+",
      courses: 25,
      students: "3000+",
      type: "Public",
      established: 1956
    },
    // Add more colleges here...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect College</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search colleges, courses, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="arts">Arts & Science</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">College Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="deemed">Deemed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fee Range</label>
                <div className="px-3">
                  <Slider
                    value={feeRange}
                    onValueChange={setFeeRange}
                    max={1000000}
                    step={10000}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹{(feeRange[0] / 100000).toFixed(1)}L</span>
                    <span>₹{(feeRange[1] / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Showing {colleges.length} colleges</p>
          
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by Ranking" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="fees">Fees (Low to High)</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="cutoff">Cutoff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* College Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {colleges.map((college) => (
            <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image */}
                  <div className="relative w-48 h-44 flex-shrink-0">
                    <img 
                      src={college.image} 
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600">
                      {college.ranking}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold ml-1">{college.rating}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl mb-2 line-clamp-2">{college.name}</h3>
                      <Badge variant="secondary">{college.type}</Badge>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{college.location}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">Est. {college.established}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="outline" className="text-blue-600">
                        {college.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {college.courses} Courses
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {college.students}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Fees:</span>
                        <div className="font-semibold">{college.fees}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Cutoff:</span>
                        <div className="font-semibold text-green-600">{college.cutoff}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Colleges
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Colleges;
