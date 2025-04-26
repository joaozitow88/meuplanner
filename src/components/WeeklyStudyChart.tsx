import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
    y: {
      grid: {
        color: '#2D2D2D',
      },
      ticks: {
        color: '#A3A3A3',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#A3A3A3',
        padding: 20,
      },
    },
  },
};

const data = {
  labels: weekDays,
  datasets: [
    {
      label: 'Tempo (horas)',
      data: [2, 3, 2.5, 4, 3.5, 5, 3],
      backgroundColor: '#4F46E5',
      borderRadius: 4,
    },
    {
      label: 'Questões',
      data: [20, 25, 30, 35, 28, 40, 32],
      backgroundColor: '#22C55E',
      borderRadius: 4,
    },
  ],
};

export function WeeklyStudyChart() {
  return (
    <div className="h-[300px]">
      <Bar options={options} data={data} />
    </div>
  );
}