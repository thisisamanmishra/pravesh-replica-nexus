
import { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses = [
    {
      id: 1,
      name: "Computer Science Engineering",
      category: "Engineering",
      level: "Undergraduate",
      duration: "4 Years",
      colleges: 2847,
      avgFees: "₹3.5L - 15L",
      description: "Learn programming, algorithms, data structures, and software development.",
      skills: ["Programming", "Data Structures", "Algorithms", "Software Development"],
      careerOptions: ["Software Engineer", "Data Scientist", "Product Manager", "Tech Lead"]
    },
    {
      id: 2,
      name: "MBBS",
      category: "Medical",
      level: "Undergraduate",
      duration: "5.5 Years",
      colleges: 542,
      avgFees: "₹5L - 25L",
      description: "Comprehensive medical education to become a practicing doctor.",
      skills: ["Clinical Skills", "Diagnosis", "Patient Care", "Medical Research"],
      careerOptions: ["Doctor", "Surgeon", "Specialist", "Medical Researcher"]
    },
    {
      id: 3,
      name: "MBA",
      category: "Management",
      level: "Postgraduate",
      duration: "2 Years",
      colleges: 3521,
      avgFees: "₹8L - 30L",
      description: "Master business administration and leadership skills.",
      skills: ["Leadership", "Strategy", "Finance", "Marketing"],
      careerOptions: ["Manager", "Consultant", "Entrepreneur", "Business Analyst"]
    },
    {
      id: 4,
      name: "B.Sc Physics",
      category: "Science",
      level: "Undergraduate",
      duration: "3 Years",
      colleges: 1834,
      avgFees: "₹1L - 8L",
      description: "Study fundamental principles of physics and scientific research.",
      skills: ["Research", "Analysis", "Problem Solving", "Scientific Method"],
      careerOptions: ["Research Scientist", "Physicist", "Teacher", "Data Analyst"]
    },
    {
      id: 5,
      name: "Law (LLB)",
      category: "Law",
      level: "Undergraduate",
      duration: "3 Years",
      colleges: 876,
      avgFees: "₹2L - 12L",
      description: "Study legal principles, constitutional law, and jurisprudence.",
      skills: ["Legal Research", "Critical Thinking", "Communication", "Analysis"],
      careerOptions: ["Lawyer", "Judge", "Legal Advisor", "Corporate Counsel"]
    },
    {
      id: 6,
      name: "B.Tech Mechanical",
      category: "Engineering",
      level: "Undergraduate",
      duration: "4 Years",
      colleges: 2156,
      avgFees: "₹3L - 12L",
      description: "Design, manufacture, and maintain mechanical systems.",
      skills: ["CAD Design", "Manufacturing", "Thermodynamics", "Materials Science"],
      careerOptions: ["Mechanical Engineer", "Design Engineer", "Production Manager", "R&D Engineer"]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Management', label: 'Management' },
    { value: 'Science', label: 'Science' },
    { value: 'Law', label: 'Law' },
    { value: 'Arts', label: 'Arts' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Undergraduate', label: 'Undergraduate' },
    { value: 'Postgraduate', label: 'Postgraduate' },
    { value: 'Diploma', label: 'Diploma' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of courses across various fields and find the perfect program for your career goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select onValueChange={setSelectedCategory} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedLevel} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <p className="text-gray-600">{course.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{course.colleges} colleges</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Average Fees</div>
                    <div className="text-lg font-bold text-green-600">{course.avgFees}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Key Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Career Options</div>
                    <div className="text-sm text-gray-600">
                      {course.careerOptions.slice(0, 2).join(', ')}
                      {course.careerOptions.length > 2 && '...'}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
