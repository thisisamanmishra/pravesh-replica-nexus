
import FirecrawlApp from '@mendable/firecrawl-js';

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

interface ScrapeResult {
  success: boolean;
  data?: ScrapedCollegeData[];
  error?: string;
  rawData?: any;
}

export class WebScrapingService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing Firecrawl API key');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // Simple test scrape
      const testResponse = await this.firecrawlApp.scrapeUrl('https://example.com');
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async scrapeCollegeData(url: string): Promise<ScrapeResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'Firecrawl API key not found. Please set your API key first.' };
    }

    try {
      console.log('Starting college data scraping for URL:', url);
      
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const scrapeResponse = await this.firecrawlApp.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        includeTags: ['h1', 'h2', 'h3', 'p', 'div', 'span', 'img'],
        excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
        onlyMainContent: true
      });

      if (!scrapeResponse.success) {
        console.error('Scrape failed:', scrapeResponse);
        return { 
          success: false, 
          error: 'Failed to scrape the website. Please check the URL and try again.' 
        };
      }

      console.log('Scrape successful, processing data...');
      const processedData = this.processScrapedData(scrapeResponse.data);
      
      return { 
        success: true,
        data: processedData,
        rawData: scrapeResponse.data
      };
    } catch (error) {
      console.error('Error during scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape college data' 
      };
    }
  }

  private static processScrapedData(rawData: any): ScrapedCollegeData[] {
    const colleges: ScrapedCollegeData[] = [];
    
    try {
      const content = rawData.markdown || rawData.html || '';
      
      // Extract college information using regex patterns
      const collegeData: ScrapedCollegeData = {};
      
      // Extract college name (usually in h1 or main title)
      const nameMatch = content.match(/(?:^|\n)#\s*([^#\n]+)/i) || 
                       content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (nameMatch) {
        collegeData.name = nameMatch[1].trim();
      }
      
      // Extract location
      const locationMatch = content.match(/(?:location|address|city)[:\s]*([^\n,]+)/i);
      if (locationMatch) {
        collegeData.location = locationMatch[1].trim();
      }
      
      // Extract category/type
      const categoryMatch = content.match(/(?:type|category|field)[:\s]*([^\n,]+)/i);
      if (categoryMatch) {
        collegeData.category = categoryMatch[1].trim();
      }
      
      // Extract establishment year
      const establishedMatch = content.match(/(?:established|founded)[:\s]*(\d{4})/i);
      if (establishedMatch) {
        collegeData.established = parseInt(establishedMatch[1]);
      }
      
      // Extract fees information
      const feesMatch = content.match(/(?:fees|fee|cost)[:\s]*([₹\d,.\-\s]+(?:lakh|L|crore|CR)?)/i);
      if (feesMatch) {
        collegeData.fees_range = feesMatch[1].trim();
      }
      
      // Extract rating
      const ratingMatch = content.match(/(?:rating|score)[:\s]*(\d+\.?\d*)/i);
      if (ratingMatch) {
        collegeData.rating = parseFloat(ratingMatch[1]);
      }
      
      // Extract image URL
      const imageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/i) ||
                        content.match(/src="(https?:\/\/[^"]+)"/i);
      if (imageMatch) {
        collegeData.image_url = imageMatch[1];
      }
      
      // Extract description (first paragraph)
      const descMatch = content.match(/(?:about|description|overview)[:\s]*([^\n]{50,300})/i);
      if (descMatch) {
        collegeData.description = descMatch[1].trim();
      }
      
      if (Object.keys(collegeData).length > 0) {
        colleges.push(collegeData);
      }
      
    } catch (error) {
      console.error('Error processing scraped data:', error);
    }
    
    return colleges;
  }
}
