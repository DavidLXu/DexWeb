import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Hardware {
  id: string;
  name: string;
  manufacturer: string;
  fingers: number;
  dofs: number;
  actuatedDofs: number;
  abduction: boolean;
  flexion: boolean;
  price: number;
  lastUpdated: string;
}

interface RadarChartProps {
  hardware: Hardware[];
}

const RadarChart: React.FC<RadarChartProps> = ({ hardware }) => {
  const { t } = useLanguage();
  
  // Expanded color palette for all hands with more transparency
  const colors = [
    'rgba(102, 126, 234, 0.15)',
    'rgba(118, 75, 162, 0.15)',
    'rgba(255, 99, 132, 0.15)',
    'rgba(54, 162, 235, 0.15)',
    'rgba(255, 206, 86, 0.15)',
    'rgba(75, 192, 192, 0.15)',
    'rgba(255, 159, 64, 0.15)',
    'rgba(153, 102, 255, 0.15)',
    'rgba(255, 99, 255, 0.15)',
    'rgba(54, 235, 162, 0.15)',
    'rgba(235, 54, 162, 0.15)',
    'rgba(162, 235, 54, 0.15)',
    'rgba(235, 162, 54, 0.15)',
    'rgba(162, 54, 235, 0.15)',
    'rgba(54, 162, 54, 0.15)',
    'rgba(162, 54, 54, 0.15)',
    'rgba(54, 54, 235, 0.15)',
    'rgba(235, 235, 54, 0.15)',
    'rgba(54, 235, 235, 0.15)',
    'rgba(192, 75, 192, 0.15)',
  ];

  const borderColors = [
    'rgba(102, 126, 234, 1)',
    'rgba(118, 75, 162, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 99, 255, 1)',
    'rgba(54, 235, 162, 1)',
    'rgba(235, 54, 162, 1)',
    'rgba(162, 235, 54, 1)',
    'rgba(235, 162, 54, 1)',
    'rgba(162, 54, 235, 1)',
    'rgba(54, 162, 54, 1)',
    'rgba(162, 54, 54, 1)',
    'rgba(54, 54, 235, 1)',
    'rgba(235, 235, 54, 1)',
    'rgba(54, 235, 235, 1)',
    'rgba(192, 75, 192, 1)',
  ];

  const hoverColors = [
    'rgba(102, 126, 234, 0.7)',
    'rgba(118, 75, 162, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 99, 255, 0.7)',
    'rgba(54, 235, 162, 0.7)',
    'rgba(235, 54, 162, 0.7)',
    'rgba(162, 235, 54, 0.7)',
    'rgba(235, 162, 54, 0.7)',
    'rgba(162, 54, 235, 0.7)',
    'rgba(54, 162, 54, 0.7)',
    'rgba(162, 54, 54, 0.7)',
    'rgba(54, 54, 235, 0.7)',
    'rgba(235, 235, 54, 0.7)',
    'rgba(54, 235, 235, 0.7)',
    'rgba(192, 75, 192, 0.7)',
  ];

  const normalizeValue = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const maxValues = {
    fingers: Math.max(...hardware.map(h => h.fingers), 5),
    dofs: Math.max(...hardware.map(h => h.dofs), 20),
    actuatedDofs: Math.max(...hardware.map(h => h.actuatedDofs), 20),
    abduction: 1,
    flexion: 1,
    affordability: Math.max(...hardware.map(h => h.price), 100000),
  };

  // Calculate area for ALL hardware items to sort by size
  const hardwareWithArea = hardware.map((item, index) => {
    const dataPoints = [
      normalizeValue(item.fingers, maxValues.fingers),
      normalizeValue(item.dofs, maxValues.dofs),
      normalizeValue(item.actuatedDofs, maxValues.actuatedDofs),
      item.abduction ? 100 : 0,
      item.flexion ? 100 : 0,
      normalizeValue(maxValues.affordability - item.price, maxValues.affordability),
    ];
    
    // Calculate approximate area (sum of all values as a simple metric)
    const area = dataPoints.reduce((sum, value) => sum + value, 0);
    
    return {
      item,
      originalIndex: index,
      dataPoints,
      area
    };
  });

  // Sort by area (largest first, so they appear at the bottom layer)
  hardwareWithArea.sort((a, b) => b.area - a.area);

  const data = {
    labels: [t('fingers'), t('totalDofs'), t('actuatedDofs'), t('abduction'), t('flexion'), t('affordability')],
    datasets: hardwareWithArea.map(({ item, originalIndex, dataPoints }, sortedIndex) => ({
      label: item.name,
      data: dataPoints,
      backgroundColor: colors[originalIndex % colors.length],
      borderColor: borderColors[originalIndex % borderColors.length],
      borderWidth: 1.5,
      pointBackgroundColor: borderColors[originalIndex % borderColors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        maxHeight: 200,
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 8,
          font: {
            size: 11
          }
        },
        onHover: (event: any, legendItem: any, legend: any) => {
          const chart = legend.chart;
          const datasets = chart.data.datasets;
          
          // Dim all datasets except the hovered one
          datasets.forEach((dataset: any, index: number) => {
            if (index !== legendItem.datasetIndex) {
              dataset.backgroundColor = 'rgba(200, 200, 200, 0.05)';
              dataset.borderColor = 'rgba(200, 200, 200, 0.2)';
            } else {
              // Light up the hovered dataset
              const originalIndex = hardwareWithArea[index].originalIndex;
              dataset.backgroundColor = hoverColors[originalIndex % hoverColors.length];
              dataset.borderColor = borderColors[originalIndex % borderColors.length];
            }
          });
          
          chart.update('none');
        },
        onLeave: (event: any, legendItem: any, legend: any) => {
          const chart = legend.chart;
          const datasets = chart.data.datasets;
          
          // Restore original opacity for all datasets
          datasets.forEach((dataset: any, index: number) => {
            const originalIndex = hardwareWithArea[index].originalIndex;
            dataset.backgroundColor = colors[originalIndex % colors.length];
            dataset.borderColor = borderColors[originalIndex % borderColors.length];
          });
          
          chart.update('none');
        }
      },
      title: {
        display: true,
        text: t('chartTitle'),
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const dataIndex = context.dataIndex;
            const sortedHardware = hardwareWithArea[context.datasetIndex];
            
            if (!sortedHardware) return label;
            
            const hardware_item = sortedHardware.item;
            const labels = [t('fingers'), t('totalDofs'), t('actuatedDofs'), t('abduction'), t('flexion'), t('affordability')];
            const values = [
              hardware_item.fingers,
              hardware_item.dofs,
              hardware_item.actuatedDofs,
              hardware_item.abduction ? t('yes') : t('no'),
              hardware_item.flexion ? t('yes') : t('no'),
              `$${hardware_item.price.toLocaleString()}`,
            ];
            
            return `${label} - ${labels[dataIndex]}: ${values[dataIndex]}`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;