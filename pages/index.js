import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/client';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import FullPageSpinner from '../components/FullPageSpinner';
import SpinnerIcon from '../components/icons/SpinnerIcon';

export default function LandingPage() {
  const [modal, setModal] = useState('');
  const [processingDemo, setProcessingDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  async function handleDemo() {
    setProcessingDemo(true);

    const username = 'demo';
    const password = 'password';
    const result = await signIn('credentials', { redirect: false, username, password });

    if (!result.error) {
      setProcessingDemo(false);
      router.replace('/dashboard');
    }
  }

  return (
    <div className="h-screen bg-black bg-hero-pattern">
      <Navbar handleModal={setModal} isLandingPage={true} />
      {loading ? (
        <FullPageSpinner />
      ) : (
        <div className="text-white container mx-auto text-center mt-48">
          <h1 className="text-4xl mb-2 font-light">All your cryptocurrencies in one place</h1>
          <p className="mb-2">
            Crypto Numismatics provides a simple, user-friendly overview of your digital currency holdings. Signing up is free and
            anonymous.
          </p>
          <a href="https://nomics.com" target="_blank" className="underline hover:text-blue-400">
            {'Crypto Market Cap & Pricing Data Provided By Nomics.'}
          </a>
          <div className="mt-12 flex flex-col items-center">
            <button
              className="w-48 mb-4 py-2 text-sm tracking-wider rounded-sm uppercase bg-blue-400 hover:bg-blue-500"
              onClick={() => setModal('signup')}
            >
              Create account
            </button>
            <button
              className=" hover:text-gray-300 hover:border-gray-300 border rounded-sm w-48 py-2 px-4 uppercase text-sm tracking-wider inline-flex items-center justify-center"
              onClick={handleDemo}
              disabled={processingDemo ? true : false}
            >
              {processingDemo && <SpinnerIcon />}
              {processingDemo ? 'Logging in' : 'View demo'}
            </button>
          </div>
          {modal && (
            <Modal type={modal} handleModal={setModal}>
              {modal === 'login' && <LoginForm handleModal={setModal} />}
              {modal === 'signup' && <SignupForm handleModal={setModal} />}
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
