
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
      // Try to load the CSV data from the public directory
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
      // Home State quota entries
      {
        college_name: "Jadavpur University",
        branch_name: "Computer Science and Engineering",
        category: "Open",
        domicile: "Home State",
        opening_rank: 1,
        closing_rank: 500,
        round: 1,
        year: 2024
      },
      {
        college_name: "Jadavpur University",
        branch_name: "Electrical Engineering",
        category: "Open",
        domicile: "Home State",
        opening_rank: 501,
        closing_rank: 800,
        round: 1,
        year: 2024
      },
      // All India quota entries
      {
        college_name: "Jadavpur University",
        branch_name: "Computer Science and Engineering",
        category: "Open",
        domicile: "All India",
        opening_rank: 1,
        closing_rank: 1000,
        round: 1,
        year: 2024
      },
      {
        college_name: "Jadavpur University",
        branch_name: "Electrical Engineering",
        category: "Open",
        domicile: "All India",
        opening_rank: 1001,
        closing_rank: 2000,
        round: 1,
        year: 2024
      },
      {
        college_name: "Calcutta University",
        branch_name: "Computer Science and Engineering",
        category: "Open",
        domicile: "All India",
        opening_rank: 2001,
        closing_rank: 4000,
        round: 1,
        year: 2024
      },
      // Add some OBC-A entries for All India
      {
        college_name: "Jadavpur University",
        branch_name: "Computer Science and Engineering",
        category: "OBC - A",
        domicile: "All India",
        opening_rank: 1001,
        closing_rank: 3000,
        round: 1,
        year: 2024
      },
      {
        college_name: "Calcutta University",
        branch_name: "Computer Science and Engineering",
        category: "OBC - A",
        domicile: "All India",
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
    
    // Debug: Show available records for the selected domicile and category
    const availableRecords = this.cutoffData.filter(cutoff => {
      const categoryMatch = this.categoryMatches(cutoff.category, normalizedCategory);
      const domicileMatch = this.domicileMatches(cutoff.domicile, normalizedDomicile);
      return categoryMatch && domicileMatch;
    });
    
    console.log(`Found ${availableRecords.length} records matching category ${normalizedCategory} and domicile ${normalizedDomicile}`);
    console.log('Available records sample:', availableRecords.slice(0, 3));
    
    // Filter cutoffs where user rank is eligible (rank should be <= closing rank)
    const eligibleCutoffs = availableRecords.filter(cutoff => {
      const rankEligible = userRank <= cutoff.closing_rank;
      console.log(`Checking rank eligibility: ${userRank} <= ${cutoff.closing_rank} = ${rankEligible} for ${cutoff.college_name} ${cutoff.branch_name}`);
      return rankEligible;
    });

    console.log(`Found ${eligibleCutoffs.length} eligible cutoffs for rank ${userRank}`);
    
    if (eligibleCutoffs.length === 0) {
      console.log('No eligible cutoffs found. All available records:');
      availableRecords.forEach((cutoff, idx) => {
        console.log(`${idx + 1}. ${cutoff.college_name} - ${cutoff.branch_name}: Opening ${cutoff.opening_rank}, Closing ${cutoff.closing_rank}, User rank: ${userRank}`);
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
      'GEN': 'Open',
      'GENERAL': 'Open',
      'General': 'Open',
      'Open': 'Open',
      'OBC-A': 'OBC - A',
      'OBC-B': 'OBC - B',
      'SC': 'SC',
      'ST': 'ST',
      'EWS': 'EWS',
      'PWD': 'PWD'
    };
    return categoryMap[category] || 'Open';
  }

  private categoryMatches(cutoffCategory: string, userCategory: string): boolean {
    // Normalize both categories for comparison
    const normalizedCutoff = cutoffCategory.trim();
    const normalizedUser = userCategory.trim();
    
    // Direct match
    if (normalizedCutoff === normalizedUser) return true;
    
    return false;
  }

  private normalizeDomicile(domicile: string): string {
    const normalized = domicile.toLowerCase().trim();
    
    // Check if it's Home State/West Bengal quota
    if (normalized.includes('home') || 
        normalized.includes('west bengal') || 
        normalized.includes('wb') ||
        normalized.includes('hs')) {
      return 'Home State';
    }
    
    // Check if it's All India quota
    if (normalized.includes('all india') || 
        normalized.includes('ai') ||
        normalized.includes('other') ||
        normalized.includes('os')) {
      return 'All India';
    }
    
    // Default mapping based on common patterns
    return domicile.includes('State') ? 'Home State' : 'All India';
  }

  private domicileMatches(cutoffDomicile: string, userDomicile: string): boolean {
    const normalizedCutoff = this.normalizeDomicile(cutoffDomicile);
    const normalizedUser = this.normalizeDomicile(userDomicile);
    
    return normalizedCutoff === normalizedUser;
  }

  getAdmissionChance(userRank: number, closingRank: number): 'High' | 'Moderate' | 'Low' {
    const ratio = userRank / closingRank;
    
    if (ratio <= 0.7) return 'High';
    if (ratio <= 0.9) return 'Moderate';
    return 'Low';
  }
}

export const wbjeeDataService = new WbjeeDataService();
