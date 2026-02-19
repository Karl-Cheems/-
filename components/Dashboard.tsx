
import React from 'react';
import { DailyMetrics, LogEntry } from '../types.ts';
import EChartBase from './EChartBase.tsx';

interface DashboardProps {
  metrics: DailyMetrics;
  logs: LogEntry[];
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, logs, onRefresh }) => {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  };

  // 24h Heatmap Options
  const heatmapOptions = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 20, left: 40, right: 10 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#666', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#111' } },
      axisLine: { show: false },
      axisLabel: { color: '#666' }
    },
    series: [{
      data: metrics.hourly_distribution,
      type: 'bar',
      itemStyle: {
        color: (params: any) => {
          const val = params.data;
          if (val > 80) return '#FFFFFF';
          if (val > 50) return '#AAAAAA';
          return '#333333';
        }
      }
    }]
  };

  // Sankey Options
  const sankeyOptions = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      data: [
        { name: 'Social Media', itemStyle: { color: '#444' } },
        { name: 'Productivity', itemStyle: { color: '#888' } },
        { name: 'Entertainment', itemStyle: { color: '#666' } },
        { name: 'Other', itemStyle: { color: '#222' } },
        { name: 'Archive', itemStyle: { color: '#111' } }
      ],
      links: metrics.flow,
      lineStyle: { color: 'gradient', curveness: 0.5 },
      label: { color: '#ccc', fontFamily: 'JetBrains Mono', fontSize: 10 }
    }]
  };

  // Trend Options
  const trendOptions = {
    backgroundColor: 'transparent',
    grid: { top: 10, bottom: 20, left: 30, right: 10 },
    xAxis: {
      type: 'category',
      data: metrics.trend.map(d => d.day),
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#111' } },
      axisLabel: { color: '#666' }
    },
    series: [{
      data: metrics.trend.map(d => d.value),
      type: 'line',
      smooth: false,
      symbol: 'rect',
      symbolSize: 6,
      lineStyle: { color: '#fff', width: 1 },
      itemStyle: { color: '#fff' },
      areaStyle: { color: 'rgba(255,255,255,0.05)' }
    }]
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
      {/* Header */}
      <div className="matrix-border header-bg p-3 flex justify-between items-center text-xs">
        <div className="font-bold tracking-tighter">
          [#] 数字脉动 (DIGITAL PULSE) | <span className="text-gray-500">极客分析模式</span>
        </div>
        <div className="text-gray-400">
          (o) {metrics.timestamp.split(' ')[0]}
        </div>
      </div>

      {/* Summary Box */}
      <div className="matrix-border p-4">
        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">[ 今日数据概览 ] --------------------------------------------------</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border-l-2 border-white pl-3">
            <span className="text-gray-500">累计时长:</span> <span className="font-bold">{formatDuration(metrics.total_duration_sec)}</span>
          </div>
          <div className="border-l-2 border-gray-600 pl-3">
            <span className="text-gray-500">拿起次数:</span> <span className="font-bold">{metrics.pickups} 次</span>
          </div>
          <div className="border-l-2 border-gray-800 pl-3">
            <span className="text-gray-500">专注熵值 (Entropy):</span> <span className="font-bold text-white">{metrics.entropy}</span>
          </div>
        </div>
      </div>

      {/* 24h Distribution */}
      <div className="matrix-border p-4">
        <div className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">[ 24小时用屏强度分布 ]</div>
        <div className="h-48">
          <EChartBase options={heatmapOptions} />
        </div>
        <div className="text-[10px] text-right text-gray-700 mt-2 tracking-tighter">
          PEAK_INTENSITY_DETECTED_AT_12:00 <span className="animate-pulse">_</span>
        </div>
      </div>

      {/* Mid Section Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="matrix-border p-4">
          <div className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">[ 应用流转逻辑 (桑基图) ]</div>
          <div className="h-64">
            <EChartBase options={sankeyOptions} />
          </div>
        </div>
        <div className="matrix-border p-4">
          <div className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">[ 专注度趋势对比 ]</div>
          <div className="h-64">
            <EChartBase options={trendOptions} />
          </div>
        </div>
      </div>

      {/* Status Logs */}
      <div className="matrix-border p-3 bg-[#050505]">
        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">[ 实时日志状态 ]</div>
        <div className="font-mono text-[11px] space-y-1">
          {logs.map(log => (
            <div key={log.id} className={`${log.level === 'SUCCESS' ? 'text-green-800' : log.level === 'ERROR' ? 'text-red-900' : 'text-gray-600'}`}>
              &gt; {log.message} <span className="text-[9px] opacity-50">[{log.timestamp}]</span>
            </div>
          ))}
          <div className="text-gray-800">&gt; LAST_UPDATE: {metrics.timestamp}</div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold">
        <button onClick={onRefresh} className="matrix-border px-4 py-2 hover:bg-white hover:text-black transition-colors">
          [ 刷新数据 ]
        </button>
        <button className="matrix-border px-4 py-2 text-gray-600 cursor-not-allowed">
          [ 原始 JSON ]
        </button>
        <button className="matrix-border px-4 py-2 text-gray-600 cursor-not-allowed">
          [ 导出 CSV ]
        </button>
        <button className="matrix-border px-4 py-2 text-gray-600 cursor-not-allowed">
          [ 历史存档 ]
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
