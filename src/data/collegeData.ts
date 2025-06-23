// College data extracted from Excel file
export interface CollegeData {
  id: string;
  name: string;
  location: string;
  category: string;
  type: 'Government' | 'Private' | 'Deemed';
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
  branches: string[];
}

export const collegeDatabase: CollegeData[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    category: 'Engineering',
    type: 'Government',
    cutoffRanks: {
      'General': { 'All India': 400, 'Home State': 450 },
      'OBC': { 'All India': 800, 'Home State': 900 },
      'SC': { 'All India': 2000, 'Home State': 2200 },
      'ST': { 'All India': 3000, 'Home State': 3200 }
    },
    fees: '₹8.5L',
    rating: 4.8,
    seats: 120,
    placementRate: 98,
    averagePackage: '₹25L',
    branches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil']
  },
  {
    id: '2',
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai',
    category: 'Engineering',
    type: 'Government',
    cutoffRanks: {
      'General': { 'All India': 350, 'Home State': 400 },
      'OBC': { 'All India': 750, 'Home State': 850 },
      'SC': { 'All India': 1800, 'Home State': 2000 },
      'ST': { 'All India': 2800, 'Home State': 3000 }
    },
    fees: '₹8.5L',
    rating: 4.9,
    seats: 150,
    placementRate: 99,
    averagePackage: '₹28L',
    branches: ['Computer Science', 'Electronics', 'Chemical', 'Aerospace']
  },
  {
    id: '3',
    name: 'NIT Trichy',
    location: 'Tiruchirappalli',
    category: 'Engineering',
    type: 'Government',
    cutoffRanks: {
      'General': { 'All India': 2200, 'Home State': 1800 },
      'OBC': { 'All India': 4500, 'Home State': 3800 },
      'SC': { 'All India': 8000, 'Home State': 6500 },
      'ST': { 'All India': 12000, 'Home State': 10000 }
    },
    fees: '₹5.5L',
    rating: 4.6,
    seats: 180,
    placementRate: 95,
    averagePackage: '₹18L',
    branches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical']
  },
  {
    id: '4',
    name: 'NIT Warangal',
    location: 'Warangal',
    category: 'Engineering',
    type: 'Government',
    cutoffRanks: {
      'General': { 'All India': 2500, 'Home State': 2000 },
      'OBC': { 'All India': 5000, 'Home State': 4200 },
      'SC': { 'All India': 9000, 'Home State': 7500 },
      'ST': { 'All India': 13000, 'Home State': 11000 }
    },
    fees: '₹5.5L',
    rating: 4.5,
    seats: 160,
    placementRate: 93,
    averagePackage: '₹16L',
    branches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil']
  },
  {
    id: '5',
    name: 'BITS Pilani',
    location: 'Pilani',
    category: 'Engineering',
    type: 'Private',
    cutoffRanks: {
      'General': { 'All India': 6500, 'Home State': 6500 },
      'OBC': { 'All India': 8000, 'Home State': 8000 },
      'SC': { 'All India': 12000, 'Home State': 12000 },
      'ST': { 'All India': 15000, 'Home State': 15000 }
    },
    fees: '₹19L',
    rating: 4.5,
    seats: 200,
    placementRate: 92,
    averagePackage: '₹16L',
    branches: ['Computer Science', 'Electronics', 'Mechanical', 'Chemical']
  },
  {
    id: '6',
    name: 'VIT Vellore',
    location: 'Vellore',
    category: 'Engineering',
    type: 'Private',
    cutoffRanks: {
      'General': { 'All India': 12000, 'Home State': 12000 },
      'OBC': { 'All India': 15000, 'Home State': 15000 },
      'SC': { 'All India': 20000, 'Home State': 20000 },
      'ST': { 'All India': 25000, 'Home State': 25000 }
    },
    fees: '₹7.8L',
    rating: 4.3,
    seats: 250,
    placementRate: 88,
    averagePackage: '₹12L',
    branches: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical']
  },
  {
    id: '7',
    name: 'SRM Institute Chennai',
    location: 'Chennai',
    category: 'Engineering',
    type: 'Private',
    cutoffRanks: {
      'General': { 'All India': 20000, 'Home State': 18000 },
      'OBC': { 'All India': 25000, 'Home State': 22000 },
      'SC': { 'All India': 35000, 'Home State': 30000 },
      'ST': { 'All India': 40000, 'Home State': 35000 }
    },
    fees: '₹9.5L',
    rating: 4.1,
    seats: 300,
    placementRate: 85,
    averagePackage: '₹10L',
    branches: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil']
  },
  {
    id: '8',
    name: 'Manipal Institute of Technology',
    location: 'Manipal',
    category: 'Engineering',
    type: 'Private',
    cutoffRanks: {
      'General': { 'All India': 15000, 'Home State': 15000 },
      'OBC': { 'All India': 18000, 'Home State': 18000 },
      'SC': { 'All India': 25000, 'Home State': 25000 },
      'ST': { 'All India': 30000, 'Home State': 30000 }
    },
    fees: '₹15L',
    rating: 4.2,
    seats: 220,
    placementRate: 87,
    averagePackage: '₹11L',
    branches: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical']
  },
  {
    id: '9',
    name: 'NIT Surathkal',
    location: 'Surathkal',
    category: 'Engineering',
    type: 'Government',
    cutoffRanks: {
      'General': { 'All India': 3000, 'Home State': 2500 },
      'OBC': { 'All India': 6000, 'Home State': 5000 },
      'SC': { 'All India': 10000, 'Home State': 8500 },
      'ST': { 'All India': 14000, 'Home State': 12000 }
    },
    fees: '₹5.5L',
    rating: 4.4,
    seats: 170,
    placementRate: 91,
    averagePackage: '₹15L',
    branches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical']
  },
  {
    id: '10',
    name: 'IIIT Hyderabad',
    location: 'Hyderabad',
    category: 'Engineering',
    type: 'Deemed',
    cutoffRanks: {
      'General': { 'All India': 1500, 'Home State': 1500 },
      'OBC': { 'All India': 3000, 'Home State': 3000 },
      'SC': { 'All India': 6000, 'Home State': 6000 },
      'ST': { 'All India': 8000, 'Home State': 8000 }
    },
    fees: '₹9L',
    rating: 4.7,
    seats: 100,
    placementRate: 96,
    averagePackage: '₹22L',
    branches: ['Computer Science', 'Electronics']
  }
];

// JEE Main rank to percentile conversion (approximate)
export const rankToPercentile = (rank: number): number => {
  if (rank <= 100) return 99.99;
  if (rank <= 500) return 99.95;
  if (rank <= 1000) return 99.9;
  if (rank <= 2000) return 99.8;
  if (rank <= 5000) return 99.5;
  if (rank <= 10000) return 99.0;
  if (rank <= 20000) return 98.0;
  if (rank <= 50000) return 95.0;
  if (rank <= 100000) return 90.0;
  if (rank <= 200000) return 80.0;
  if (rank <= 500000) return 50.0;
  return Math.max(0, 50 - (rank - 500000) / 10000);
};

// Score to rank conversion for JEE Main (approximate)
export const scoreToRank = (score: number): number => {
  if (score >= 280) return Math.max(1, Math.round((300 - score) * 50));
  if (score >= 250) return Math.round((300 - score) * 200);
  if (score >= 200) return Math.round((300 - score) * 800);
  if (score >= 150) return Math.round((300 - score) * 2000);
  if (score >= 100) return Math.round((300 - score) * 4000);
  return Math.round((300 - score) * 6000);
};

// Percentile to rank conversion
export const percentileToRank = (percentile: number): number => {
  const totalCandidates = 1200000; // Approximate JEE Main candidates
  return Math.round((100 - percentile) * totalCandidates / 100);
};