
// Mock college data for non-WBJEE exams (JEE Main, JEE Advanced)
export interface CollegeData {
  id: string;
  name: string;
  location: string;
  type: 'Government' | 'Private' | 'Deemed';
  category: string;
  branches: string[];
  cutoffRanks: {
    [category: string]: {
      [quota: string]: number;
    };
  };
  fees: string;
  rating: number;
  seats: number;
  placementRate: number;
  averagePackage: string;
}

export const collegeDatabase: CollegeData[] = [
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    location: "Mumbai",
    type: "Government",
    category: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil"],
    cutoffRanks: {
      "General": { "All India": 100 },
      "OBC": { "All India": 300 },
      "SC": { "All India": 500 },
      "ST": { "All India": 700 }
    },
    fees: "₹2.5 Lakhs/year",
    rating: 4.5,
    seats: 800,
    placementRate: 95,
    averagePackage: "₹20 LPA"
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    location: "New Delhi",
    type: "Government", 
    category: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil"],
    cutoffRanks: {
      "General": { "All India": 150 },
      "OBC": { "All India": 350 },
      "SC": { "All India": 550 },
      "ST": { "All India": 750 }
    },
    fees: "₹2.5 Lakhs/year",
    rating: 4.4,
    seats: 750,
    placementRate: 94,
    averagePackage: "₹18 LPA"
  }
];

export function scoreToRank(score: number): number {
  // Simple score to rank conversion for mock data
  if (score >= 300) return Math.floor(100 + (360 - score) * 10);
  if (score >= 250) return Math.floor(1000 + (300 - score) * 50);
  if (score >= 200) return Math.floor(5000 + (250 - score) * 100);
  return Math.floor(20000 + (200 - score) * 200);
}

export function percentileToRank(percentile: number): number {
  // Simple percentile to rank conversion for mock data
  if (percentile >= 99.5) return Math.floor(1 + (100 - percentile) * 100);
  if (percentile >= 95) return Math.floor(1000 + (99.5 - percentile) * 500);
  if (percentile >= 85) return Math.floor(10000 + (95 - percentile) * 1000);
  return Math.floor(50000 + (85 - percentile) * 2000);
}
