import { useSession, signOut } from 'next-auth/client';
import CopyleftIcon from './icons/CopyleftIcon';
import LoginIcon from './icons/LoginIcon';
import SignupIcon from './icons/SignupIcon';
import LogoutIcon from './icons/LogoutIcon';

export default function Navbar({ handleModal }) {
  const [session, loading] = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <header className="navbar text-neutral-content mx-auto container">
      <div className="flex-1 ">
        <CopyleftIcon />
        <p className="hidden lg:block">Crypto Numismatics</p>
      </div>
      <div>
        {!session && !loading && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => handleModal('login')}>
              <LoginIcon />
              Log in
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => handleModal('signup')}>
              <SignupIcon />
              Sign up
            </button>
          </>
        )}
        {session && (
          <div className="items-center flex">
            <span className="truncate mr-2">{session.user.name}</span>
            <a className="btn btn-ghost btn-sm" onClick={logoutHandler}>
              <LogoutIcon />
              Log out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
