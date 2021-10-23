import { useState } from 'react';
import { useSWRConfig } from 'swr';
import SpinnerIcon from './icons/SpinnerIcon';
import TrashIcon from './icons/TrashIcon';

export default function DeleteHolding({ holdings, holdingId }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  async function handleDeleteHolding() {
    setLoading(true);

    try {
      const newHoldings = holdings.filter(holding => holding.id !== holdingId);

      setTimeout(() => {
        mutate('/api/holdings', { holdings: newHoldings }, false);
      }, 500);
      await fetch(`/api/holdings/${holdingId}`, {
        method: 'DELETE',
      });
      mutate('/api/holdings');
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
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
