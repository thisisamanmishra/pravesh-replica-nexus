
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, BookOpen, ExternalLink, Play, MessageCircle, Award, GraduationCap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import ContactModal from '@/components/ContactModal';
import { useCollege } from '@/hooks/useColleges';

const CollegeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: college, isLoading, error } = useCollege(id!);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Enhanced Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="relative h-96 overflow-hidden">
            <img 
              src={college.image_url || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop"} 
              alt={college.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold animate-pulse">
                    <Award className="w-4 h-4 mr-2" />
                    Rank #{college.national_ranking || 'N/A'}
                  </Badge>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                    <span className="font-bold text-lg">{college.rating || 4.0}</span>
                  </div>
                  <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30 capitalize px-4 py-2">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {college.college_type}
                  </Badge>
                </div>
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-200">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-blue-300" />
                    <span className="text-xl">{college.location}</span>
                  </div>
                  {college.established && (
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-blue-300" />
                      <span className="text-xl">Est. {college.established}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section with Animation */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  About {college.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {college.description || `${college.name} is a premier ${college.category.toLowerCase()} institution located in ${college.location}. Known for its academic excellence and innovative approach to education, the college offers world-class facilities and experienced faculty to help students achieve their academic and career goals.`}
                </p>
              </CardContent>
            </Card>

            {/* Enhanced Video Section */}
            {videoId && (
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Play className="w-6 h-6 mr-3 text-red-500" />
                    Campus Experience
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Take a virtual tour and discover campus life
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

            {/* Enhanced Quick Stats */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-purple-50/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Quick Facts & Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {college.total_students && (
                    <div className="group flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-600">{college.total_students.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {college.total_courses && (
                    <div className="group flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Courses Offered</p>
                        <p className="text-2xl font-bold text-green-600">{college.total_courses}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="group flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Overall Rating</p>
                      <p className="text-2xl font-bold text-purple-600">{college.rating || 4.0}/5.0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Category & Type Card */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-indigo-50/30">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Category</p>
                    <Badge variant="secondary" className="text-blue-600 capitalize px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200">
                      {college.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Institution Type</p>
                    <Badge variant="outline" className="capitalize px-4 py-2 text-sm font-semibold border-2">
                      {college.college_type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Admission Details */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Admission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Fee Range</p>
                  <p className="font-bold text-xl text-green-600">
                    {college.fees_range || 'Contact College'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Cutoff Information</p>
                  <p className="font-semibold text-blue-600">
                    {college.cutoff_info || 'Check Official Website'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                Apply Now
              </Button>
              
              <Button 
                onClick={() => setIsContactModalOpen(true)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-50 font-semibold py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Website
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-50 font-semibold py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                size="lg"
              >
                Download Brochure
              </Button>
            </div>
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
