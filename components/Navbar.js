import { useSession, signOut } from 'next-auth/client';
import LoginIcon from './icons/LoginIcon';
import SignupIcon from './icons/SignupIcon';
import LogoutIcon from './icons/LogoutIcon';

export default function Navbar(props) {
  const [session, loading] = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <div className="bg-gray-900">
      <header className="flex items-center justify-between py-3 text-white container mx-auto px-4 lg:px-0">
        Crypto Numismatics
        <div>
          {!session && !loading && (
            <>
              <button
                className="mr-4 rounded inline-flex items-center hover:text-blue-400"
                onClick={() => props.handleModal('login')}
              >
                <LoginIcon />
                Log in
              </button>
              <button
                className="rounded inline-flex items-center hover:text-blue-400"
                onClick={() => props.handleModal('signup')}
              >
                <SignupIcon />
                Sign up
              </button>
            </>
          )}
          {session && (
            <div className="items-center flex">
              <span>{session.user.name}</span>
              <button className="rounded inline-flex items-center hover:text-blue-400 ml-4" onClick={logoutHandler}>
                <LogoutIcon />
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
