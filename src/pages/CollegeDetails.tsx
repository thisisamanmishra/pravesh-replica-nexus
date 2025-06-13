
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, BookOpen, ExternalLink, Play, MessageCircle, Award, GraduationCap, Clock, Phone, Mail, Globe, Building, TrendingUp, CheckCircle, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import ContactModal from '@/components/ContactModal';
import { useCollege } from '@/hooks/useColleges';

const CollegeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: college, isLoading, error } = useCollege(id!);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Animation state
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStage(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Sample data for enhanced features
  const sampleImages = [
    college?.image_url || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop"
  ];

  const facilities = [
    { name: "Library", icon: BookOpen, rating: 4.5 },
    { name: "Sports Complex", icon: TrendingUp, rating: 4.2 },
    { name: "Hostels", icon: Building, rating: 4.0 },
    { name: "Labs", icon: Award, rating: 4.8 }
  ];

  const placementStats = {
    averagePackage: "₹8.5 LPA",
    highestPackage: "₹45 LPA",
    placementRate: 92
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">College Not Found</h2>
              <p>We couldn't find the college you're looking for. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videoId = college.youtube_video_url ? extractYouTubeVideoId(college.youtube_video_url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section with Image Carousel */}
      <div className={`relative overflow-hidden transition-all duration-1000 ${animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
          
          {/* Image Carousel */}
          <div className="relative w-full h-full">
            {sampleImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${college.name} - Image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === activeImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-4 mb-6 animate-slide-in-left">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                    <Award className="w-4 h-4 mr-2" />
                    Rank #{college.national_ranking || 'N/A'}
                  </Badge>
                  <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                    <span className="font-bold text-white text-lg">{college.rating || 4.0}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight animate-fade-in-up">
                  {college.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-xl mb-8 animate-slide-in-right">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-blue-300" />
                    <span>{college.location}</span>
                  </div>
                  {college.established && (
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-blue-300" />
                      <span>Est. {college.established}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 capitalize px-4 py-2 text-lg">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    {college.college_type}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 animate-fade-in-up">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Apply Now
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-bold px-8 py-4 text-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Get Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {sampleImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-lg rounded-xl p-1">
                <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="font-semibold">Courses</TabsTrigger>
                <TabsTrigger value="placements" className="font-semibold">Placements</TabsTrigger>
                <TabsTrigger value="facilities" className="font-semibold">Facilities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* About Section */}
                <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle className="text-2xl font-bold">About {college.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {college.description || `${college.name} is a premier ${college.category.toLowerCase()} institution located in ${college.location}. Known for its academic excellence and innovative approach to education, the college offers world-class facilities and experienced faculty to help students achieve their academic and career goals.`}
                    </p>
                    
                    {/* Quick Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      {college.total_students && (
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <Users className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                          <p className="text-3xl font-bold text-blue-600">{college.total_students.toLocaleString()}</p>
                          <p className="text-gray-600 font-medium">Students</p>
                        </div>
                      )}
                      
                      {college.total_courses && (
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                          <BookOpen className="w-12 h-12 mx-auto text-green-600 mb-3" />
                          <p className="text-3xl font-bold text-green-600">{college.total_courses}</p>
                          <p className="text-gray-600 font-medium">Courses</p>
                        </div>
                      )}
                      
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <Star className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                        <p className="text-3xl font-bold text-purple-600">{college.rating || 4.0}/5</p>
                        <p className="text-gray-600 font-medium">Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Video Section */}
                {videoId && (
                  <Card className="overflow-hidden shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <Play className="w-6 h-6 mr-3 text-red-500" />
                        Campus Virtual Tour
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Experience campus life through our virtual tour
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="College Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="transition-transform duration-300 hover:scale-105"
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Available Courses</CardTitle>
                    <CardDescription>Explore our comprehensive range of academic programs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'MBA', 'BBA'].map((course, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                          <h4 className="font-semibold text-lg">{course}</h4>
                          <p className="text-gray-600">4 Years • Full Time</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="placements" className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Placement Statistics</CardTitle>
                    <CardDescription>Outstanding career opportunities for our graduates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                        <TrendingUp className="w-12 h-12 mx-auto text-green-600 mb-3" />
                        <p className="text-2xl font-bold text-green-600">{placementStats.averagePackage}</p>
                        <p className="text-gray-600">Average Package</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <Award className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                        <p className="text-2xl font-bold text-blue-600">{placementStats.highestPackage}</p>
                        <p className="text-gray-600">Highest Package</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <CheckCircle className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                        <p className="text-2xl font-bold text-purple-600">{placementStats.placementRate}%</p>
                        <p className="text-gray-600">Placement Rate</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Placement Progress</h4>
                      <Progress value={placementStats.placementRate} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="facilities" className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Campus Facilities</CardTitle>
                    <CardDescription>World-class infrastructure for holistic development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {facilities.map((facility, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <facility.icon className="w-8 h-8 text-blue-600 mr-3" />
                              <h4 className="font-bold text-lg">{facility.name}</h4>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-semibold">{facility.rating}</span>
                            </div>
                          </div>
                          <Progress value={facility.rating * 20} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="sticky top-4 shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <Badge className="bg-blue-600 text-white capitalize font-semibold">
                    {college.category}
                  </Badge>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fee Range</p>
                  <p className="font-bold text-green-600 text-lg">
                    {college.fees_range || 'Contact College'}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Cutoff Information</p>
                  <p className="font-semibold text-purple-600">
                    {college.cutoff_info || 'Check Website'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                Apply Now
              </Button>
              
              <Button 
                onClick={() => setIsContactModalOpen(true)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-50 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Website
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-50 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                Download Brochure
              </Button>
            </div>

            {/* Contact Info */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>info@college.edu</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-3" />
                  <span>www.college.edu</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default CollegeDetails;
