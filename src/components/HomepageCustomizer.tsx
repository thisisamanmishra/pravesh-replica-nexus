
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Image, Type, Users, Settings, Palette } from 'lucide-react';
import { useHomepageSettings, useUpdateHomepageSettings, HomepageSettings } from '@/hooks/useHomepageSettings';
import { useColleges } from '@/hooks/useColleges';
import { Checkbox } from '@/components/ui/checkbox';

const HomepageCustomizer = () => {
  const { data: settings, isLoading } = useHomepageSettings();
  const { data: colleges = [] } = useColleges();
  const updateSettings = useUpdateHomepageSettings();

  const [formData, setFormData] = useState<Partial<HomepageSettings>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings?.id) return;
    
    try {
      await updateSettings.mutateAsync({ ...formData, id: settings.id });
    } catch (error) {
      console.error('Error updating homepage settings:', error);
    }
  };

  const updateQuickStat = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      quick_stats: {
        ...prev.quick_stats,
        [key]: value
      }
    }));
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const newCategories = [...(formData.categories || [])];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setFormData(prev => ({ ...prev, categories: newCategories }));
  };

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...(prev.categories || []), { name: '', count: '', icon: '' }]
    }));
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.filter((_, i) => i !== index) || []
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { title: '', description: '', icon: '' }]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleFeaturedCollege = (collegeId: string) => {
    const currentIds = formData.featured_colleges_ids || [];
    const newIds = currentIds.includes(collegeId)
      ? currentIds.filter(id => id !== collegeId)
      : [...currentIds, collegeId];
    
    setFormData(prev => ({ ...prev, featured_colleges_ids: newIds }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Homepage Customization</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="colleges">Featured Colleges</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic website information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website_name">Website Name</Label>
                  <Input
                    id="website_name"
                    value={formData.website_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_name: e.target.value }))}
                    placeholder="College Lelo"
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quick Stats - Colleges</Label>
                    <Input
                      value={formData.quick_stats?.colleges || ''}
                      onChange={(e) => updateQuickStat('colleges', e.target.value)}
                      placeholder="15,000+"
                    />
                  </div>
                  <div>
                    <Label>Quick Stats - Courses</Label>
                    <Input
                      value={formData.quick_stats?.courses || ''}
                      onChange={(e) => updateQuickStat('courses', e.target.value)}
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <Label>Quick Stats - Students</Label>
                    <Input
                      value={formData.quick_stats?.students || ''}
                      onChange={(e) => updateQuickStat('students', e.target.value)}
                      placeholder="2L+"
                    />
                  </div>
                  <div>
                    <Label>Quick Stats - Cities</Label>
                    <Input
                      value={formData.quick_stats?.cities || ''}
                      onChange={(e) => updateQuickStat('cities', e.target.value)}
                      placeholder="50+"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Hero Section
                </CardTitle>
                <CardDescription>Customize the main hero section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={formData.hero_title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                    placeholder="Find Your Perfect College"
                  />
                </div>
                <div>
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                    placeholder="Discover top colleges, compare courses, check cutoffs, and make informed decisions for your future"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="hero_background">Hero Background Image URL</Label>
                  <Input
                    id="hero_background"
                    value={formData.hero_background_image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_background_image: e.target.value }))}
                    placeholder="https://example.com/hero-bg.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colleges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Featured Colleges
                </CardTitle>
                <CardDescription>Select which colleges to feature on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {colleges.map((college) => (
                    <div key={college.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        checked={formData.featured_colleges_ids?.includes(college.id) || false}
                        onCheckedChange={() => toggleFeaturedCollege(college.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{college.name}</p>
                        <p className="text-xs text-gray-500">{college.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage course categories displayed on homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.categories?.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2 p-4 border rounded">
                    <Input
                      placeholder="Category name"
                      value={category.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Count (e.g., 5000+)"
                      value={category.count}
                      onChange={(e) => updateCategory(index, 'count', e.target.value)}
                      className="w-32"
                    />
                    <Input
                      placeholder="Icon (emoji)"
                      value={category.icon}
                      onChange={(e) => updateCategory(index, 'icon', e.target.value)}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Manage features section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Feature title"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Icon name"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HomepageCustomizer;
