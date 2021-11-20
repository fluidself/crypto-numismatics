import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/client';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import FullPageSpinner from '../components/FullPageSpinner';

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

    try {
      const username = 'demo';
      const password = 'password';
      const result = await signIn('credentials', { redirect: false, username, password });

      if (!result.error) {
        setProcessingDemo(false);
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log(error.message);
      setProcessingDemo(false);
    }
  }

  return (
    <div className="h-screen bg-base-100">
      <Navbar handleModal={setModal} isLandingPage={true} />
      {loading ? (
        <FullPageSpinner />
      ) : (
        <div className="container mx-auto text-center mt-48 font-light">
          <h1 className="text-4xl mb-2 text-primary">All your cryptocurrencies in one place</h1>
          <p className="mb-2">
            Crypto Numismatics provides a simple, user-friendly overview of your digital currency holdings. Signing up is free and
            anonymous.
          </p>
          <a href="https://nomics.com" target="_blank" rel="noreferrer" className="link hover:text-primary">
            {'Crypto Market Cap & Pricing Data Provided By Nomics.'}
          </a>
          <div className="mt-12 flex flex-col items-center">
            <button className="w-48 mb-4 btn btn-primary" onClick={() => setModal('signup')}>
              Create account
            </button>
            <button
              className={`w-48 py-2 btn btn-outline ${processingDemo && 'loading'}`}
              onClick={handleDemo}
              disabled={processingDemo ? true : false}
            >
              View demo
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
