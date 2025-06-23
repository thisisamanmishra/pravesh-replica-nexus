import { collegeDatabase, CollegeData, scoreToRank, percentileToRank } from '@/data/collegeData';

export interface PredictionInput {
  examType: string;
  score?: string;
  percentile?: string;
  category: string;
  homeState: string;
  gender?: string;
}

export interface PredictionResult {
  id: string;
  college: string;
  branch: string;
  location: string;
  probability: number;
  admissionChance: 'High' | 'Moderate' | 'Low';
  expectedRank: string;
  cutoffRank: number;
  fees: string;
  rating: number;
  category: string;
  collegeType: 'Government' | 'Private' | 'Deemed';
  seats: number;
  placementRate: number;
  averagePackage: string;
  reason: string;
}

export class PredictionService {
  static calculateRank(input: PredictionInput): number {
    if (input.percentile && parseFloat(input.percentile) > 0) {
      return percentileToRank(parseFloat(input.percentile));
    }
    if (input.score && parseFloat(input.score) > 0) {
      return scoreToRank(parseFloat(input.score));
    }
    return 0;
  }

  static normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'general': 'General',
      'obc': 'OBC',
      'obc-ncl': 'OBC',
      'sc': 'SC',
      'st': 'ST',
      'ews': 'General', // EWS treated as General for cutoff purposes
      'tuition-fee-waiver': 'General' // Special category
    };
    return categoryMap[category.toLowerCase()] || 'General';
  }

  static getQuotaType(homeState: string, collegeLocation: string): string {
    // Simplified quota determination
    const stateMap: { [key: string]: string[] } = {
      'delhi': ['New Delhi', 'Delhi'],
      'maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
      'tamil-nadu': ['Chennai', 'Tiruchirappalli', 'Vellore'],
      'karnataka': ['Bangalore', 'Manipal', 'Surathkal'],
      'telangana': ['Hyderabad', 'Warangal'],
      'rajasthan': ['Pilani', 'Jaipur']
    };

    const userStateKey = homeState.toLowerCase().replace(/\s+/g, '-');
    const collegeStates = stateMap[userStateKey] || [];
    
    return collegeStates.some(state => 
      collegeLocation.toLowerCase().includes(state.toLowerCase())
    ) ? 'Home State' : 'All India';
  }

  static calculateProbability(
    userRank: number, 
    cutoffRank: number, 
    college: CollegeData,
    quota: string
  ): number {
    if (userRank <= 0 || cutoffRank <= 0) return 0;

    // Base probability calculation
    let probability = 0;
    
    if (userRank <= cutoffRank * 0.7) {
      probability = 95; // Very high chance
    } else if (userRank <= cutoffRank * 0.85) {
      probability = 85; // High chance
    } else if (userRank <= cutoffRank) {
      probability = 70; // Good chance
    } else if (userRank <= cutoffRank * 1.1) {
      probability = 50; // Moderate chance
    } else if (userRank <= cutoffRank * 1.3) {
      probability = 30; // Low chance
    } else if (userRank <= cutoffRank * 1.5) {
      probability = 15; // Very low chance
    } else {
      probability = 5; // Minimal chance
    }

    // Adjust for college type
    if (college.type === 'Government') {
      probability *= 0.9; // Government colleges are more competitive
    } else if (college.type === 'Private') {
      probability *= 1.1; // Private colleges may have more flexibility
    }

    // Adjust for quota
    if (quota === 'Home State') {
      probability *= 1.15; // Home state quota advantage
    }

    return Math.min(95, Math.max(5, Math.round(probability)));
  }

  static getAdmissionChance(probability: number): 'High' | 'Moderate' | 'Low' {
    if (probability >= 70) return 'High';
    if (probability >= 40) return 'Moderate';
    return 'Low';
  }

  static generatePredictions(input: PredictionInput): PredictionResult[] {
    const userRank = this.calculateRank(input);
    if (userRank <= 0) return [];

    const userCategory = this.normalizeCategory(input.category);
    const predictions: PredictionResult[] = [];

    for (const college of collegeDatabase) {
      const quota = this.getQuotaType(input.homeState, college.location);
      const cutoffRank = college.cutoffRanks[userCategory]?.[quota] || 
                        college.cutoffRanks['General']?.[quota] || 
                        college.cutoffRanks['General']?.['All India'] || 0;

      if (cutoffRank <= 0) continue;

      // Generate predictions for each branch
      for (const branch of college.branches) {
        const probability = this.calculateProbability(userRank, cutoffRank, college, quota);
        
        // Only include colleges with reasonable chance (>5%)
        if (probability > 5) {
          const admissionChance = this.getAdmissionChance(probability);
          
          let reason = '';
          if (userRank <= cutoffRank) {
            reason = `Your rank ${userRank} is within the cutoff range (${cutoffRank})`;
          } else {
            reason = `Your rank ${userRank} is close to cutoff (${cutoffRank}). Consider as backup option.`;
          }

          if (quota === 'Home State') {
            reason += ' (Home state quota advantage)';
          }

          predictions.push({
            id: `${college.id}-${branch}`,
            college: college.name,
            branch,
            location: college.location,
            probability,
            admissionChance,
            expectedRank: userRank <= cutoffRank ? `${userRank}` : `${userRank} (Cutoff: ${cutoffRank})`,
            cutoffRank,
            fees: college.fees,
            rating: college.rating,
            category: college.category,
            collegeType: college.type,
            seats: college.seats,
            placementRate: college.placementRate,
            averagePackage: college.averagePackage,
            reason
          });
        }
      }
    }

    // Sort by probability (highest first)
    return predictions.sort((a, b) => b.probability - a.probability);
  }

  static getRecommendations(input: PredictionInput): {
    safe: PredictionResult[];
    moderate: PredictionResult[];
    ambitious: PredictionResult[];
  } {
    const allPredictions = this.generatePredictions(input);
    
    return {
      safe: allPredictions.filter(p => p.admissionChance === 'High').slice(0, 10),
      moderate: allPredictions.filter(p => p.admissionChance === 'Moderate').slice(0, 10),
      ambitious: allPredictions.filter(p => p.admissionChance === 'Low' && p.probability >= 15).slice(0, 5)
    };
  }
}