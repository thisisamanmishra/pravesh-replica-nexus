import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Settings,
  LogOut,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCollege, setShowAddCollege] = useState(false);

  const stats = [
    { title: 'Total Colleges', value: '1,247', icon: GraduationCap, change: '+12%' },
    { title: 'Active Users', value: '45,231', icon: Users, change: '+8%' },
    { title: 'Total Courses', value: '8,432', icon: BookOpen, change: '+15%' },
    { title: 'Monthly Views', value: '2.4M', icon: TrendingUp, change: '+23%' }
  ];

  const colleges = [
    {
      id: 1,
      name: "IIT Delhi",
      location: "New Delhi",
      category: "Engineering",
      status: "Active",
      students: 8000,
      courses: 45,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "AIIMS Delhi",
      location: "New Delhi", 
      category: "Medical",
      status: "Active",
      students: 3000,
      courses: 25,
      lastUpdated: "2024-01-14"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-600">College Pravesh</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="inline w-4 h-4 mr-3" />
                Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('colleges')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'colleges' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="inline w-4 h-4 mr-3" />
                Colleges
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'courses' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <BookOpen className="inline w-4 h-4 mr-3" />
                Courses
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Users className="inline w-4 h-4 mr-3" />
                Users
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start mt-2">
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'colleges' && 'Manage Colleges'}
              {activeTab === 'courses' && 'Manage Courses'}
              {activeTab === 'users' && 'Manage Users'}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'overview' && 'Monitor your platform performance'}
              {activeTab === 'colleges' && 'Add, edit, and manage college information'}
              {activeTab === 'courses' && 'Manage course offerings and details'}
              {activeTab === 'users' && 'View and manage platform users'}
            </p>
          </div>
          
          {activeTab === 'colleges' && (
            <Button onClick={() => setShowAddCollege(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-full">
                        <stat.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New college added: IIT Gandhinagar</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Updated cutoff information for 15 colleges</p>
                      <p className="text-sm text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search colleges..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Colleges Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell className="font-medium">{college.name}</TableCell>
                        <TableCell>{college.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{college.category}</Badge>
                        </TableCell>
                        <TableCell>{college.students.toLocaleString()}</TableCell>
                        <TableCell>{college.courses}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {college.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add College Modal */}
        {showAddCollege && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New College</CardTitle>
                <CardDescription>Fill in the details to add a new college to the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collegeName">College Name</Label>
                    <Input id="collegeName" placeholder="Enter college name" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Enter location" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="arts">Arts & Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">College Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="deemed">Deemed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter college description" rows={4} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="established">Established</Label>
                    <Input id="established" type="number" placeholder="Year" />
                  </div>
                  <div>
                    <Label htmlFor="students">Total Students</Label>
                    <Input id="students" type="number" placeholder="Number of students" />
                  </div>
                  <div>
                    <Label htmlFor="ranking">National Ranking</Label>
                    <Input id="ranking" type="number" placeholder="Ranking" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="youtubeVideo" className="flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    YouTube Video Link
                  </Label>
                  <Input 
                    id="youtubeVideo" 
                    placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the complete YouTube URL. We'll extract the video ID automatically.
                  </p>
                </div>

                <div>
                  <Label htmlFor="image">College Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <Input type="file" className="hidden" />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setShowAddCollege(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Add College
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
