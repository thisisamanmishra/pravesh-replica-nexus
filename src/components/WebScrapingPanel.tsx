
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WebScrapingService } from '@/utils/WebScrapingService';
import { useCreateCollege } from '@/hooks/useColleges';
import { Globe, Key, Download, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface ScrapedCollegeData {
  name?: string;
  location?: string;
  category?: string;
  description?: string;
  established?: number;
  fees_range?: string;
  rating?: number;
  image_url?: string;
}

const WebScrapingPanel = () => {
  const [apiKey, setApiKey] = useState(WebScrapingService.getApiKey() || '');
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedCollegeData[]>([]);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [selectedData, setSelectedData] = useState<ScrapedCollegeData[]>([]);
  
  const { toast } = useToast();
  const createCollege = useCreateCollege();

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Firecrawl API key",
        variant: "destructive"
      });
      return;
    }

    const isValid = await WebScrapingService.testApiKey(apiKey);
    if (isValid) {
      WebScrapingService.saveApiKey(apiKey);
      setIsKeyValid(true);
      toast({
        title: "Success",
        description: "Firecrawl API key saved and validated successfully!"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check your Firecrawl API key.",
        variant: "destructive"
      });
    }
  };

  const handleScrapeWebsite = async () => {
    if (!scrapeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    setIsScrapingActive(true);
    setScrapedData([]);

    try {
      const result = await WebScrapingService.scrapeCollegeData(scrapeUrl);
      
      if (result.success && result.data) {
        setScrapedData(result.data);
        toast({
          title: "Success",
          description: `Successfully scraped ${result.data.length} college records`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape website data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: "An error occurred while scraping the website",
        variant: "destructive"
      });
    } finally {
      setIsScrapingActive(false);
    }
  };

  const handleSelectData = (index: number) => {
    const college = scrapedData[index];
    const isSelected = selectedData.includes(college);
    
    if (isSelected) {
      setSelectedData(selectedData.filter(item => item !== college));
    } else {
      setSelectedData([...selectedData, college]);
    }
  };

  const handleImportSelected = async () => {
    if (selectedData.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one college to import",
        variant: "destructive"
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const college of selectedData) {
      try {
        await createCollege.mutateAsync({
          name: college.name || 'Unknown College',
          location: college.location || 'Unknown Location',
          category: college.category || 'General',
          college_type: 'public',
          description: college.description || null,
          established: college.established || null,
          fees_range: college.fees_range || null,
          rating: college.rating || null,
          image_url: college.image_url || null,
          total_students: null,
          total_courses: null,
          national_ranking: null,
          cutoff_info: null,
          youtube_video_url: null
        });
        successCount++;
      } catch (error) {
        console.error('Error importing college:', error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} colleges${errorCount > 0 ? ` (${errorCount} failed)` : ''}`
      });
      setSelectedData([]);
      setScrapedData([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Firecrawl API Configuration
          </CardTitle>
          <CardDescription>
            Set up your Firecrawl API key to enable web scraping. Get your free API key from{' '}
            <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Firecrawl.dev
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Firecrawl API Key</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Firecrawl API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
                {isKeyValid ? <CheckCircle className="w-4 h-4 mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                {isKeyValid ? 'Valid' : 'Save Key'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Scraping Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Web Scraping
          </CardTitle>
          <CardDescription>
            Scrape college data from websites like Shiksha.com, CollegeDunia.com, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="scrapeUrl">Website URL</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="scrapeUrl"
                type="url"
                placeholder="https://www.shiksha.com/college/xyz-college"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleScrapeWebsite} 
                disabled={!scrapeUrl.trim() || !isKeyValid || isScrapingActive}
              >
                {isScrapingActive ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isScrapingActive ? 'Scraping...' : 'Scrape Data'}
              </Button>
            </div>
            {!isKeyValid && (
              <div className="flex items-center mt-2 text-amber-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Please set up a valid API key first</span>
              </div>
            )}
          </div>

          {/* Popular College Websites */}
          <div>
            <Label className="text-sm font-medium">Popular College Websites:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                'https://www.shiksha.com',
                'https://www.collegedunia.com', 
                'https://www.careers360.com',
                'https://www.getmyuni.com'
              ].map((url) => (
                <Badge 
                  key={url} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setScrapeUrl(url)}
                >
                  {url.replace('https://www.', '')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraped Data Results */}
      {scrapedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scraped College Data ({scrapedData.length} found)</span>
              <Button 
                onClick={handleImportSelected} 
                disabled={selectedData.length === 0 || createCollege.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Import Selected ({selectedData.length})
              </Button>
            </CardTitle>
            <CardDescription>
              Review and select the college data you want to import to your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {scrapedData.map((college, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedData.includes(college) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectData(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{college.name || 'Unknown College'}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                        {college.location && <p><strong>Location:</strong> {college.location}</p>}
                        {college.category && <p><strong>Category:</strong> {college.category}</p>}
                        {college.established && <p><strong>Established:</strong> {college.established}</p>}
                        {college.fees_range && <p><strong>Fees:</strong> {college.fees_range}</p>}
                        {college.rating && <p><strong>Rating:</strong> {college.rating}/5</p>}
                      </div>
                      {college.description && (
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{college.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={selectedData.includes(college)}
                        onChange={() => handleSelectData(index)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebScrapingPanel;
