import { useState } from 'react';
import { useSession, getSession } from 'next-auth/client';
import useSWR, { useSWRConfig } from 'swr';
import { getPopulatedHoldings, getTotals, round, deleteHolding, updateHolding } from '../lib/utils';
import FullPageSpinner from '../components/FullPageSpinner';
import PortfolioFooter from '../components/PortfolioFooter';
import DeleteHolding from '../components/DeleteHolding';
import DoughnutChart from '../components/DoughnutChart';
import EditableCell from '../components/EditableCell';
import EditIcon from '../components/icons/EditIcon';
import Navbar from '../components/Navbar';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Dashboard() {
  const [, loading] = useSession();
  const [editing, setEditing] = useState(false);
  const [processingEdit, setProcessingEdit] = useState(false);
  const { mutate } = useSWRConfig();

  // TODO: handle these potential errors in UI
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

  function handleEditClick(holdingId) {
    if (editing === holdingId) {
      setEditing(false);
    } else {
      setEditing(holdingId);
    }
  }

  async function editHolding(holdingId, submittedAmount) {
    setProcessingEdit(true);
    const currentHolding = populatedHoldings.find(holding => holding.id === holdingId);
    const newAmount = Number(submittedAmount);
    let optimisticNewHoldings;
    let holdingRequestPromise;

    if (currentHolding.amount !== newAmount) {
      if (newAmount === 0) {
        optimisticNewHoldings = populatedHoldings.filter(holding => holding.id !== holdingId);
        holdingRequestPromise = deleteHolding(holdingId);
      } else {
        const newHolding = { ...currentHolding, amount: newAmount };
        optimisticNewHoldings = [...populatedHoldings.filter(holding => holding.id !== holdingId), newHolding];
        holdingRequestPromise = updateHolding(holdingId, newAmount);
      }

      try {
        setTimeout(() => {
          mutate('/api/holdings', { holdings: optimisticNewHoldings }, false);
          setEditing(false);
        }, 500);

        await holdingRequestPromise;

        mutate('/api/holdings');
      } catch (error) {
        console.log(error);
        setEditing(false);
      }
    }

    setProcessingEdit(false);
  }

  return (
    <div className="h-screen bg-gray-800">
      <Navbar />
      {loading || (!populatedHoldings && !totals) ? (
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
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700">
                  {populatedHoldings.map(holding => (
                    <tr key={holding.symbol} className="border-b border-white">
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
                      <td className="pr-4 text-right">
                        {editing === holding.id ? (
                          <EditableCell
                            amount={holding.amount}
                            holdingId={holding.id}
                            editHolding={editHolding}
                            processing={processingEdit}
                          />
                        ) : (
                          <span>{holding.amount}</span>
                        )}
                      </td>
                      <td className="pr-4 text-right">${round(holding.value, 2)}</td>
                      <td className="pr-4 text-right hidden lg:table-cell">{round(holding.allocation, 2)}%</td>
                      <td className="w-8 pl-2 ">
                        <button className="flex hover:text-blue-400" onClick={() => handleEditClick(holding.id)}>
                          <EditIcon />
                        </button>
                      </td>
                      <td className="w-8 pl-2 ">
                        <DeleteHolding holdings={populatedHoldings} holdingId={holding.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-900 flex pl-4 py-5">
              <PortfolioFooter holdings={populatedHoldings} availableCoins={availableCoins} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
