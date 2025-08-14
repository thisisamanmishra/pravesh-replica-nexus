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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Navbar />
      
      {/* Hero Section - Full Width */}
      <div className={`relative overflow-hidden transition-all duration-1500 ease-out ${animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="relative h-[85vh] overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
          
          {/* Image Carousel */}
          <div className="absolute inset-0" ref={emblaRef}>
            <div className="flex h-full">
              {sampleImages.map((image, index) => (
                <div key={index} className="relative min-w-full h-full">
                  <img
                    src={image}
                    alt={`${college.name} - Campus ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Content - Floating */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center max-w-5xl px-6">
              
              {/* Top Badges */}
              <div className="flex items-center justify-center space-x-4 mb-8 animate-fade-in">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Award className="w-5 h-5 mr-2 inline" />
                  Rank #{college.national_ranking || 'N/A'}
                </div>
                <div className="bg-white/15 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 shadow-2xl">
                  <Star className="w-6 h-6 text-yellow-400 fill-current mr-3 inline" />
                  <span className="font-bold text-white text-xl">{college.rating || 4.0}</span>
                </div>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white leading-none animate-scale-in tracking-tight">
                {college.name}
              </h1>
              
              {/* Subtitle Info */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-white/90 text-xl mb-12 animate-slide-in-right">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <MapPin className="w-6 h-6 mr-3 text-blue-300" />
                  <span className="font-medium">{college.location}</span>
                </div>
                {college.established && (
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                    <Calendar className="w-6 h-6 mr-3 text-blue-300" />
                    <span className="font-medium">Est. {college.established}</span>
                  </div>
                )}
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full capitalize font-medium">
                  <GraduationCap className="w-5 h-5 mr-2 inline" />
                  {college.college_type}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 rounded-full"
                >
                  Apply Now
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/15 backdrop-blur-xl border-white/30 text-white hover:bg-white/25 font-bold px-8 py-4 text-lg shadow-2xl transform hover:-translate-y-2 transition-all duration-500 rounded-full"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Get Details
                </Button>
                {college.website_url && (
                  <Button 
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/20 font-bold px-8 py-4 text-lg transform hover:-translate-y-2 transition-all duration-500 rounded-full"
                    onClick={() => window.open(college.website_url, '_blank')}
                  >
                    <Globe className="w-5 h-5 mr-3" />
                    Visit Website
                  </Button>
                )}
              </div>
              
              {/* Interactive Elements */}
              <div className="flex justify-center space-x-6 mt-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
            {sampleImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeImageIndex 
                    ? 'bg-white scale-150 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/75 hover:scale-125'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl p-2 h-16 border border-border/50">
                <TabsTrigger value="overview" className="font-semibold text-base rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="font-semibold text-base rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Courses</TabsTrigger>
                <TabsTrigger value="placements" className="font-semibold text-base rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Placements</TabsTrigger>
                <TabsTrigger value="facilities" className="font-semibold text-base rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Facilities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                {/* About Section */}
                <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 rounded-3xl">
                  <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8">
                    <CardTitle className="text-2xl font-bold">About {college.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                      {showFullDesc ? descriptionText : descriptionText.slice(0, 280)}
                      {descriptionText.length > 280 && !showFullDesc && '...'}
                    </p>
                    {descriptionText.length > 280 && (
                      <button
                        type="button"
                        onClick={() => setShowFullDesc((v) => !v)}
                        className="text-primary font-semibold hover:underline transition-all duration-300 transform hover:scale-105"
                      >
                        {showFullDesc ? 'Show less' : 'Read more'}
                      </button>
                    )}
                    
                    {/* Quick Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      {college.total_students && (
                        <div className="group text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                          <Users className="w-12 h-12 mx-auto text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-3xl font-bold text-primary">{college.total_students.toLocaleString()}</p>
                          <p className="text-muted-foreground font-medium mt-2">Students</p>
                        </div>
                      )}
                      
                      {college.total_courses && (
                        <div className="group text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl border border-secondary/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                          <BookOpen className="w-12 h-12 mx-auto text-secondary mb-4 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-3xl font-bold text-secondary">{college.total_courses}</p>
                          <p className="text-muted-foreground font-medium mt-2">Courses</p>
                        </div>
                      )}
                      
                      <div className="group text-center p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                        <Star className="w-12 h-12 mx-auto text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-3xl font-bold text-accent">{college.rating || 4.0}/5</p>
                        <p className="text-muted-foreground font-medium mt-2">Rating</p>
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

          {/* Floating Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Info Card */}
              <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 rounded-3xl">
                <CardHeader className="text-center pb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="text-xl font-bold">Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="group p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 hover:shadow-lg transition-all duration-300">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Category</p>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground capitalize font-bold px-4 py-2 rounded-full">
                      {college.category}
                    </Badge>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-2xl border border-secondary/20 hover:shadow-lg transition-all duration-300">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Fee Range</p>
                    <p className="font-bold text-secondary text-lg">
                      {college.fees_range || '₹25L - 30L'}
                    </p>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-r from-accent/5 to-accent/10 rounded-2xl border border-accent/20 hover:shadow-lg transition-all duration-300">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Cutoff Information</p>
                    <p className="font-semibold text-accent">
                      {college.cutoff_info || 'CAT 99+ percentile'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-xl rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                  
                  <Button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-primary-foreground font-bold py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Get in Touch
                  </Button>
                  
                  {college.website_url ? (
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full border-2 border-primary/30 hover:bg-primary/10 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
                      size="lg"
                    >
                      <a
                        href={college.website_url.startsWith("http") ? college.website_url : `https://${college.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 mr-3" />
                        Visit Website
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      disabled
                      className="w-full border-2 border-muted font-bold py-4 text-lg shadow-lg rounded-2xl"
                      size="lg"
                    >
                      <ExternalLink className="w-5 h-5 mr-3" />
                      Visit Website
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-accent/30 hover:bg-accent/10 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
                    size="lg"
                  >
                    Download Brochure
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-xl rounded-3xl">
                <CardHeader className="pb-4 bg-gradient-to-r from-muted/20 to-muted/10">
                  <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-all duration-300">
                    <Phone className="w-5 h-5 mr-4 flex-shrink-0 text-primary" />
                    <span className="font-medium">{college.phone || "Not available"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-all duration-300">
                    <Mail className="w-5 h-5 mr-4 flex-shrink-0 text-primary" />
                    <span className="font-medium">{college.email || "Not available"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-all duration-300">
                    <Globe className="w-5 h-5 mr-4 flex-shrink-0 text-primary" />
                    {college.website_url ? (
                      <a
                        href={college.website_url.startsWith("http") ? college.website_url : `https://${college.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all font-medium transition-all duration-300 hover:scale-105"
                      >
                        {college.website_url}
                      </a>
                    ) : (
                      <span className="font-medium">Not available</span>
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
