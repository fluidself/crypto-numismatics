import React from 'react';

export default function SearchResults(props) {
  const { results, setSearchString, maxResults, resultStringKeyName, keyLocation } = props;

  const formatResult = item => `${item.name} (${item.symbol})`;

  const handleClick = result => {
    setSearchString(`${result.name} (${result.symbol})`);
  };

  if (results?.length <= 0) {
    return null;
  }

  return (
    <div className="border z-10 bg-base-200">
      <ul>
        {results.slice(0, maxResults).map((result, index) => {
          return (
            <li
              data-test="result"
              key={`result-${index}-${result.symbol}`}
              onMouseDown={() => handleClick(result)}
              onClick={() => handleClick(result)}
              className={`pl-2 flex items-center py-1 hover:bg-primary cursor-pointer ${index === keyLocation && 'bg-primary'}`}
            >
              <div className="truncate">{formatResult(result)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
