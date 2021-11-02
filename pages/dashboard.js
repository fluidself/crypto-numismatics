import { useState } from 'react';
import { useSession, getSession } from 'next-auth/client';
import { useSWRConfig } from 'swr';
import { useDashboardData, round, deleteHolding, updateHolding } from '../lib/utils';
import FullPageSpinner from '../components/FullPageSpinner';
import PortfolioFooter from '../components/PortfolioFooter';
import DeleteHolding from '../components/DeleteHolding';
import DoughnutChart from '../components/DoughnutChart';
import EditableCell from '../components/EditableCell';
import EditIcon from '../components/icons/EditIcon';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [, loading] = useSession();
  const { availableCoins, populatedHoldings, totals, isLoading, isError } = useDashboardData();
  const [editing, setEditing] = useState(false);
  const [processingEdit, setProcessingEdit] = useState(false);
  const { mutate } = useSWRConfig();

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

  function renderError(error) {
    return (
      <>
        <p>{`${error.status ? error.status : ''} Error fetching ${error.type}`}</p>
        <code className="text-red-500">{JSON.stringify(error.info, null, 2)}</code>
      </>
    );
  }

  return (
    <div className="h-screen bg-black bg-hero-pattern">
      <Navbar />
      {loading || isLoading ? (
        <FullPageSpinner />
      ) : (
        <>
          <div className="text-white container mx-auto text-center mt-4 xl:w-1/2 lg:w-5/6 border-t border-b md:border-l md:border-r border-white">
            <div className="h-14 bg-gray-900"></div>
            <div className="bg-gray-700 flex justify-between py-4 px-4">
              <div className="text-left">
                {isError && renderError(isError)}
                {totals?.total ? (
                  <>
                    <h3 className="uppercase">Total value</h3>
                    <div className="h-px bg-blue-400 w-16 lg:w-20"></div>
                    <p className="text-xl lg:text-2xl pt-1">
                      ${totals.total ? round(totals.total, 2) : '0'}{' '}
                      <small className={totals.total ? 'block' : ''}>(₿{Number(totals.totalBTC) ? totals.totalBTC : '0'})</small>
                    </p>
                  </>
                ) : null}
              </div>
              {!isError && !isLoading ? (
                populatedHoldings?.length ? (
                  <div className="text-left">
                    <h3 className="uppercase">Performance</h3>
                    <div className="h-px bg-blue-400 w-16 lg:w-20"></div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="py-2 pr-2">
                            <span className="md:hidden">1D</span>
                            <span className="hidden md:inline">24 hours</span>
                          </td>
                          <td className={totals.change24HrsPct > 0 ? 'text-green-500' : 'text-red-500'}>
                            ${totals.change24Hrs} ({totals.change24HrsPct}%)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">
                            <span className="md:hidden">1W</span>
                            <span className="hidden md:inline">7 days</span>
                          </td>
                          <td className={totals.change7DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                            ${totals.change7Days} ({totals.change7DaysPct}%)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">
                            <span className="md:hidden">1M</span>
                            <span className="hidden md:inline">30 days</span>
                          </td>
                          <td className={totals.change30DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                            ${totals.change30Days} ({totals.change30DaysPct}%)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">
                            <span className="md:hidden">1Y</span>
                            <span className="hidden md:inline">1 year</span>
                          </td>
                          <td className={totals.change365DaysPct > 0 ? 'text-green-500' : 'text-red-500'}>
                            ${totals.change365Days} ({totals.change365DaysPct}%)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Your portfolio is currently empty.</p>
                )
              ) : null}
              <div className="hidden lg:block">
                <DoughnutChart holdings={populatedHoldings} />
              </div>
            </div>
            <div className="flex">
              <table className="min-w-full">
                <thead className="bg-gray-900 border-b border-white">
                  <tr>
                    <th className="py-2 pl-4 text-left lg:hidden">Symbol</th>
                    <th className="py-2 pl-4 text-left hidden lg:table-cell">Name</th>
                    <th className="pr-4 text-right">Price</th>
                    <th className="pr-4 text-right">
                      <span className="lg:hidden">1D</span>
                      <span className="hidden lg:inline">24 hrs</span>
                    </th>
                    <th className="pr-4 text-right hidden lg:table-cell">7 days</th>
                    <th className="pr-4 text-right hidden lg:table-cell">30 days</th>
                    <th className="pr-4 text-right hidden lg:table-cell">1 year</th>
                    <th className="pr-4 text-right">Amount</th>
                    <th className="pr-4 text-right hidden lg:table-cell">Value</th>
                    <th className="pr-4 text-right hidden lg:table-cell">Allocation</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700">
                  {populatedHoldings?.map(holding => (
                    <tr key={holding.symbol} className="border-b border-white">
                      <td className="py-2 pl-4 text-left lg:hidden">{holding.symbol}</td>
                      <td className="py-2 pl-4 text-left hidden lg:table-cell">{holding.name}</td>
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
                      <td className="pr-4 text-right hidden lg:table-cell">${round(holding.value, 2)}</td>
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
              {!isError && !isLoading ? <PortfolioFooter holdings={populatedHoldings} availableCoins={availableCoins} /> : null}
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
