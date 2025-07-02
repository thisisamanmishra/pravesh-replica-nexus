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
      // Try to load the CSV data from the public directory - correct path
      const response = await fetch('/src/data/WBJEE_Cutoff_data_2024(1).csv');
      if (!response.ok) {
        console.warn(`Failed to fetch CSV from /src/data/, trying alternative path. Status: ${response.status}`);
        // Try alternative path
        const altResponse = await fetch('/WBJEE_Cutoff_data_2024(1).csv');
        if (!altResponse.ok) {
          throw new Error(`Failed to fetch CSV from both paths: ${response.status}, ${altResponse.status}`);
        }
        const csvText = await altResponse.text();
        this.processCsvData(csvText);
        return;
      }
      
      const csvText = await response.text();
      this.processCsvData(csvText);
      
    } catch (error) {
      console.error('Error loading WBJEE data:', error);
      this.createFallbackData();
    }
  }

  private processCsvData(csvText: string): void {
    console.log('CSV loaded successfully, length:', csvText.length);
    console.log('First 500 characters:', csvText.substring(0, 500));
    
    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file appears to be empty or invalid');
    }
    
    // Parse headers - handle potential BOM and clean up
    const rawHeaders = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Raw CSV headers:', rawHeaders);
    console.log('Number of headers:', rawHeaders.length);
    console.log('First few data lines:', lines.slice(1, 3).map(line => line.substring(0, 100)));

    // Process data rows
    const validRows: WbjeeCutoffData[] = [];
    let processedCount = 0;
    let skippedCount = 0;

    for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Limit to first 1000 rows for debugging
      try {
        const values = this.parseCSVLine(lines[i]);
        const row: any = {};
        
        rawHeaders.forEach((header, idx) => {
          row[header] = values[idx]?.trim().replace(/"/g, '') || '';
        });

        // Try multiple possible header variations
        const collegeName = row['Institute'] || row['College'] || row['College Name'] || row['COLLEGE'] || '';
        const branchName = row['Program'] || row['Branch'] || row['Course'] || row['COURSE'] || '';
        const category = row['Category'] || row['CATEGORY'] || '';
        const domicile = row['Quota'] || row['Domicile'] || row['QUOTA'] || '';
        const openingRank = this.parseNumber(row['Opening Rank'] || row['OPENING RANK'] || row['Opening'] || '0');
        const closingRank = this.parseNumber(row['Closing Rank'] || row['CLOSING RANK'] || row['Closing'] || '0');

        // Debug first few rows
        if (i <= 5) {
          console.log(`Row ${i} parsed:`, {
            collegeName,
            branchName,
            category,
            domicile,
            openingRank,
            closingRank,
            rawRow: Object.keys(row).slice(0, 5).map(k => `${k}: "${row[k]}"`)
          });
        }

        // Validate row data
        if (collegeName && branchName && category && domicile && openingRank > 0 && closingRank > 0) {
          validRows.push({
            college_name: collegeName,
            branch_name: branchName,
            category: category,
            domicile: domicile,
            opening_rank: openingRank,
            closing_rank: closingRank,
            round: 1,
            year: 2024,
          });
          processedCount++;
        } else {
          skippedCount++;
          if (skippedCount <= 5) {
            console.log(`Skipped row ${i} - missing data:`, {
              collegeName: collegeName || 'MISSING',
              branchName: branchName || 'MISSING',
              category: category || 'MISSING',
              domicile: domicile || 'MISSING',
              openingRank: openingRank || 'MISSING',
              closingRank: closingRank || 'MISSING'
            });
          }
        }
      } catch (error) {
        console.warn(`Error parsing line ${i}:`, error);
        skippedCount++;
      }
    }

    this.cutoffData = validRows;
    this.isDataLoaded = true;
    
    console.log(`CSV processing complete:`, {
      totalLines: lines.length,
      processedRows: processedCount,
      skippedRows: skippedCount,
      validData: this.cutoffData.length
    });

    // Log sample data
    if (this.cutoffData.length > 0) {
      console.log('Sample cutoff data (first 3 records):', this.cutoffData.slice(0, 3));
      console.log('Categories found:', [...new Set(this.cutoffData.map(d => d.category))]);
      console.log('Domiciles found:', [...new Set(this.cutoffData.map(d => d.domicile))]);
    }
  }

  private parseNumber(value: string): number {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    const parsed = parseInt(cleanValue) || 0;
    return parsed;
  }

  private createFallbackData(): void {
    console.log('Creating fallback mock data');
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
      },
      {
        college_name: "Kalyani Government Engineering College",
        branch_name: "Computer Science and Engineering",
        category: "GENERAL",
        domicile: "Home State",
        opening_rank: 1501,
        closing_rank: 3000,
        round: 1,
        year: 2024
      },
      {
        college_name: "Jalpaiguri Government Engineering College",
        branch_name: "Computer Science and Engineering",
        category: "GENERAL",
        domicile: "Home State",
        opening_rank: 3001,
        closing_rank: 5000,
        round: 1,
        year: 2024
      }
    ];
    this.isDataLoaded = true;
    console.log('Fallback data created:', this.cutoffData.length, 'records');
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
    
    console.log('Getting predictions with:', {
      userRank,
      category: category,
      normalizedCategory,
      domicile: domicile,
      normalizedDomicile,
      totalRecords: this.cutoffData.length
    });
    
    if (this.cutoffData.length === 0) {
      console.error('No cutoff data available');
      return [];
    }
    
    // Filter cutoffs where user rank is eligible
    const eligibleCutoffs = this.cutoffData.filter(cutoff => {
      const categoryMatch = this.categoryMatches(cutoff.category, normalizedCategory);
      const domicileMatch = this.domicileMatches(cutoff.domicile, normalizedDomicile);
      const rankEligible = userRank >= cutoff.opening_rank && userRank <= cutoff.closing_rank;
      
      return categoryMatch && domicileMatch && rankEligible;
    });

    console.log(`Found ${eligibleCutoffs.length} eligible cutoffs for rank ${userRank}`);
    
    if (eligibleCutoffs.length === 0) {
      // Debug: Show why no matches found
      console.log('Debug: No matches found. Checking first 10 records:');
      this.cutoffData.slice(0, 10).forEach((cutoff, idx) => {
        const categoryMatch = this.categoryMatches(cutoff.category, normalizedCategory);
        const domicileMatch = this.domicileMatches(cutoff.domicile, normalizedDomicile);
        const rankEligible = userRank >= cutoff.opening_rank && userRank <= cutoff.closing_rank;
        
        console.log(`Record ${idx + 1}:`, {
          college: cutoff.college_name,
          category: cutoff.category,
          domicile: cutoff.domicile,
          opening: cutoff.opening_rank,
          closing: cutoff.closing_rank,
          categoryMatch,
          domicileMatch,
          rankEligible
        });
      });
    }

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
    return results.slice(0, 50);
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
