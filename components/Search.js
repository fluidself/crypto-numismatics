import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import SearchResults from './SearchResults';
import { debounce } from '../lib/utils';

const DEFAULT_INPUT_DEBOUNCE = 200;
const MAX_RESULTS = 10;
const FUSE_OPTIONS = {
  shouldSort: false,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name', 'symbol'],
};

export default function Search(props) {
  const { availableCoins: items, resultStringKeyName, inputSearchString } = props;

  const fuse = new Fuse(items, FUSE_OPTIONS);
  fuse.setCollection(items);

  const [searchString, setSearchString] = useState(inputSearchString);
  const [results, setResults] = useState([]);
  const [keyLocation, setKeyLocation] = useState(null);

  const callOnSearch = keyword => {
    let newResults = [];
    if (keyword?.length > 0) {
      newResults = fuseResults(keyword);
      setResults(newResults);
    } else {
      setResults(newResults);
    }

    setKeyLocation(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnSearch = React.useCallback(
    debounce(keyword => callOnSearch(keyword), DEFAULT_INPUT_DEBOUNCE),
    [items],
  );

  useEffect(() => {
    setSearchString(inputSearchString);
  }, [inputSearchString]);

  useEffect(() => {
    searchString?.length > 0 && results?.length > 0 && setResults(fuseResults(searchString));
    setKeyLocation(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleSelect = result => {
    setSearchString(`${result.name} (${result.symbol})`);
  };

  const handleKeyDown = e => {
    if (e.keyCode === 38 && results?.length > 0) {
      e.preventDefault();
      if (keyLocation === null || keyLocation === 0) {
        setKeyLocation(results.length - 1);
        setSearchString(results[results.length - 1][resultStringKeyName]);
      } else if (keyLocation !== null) {
        handleSelect(results[results.length - 1]);
        setKeyLocation(keyLocation - 1);
        handleSelect(results[keyLocation - 1]);
      }
    } else if (e.keyCode === 40 && results?.length > 0) {
      e.preventDefault();
      if (keyLocation == null || keyLocation === results.length - 1) {
        setKeyLocation(0);
        handleSelect(results[0]);
      } else if (keyLocation < results.length - 1) {
        setKeyLocation(keyLocation + 1);
        handleSelect(results[keyLocation + 1]);
      }
    } else if (e.keyCode === 13 && results?.length > 0) {
      handleSelect(results[keyLocation]);
    }
  };

  const fuseResults = keyword =>
    fuse
      .search(keyword, { limit: MAX_RESULTS })
      .map(result => ({ ...result.item }))
      .slice(0, MAX_RESULTS);

  const handleSetSearchString = ({ target }) => {
    const keyword = target.value;
    setSearchString(keyword);
    handleOnSearch(keyword);
  };

  return (
    <div className="relative">
      <div className="absolute flex flex-col w-full pl-2">
        <input
          type="search"
          className="input input-bordered w-full"
          spellCheck={false}
          onBlur={() => setResults([])}
          value={searchString}
          onChange={handleSetSearchString}
          onKeyDown={handleKeyDown}
          placeholder="Asset"
          autoFocus
        />
        <SearchResults
          results={results}
          setSearchString={setSearchString}
          maxResults={MAX_RESULTS}
          resultStringKeyName={resultStringKeyName}
          keyLocation={keyLocation}
        />
      </div>
    </div>
  );
}
