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
  Play,
  Palette,
  MessageSquare,
  CheckCircle,
  Clock,
  Globe,
  Layout,
  Image,
  Star,
  Award,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useColleges, useCreateCollege, useUpdateCollege, useDeleteCollege, College } from '@/hooks/useColleges';
import { useContactQueries, useUpdateContactQuery } from '@/hooks/useContactQueries';
import { useToast } from '@/hooks/use-toast';
import HomepageCustomizer from '@/components/HomepageCustomizer';
import WebScrapingPanel from '@/components/WebScrapingPanel';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { signOut } = useAuth();
  const { data: colleges = [], isLoading } = useColleges();
  const { data: contactQueries = [], isLoading: isLoadingQueries } = useContactQueries();
  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();
  const deleteCollege = useDeleteCollege();
  const updateContactQuery = useUpdateContactQuery();
  const { toast } = useToast();

  // Enhanced form data with all college view fields
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: '',
    college_type: 'public',
    description: '',
    established: '',
    total_students: '',
    total_courses: '',
    national_ranking: '',
    fees_range: '',
    cutoff_info: '',
    rating: '',
    image_url: '',
    youtube_video_url: '',
    // Additional fields for enhanced college view
    additional_images: ['', '', ''],
    website_url: '',
    phone: '',
    email: '',
    address: '',
    facilities: {
      library: { available: true, rating: '4.5' },
      sports_complex: { available: true, rating: '4.2' },
      hostels: { available: true, rating: '4.0' },
      labs: { available: true, rating: '4.8' },
      cafeteria: { available: true, rating: '4.3' },
      wifi: { available: true, rating: '4.6' }
    },
    courses_offered: [''],
    placement_stats: {
      average_package: '',
      highest_package: '',
      placement_rate: ''
    },
    accreditation: '',
    awards: [''],
    campus_area: '',
    admission_process: '',
    scholarships: ['']
  });

  // College view customization settings
  const [viewSettings, setViewSettings] = useState({
    show_image_carousel: true,
    show_quick_stats: true,
    show_facilities: true,
    show_placement_stats: true,
    show_courses: true,
    show_video: true,
    hero_gradient: 'from-black/70 via-black/50 to-transparent',
    primary_color: 'blue',
    card_style: 'gradient',
    animation_enabled: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      category: '',
      college_type: 'public',
      description: '',
      established: '',
      total_students: '',
      total_courses: '',
      national_ranking: '',
      fees_range: '',
      cutoff_info: '',
      rating: '',
      image_url: '',
      youtube_video_url: '',
      additional_images: ['', '', ''],
      website_url: '',
      phone: '',
      email: '',
      address: '',
      facilities: {
        library: { available: true, rating: '4.5' },
        sports_complex: { available: true, rating: '4.2' },
        hostels: { available: true, rating: '4.0' },
        labs: { available: true, rating: '4.8' },
        cafeteria: { available: true, rating: '4.3' },
        wifi: { available: true, rating: '4.6' }
      },
      courses_offered: [''],
      placement_stats: {
        average_package: '',
        highest_package: '',
        placement_rate: ''
      },
      accreditation: '',
      awards: [''],
      campus_area: '',
      admission_process: '',
      scholarships: ['']
    });
    setEditingCollege(null);
    setShowAddCollege(false);
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      location: college.location,
      category: college.category,
      college_type: college.college_type,
      description: college.description || '',
      established: college.established?.toString() || '',
      total_students: college.total_students?.toString() || '',
      total_courses: college.total_courses?.toString() || '',
      national_ranking: college.national_ranking?.toString() || '',
      fees_range: college.fees_range || '',
      cutoff_info: college.cutoff_info || '',
      rating: college.rating?.toString() || '',
      image_url: college.image_url || '',
      youtube_video_url: college.youtube_video_url || '',
      additional_images: college.additional_images ?? ['', '', ''],
      website_url: college.website_url || '',
      phone: college.phone || '',
      email: college.email || '',
      address: college.address || '',
      facilities: college.facilities || {
        library: { available: true, rating: '4.5' },
        sports_complex: { available: true, rating: '4.2' },
        hostels: { available: true, rating: '4.0' },
        labs: { available: true, rating: '4.8' },
        cafeteria: { available: true, rating: '4.3' },
        wifi: { available: true, rating: '4.6' }
      },
      courses_offered: college.courses_offered ?? [''],
      placement_stats: college.placement_stats || {
        average_package: '',
        highest_package: '',
        placement_rate: ''
      },
      accreditation: college.accreditation || '',
      awards: college.awards ?? [''],
      campus_area: college.campus_area || '',
      admission_process: college.admission_process || '',
      scholarships: college.scholarships ?? ['']
    });
    setShowAddCollege(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const collegeData = {
      name: formData.name,
      location: formData.location,
      category: formData.category,
      college_type: formData.college_type,
      description: formData.description || null,
      established: formData.established ? parseInt(formData.established) : null,
      total_students: formData.total_students ? parseInt(formData.total_students) : null,
      total_courses: formData.total_courses ? parseInt(formData.total_courses) : null,
      national_ranking: formData.national_ranking ? parseInt(formData.national_ranking) : null,
      fees_range: formData.fees_range || null,
      cutoff_info: formData.cutoff_info || null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      image_url: formData.image_url || null,
      youtube_video_url: formData.youtube_video_url || null,
      phone: formData.phone || null,
      email: formData.email || null,
      address: formData.address || null,
      additional_images: formData.additional_images,
      facilities: formData.facilities,
      courses_offered: formData.courses_offered,
      placement_stats: formData.placement_stats,
      accreditation: formData.accreditation || null,
      awards: formData.awards,
      campus_area: formData.campus_area || null,
      admission_process: formData.admission_process || null,
      scholarships: formData.scholarships
    };

    try {
      if (editingCollege) {
        await updateCollege.mutateAsync({ id: editingCollege.id, ...collegeData });
      } else {
        await createCollege.mutateAsync(collegeData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving college:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await deleteCollege.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting college:', error);
      }
    }
  };

  const handleUpdateQueryStatus = async (id: string, status: string) => {
    try {
      await updateContactQuery.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating query status:', error);
    }
  };

  const addArrayField = (field: string, index?: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }));
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQueries = contactQueries.filter(query =>
    query.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: 'Total Colleges', value: colleges.length.toString(), icon: GraduationCap, change: '+12%' },
    { title: 'Contact Queries', value: contactQueries.length.toString(), icon: MessageSquare, change: '+5%' },
    { title: 'Pending Queries', value: contactQueries.filter(q => q.status === 'pending').length.toString(), icon: Clock, change: '+3%' },
    { title: 'Resolved Queries', value: contactQueries.filter(q => q.status === 'resolved').length.toString(), icon: CheckCircle, change: '+8%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-600">College Lelo</p>
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
                onClick={() => setActiveTab('college-view')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'college-view' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Layout className="inline w-4 h-4 mr-3" />
                College View
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('queries')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'queries' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="inline w-4 h-4 mr-3" />
                Contact Queries
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('scraping')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'scraping' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Globe className="inline w-4 h-4 mr-3" />
                Web Scraping
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('homepage')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'homepage' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Palette className="inline w-4 h-4 mr-3" />
                Homepage
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
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
              {activeTab === 'college-view' && 'College View Customization'}
              {activeTab === 'queries' && 'Contact Queries'}
              {activeTab === 'scraping' && 'Web Scraping'}
              {activeTab === 'homepage' && 'Homepage Customization'}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'overview' && 'Monitor your platform performance'}
              {activeTab === 'colleges' && 'Add, edit, and manage college information'}
              {activeTab === 'college-view' && 'Customize how college pages appear to users'}
              {activeTab === 'queries' && 'View and manage user contact queries'}
              {activeTab === 'scraping' && 'Scrape college data from external websites'}
              {activeTab === 'homepage' && 'Customize the homepage content and appearance'}
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
                      </div>
                      <div className="bg-blue-50 p-3 rounded-full">
                        <stat.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search colleges..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Colleges Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>College Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredColleges.map((college) => (
                        <TableRow key={college.id}>
                          <TableCell className="font-medium">{college.name}</TableCell>
                          <TableCell>{college.location}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">{college.category}</Badge>
                          </TableCell>
                          <TableCell className="capitalize">{college.college_type}</TableCell>
                          <TableCell>{college.rating || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(college)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDelete(college.id)}
                                disabled={deleteCollege.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'college-view' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College View Page Customization</CardTitle>
                <CardDescription>Customize how college detail pages appear to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Display Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Show Image Carousel</Label>
                        <Switch 
                          checked={viewSettings.show_image_carousel}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, show_image_carousel: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Quick Stats</Label>
                        <Switch 
                          checked={viewSettings.show_quick_stats}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, show_quick_stats: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Facilities</Label>
                        <Switch 
                          checked={viewSettings.show_facilities}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, show_facilities: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Placement Stats</Label>
                        <Switch 
                          checked={viewSettings.show_placement_stats}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, show_placement_stats: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Video Section</Label>
                        <Switch 
                          checked={viewSettings.show_video}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, show_video: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Enable Animations</Label>
                        <Switch 
                          checked={viewSettings.animation_enabled}
                          onCheckedChange={(checked) => setViewSettings(prev => ({...prev, animation_enabled: checked}))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Style Options</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Primary Color Theme</Label>
                        <Select value={viewSettings.primary_color} onValueChange={(value) => setViewSettings(prev => ({...prev, primary_color: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Card Style</Label>
                        <Select value={viewSettings.card_style} onValueChange={(value) => setViewSettings(prev => ({...prev, card_style: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="bordered">Bordered</SelectItem>
                            <SelectItem value="shadow">Shadow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Hero Gradient</Label>
                        <Select value={viewSettings.hero_gradient} onValueChange={(value) => setViewSettings(prev => ({...prev, hero_gradient: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="from-black/70 via-black/50 to-transparent">Dark Gradient</SelectItem>
                            <SelectItem value="from-blue-600/70 via-blue-500/50 to-transparent">Blue Gradient</SelectItem>
                            <SelectItem value="from-purple-600/70 via-purple-500/50 to-transparent">Purple Gradient</SelectItem>
                            <SelectItem value="from-green-600/70 via-green-500/50 to-transparent">Green Gradient</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Save View Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search queries..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Queries Table */}
            <Card>
              <CardContent className="p-0">
                {isLoadingQueries ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Query</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQueries.map((query) => (
                        <TableRow key={query.id}>
                          <TableCell className="font-medium">{query.name}</TableCell>
                          <TableCell>{query.email}</TableCell>
                          <TableCell>{query.phone}</TableCell>
                          <TableCell className="max-w-xs truncate">{query.description}</TableCell>
                          <TableCell>
                            <Badge variant={query.status === 'pending' ? 'destructive' : 'default'}>
                              {query.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select
                              value={query.status}
                              onValueChange={(status) => handleUpdateQueryStatus(query.id, status)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'scraping' && (
          <WebScrapingPanel />
        )}

        {activeTab === 'homepage' && (
          <HomepageCustomizer />
        )}

        {/* Enhanced Add/Edit College Modal */}
        {showAddCollege && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingCollege ? 'Edit College' : 'Add New College'}</CardTitle>
                <CardDescription>
                  {editingCollege ? 'Update college information' : 'Fill in all the details to create a comprehensive college profile'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">College Name *</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input 
                          id="location" 
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                            <SelectItem value="Arts">Arts & Science</SelectItem>
                            <SelectItem value="Law">Law</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">College Type</Label>
                        <Select value={formData.college_type} onValueChange={(value) => setFormData({ ...formData, college_type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="deemed">Deemed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="accreditation">Accreditation</Label>
                        <Input 
                          id="accreditation" 
                          value={formData.accreditation}
                          onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                          placeholder="NAAC A+, NBA"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3} 
                        placeholder="Detailed description of the college..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea 
                        id="address" 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2} 
                        placeholder="Complete address with pincode"
                      />
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">College Statistics</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="established">Established</Label>
                        <Input 
                          id="established" 
                          type="number" 
                          value={formData.established}
                          onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="students">Total Students</Label>
                        <Input 
                          id="students" 
                          type="number" 
                          value={formData.total_students}
                          onChange={(e) => setFormData({ ...formData, total_students: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="courses">Total Courses</Label>
                        <Input 
                          id="courses" 
                          type="number" 
                          value={formData.total_courses}
                          onChange={(e) => setFormData({ ...formData, total_courses: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="campus_area">Campus Area (acres)</Label>
                        <Input 
                          id="campus_area" 
                          value={formData.campus_area}
                          onChange={(e) => setFormData({ ...formData, campus_area: e.target.value })}
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="ranking">National Ranking</Label>
                        <Input 
                          id="ranking" 
                          type="number" 
                          value={formData.national_ranking}
                          onChange={(e) => setFormData({ ...formData, national_ranking: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Input 
                          id="rating" 
                          type="number" 
                          step="0.1" 
                          min="1" 
                          max="5" 
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fees">Fees Range</Label>
                        <Input 
                          id="fees" 
                          placeholder="e.g., ₹2.5L - 8L" 
                          value={formData.fees_range}
                          onChange={(e) => setFormData({ ...formData, fees_range: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@college.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website_url">Website URL</Label>
                        <Input 
                          id="website_url" 
                          type="url"
                          value={formData.website_url}
                          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                          placeholder="https://www.college.edu"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Media & Images</h3>
                    <div>
                      <Label htmlFor="image">Main Image URL</Label>
                      <Input 
                        id="image" 
                        type="url" 
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Main college image URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Images (for carousel)</Label>
                      {formData.additional_images.map((image, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={image}
                            onChange={(e) => updateArrayField('additional_images', index, e.target.value)}
                            placeholder={`Additional image ${index + 1} URL`}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayField('additional_images', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayField('additional_images')}
                      >
                        Add Image
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="youtubeVideo" className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        YouTube Video URL
                      </Label>
                      <Input 
                        id="youtubeVideo" 
                        placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)" 
                        value={formData.youtube_video_url}
                        onChange={(e) => setFormData({ ...formData, youtube_video_url: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Courses Offered */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Courses Offered</h3>
                    <div className="space-y-2">
                      {formData.courses_offered.map((course, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={course}
                            onChange={(e) => updateArrayField('courses_offered', index, e.target.value)}
                            placeholder={`Course ${index + 1} (e.g., B.Tech Computer Science)`}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayField('courses_offered', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayField('courses_offered')}
                      >
                        Add Course
                      </Button>
                    </div>
                  </div>

                  {/* Placement Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Placement Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="avg_package">Average Package</Label>
                        <Input 
                          id="avg_package" 
                          value={formData.placement_stats.average_package}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            placement_stats: { ...formData.placement_stats, average_package: e.target.value }
                          })}
                          placeholder="e.g., ₹8.5 LPA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="highest_package">Highest Package</Label>
                        <Input 
                          id="highest_package" 
                          value={formData.placement_stats.highest_package}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            placement_stats: { ...formData.placement_stats, highest_package: e.target.value }
                          })}
                          placeholder="e.g., ₹45 LPA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="placement_rate">Placement Rate (%)</Label>
                        <Input 
                          id="placement_rate" 
                          value={formData.placement_stats.placement_rate}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            placement_stats: { ...formData.placement_stats, placement_rate: e.target.value }
                          })}
                          placeholder="e.g., 92"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Facilities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(formData.facilities).map(([facility, data]) => (
                        <div key={facility} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="capitalize">{facility.replace('_', ' ')}</Label>
                            <Switch 
                              checked={data.available}
                              onCheckedChange={(checked) => setFormData({
                                ...formData,
                                facilities: {
                                  ...formData.facilities,
                                  [facility]: { ...data, available: checked }
                                }
                              })}
                            />
                          </div>
                          {data.available && (
                            <Input 
                              value={data.rating}
                              onChange={(e) => setFormData({
                                ...formData,
                                facilities: {
                                  ...formData.facilities,
                                  [facility]: { ...data, rating: e.target.value }
                                }
                              })}
                              placeholder="Rating (1-5)"
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admission & Other Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Admission & Other Information</h3>
                    
                    <div>
                      <Label htmlFor="cutoff">Cutoff Information</Label>
                      <Input 
                        id="cutoff" 
                        placeholder="e.g., JEE Advanced Rank 1-500" 
                        value={formData.cutoff_info}
                        onChange={(e) => setFormData({ ...formData, cutoff_info: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="admission_process">Admission Process</Label>
                      <Textarea 
                        id="admission_process" 
                        value={formData.admission_process}
                        onChange={(e) => setFormData({ ...formData, admission_process: e.target.value })}
                        rows={3} 
                        placeholder="Detailed admission process and requirements..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Awards & Recognition</Label>
                      {formData.awards.map((award, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={award}
                            onChange={(e) => updateArrayField('awards', index, e.target.value)}
                            placeholder={`Award ${index + 1}`}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayField('awards', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayField('awards')}
                      >
                        Add Award
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Scholarships Available</Label>
                      {formData.scholarships.map((scholarship, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={scholarship}
                            onChange={(e) => updateArrayField('scholarships', index, e.target.value)}
                            placeholder={`Scholarship ${index + 1}`}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeArrayField('scholarships', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addArrayField('scholarships')}
                      >
                        Add Scholarship
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={createCollege.isPending || updateCollege.isPending}
                    >
                      {editingCollege ? 'Update College' : 'Add College'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
