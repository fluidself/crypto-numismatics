import { useState } from 'react';
import { useSWRConfig } from 'swr';
import SpinnerIcon from './icons/SpinnerIcon';

function deleteHolding(holdingId) {
  return fetch(`/api/holdings/${holdingId}`, {
    method: 'DELETE',
  });
}

function updateHolding(holdingId, amount) {
  return fetch(`/api/holdings/${holdingId}`, {
    method: 'PUT',
    body: JSON.stringify({ id: holdingId, amount }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default function EditHoldingsForm({ holdings, handleModal }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const updates = [];
    for (let i = 0; i < holdings.length; i++) {
      const inputAmount = Number(event.target[i].value);
      const holdingId = event.target[i].id;

      if (inputAmount !== holdings[i].amount) {
        if (inputAmount === 0) {
          updates.push(deleteHolding(holdingId));
        } else {
          updates.push(updateHolding(holdingId, inputAmount));
        }
      }
    }

    try {
      await Promise.all(updates);
      mutate('/api/holdings');
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    handleModal('');
  }

  return (
    <form className="px-2 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      {holdings.map(holding => (
        <div className="mb-4 flex items-center" key={holding.id}>
          <label className="text-gray-700 text-sm font-bold mb-2 w-1/3" htmlFor={holding.id}>
            {holding.name}
          </label>
          <input
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={holding.id}
            type="number"
            min="0"
            step="any"
            defaultValue={holding.amount}
          />
        </div>
      ))}
      <div className="flex items-center">
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase text-sm tracking-wider flex"
          type="submit"
          disabled={loading ? true : false}
        >
          {loading && <SpinnerIcon />}
          {loading ? 'Updating' : 'Update'}
        </button>
        <button className="ml-2 text-xs tracking-wider border rounded uppercase px-6 py-2" onClick={() => handleModal('')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
