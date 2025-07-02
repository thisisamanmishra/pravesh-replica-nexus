
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
      // Load the CSV data
      const response = await fetch('/src/data/WBJEE_Cutoff_data_2024(1).csv');
      const csvText = await response.text();
      
      // Parse CSV
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      this.cutoffData = lines.slice(1).map(line => {
        const values = this.parseCSVLine(line);
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim().replace(/"/g, '') || '';
        });

        return {
          college_name: row['College Name'] || row['college_name'] || '',
          branch_name: row['Branch Name'] || row['branch_name'] || '',
          category: row['Category'] || row['category'] || '',
          domicile: row['Domicile'] || row['domicile'] || '',
          opening_rank: parseInt(row['Opening Rank'] || row['opening_rank'] || '0') || 0,
          closing_rank: parseInt(row['Closing Rank'] || row['closing_rank'] || '0') || 0,
          round: parseInt(row['Round'] || row['round'] || '1') || 1,
          year: parseInt(row['Year'] || row['year'] || '2024') || 2024,
        };
      }).filter(item => item.college_name && item.branch_name && item.closing_rank > 0);

      this.isDataLoaded = true;
      console.log(`Loaded ${this.cutoffData.length} WBJEE cutoff records`);
    } catch (error) {
      console.error('Error loading WBJEE data:', error);
      this.cutoffData = [];
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
    
    // Filter cutoffs where user rank is eligible (rank <= closing_rank)
    const eligibleCutoffs = this.cutoffData.filter(cutoff => {
      const categoryMatch = cutoff.category.toUpperCase() === normalizedCategory.toUpperCase();
      const domicileMatch = this.domicileMatches(cutoff.domicile, normalizedDomicile);
      const rankEligible = userRank <= cutoff.closing_rank;
      
      return categoryMatch && domicileMatch && rankEligible;
    });

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
    
    return results.slice(0, 50); // Limit to top 50 colleges
  }

  private normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'GEN': 'GENERAL',
      'GENERAL': 'GENERAL',
      'OBC-A': 'OBC-A',
      'OBC-B': 'OBC-B',
      'SC': 'SC',
      'ST': 'ST',
      'EWS': 'EWS',
      'PWD': 'PWD'
    };
    return categoryMap[category.toUpperCase()] || 'GENERAL';
  }

  private normalizeDomicile(domicile: string): string {
    if (domicile.toLowerCase().includes('home') || domicile.toLowerCase().includes('west bengal')) {
      return 'Home State';
    }
    return 'Other State';
  }

  private domicileMatches(cutoffDomicile: string, userDomicile: string): boolean {
    const normalizedCutoff = cutoffDomicile.toLowerCase();
    const normalizedUser = userDomicile.toLowerCase();
    
    if (normalizedUser.includes('home') || normalizedUser.includes('west bengal')) {
      return normalizedCutoff.includes('home') || normalizedCutoff.includes('west bengal');
    } else {
      return normalizedCutoff.includes('other') || normalizedCutoff.includes('all india');
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
