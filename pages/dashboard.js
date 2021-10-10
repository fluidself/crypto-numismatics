import useSWR from 'swr';
import Navbar from '../components/Navbar';
import { getPopulatedHoldings, getTotals, round } from '../lib/utils';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Dashboard() {
  const { data: prices, error: pricesError } = useSWR('/api/prices', fetcher);
  const { data: holdings, error: holdingsError } = useSWR('/api/holdings', fetcher);
  let populatedHoldings;
  let totals;

  if (holdings && prices) {
    populatedHoldings = getPopulatedHoldings(holdings.holdings, prices.data);
    totals = getTotals(populatedHoldings, prices.data);
    populatedHoldings.map(holding => (holding.allocation = (100 / totals.total) * holding.value));

    // console.log('populatedHoldings', populatedHoldings);
    // console.log('totals', totals);
  }

  // TODO: error handling
  // TODO: better loading indicator. full-screen spinner? render skeleton, spinner in table?
  // if (error) return <div>failed to load</div>;
  if (!populatedHoldings && !totals) return <div>loading...</div>;

  return (
    <div className="h-screen bg-gray-800">
      <Navbar />
      <div className="text-white container mx-auto text-center mt-4">
        <div className="h-12 bg-gray-900"></div>
        <div className="bg-gray-700 flex justify-between">
          <div>
            <h3 className="uppercase">Portfolio value</h3>
            <p>${round(totals.total, 2)}</p>
            <p>(₿{totals.totalBTC})</p>
          </div>
          <div>
            <h3 className="uppercase text-left">Performance</h3>
            <table>
              <tbody>
                <tr>
                  <td className="py-2">24 hours</td>
                  <td className={totals.change24HrsPct > 0 ? 'text-green-500' : 'text-red-500'}>
                    ${totals.change24Hrs} ({totals.change24HrsPct}%)
                  </td>
                </tr>
                <tr>
                  <td className="py-2">7 days</td>
                  <td className={totals.change7DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                    ${totals.change7Days} ({totals.change7DaysPct}%)
                  </td>
                </tr>
                <tr>
                  <td className="py-2">30 days</td>
                  <td className={totals.change30DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                    ${totals.change30Days} ({totals.change30DaysPct}%)
                  </td>
                </tr>
                <tr>
                  <td className="py-2">1 year</td>
                  <td className={totals.change365DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                    ${totals.change365Days} ({totals.change365DaysPct}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>PIE CHART</div>
        </div>
        <div className="flex">
          <table className="min-w-full">
            <thead className="bg-gray-900 border-b border-white">
              <tr>
                <th className="py-2">Name</th>
                <th>Price</th>
                <th>24 hrs</th>
                <th>7 days</th>
                <th>30 days</th>
                <th>1 year</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Allocation</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-gray-700">
              {populatedHoldings.map(holding => (
                <tr key={holding.id} className="border-b border-white">
                  <td className="py-2">{holding.name}</td>
                  <td>${round(holding.price, 2)}</td>
                  <td className={holding.percent_change_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                    {holding.percent_change_24h}%
                  </td>
                  <td className={holding.percent_change_7d > 0 ? 'text-green-500' : 'text-red-500'}>
                    {holding.percent_change_7d}%
                  </td>
                  <td className={holding.percent_change_30d > 0 ? 'text-green-500' : 'text-red-500'}>
                    {holding.percent_change_30d}%
                  </td>
                  <td className={holding.percent_change_365d > 0 ? 'text-green-500' : 'text-red-500'} d>
                    {holding.percent_change_365d}%
                  </td>
                  <td>{holding.amount}</td>
                  <td>${round(holding.value, 2)}</td>
                  <td>{round(holding.allocation, 2)}%</td>
                  <td>
                    <button className="flex hover:text-blue-400">
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                          fill="currentColor"
                          d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-900 py-4 flex pl-4">
          <button
            className="mr-4 rounded inline-flex items-center hover:text-blue-400"
            onClick={() => props.handleModal('login')}
          >
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="currentColor"
                d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"
              ></path>
            </svg>
            Add
          </button>
          <button className="rounded inline-flex items-center hover:text-blue-400" onClick={() => props.handleModal('signup')}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path
                fill="currentColor"
                d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
              ></path>
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
