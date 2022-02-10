import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

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
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <form className="px-2 pt-4 pb-4 mb-4" onSubmit={handleSubmit}>
      <div className="form-control mb-2">
        <label className="label" htmlFor="username">
          <span className="label-text">Username</span>
        </label>
        <input
          className="input input-bordered"
          id="username"
          type="text"
          required
          autoFocus
          placeholder="Username"
          value={formInput.username}
          onChange={e => updateFormInput({ ...formInput, username: e.target.value })}
        />
      </div>
      <div className="form-control mb-2">
        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          className="input input-bordered"
          id="password"
          type="password"
          required
          placeholder="************"
          value={formInput.password}
          onChange={e => updateFormInput({ ...formInput, password: e.target.value })}
        />
      </div>
      <div className="form-control mb-6">
        <label className="label" htmlFor="passwordconfirm">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          className="input input-bordered"
          id="passwordconfirm"
          type="password"
          required
          placeholder="************"
          value={formInput.passwordconfirm}
          onChange={e => updateFormInput({ ...formInput, passwordconfirm: e.target.value })}
        />
      </div>
      {error && <p className="text-error mb-2">{error}</p>}
      <div className="flex items-center justify-between">
        {/* <button className="btn btn-primary px-6 inline-flex items-center" type="submit" disabled={loading ? true : false}> */}
        <button className={`btn btn-primary px-6 ${loading && 'loading'}`} type="submit" disabled={loading ? true : false}>
          Sign up
        </button>
      </div>
    </form>
  );
}
