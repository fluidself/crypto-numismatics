import { useState } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import SpinnerIcon from './icons/SpinnerIcon';

export default function LoginForm({ handleModal }) {
  const [formInput, updateFormInput] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const { username, password } = formInput;
    const result = await signIn('credentials', { redirect: false, username, password });

    if (!result.error) {
      setLoading(false);
      handleModal('');
      router.replace('/dashboard');
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
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          required
          placeholder="************"
          value={formInput.password}
          onChange={e => updateFormInput({ ...formInput, password: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded focus:shadow-outline uppercase text-sm tracking-wider inline-flex items-center"
          type="submit"
          disabled={loading ? true : false}
        >
          {loading && <SpinnerIcon />}
          {loading ? 'Logging in' : 'Log in'}
        </button>
      </div>
    </form>
  );
}
