import { useState } from 'react';
import { useSWRConfig } from 'swr';
import SpinnerIcon from './icons/SpinnerIcon';
import TrashIcon from './icons/TrashIcon';

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
        <SpinnerIcon />
      ) : (
        <button className="flex hover:text-blue-400" onClick={handleDeleteHolding}>
          <TrashIcon />
        </button>
      )}
    </>
  );
}
