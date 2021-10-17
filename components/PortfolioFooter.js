import { useState, useRef } from 'react';
import { useSWRConfig } from 'swr';
import CoinSearch from './CoinSearch';

export default function PortfolioFooter({ holdings, availableCoins, handleModal }) {
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
      await fetch('/api/holdings', {
        method: 'POST',
        body: JSON.stringify({ symbol, name, amount }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      inputRef.current.value = '';
      document.querySelector('.clear-icon').click();
      setLoading(false);
      mutate('/api/holdings');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      {adding && (
        <form className="flex w-3/4 -m-1.5" onSubmit={handleSubmit}>
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
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 rounded focus:outline-none focus:shadow-outline uppercase text-xs tracking-wider inline-flex items-center"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
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
          <>
            <button className="mr-4 rounded inline-flex items-center hover:text-blue-400" onClick={() => setAdding(true)}>
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"
                ></path>
              </svg>
              Add
            </button>
            <button className="rounded inline-flex items-center hover:text-blue-400" onClick={() => handleModal('holdings')}>
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  fill="currentColor"
                  d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
                ></path>
              </svg>
              Edit
            </button>
          </>
        ) : (
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 -m-1 rounded focus:outline-none focus:shadow-outline uppercase text-sm tracking-wider"
            onClick={() => setAdding(true)}
          >
            Add your first coin
          </button>
        ))}
    </>
  );
}
