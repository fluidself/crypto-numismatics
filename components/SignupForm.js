import { useState } from 'react';
// import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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
  const [formInput, updateFormInput] = useState({ username: '', password: '', confirmPassword: '' });
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    const { username, password } = formInput;

    try {
      const result = await createUser(email, password);
      console.log(result);
      // automatically log in here?
      handleModal('');
      console.log('redirect to dashboard here');
      // router.replace('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    // <div className="w-full max-w-xs mx-auto">
    <form className="px-2 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="************"
          value={formInput.password}
          onChange={e => updateFormInput({ ...formInput, password: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
          Confirm Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="confirm-password"
          type="password"
          placeholder="************"
          value={formInput.confirmPassword}
          onChange={e => updateFormInput({ ...formInput, confirmPassword: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase text-sm tracking-wider"
          type="submit"
        >
          Log In
        </button>
      </div>
    </form>

    // </div>
  );
}
