import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Calendar, Users, BookOpen, Trophy, Download, Share2, Heart, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';

const CollegeDetails = () => {
  const { id } = useParams();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock college data - in real app, this would come from API
  const college = {
    id: 1,
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    location: "New Delhi",
    state: "Delhi",
    rating: 4.8,
    reviews: 2547,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    youtubeVideoId: "dQw4w9WgXcQ", // YouTube video ID for embedding
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop"
    ],
    ranking: {
      nirf: "#1",
      qs: "#185",
      times: "#301-350"
    },
    category: "Engineering",
    type: "Public",
    established: 1961,
    affiliation: "Autonomous",
    accreditation: "NAAC A++",
    website: "https://home.iitd.ac.in",
    phone: "+91-11-2659-1000",
    email: "info@admin.iitd.ac.in",
    description: "Indian Institute of Technology Delhi is one of the premier engineering institutes in India. Established in 1961, IIT Delhi has been a leader in engineering education and research.",
    highlights: [
      "Top 1 Engineering College in India",
      "Excellent Placement Record",
      "World-class Faculty",
      "State-of-the-art Infrastructure",
      "Strong Alumni Network"
    ],
    courses: [
      {
        name: "B.Tech Computer Science",
        duration: "4 Years",
        fees: "₹2.5L",
        seats: 60,
        cutoff: "JEE Advanced Rank 1-150"
      },
      {
        name: "B.Tech Electrical Engineering",
        duration: "4 Years",
        fees: "₹2.5L",
        seats: 55,
        cutoff: "JEE Advanced Rank 150-300"
      },
      {
        name: "B.Tech Mechanical Engineering",
        duration: "4 Years",
        fees: "₹2.5L",
        seats: 65,
        cutoff: "JEE Advanced Rank 200-400"
      }
    ],
    placements: {
      year: "2023",
      highestPackage: "₹2.1 Cr",
      averagePackage: "₹18.5L",
      medianPackage: "₹15.2L",
      placementPercentage: "95%",
      topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey"]
    },
    fees: {
      tuition: "₹2,50,000",
      hostel: "₹35,000",
      mess: "₹42,000",
      other: "₹15,000",
      total: "₹3,42,000"
    },
    facilities: [
      "Library", "Hostels", "Sports Complex", "Medical Center", 
      "Computer Labs", "Research Centers", "Auditorium", "Cafeteria"
    ],
    admissions: {
      exam: "JEE Advanced",
      applicationDeadline: "June 15, 2024",
      examDate: "May 26, 2024",
      eligibility: "12th with PCM, JEE Main qualified"
    }
  };

  const cutoffs = [
    { year: "2023", general: "150", obc: "200", sc: "300", st: "350" },
    { year: "2022", general: "145", obc: "195", sc: "295", st: "345" },
    { year: "2021", general: "140", obc: "190", sc: "290", st: "340" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/colleges" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Colleges
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* College Image */}
            <div className="lg:w-1/3">
              <img 
                src={college.image} 
                alt={college.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
            </div>
            
            {/* College Info */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{college.location}, {college.state}</span>
                    <span className="mx-2">•</span>
                    <span>Est. {college.established}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-semibold">{college.rating}</span>
                  <span className="text-sm text-gray-600 ml-1">({college.reviews} reviews)</span>
                </div>
                <Badge variant="secondary">{college.type}</Badge>
                <Badge>{college.category}</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{college.ranking.nirf}</div>
                  <div className="text-sm text-gray-600">NIRF Ranking</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{college.placements.placementPercentage}</div>
                  <div className="text-sm text-gray-600">Placement Rate</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{college.placements.averagePackage}</div>
                  <div className="text-sm text-gray-600">Avg Package</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button className="flex-1">Apply Now</Button>
                <Button variant="outline">Download Brochure</Button>
                <Button variant="outline">Compare</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="cutoffs">Cutoffs</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {college.shortName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{college.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {college.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campus Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {college.gallery.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`Campus ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Facilities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {college.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established</span>
                      <span className="font-semibold">{college.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-semibold">{college.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Affiliation</span>
                      <span className="font-semibold">{college.affiliation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accreditation</span>
                      <span className="font-semibold">{college.accreditation}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{college.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{college.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-600" />
                      <a href={college.website} className="text-sm text-blue-600 hover:underline">
                        Official Website
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Rankings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rankings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIRF</span>
                      <Badge variant="outline">{college.ranking.nirf}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">QS World</span>
                      <Badge variant="outline">{college.ranking.qs}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Times Higher Ed</span>
                      <Badge variant="outline">{college.ranking.times}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  College Video Tour
                </CardTitle>
              </CardHeader>
              <CardContent>
                {college.youtubeVideoId ? (
                  <div className="space-y-4">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${college.youtubeVideoId}`}
                        title="College Video Tour"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Get a virtual tour of {college.shortName} campus and facilities</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No video available for this college</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Courses Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {college.courses.map((course, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                        <Badge>{course.duration}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Annual Fees:</span>
                          <div className="font-semibold">{course.fees}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Seats:</span>
                          <div className="font-semibold">{course.seats}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Cutoff:</span>
                          <div className="font-semibold text-green-600">{course.cutoff}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cutoffs Tab */}
          <TabsContent value="cutoffs">
            <Card>
              <CardHeader>
                <CardTitle>Previous Year Cutoffs (JEE Advanced Rank)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Year</th>
                        <th className="text-left py-3">General</th>
                        <th className="text-left py-3">OBC-NCL</th>
                        <th className="text-left py-3">SC</th>
                        <th className="text-left py-3">ST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cutoffs.map((cutoff, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 font-semibold">{cutoff.year}</td>
                          <td className="py-3">{cutoff.general}</td>
                          <td className="py-3">{cutoff.obc}</td>
                          <td className="py-3">{cutoff.sc}</td>
                          <td className="py-3">{cutoff.st}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placements Tab */}
          <TabsContent value="placements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Statistics {college.placements.year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{college.placements.highestPackage}</div>
                      <div className="text-sm text-gray-600">Highest Package</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{college.placements.averagePackage}</div>
                      <div className="text-sm text-gray-600">Average Package</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{college.placements.medianPackage}</div>
                      <div className="text-sm text-gray-600">Median Package</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{college.placements.placementPercentage}</div>
                      <div className="text-sm text-gray-600">Placement Rate</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Top Recruiters</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {college.placements.topRecruiters.map((recruiter, index) => (
                        <div key={index} className="p-3 border rounded-lg text-center">
                          <div className="font-medium">{recruiter}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure (Annual)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span>Tuition Fees</span>
                    <span className="font-semibold">{college.fees.tuition}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Hostel Fees</span>
                    <span className="font-semibold">{college.fees.hostel}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Mess Fees</span>
                    <span className="font-semibold">{college.fees.mess}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span>Other Fees</span>
                    <span className="font-semibold">{college.fees.other}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold bg-blue-50 px-4 rounded-lg">
                    <span>Total Annual Fees</span>
                    <span>{college.fees.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admissions Tab */}
          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Admission Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance Exam</h4>
                      <p className="text-gray-700">{college.admissions.exam}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Eligibility</h4>
                      <p className="text-gray-700">{college.admissions.eligibility}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Application Deadline</h4>
                      <p className="text-gray-700">{college.admissions.applicationDeadline}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Exam Date</h4>
                      <p className="text-gray-700">{college.admissions.examDate}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Admission Process</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      <li>Qualify JEE Main</li>
                      <li>Appear for JEE Advanced</li>
                      <li>Participate in JoSAA Counselling</li>
                      <li>Document Verification</li>
                      <li>Seat Allotment</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeDetails;
