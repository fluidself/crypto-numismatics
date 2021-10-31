import { Doughnut } from 'react-chartjs-2';
import { round } from '../lib/utils';

const COLORS = [
  'rgba(255, 206, 86, 0.7)',
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(96, 189, 104, 0.7)',
  'rgba(241, 124, 176, 0.7)',
  'rgba(67, 24, 51, 0.7)',
  'rgba(178, 118, 178, 0.7)',
  'rgba(16, 138, 159, 0.7)',
];

export default function DoughnutChart({ holdings = [] }) {
  const sortedHoldings = holdings.sort((a, b) => b.allocation - a.allocation);
  const data = {
    labels: sortedHoldings.map(holding => holding.name),
    datasets: [
      {
        label: 'Holdings',
        data: sortedHoldings.map(holding => round(holding.allocation, 2)),
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWidth: 0.4,
      },
    ],
  };
  const options = {
    maintainAspectRatio: true,
    cutout: '40%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = `${context.label}: ${context.raw}%`;

            return label;
          },
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  return <Doughnut data={data} options={options} height={200} width={200} />;
}
