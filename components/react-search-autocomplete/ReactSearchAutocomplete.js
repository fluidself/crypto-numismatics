import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { defaultTheme, defaultFuseOptions } from './config';
import Results from './Results';
import SearchInput from './SearchInput';
import { ThemeProvider } from 'styled-components';
import { debounce } from './utils';
import styled from 'styled-components';

export const DEFAULT_INPUT_DEBOUNCE = 200;
export const MAX_RESULTS = 10;

export default function ReactSearchAutocomplete(props) {
  const {
    items,
    fuseOptions,
    inputDebounce,
    onSearch,
    onHover,
    onFocus,
    onClear,
    showIcon,
    showClear,
    maxResults,
    placeholder,
    autoFocus,
    styling,
    resultStringKeyName,
    inputSearchString,
    formatResult,
  } = props;

  const theme = { ...defaultTheme, ...styling };
  const options = { ...defaultFuseOptions, ...fuseOptions };

  const fuse = new Fuse(items, options);
  fuse.setCollection(items);

  const [searchString, setSearchString] = useState(inputSearchString);
  const [results, setResults] = useState();
  const [keyLocation, setKeyLocation] = useState(null);

  const callOnSearch = keyword => {
    let newResults = [];
    if (keyword?.length > 0) {
      newResults = fuseResults(keyword);
      setResults(newResults);
      onSearch(keyword, newResults);
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
      .search(keyword, { limit: maxResults })
      .map(result => ({ ...result.item }))
      .slice(0, maxResults);

  const handleSetSearchString = ({ target }) => {
    const keyword = target.value;
    setSearchString(keyword);
    handleOnSearch(keyword);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledReactSearchAutocomplete>
        <div className="wrapper">
          <SearchInput
            searchString={searchString}
            setSearchString={handleSetSearchString}
            autoFocus={autoFocus}
            onBlur={() => setResults([])}
            onFocus={onFocus}
            onClear={onClear}
            placeholder={placeholder}
            showIcon={showIcon}
            showClear={showClear}
            onKeyDown={handleKeyDown}
          />
          <Results
            results={results}
            onHover={onHover}
            setSearchString={setSearchString}
            showIcon={showIcon}
            maxResults={maxResults}
            resultStringKeyName={resultStringKeyName}
            formatResult={formatResult}
            keyLocation={keyLocation}
          />
        </div>
      </StyledReactSearchAutocomplete>
    </ThemeProvider>
  );
}

ReactSearchAutocomplete.defaultProps = {
  items: [],
  fuseOptions: defaultFuseOptions,
  onSearch: () => {},
  onHover: () => {},
  onSelect: () => {},
  onClear: () => {},
  inputDebounce: DEFAULT_INPUT_DEBOUNCE,
  showIcon: true,
  showClear: true,
  maxResults: MAX_RESULTS,
  placeholder: '',
  autoFocus: false,
  onFocus: () => {},
  styling: {},
  resultStringKeyName: 'name',
  inputSearchString: '',
  formatResult: val => val,
};

ReactSearchAutocomplete.propTypes = {
  items: PropTypes.array,
  fuseOptions: PropTypes.object,
  inputDebounce: PropTypes.number,
  onSearch: PropTypes.func,
  onHover: PropTypes.func,
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  onFocus: PropTypes.func,
  showIcon: PropTypes.bool,
  showClear: PropTypes.bool,
  maxResults: PropTypes.number,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  styling: PropTypes.object,
  resultStringKeyName: PropTypes.string,
  inputSearchString: PropTypes.string,
  formatResult: PropTypes.func,
};

const StyledReactSearchAutocomplete = styled.div`
  position: relative;
  height: ${props => parseInt(props.theme.height) + 2 + 'px'};
  > .wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    border: ${props => props.theme.border};
    border-radius: ${props => props.theme.borderRadius};
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};
    font-size: ${props => props.theme.fontSize};
    font-family: ${props => props.theme.fontFamily};
    z-index: ${props => props.theme.zIndex};
    &:hover {
      box-shadow: ${props => props.theme.boxShadow};
    }
    &:active {
      box-shadow: ${props => props.theme.boxShadow};
    }
    &:focus-within {
      box-shadow: ${props => props.theme.boxShadow};
    }
  }
`;
