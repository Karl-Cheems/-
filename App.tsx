
import React, { useState, useEffect } from 'react';
import { DailyMetrics, LogEntry } from './types.ts';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const addLog = (message: string, level: LogEntry['level'] = 'INFO') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      level,
      message,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      addLog('INITIALIZING_SYSTEM_CORE...', 'INFO');
      
      // Simulate fetching data from the SSG generated JSON
      setTimeout(() => {
        const mockData: DailyMetrics = {
          timestamp: '2026-02-19 23:45:12',
          total_duration_sec: 20520, // 05h 42m
          pickups: 84,
          entropy: 0.42,
          hourly_distribution: [
            2, 1, 0, 0, 0, 0, 5, 12, 25, 40, 30, 45, 100, 85, 60, 40, 35, 20, 55, 70, 40, 25, 15, 5
          ],
          flow: [
            // Fixed: Flow must be a Directed Acyclic Graph (DAG) for ECharts Sankey
            { source: 'Social Media', target: 'Productivity', value: 35 },
            { source: 'Social Media', target: 'Entertainment', value: 15 },
            { source: 'Productivity', target: 'Other', value: 20 },
            { source: 'Entertainment', target: 'Other', value: 10 },
            { source: 'Other', target: 'Archive', value: 20 },
          ],
          trend: [
            { day: 'Mon', value: 0.35 },
            { day: 'Tue', value: 0.48 },
            { day: 'Wed', value: 0.42 },
            { day: 'Thu', value: 0.55 },
            { day: 'Fri', value: 0.39 },
            { day: 'Sat', value: 0.21 },
            { day: 'Sun', value: 0.18 },
          ]
        };
        setMetrics(mockData);
        addLog('DATA_SYNC: SUCCESS (Source: iOS_Shortcuts)', 'SUCCESS');
        addLog('REPO_STATUS: GITHUB_ACTIONS_COMPLETED', 'SUCCESS');
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-[#00FF41]">
        <div className="text-xl font-bold animate-pulse tracking-widest">
          > LOADING_DIGITAL_PULSE_V2.0.6
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <Dashboard metrics={metrics} logs={logs} onRefresh={() => window.location.reload()} />
    </div>
  );
};

export default App;
