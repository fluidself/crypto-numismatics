import { useState } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import SpinnerIcon from './icons/SpinnerIcon';

async function createUser(username, password, passwordconfirm) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, passwordconfirm }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

export default function SignupForm({ handleModal }) {
  const [formInput, updateFormInput] = useState({ username: '', password: '', passwordconfirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const { username, password, passwordconfirm } = formInput;

    try {
      await createUser(username, password, passwordconfirm);
      const loginResult = await signIn('credentials', { redirect: false, username, password });

      if (!loginResult.error) {
        setLoading(false);
        handleModal('');
        router.replace('/dashboard');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <form className="px-2 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          required
          autoFocus
          placeholder="Username"
          value={formInput.username}
          onChange={e => updateFormInput({ ...formInput, username: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          required
          placeholder="************"
          value={formInput.password}
          onChange={e => updateFormInput({ ...formInput, password: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordconfirm">
          Confirm Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
          id="passwordconfirm"
          type="password"
          required
          placeholder="************"
          value={formInput.passwordconfirm}
          onChange={e => updateFormInput({ ...formInput, passwordconfirm: e.target.value })}
        />
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded focus:shadow-outline uppercase text-sm tracking-wider inline-flex items-center"
          type="submit"
          disabled={loading ? true : false}
        >
          {loading && <SpinnerIcon />}
          {loading ? 'Creating' : 'Create account'}
        </button>
      </div>
    </form>
  );
}
