import { useState, useRef } from 'react';
import { useSWRConfig } from 'swr';
import Search from './Search';
import AddIcon from './icons/AddIcon';

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
        <form className="flex w-full lg:w-4/5 lg:-m-2" onSubmit={handleSubmit}>
          <div className="w-4/5">
            <Search availableCoins={availableCoins} />
          </div>
          <input
            className="input input-sm lg:input-md input-bordered mx-2"
            type="number"
            required
            min="0"
            step="any"
            placeholder="Amount"
            ref={inputRef}
          />
          <div className="w-3/4 flex lg:ml-2">
            <button
              className={`btn btn-sm lg:btn-md btn-primary ${loading && 'loading'}`}
              type="submit"
              disabled={loading ? true : false}
            >
              Add <span className="hidden lg:inline">&nbsp;holding</span>
            </button>
            <button className="btn btn-sm lg:btn-md btn-outline ml-1 lg:ml-2" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {!adding &&
        (holdings.length ? (
          <button className="btn btn-ghost btn-sm inline-flex items-center" onClick={() => setAdding(true)}>
            <AddIcon />
            Add Holding
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            Add your first coin
          </button>
        ))}
    </>
  );
}
