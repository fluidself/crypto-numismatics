import Head from 'next/head';

import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import Modal from '../components/Modal';

export default function Home() {
  return (
    <div className="h-screen bg-gray-800">
      <Navbar />
      <div className="text-white container mx-auto text-center mt-48">
        <h1 className="text-4xl mb-2 font-light">All your cryptocurrencies in one place</h1>
        <p>
          Crypto Numismatics provides a simple, user-friendly overview of your digital currency holdings. Signing up is free and
          anonymous.
        </p>
        <div className="mt-12 flex flex-col items-center">
          <button className="w-48 mb-4 py-2 text-sm tracking-wider rounded-sm bg-blue-400 uppercase">Create account</button>
          <button className="w-48 mb-4 py-2 text-sm tracking-wider border rounded-sm uppercase">View demo</button>
        </div>
        <Modal>
          <LoginForm />
        </Modal>
      </div>
    </div>
  );
}
