import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#A3A3A3',
        padding: 20,
      },
    },
  },
};

const data = {
  labels: ['Português', 'Matemática', 'Direito Constitucional'],
  datasets: [
    {
      data: [3, 2, 1],
      backgroundColor: [
        '#4F46E5',
        '#22C55E',
        '#3B82F6',
      ],
      borderColor: '#1E1E1E',
      borderWidth: 2,
    },
  ],
};

export function DailyStudyPieChart() {
  return (
    <div className="h-[200px]">
      <Pie options={options} data={data} />
    </div>
  );
}