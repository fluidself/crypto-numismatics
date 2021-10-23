import { useState, useEffect } from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import CheckIcon from './icons/CheckIcon';

export default function EditableCell({ amount: initialValue, holdingId, editHolding, processing }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = event => {
    setValue(event.target.value);
  };

  const onClick = () => {
    editHolding(holdingId, value);
  };

  const onKeyUp = event => {
    if (event.keyCode === 13) {
      editHolding(holdingId, value);
    }
    return;
  };

  return (
    <>
      {processing ? (
        <div className="flex justify-end">
          <SpinnerIcon />
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <input
            className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 bg-gray-300 leading-tight focus:shadow-outline mr-2"
            type="number"
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            autoFocus
          />
          <button className="flex hover:text-blue-400" onClick={onClick}>
            <CheckIcon />
          </button>
        </div>
      )}
    </>
  );
}
