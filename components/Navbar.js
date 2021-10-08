import Link from 'next/link';

export default function Navbar({ handleModal }) {
  return (
    <div className="bg-gray-900">
      <header className="flex items-center justify-between py-3 text-white container mx-auto lg:w-1/2 px-4 lg:px-0">
        <Link href="/">
          <a className="hover:text-blue-400">Crypto Numismatics</a>
        </Link>
        <div>
          <button className="mr-4 rounded inline-flex items-center hover:text-blue-400" onClick={() => handleModal('login')}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"
              ></path>
            </svg>
            Log in
          </button>
          <button className="rounded inline-flex items-center hover:text-blue-400" onClick={() => handleModal('signup')}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path
                fill="currentColor"
                d="M224 32c77.32 0 140 62.68 140 140s-62.68 140-140 140S84 249.32 84 172 146.68 32 224 32zm160.373 292.093l-62.399-15.6c-65.557 47.154-145.021 36.631-195.948 0l-62.399 15.6C26.233 333.442 0 367.04 0 405.585V438c0 23.196 18.804 42 42 42h364c23.196 0 42-18.804 42-42v-32.415c0-38.545-26.233-72.143-63.627-81.492zM628 224.889h-68.889V156c0-6.627-5.373-12-12-12h-38.222c-6.627 0-12 5.373-12 12l-.002 68.887-68.887.002c-6.627 0-12 5.373-12 12v38.222c0 6.627 5.373 12 12 12l68.887.002.002 68.887c0 6.627 5.373 12 12 12h38.222c6.627 0 12-5.373 12-12l.002-68.887 68.887-.002c6.627 0 12-5.373 12-12v-38.222c0-6.627-5.373-12-12-12z"
              ></path>
            </svg>
            Sign up
          </button>
        </div>
      </header>
    </div>
  );
}
