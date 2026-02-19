
export interface AppUsage {
  [key: string]: number;
}

export interface FlowItem {
  source: string;
  target: string;
  value: number;
}

export interface DailyMetrics {
  timestamp: string;
  total_duration_sec: number;
  pickups: number;
  entropy: number;
  hourly_distribution: number[];
  flow: FlowItem[];
  trend: { day: string; value: number }[];
}

export interface LogEntry {
  id: string;
  level: 'INFO' | 'SUCCESS' | 'ERROR';
  message: string;
  timestamp: string;
}
