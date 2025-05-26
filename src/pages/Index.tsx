
import { useState } from 'react';
import { Search, MapPin, Star, Users, BookOpen, TrendingUp, Calculator, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredColleges = [
    {
      id: 1,
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
      ranking: "#1",
      category: "Engineering",
      fees: "₹2.5L - 8L",
      cutoff: "JEE Advanced Rank 1-500"
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
      cutoff: "NEET Score 720+"
    },
    {
      id: 3,
      name: "Indian Institute of Management Ahmedabad",
      location: "Ahmedabad",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
      ranking: "#1",
      category: "Management",
      fees: "₹25L - 30L",
      cutoff: "CAT Percentile 99+"
    },
    {
      id: 4,
      name: "Indian Institute of Science",
      location: "Bangalore",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      ranking: "#1",
      category: "Science",
      fees: "₹2L - 6L",
      cutoff: "GATE Score 800+"
    }
  ];

  const categories = [
    { name: "Engineering", count: "5000+", icon: "⚙️" },
    { name: "Medical", count: "1200+", icon: "🏥" },
    { name: "Management", count: "3000+", icon: "💼" },
    { name: "Arts & Science", count: "8000+", icon: "🎨" },
    { name: "Law", count: "800+", icon: "⚖️" },
    { name: "Agriculture", count: "600+", icon: "🌾" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect College
            </h1>
            <p className="text-xl mb-8 text-blue-100 animate-fade-in">
              Discover top colleges, compare courses, check cutoffs, and make informed decisions for your future
            </p>
            
            {/* Rank Predictor Button */}
            <div className="max-w-2xl mx-auto animate-scale-in">
              <Link to="/rank-predictor">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  <Calculator className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  <span className="relative">
                    Predict Your Rank
                    <Sparkles className="w-5 h-5 absolute -top-2 -right-6 text-yellow-300 animate-pulse" />
                  </span>
                </Button>
              </Link>
              <p className="text-blue-200 mt-4 text-sm">
                Get personalized college predictions based on your exam scores
              </p>
            </div>
            
            {/* Search Bar Below Rank Predictor */}
            <div className="max-w-2xl mx-auto relative mt-8">
              <div className="flex bg-white rounded-full p-2 shadow-xl">
                <Input
                  type="text"
                  placeholder="Search colleges, courses, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-gray-900 text-lg px-6"
                />
                <Link to="/colleges">
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
                    <Search className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold">15,000+</div>
                <div className="text-blue-200">Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-200">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2L+</div>
                <div className="text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} colleges</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Top Ranked Colleges</h2>
            <Link to="/colleges">
              <Button variant="outline">View All Colleges</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredColleges.map((college) => (
              <Card key={college.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale">
                <div className="relative">
                  <img 
                    src={college.image} 
                    alt={college.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-600">
                    {college.ranking}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold ml-1">{college.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{college.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{college.location}</span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-3">
                    {college.category}
                  </Badge>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fees:</span>
                      <span className="font-semibold">{college.fees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cutoff:</span>
                      <span className="font-semibold text-green-600">{college.cutoff}</span>
                    </div>
                  </div>
                  
                  <Link to={`/college/${college.id}`}>
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose College Pravesh?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Smart Search</h3>
              <p className="text-gray-600">Advanced filtering by location, course, fees, cutoffs and more to find your perfect match.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Real-time Data</h3>
              <p className="text-gray-600">Latest cutoffs, admission updates, and college information updated regularly.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Expert Guidance</h3>
              <p className="text-gray-600">Get personalized counseling and guidance from education experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">College Pravesh</h3>
              <p className="text-gray-400">Your trusted partner in finding the perfect college for your future.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/colleges" className="hover:text-white">All Colleges</Link></li>
                <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
                <li><Link to="/rank-predictor" className="hover:text-white">Rank Predictor</Link></li>
                <li><a href="#" className="hover:text-white">Rankings</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Engineering</a></li>
                <li><a href="#" className="hover:text-white">Medical</a></li>
                <li><a href="#" className="hover:text-white">Management</a></li>
                <li><a href="#" className="hover:text-white">Arts & Science</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 College Pravesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
