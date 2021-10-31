import { useState, useRef } from 'react';
import { useSWRConfig } from 'swr';
import CoinSearch from './CoinSearch';
import AddIcon from './icons/AddIcon';
import SpinnerIcon from './icons/SpinnerIcon';

export default function PortfolioFooter({ holdings = [], availableCoins }) {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const inputRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const regex = /\(([^)]+)\)/;
    const symbol = regex.exec(event.target[0].value)[1];
    const name = event.target[0].value.split('(')[0].trim();
    const amount = event.target[1].value;

    try {
      const optimisticNewHoldings = holdings;
      const existingHolding = optimisticNewHoldings.find(holding => holding.symbol === symbol);

      if (existingHolding) {
        existingHolding.amount += Number(amount);
      } else {
        optimisticNewHoldings.push({ symbol, name, amount });
      }

      setTimeout(() => {
        mutate('/api/holdings', { holdings: optimisticNewHoldings }, false);
        inputRef.current.value = '';
        document.querySelector('.clear-icon').click();
        setLoading(false);
      }, 500);

      await fetch('/api/holdings', {
        method: 'POST',
        body: JSON.stringify({ symbol, name, amount }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      mutate('/api/holdings');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      {adding && (
        <form className="flex w-full lg:w-4/5 -m-1.5" onSubmit={handleSubmit}>
          <CoinSearch availableCoins={availableCoins} />
          <input
            className="shadow appearance-none border rounded w-3/4 py-2 px-3 ml-2 mr-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            required
            min="0"
            step="any"
            placeholder="Amount"
            ref={inputRef}
          />
          <div className="w-3/4 flex">
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 rounded focus:shadow-outline uppercase text-xs tracking-wider inline-flex items-center"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading && <SpinnerIcon />}
              {loading ? 'Adding' : 'Add coin'}
            </button>
            <button className="ml-2 text-xs tracking-wider border rounded uppercase px-6" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {!adding &&
        (holdings.length ? (
          <button className="rounded inline-flex items-center hover:text-blue-400" onClick={() => setAdding(true)}>
            <AddIcon />
            Add Holding
          </button>
        ) : (
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 -m-1 rounded focus:shadow-outline uppercase text-sm tracking-wider"
            onClick={() => setAdding(true)}
          >
            Add your first coin
          </button>
        ))}
    </>
  );
}
