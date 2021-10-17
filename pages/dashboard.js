import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';
import Navbar from '../components/Navbar';
import DoughnutChart from '../components/DoughnutChart';
// import PieChart from '../components/PieChart';
import Modal from '../components/Modal';
import EditHoldingsForm from '../components/EditHoldingsForm';
import FullPageSpinner from '../components/FullPageSpinner';
import { getPopulatedHoldings, getTotals, round } from '../lib/utils';
import PortfolioFooter from '../components/PortfolioFooter';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Dashboard() {
  const [session, loading] = useSession();
  const [modal, setModal] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace('/');
    }
  }, [session]);

  const { data: currencies, error: pricesError } = useSWR(
    `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&convert=USD&status=active`,
    fetcher,
  );
  const { data: holdings, error: holdingsError } = useSWR('/api/holdings', fetcher);
  let populatedHoldings;
  let totals;
  let availableCoins;

  if (holdings?.holdings && currencies?.length) {
    const partialCurrencies = currencies.slice(0, 1500);
    populatedHoldings = getPopulatedHoldings(holdings.holdings, partialCurrencies);
    totals = getTotals(populatedHoldings, partialCurrencies);
    populatedHoldings.map(holding => (holding.allocation = (100 / totals.total) * holding.value));
    availableCoins = partialCurrencies.map(element => ({ name: element.name, symbol: element.symbol }));
  }

  async function handleDeleteHolding(holdingId) {
    try {
      await fetch(`/api/holdings/${holdingId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(error);
    }
  }

  // TODO: error handling
  // if (error) return <div>failed to load</div>;
  // TODO: alternative loading indicator? render skeleton + spinner in table?

  return (
    <div className="h-screen bg-gray-800">
      <Navbar />
      {!populatedHoldings && !totals ? (
        <FullPageSpinner />
      ) : (
        <>
          <div className="text-white container mx-auto text-center mt-4 xl:w-1/2 l:w-2/3">
            <div className="h-12 bg-gray-900"></div>
            <div className="bg-gray-700 flex justify-between py-4 px-4">
              <div className="text-left">
                <h3 className="uppercase">Portfolio value</h3>
                <p className="text-2xl pt-1">
                  ${totals.total ? round(totals.total, 2) : '0'}{' '}
                  <small className={totals.total ? 'block' : ''}>(₿{Number(totals.totalBTC) ? totals.totalBTC : '0'})</small>
                </p>
              </div>
              {populatedHoldings.length ? (
                <div className="text-left">
                  <h3 className="uppercase">Performance</h3>
                  <table>
                    <tbody>
                      <tr>
                        <td className="py-2 pr-2">24 hours</td>
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
              ) : (
                <p>Your portfolio is currently empty.</p>
              )}
              <div className="hidden lg:block">
                {/* <PieChart holdings={populatedHoldings} /> */}
                <DoughnutChart holdings={populatedHoldings} />
              </div>
            </div>
            <div className="flex">
              <table className="min-w-full">
                <thead className="bg-gray-900 border-b border-white">
                  <tr>
                    <th className="py-2 pl-4 text-left">Name</th>
                    <th className="pr-4 text-right">Price</th>
                    <th className="pr-4 text-right">24 hrs</th>
                    <th className="pr-4 text-right hidden lg:table-cell">7 days</th>
                    <th className="pr-4 text-right hidden lg:table-cell">30 days</th>
                    <th className="pr-4 text-right hidden lg:table-cell">1 year</th>
                    <th className="pr-4 text-right">Amount</th>
                    <th className="pr-4 text-right">Value</th>
                    <th className="pr-4 text-right hidden lg:table-cell">Allocation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700">
                  {populatedHoldings.map(holding => (
                    <tr key={holding.id} className="border-b border-white">
                      <td className="py-2 pl-4 text-left">{holding.name}</td>
                      <td className="pr-4 text-right">${round(holding.price, 2)}</td>
                      <td className={`pr-4 text-right ${holding.percent_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.percent_change_24h}%
                      </td>
                      <td
                        className={`pr-4 text-right hidden lg:table-cell ${
                          holding.percent_change_7d > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {holding.percent_change_7d}%
                      </td>
                      <td
                        className={`pr-4 text-right hidden lg:table-cell ${
                          holding.percent_change_30d > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {holding.percent_change_30d}%
                      </td>
                      <td
                        className={`pr-4 text-right hidden lg:table-cell ${
                          holding.percent_change_365d > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {holding.percent_change_365d}%
                      </td>
                      <td className="pr-4 text-right">{holding.amount}</td>
                      <td className="pr-4 text-right">${round(holding.value, 2)}</td>
                      <td className="pr-4 text-right hidden lg:table-cell">{round(holding.allocation, 2)}%</td>
                      <td className="w-10 pl-2">
                        <button className="flex hover:text-blue-400" onClick={() => handleDeleteHolding(holding.id)}>
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
            <PortfolioFooter holdings={populatedHoldings} availableCoins={availableCoins} handleModal={setModal} />
            {modal && (
              <Modal type={modal} handleModal={setModal}>
                {modal === 'holdings' && <EditHoldingsForm handleModal={setModal} holdings={populatedHoldings} />}
              </Modal>
            )}
          </div>
        </>
      )}
    </div>
  );
}
