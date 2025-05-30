import { useState } from 'react';
import { Search, MapPin, Star, Users, BookOpen, TrendingUp, Calculator, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import ContactModal from '@/components/ContactModal';
import { Link } from 'react-router-dom';
import { useHomepageSettings } from '@/hooks/useHomepageSettings';
import { useColleges } from '@/hooks/useColleges';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const { data: settings } = useHomepageSettings();
  const { data: allColleges = [] } = useColleges();

  // Get featured colleges based on settings
  const featuredColleges = settings?.featured_colleges_ids 
    ? allColleges.filter(college => settings.featured_colleges_ids.includes(college.id)).slice(0, 4)
    : allColleges.slice(0, 4);

  // Default fallback values
  const websiteName = settings?.website_name || 'College Lelo';
  const heroTitle = settings?.hero_title || 'Find Your Perfect College';
  const heroSubtitle = settings?.hero_subtitle || 'Discover top colleges, compare courses, check cutoffs, and make informed decisions for your future';
  const quickStats = settings?.quick_stats || {
    colleges: "15,000+",
    courses: "500+", 
    students: "2L+",
    cities: "50+"
  };
  const categories = settings?.categories || [
    { name: "Engineering", count: "5000+", icon: "⚙️" },
    { name: "Medical", count: "1200+", icon: "🏥" },
    { name: "Management", count: "3000+", icon: "💼" },
    { name: "Arts & Science", count: "8000+", icon: "🎨" },
    { name: "Law", count: "800+", icon: "⚖️" },
    { name: "Agriculture", count: "600+", icon: "🌾" }
  ];
  const features = settings?.features || [
    { title: "Smart Search", description: "Advanced filtering by location, course, fees, cutoffs and more to find your perfect match.", icon: "Search" },
    { title: "Real-time Data", description: "Latest cutoffs, admission updates, and college information updated regularly.", icon: "TrendingUp" },
    { title: "Expert Guidance", description: "Get personalized counseling and guidance from education experts.", icon: "Users" }
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Search,
      TrendingUp,
      Users,
      BookOpen,
      Calculator
    };
    return icons[iconName] || Search;
  };

  const heroStyle = settings?.hero_background_image 
    ? { backgroundImage: `url(${settings.hero_background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20" style={heroStyle}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {heroTitle}
            </h1>
            <p className="text-xl mb-8 text-blue-100 animate-fade-in">
              {heroSubtitle}
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
                <div className="text-3xl font-bold">{quickStats.colleges}</div>
                <div className="text-blue-200">Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{quickStats.courses}</div>
                <div className="text-blue-200">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{quickStats.students}</div>
                <div className="text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{quickStats.cities}</div>
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
                    src={college.image_url || "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop"} 
                    alt={college.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-600">
                    #{college.national_ranking || 'N/A'}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold ml-1">{college.rating || 'N/A'}</span>
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
                      <span className="font-semibold">{college.fees_range || 'Contact for fees'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cutoff:</span>
                      <span className="font-semibold text-green-600">{college.cutoff_info || 'Contact for cutoff'}</span>
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose {websiteName}?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help Finding the Right College?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Our education experts are here to guide you through your college selection process. 
            Get personalized assistance and answers to all your questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Get in Touch
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-full"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Us Now
            </Button>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-blue-200">Expert Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-blue-200">Consultation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-blue-200">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">{websiteName}</h3>
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
            <p>&copy; 2024 {websiteName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

export default Index;
