export interface MetricSummary {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  neutralText?: string;
  iconName: string;
  chartType: 'bar' | 'line' | 'progress';
  chartData: number[]; // numerical representation for rendering
  compareLabel?: string;
}

export interface PolicyMilestone {
  id: string;
  years: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface SectorContribution {
  sector: string;
  share: number;
  yoyGrowth: number;
  keyDriver: string;
  iconName: string;
}

export interface GDPSeriesPoint {
  year: number;
  tamilNadu: number;
  averageOthers: number;
  term: 'A' | 'B' | 'C';
}

export interface EducationEnrolment {
  state: string; // "TN", "MH", "KA", "GJ"
  percentage: number;
}

export interface InfrastructureIndex {
  state: string;
  score: number; // score representing index, e.g., out of 100
}

export type ActiveTab = 'gdp_growth' | 'infrastructure' | 'education_skills' | 'public_health' | 'industrial_output';

export interface SectorInsight {
  title: string;
  subtitle: string;
  summary: string;
  metrics: MetricSummary[];
  milestones?: PolicyMilestone[];
  contributions?: SectorContribution[];
}
