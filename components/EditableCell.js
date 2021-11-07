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
            className="input input-bordered bg-base-200 input-sm w-16"
            type="number"
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            autoFocus
          />
          <button className="flex hover:text-primary" onClick={onClick}>
            <CheckIcon />
          </button>
        </div>
      )}
    </>
  );
}
