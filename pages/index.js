import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function LandingPage() {
  const [modal, setModal] = useState('');
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session]);

  // TODO: spinner here?

  return (
    <div className="h-screen bg-gray-800">
      <Navbar handleModal={setModal} />
      <div className="text-white container mx-auto text-center mt-48">
        <h1 className="text-4xl mb-2 font-light">All your cryptocurrencies in one place</h1>
        <p>
          Crypto Numismatics provides a simple, user-friendly overview of your digital currency holdings. Signing up is free and
          anonymous.
        </p>
        <div className="mt-12 flex flex-col items-center">
          <button
            className="w-48 mb-4 py-2 text-sm tracking-wider rounded-sm uppercase bg-blue-400 hover:bg-blue-500"
            onClick={() => setModal('signup')}
          >
            Create account
          </button>
          <button className="w-48 mb-4 py-2 text-sm tracking-wider border rounded-sm uppercase">View demo</button>
        </div>
        {modal && (
          <Modal type={modal} handleModal={setModal}>
            {modal === 'login' && <LoginForm handleModal={setModal} />}
            {modal === 'signup' && <SignupForm handleModal={setModal} />}
          </Modal>
        )}
      </div>
    </div>
  );
}
