import { Pie } from 'react-chartjs-2';
import { round } from '../lib/utils';

// const COLORS = [
//   '#4D4D4D',
//   '#5DA5DA',
//   '#FAA43A',
//   '#F17CB0',
//   '#60BD68',
//   '#B2912F',
//   '#B276B2',
//   '#DECF3F',
//   '#F15854',
//   '#072A49',
//   '#108A9F',
//   '#431833',
// ];

// https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Pie.js
const COLORS = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
];

export default function PieChart({ holdings }) {
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
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = `${context.label}: ${context.raw}%`; // alternatively, context.parsed in second

            return label;
          },
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  return <Pie data={data} options={options} height={200} width={200} />;
}
