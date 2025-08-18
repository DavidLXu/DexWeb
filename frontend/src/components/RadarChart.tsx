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
  const colors = [
    'rgba(102, 126, 234, 0.6)',
    'rgba(118, 75, 162, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
  ];

  const borderColors = [
    'rgba(102, 126, 234, 1)',
    'rgba(118, 75, 162, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
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

  // Calculate area for each hardware item to sort by size
  const hardwareWithArea = hardware.slice(0, 6).map((item, index) => {
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
      index,
      dataPoints,
      area
    };
  });

  // Sort by area (largest first, so they appear at the bottom layer)
  hardwareWithArea.sort((a, b) => b.area - a.area);

  const data = {
    labels: [t('fingers'), t('totalDofs'), t('actuatedDofs'), t('abduction'), t('flexion'), t('affordability')],
    datasets: hardwareWithArea.map(({ item, index, dataPoints }) => ({
      label: item.name,
      data: dataPoints,
      backgroundColor: colors[index],
      borderColor: borderColors[index],
      borderWidth: 2,
      pointBackgroundColor: borderColors[index],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        onHover: (event: any, legendItem: any, legend: any) => {
          const chart = legend.chart;
          const datasets = chart.data.datasets;
          
          // Dim all datasets
          datasets.forEach((dataset: any, index: number) => {
            if (index !== legendItem.datasetIndex) {
              dataset.backgroundColor = dataset.backgroundColor.replace(/0\.\d+/, '0.1');
              dataset.borderColor = dataset.borderColor.replace(/1\)/, '0.3)');
            } else {
              // Highlight the hovered dataset
              dataset.backgroundColor = dataset.backgroundColor.replace(/0\.\d+/, '0.8');
              dataset.borderColor = dataset.borderColor.replace(/0\.\d+\)/, '1)');
            }
          });
          
          chart.update('none');
        },
        onLeave: (event: any, legendItem: any, legend: any) => {
          const chart = legend.chart;
          const datasets = chart.data.datasets;
          
          // Restore original opacity for all datasets
          datasets.forEach((dataset: any, index: number) => {
            const originalIndex = hardwareWithArea[index].index;
            dataset.backgroundColor = colors[originalIndex];
            dataset.borderColor = borderColors[originalIndex];
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