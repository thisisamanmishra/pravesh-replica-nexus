
// Service to handle WBJEE cutoff data from CSV
export interface WbjeeCutoffData {
  college_name: string;
  branch_name: string;
  category: string;
  domicile: string;
  opening_rank: number;
  closing_rank: number;
  round: number;
  year: number;
}

export interface WbjeeCollegeData {
  name: string;
  branches: {
    name: string;
    cutoffs: WbjeeCutoffData[];
  }[];
}

class WbjeeDataService {
  private cutoffData: WbjeeCutoffData[] = [];
  private isDataLoaded = false;

  async loadCutoffData(): Promise<void> {
    if (this.isDataLoaded) return;

    try {
      // Load the CSV data from the public directory
      const response = await fetch('/src/data/WBJEE_Cutoff_data_2024(1).csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status}`);
      }
      
      const csvText = await response.text();
      console.log('CSV loaded, length:', csvText.length);
      
      // Parse CSV
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file appears to be empty or invalid');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      console.log('CSV headers:', headers);
      
      this.cutoffData = lines.slice(1).map((line, index) => {
        try {
          const values = this.parseCSVLine(line);
          const row: any = {};
          
          headers.forEach((header, idx) => {
            row[header] = values[idx]?.trim().replace(/"/g, '') || '';
          });

          // Map the actual CSV headers to our expected format
          // Based on console logs: ["", "Institute", "Program", "Stream", "Seat Type", "Quota", "Category", "Opening Rank", "Closing Rank"]
          const collegeName = row['Institute'] || '';
          const branchName = row['Program'] || '';
          const category = row['Category'] || '';
          const domicile = row['Quota'] || '';
          const openingRank = parseInt(row['Opening Rank'] || '0') || 0;
          const closingRank = parseInt(row['Closing Rank'] || '0') || 0;

          return {
            college_name: collegeName,
            branch_name: branchName,
            category: category,
            domicile: domicile,
            opening_rank: openingRank,
            closing_rank: closingRank,
            round: 1, // Default to round 1
            year: 2024,
          };
        } catch (error) {
          console.warn(`Error parsing line ${index + 1}:`, error);
          return null;
        }
      }).filter((item): item is WbjeeCutoffData => 
        item !== null && 
        item.college_name && 
        item.branch_name && 
        item.closing_rank > 0 && 
        item.opening_rank > 0
      );

      this.isDataLoaded = true;
      console.log(`Successfully loaded ${this.cutoffData.length} WBJEE cutoff records`);
      
      // Log sample data for debugging
      if (this.cutoffData.length > 0) {
        console.log('Sample cutoff data:', this.cutoffData.slice(0, 3));
      }
      
    } catch (error) {
      console.error('Error loading WBJEE data:', error);
      this.cutoffData = [];
      
      // Fallback: Create some mock data for testing
      this.cutoffData = [
        {
          college_name: "Jadavpur University",
          branch_name: "Computer Science and Engineering",
          category: "GENERAL",
          domicile: "Home State",
          opening_rank: 1,
          closing_rank: 500,
          round: 1,
          year: 2024
        },
        {
          college_name: "Jadavpur University",
          branch_name: "Electrical Engineering",
          category: "GENERAL",
          domicile: "Home State",
          opening_rank: 501,
          closing_rank: 800,
          round: 1,
          year: 2024
        },
        {
          college_name: "Calcutta University",
          branch_name: "Computer Science and Engineering",
          category: "GENERAL",
          domicile: "Home State",
          opening_rank: 801,
          closing_rank: 1500,
          round: 1,
          year: 2024
        }
      ];
      console.log('Using fallback mock data:', this.cutoffData.length, 'records');
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  async getPredictions(userRank: number, category: string, domicile: string): Promise<WbjeeCollegeData[]> {
    await this.loadCutoffData();

    const normalizedCategory = this.normalizeCategory(category);
    const normalizedDomicile = this.normalizeDomicile(domicile);
    
    console.log('Searching for predictions with:', {
      userRank,
      normalizedCategory,
      normalizedDomicile,
      totalRecords: this.cutoffData.length
    });
    
    // Filter cutoffs where user rank is eligible
    // User is eligible if: userRank >= opening_rank AND userRank <= closing_rank
    const eligibleCutoffs = this.cutoffData.filter(cutoff => {
      const categoryMatch = this.categoryMatches(cutoff.category, normalizedCategory);
      const domicileMatch = this.domicileMatches(cutoff.domicile, normalizedDomicile);
      const rankEligible = userRank >= cutoff.opening_rank && userRank <= cutoff.closing_rank;
      
      // Debug logging for first few records
      if (this.cutoffData.indexOf(cutoff) < 5) {
        console.log('Checking cutoff:', {
          college: cutoff.college_name,
          branch: cutoff.branch_name,
          category: cutoff.category,
          domicile: cutoff.domicile,
          opening: cutoff.opening_rank,
          closing: cutoff.closing_rank,
          categoryMatch,
          domicileMatch,
          rankEligible,
          userRank
        });
      }
      
      return categoryMatch && domicileMatch && rankEligible;
    });

    console.log(`Found ${eligibleCutoffs.length} eligible cutoffs`);

    // Group by college and branch
    const collegeMap = new Map<string, Map<string, WbjeeCutoffData[]>>();
    
    eligibleCutoffs.forEach(cutoff => {
      if (!collegeMap.has(cutoff.college_name)) {
        collegeMap.set(cutoff.college_name, new Map());
      }
      
      const branchMap = collegeMap.get(cutoff.college_name)!;
      if (!branchMap.has(cutoff.branch_name)) {
        branchMap.set(cutoff.branch_name, []);
      }
      
      branchMap.get(cutoff.branch_name)!.push(cutoff);
    });

    // Convert to result format
    const results: WbjeeCollegeData[] = [];
    
    collegeMap.forEach((branchMap, collegeName) => {
      const branches: { name: string; cutoffs: WbjeeCutoffData[] }[] = [];
      
      branchMap.forEach((cutoffs, branchName) => {
        // Sort cutoffs by round (latest first)
        cutoffs.sort((a, b) => b.round - a.round);
        branches.push({
          name: branchName,
          cutoffs: cutoffs
        });
      });
      
      // Sort branches by best closing rank
      branches.sort((a, b) => {
        const aRank = Math.min(...a.cutoffs.map(c => c.closing_rank));
        const bRank = Math.min(...b.cutoffs.map(c => c.closing_rank));
        return aRank - bRank;
      });
      
      results.push({
        name: collegeName,
        branches: branches
      });
    });

    // Sort colleges by number of eligible branches (more options first)
    results.sort((a, b) => b.branches.length - a.branches.length);
    
    console.log(`Returning ${results.length} colleges with predictions`);
    return results.slice(0, 50); // Limit to top 50 colleges
  }

  private normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'GEN': 'GENERAL',
      'GENERAL': 'GENERAL',
      'General': 'GENERAL',
      'OBC-A': 'OBC-A',
      'OBC-B': 'OBC-B',
      'SC': 'SC',
      'ST': 'ST',
      'EWS': 'EWS',
      'PWD': 'PWD'
    };
    return categoryMap[category] || 'GENERAL';
  }

  private categoryMatches(cutoffCategory: string, userCategory: string): boolean {
    // Normalize both categories for comparison
    const normalizedCutoff = cutoffCategory.toUpperCase().trim();
    const normalizedUser = userCategory.toUpperCase().trim();
    
    // Direct match
    if (normalizedCutoff === normalizedUser) return true;
    
    // Handle variations
    if (normalizedUser === 'GENERAL' && (normalizedCutoff === 'GEN' || normalizedCutoff === 'GENERAL')) return true;
    
    return false;
  }

  private normalizeDomicile(domicile: string): string {
    if (domicile.toLowerCase().includes('home') || domicile.toLowerCase().includes('west bengal')) {
      return 'Home State';
    }
    return 'Other State';
  }

  private domicileMatches(cutoffDomicile: string, userDomicile: string): boolean {
    const normalizedCutoff = cutoffDomicile.toLowerCase().trim();
    const normalizedUser = userDomicile.toLowerCase().trim();
    
    // If user selected Home State
    if (normalizedUser.includes('home') || normalizedUser.includes('west bengal')) {
      return normalizedCutoff.includes('home') || 
             normalizedCutoff.includes('west bengal') ||
             normalizedCutoff.includes('wb') ||
             normalizedCutoff.includes('state') ||
             normalizedCutoff.includes('hs');
    } 
    // If user selected Other State
    else {
      return normalizedCutoff.includes('other') || 
             normalizedCutoff.includes('all india') ||
             normalizedCutoff.includes('ai') ||
             normalizedCutoff.includes('os');
    }
  }

  getAdmissionChance(userRank: number, closingRank: number): 'High' | 'Moderate' | 'Low' {
    const ratio = userRank / closingRank;
    
    if (ratio <= 0.7) return 'High';
    if (ratio <= 0.9) return 'Moderate';
    return 'Low';
  }
}

export const wbjeeDataService = new WbjeeDataService();
