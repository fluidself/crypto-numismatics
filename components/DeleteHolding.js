import { useState } from 'react';
import { useSWRConfig } from 'swr';

export default function DeleteHolding({ holdingId }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  async function handleDeleteHolding() {
    setLoading(true);
    // TODO: does this work + do I want it?
    // update the local data immediately, but disable the revalidation
    // const newHoldings = holdings.holdings.filter(holding => holding._id !== holdingId);
    // mutate('/api/holdings', { holdings: newHoldings }, false);
    try {
      await fetch(`/api/holdings/${holdingId}`, {
        method: 'DELETE',
      });

      // trigger a revalidation (refetch) to make sure our local data is correct
      mutate('/api/holdings');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
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
      ) : (
        <button className="flex hover:text-blue-400" onClick={handleDeleteHolding}>
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              fill="currentColor"
              d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"
            ></path>
          </svg>
        </button>
      )}
    </>
  );
}
