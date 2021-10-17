import { useState } from 'react';
import { useSWRConfig } from 'swr';

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

export default function EditHoldingsForm({ handleModal, holdings }) {
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
      setLoading(false);
      mutate('/api/holdings');
      handleModal('');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
          {loading ? 'Updating' : 'Update'}
        </button>
        <button className="ml-2 text-xs tracking-wider border rounded uppercase px-6 py-2" onClick={() => handleModal('')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
