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
import useEmblaCarousel from 'embla-carousel-react';

const CollegeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: college, isLoading, error } = useCollege(id!);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Animation state
  const [animationStage, setAnimationStage] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStage(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveImageIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(timer);
    };
  }, [emblaApi]);

  // SEO: set dynamic title and description (must be declared before any early returns)
  useEffect(() => {
    if (!college) return;
    document.title = `${college.name} | College Details & Courses`;
    const desc = `${college.name} in ${college.location}. Courses, placements, facilities, fees, contact, and more.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc.slice(0, 155));

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [college]);

  // Structured Data (JSON-LD)
  useEffect(() => {
    if (!college) return;
    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: college.name,
      url: college.website_url || undefined,
      address: college.address || undefined,
      telephone: college.phone || undefined,
      image: college.image_url || undefined,
      aggregateRating: college.rating ? { "@type": "AggregateRating", ratingValue: college.rating, ratingCount: 1 } : undefined,
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd, (k, v) => (v === undefined ? undefined : v));
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [college]);

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Images: prefer DB images, fallback to stock
  const sampleImages = (
    (Array.isArray(college?.additional_images) && college!.additional_images!.length > 0)
      ? [college?.image_url, ...college!.additional_images!]
      : [
          college?.image_url || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop"
        ]
  ).filter(Boolean) as string[];

  // Facilities: derive from DB if available
  const facilities = (() => {
    const raw = (college?.facilities as Record<string, { available?: boolean; rating?: string }> | null) || null;
    if (!raw) return [] as { name: string; icon: any; rating: number }[];
    const iconMap: Record<string, any> = {
      library: BookOpen,
      sports: TrendingUp,
      hostel: Building,
      hostels: Building,
      lab: Award,
      labs: Award,
    };
    return Object.entries(raw)
      .filter(([, v]) => v?.available)
      .map(([key, v]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        icon: iconMap[key.toLowerCase()] || Building,
        rating: Number(v?.rating ?? 4) || 4,
      }));
  })();

  const placementStats = {
    averagePackage: (college?.placement_stats as any)?.average_package ?? '—',
    highestPackage: (college?.placement_stats as any)?.highest_package ?? '—',
    placementRate: Number(String((college?.placement_stats as any)?.placement_rate ?? 0).toString().replace(/[^0-9.]/g, '')) || 0,
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
  const descriptionText = college.description || `${college.name} is a premier ${college.category.toLowerCase()} institution located in ${college.location}. Known for its academic excellence and innovative approach to education, the college offers world-class facilities and experienced faculty to help students achieve their academic and career goals.`;



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section with Image Carousel */}
      <div className={`relative overflow-hidden transition-all duration-1000 ${animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
          
          {/* Image Carousel (Embla) */}
          <div className="relative w-full h-full" ref={emblaRef}>
            <div className="flex h-full">
              {sampleImages.map((image, index) => (
                <div key={index} className="relative min-w-full h-full">
                  <img
                    src={image}
                    alt={`${college.name} - Image ${index + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
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
                
                <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight animate-fade-in-up">
                  {college.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg mb-8 animate-slide-in-right">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-300" />
                    <span>{college.location}</span>
                  </div>
                  {college.established && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-300" />
                      <span>Est. {college.established}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 capitalize px-3 py-1">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {college.college_type}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 animate-fade-in-up">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Apply Now
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-bold px-6 py-3 shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {sampleImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-white shadow-md rounded-xl p-1 h-12">
                <TabsTrigger value="overview" className="font-medium text-sm">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="font-medium text-sm">Courses</TabsTrigger>
                <TabsTrigger value="placements" className="font-medium text-sm">Placements</TabsTrigger>
                <TabsTrigger value="facilities" className="font-medium text-sm">Facilities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* About Section */}
                <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle className="text-xl font-bold">About {college.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {showFullDesc ? descriptionText : descriptionText.slice(0, 280)}
                      {descriptionText.length > 280 && !showFullDesc && '...'}
                    </p>
                    {descriptionText.length > 280 && (
                      <button
                        type="button"
                        onClick={() => setShowFullDesc((v) => !v)}
                        className="text-blue-700 font-medium hover:underline"
                      >
                        {showFullDesc ? 'Show less' : 'Read more'}
                      </button>
                    )}
                    
                    {/* Quick Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {college.total_students && (
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <Users className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{college.total_students.toLocaleString()}</p>
                          <p className="text-gray-600 text-sm font-medium">Students</p>
                        </div>
                      )}
                      
                      {college.total_courses && (
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <BookOpen className="w-10 h-10 mx-auto text-green-600 mb-2" />
                          <p className="text-2xl font-bold text-green-600">{college.total_courses}</p>
                          <p className="text-gray-600 text-sm font-medium">Courses</p>
                        </div>
                      )}
                      
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <Star className="w-10 h-10 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{college.rating || 4.0}/5</p>
                        <p className="text-gray-600 text-sm font-medium">Rating</p>
                      </div>
                    </div>

                    {/* Key Details */}
                    {(college.accreditation || college.campus_area) && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {college.accreditation && (
                          <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100">
                            <h4 className="font-semibold mb-1">Accreditation</h4>
                            <p className="text-sm text-muted-foreground">{college.accreditation}</p>
                          </div>
                        )}
                        {college.campus_area && (
                          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100">
                            <h4 className="font-semibold mb-1">Campus Area</h4>
                            <p className="text-sm text-muted-foreground">{college.campus_area}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Admission Process */}
                    {college.admission_process && (
                      <div className="mt-6">
                        <h3 className="font-bold mb-2">Admission Process</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{college.admission_process}</p>
                      </div>
                    )}

                    {/* Awards & Scholarships */}
                    {(Array.isArray(college.awards) && (college.awards as string[]).length > 0) && (
                      <div className="mt-6">
                        <h3 className="font-bold mb-2">Awards</h3>
                        <div className="flex flex-wrap gap-2">
                          {(college.awards as string[]).map((a, i) => (
                            <Badge key={i} variant="secondary">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(Array.isArray(college.scholarships) && (college.scholarships as string[]).length > 0) && (
                      <div className="mt-6">
                        <h3 className="font-bold mb-2">Scholarships</h3>
                        <div className="flex flex-wrap gap-2">
                          {(college.scholarships as string[]).map((s, i) => (
                            <Badge key={i} variant="outline">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>

                {/* Video Section */}
                {videoId && (
                  <Card className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Play className="w-5 h-5 mr-2 text-red-500" />
                        Campus Virtual Tour
                      </CardTitle>
                      <CardDescription>
                        Experience campus life through our virtual tour
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-lg overflow-hidden shadow-md">
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

              <TabsContent value="courses" className="space-y-4">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Available Courses</CardTitle>
                    <CardDescription>Explore our comprehensive range of academic programs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Array.isArray(college.courses_offered) && college.courses_offered.length > 0 ? (
                        (college.courses_offered as string[]).map((course, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                            <h4 className="font-semibold">{course}</h4>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Course information will be available soon.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="placements" className="space-y-4">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Placement Statistics</CardTitle>
                    <CardDescription>Outstanding career opportunities for our graduates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                        <TrendingUp className="w-10 h-10 mx-auto text-green-600 mb-2" />
                        <p className="text-xl font-bold text-green-600">{placementStats.averagePackage}</p>
                        <p className="text-gray-600 text-sm">Average Package</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <Award className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                        <p className="text-xl font-bold text-blue-600">{placementStats.highestPackage}</p>
                        <p className="text-gray-600 text-sm">Highest Package</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <CheckCircle className="w-10 h-10 mx-auto text-purple-600 mb-2" />
                        <p className="text-xl font-bold text-purple-600">{placementStats.placementRate}%</p>
                        <p className="text-gray-600 text-sm">Placement Rate</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Placement Progress</h4>
                      <Progress value={placementStats.placementRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="facilities" className="space-y-4">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Campus Facilities</CardTitle>
                    <CardDescription>World-class infrastructure for holistic development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {facilities.map((facility, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <facility.icon className="w-6 h-6 text-blue-600 mr-2" />
                              <h4 className="font-bold">{facility.name}</h4>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-semibold text-sm">{facility.rating}</span>
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

          {/* Sidebar - Fixed overlapping issue */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50/50">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-bold">Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <Badge className="bg-blue-600 text-white capitalize font-semibold text-xs">
                      {college.category}
                    </Badge>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Fee Range</p>
                    <p className="font-bold text-green-600">
                      {college.fees_range || '₹25L - 30L'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Cutoff Information</p>
                    <p className="font-semibold text-purple-600 text-sm">
                      {college.cutoff_info || 'CAT 99+ percentile'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons - Fixed spacing */}
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  size="lg"
                >
                  Apply Now
                </Button>
                
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
                
                {college.website_url ? (
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full border-2 hover:bg-gray-50 font-bold py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    size="lg"
                  >
                    <a
                      href={college.website_url.startsWith("http") ? college.website_url : `https://${college.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 inline" />
                      Visit Website
                    </a>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    disabled
                    className="w-full border-2 font-bold py-3 shadow-md"
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full border-2 hover:bg-gray-50 font-bold py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  size="lg"
                >
                  Download Brochure
                </Button>
              </div>

              {/* Contact Info */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{college.phone ? college.phone : "Not available"}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{college.email ? college.email : "Not available"}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                    {college.website_url ? (
                      <a
                        href={college.website_url.startsWith("http") ? college.website_url : `https://${college.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {college.website_url}
                      </a>
                    ) : (
                      <span>Not available</span>
                    )}
                  </div>
                </CardContent>
              </Card>
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
