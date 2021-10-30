import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ type, children, handleModal }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const modalWrapperRef = useRef();

  useEffect(() => {
    setIsBrowser(true);
    const backdropHandler = e => {
      if (modalWrapperRef?.current?.contains(e.target)) {
        handleModal('');
      }
    };
    window.addEventListener('click', backdropHandler);

    return () => window.removeEventListener('click', backdropHandler);
  }, [handleModal]);

  const HEADINGS = {
    login: 'Log in',
    signup: 'Create your account',
    holdings: 'Edit holdings',
  };

  if (!isBrowser) return null;

  return ReactDOM.createPortal(
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          ref={modalWrapperRef}
        ></div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom border bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 py-2 bg-gray-900 text-white flex justify-between">
            {HEADINGS[type]}
            <button onClick={() => handleModal('')}>&times;</button>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>
        </div>
      </div>
    </div>,
    document.getElementById('modal'),
  );
}
