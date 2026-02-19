
import React, { useEffect, useRef } from 'react';

interface EChartBaseProps {
  options: any;
}

declare const echarts: any;

const EChartBase: React.FC<EChartBaseProps> = ({ options }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current && typeof echarts !== 'undefined') {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }
      chartInstance.current.setOption(options);
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options]);

  return <div ref={chartRef} className="w-full h-full" />;
};

export default EChartBase;
