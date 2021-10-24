import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default function Results(props) {
  const { results, setSearchString, maxResults, resultStringKeyName, onHover, formatResult, keyLocation } = props;

  const handleClick = result => {
    setSearchString(`${result.name} (${result.symbol})`);
  };

  if (results?.length <= 0) {
    return null;
  }

  return (
    <StyledResults>
      <div className="line" />
      <ul>
        {results.slice(0, maxResults).map((result, index) => {
          return (
            <li
              onMouseEnter={() => onHover(result)}
              data-test="result"
              key={`rsa-result-${result.symbol}`}
              onMouseDown={() => handleClick(result)}
              onClick={() => handleClick(result)}
              className={index === keyLocation ? 'keySelected' : ''}
            >
              <div className="ellipsis" title={result[resultStringKeyName]}>
                {formatResult(result)}
              </div>
            </li>
          );
        })}
      </ul>
    </StyledResults>
  );
}

Results.defaultProps = {
  results: [],
  setDisplayString: () => {},
  resultStringKeyName: 'name',
  formatResult: val => val,
};

Results.propTypes = {
  results: PropTypes.array,
  onClick: PropTypes.func,
  setSearchString: PropTypes.func,
  maxResults: PropTypes.number,
  resultStringKeyName: PropTypes.string,
  formatResult: PropTypes.func,
};

const StyledResults = styled.div`
  > div.line {
    border-top-color: ${props => props.theme.lineColor};
    border-top-style: solid;
    border-top-width: 1px;
    margin-bottom: 0px;
    margin-left: 14px;
    margin-right: 20px;
    margin-top: 0px;
    padding-bottom: 4px;
  }
  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0px 0 16px 0;
    max-height: ${props => props.theme.maxHeight};
    > li {
      display: flex;
      align-items: center;
      padding: 4px 0 4px 0;
      &:hover {
        background-color: ${props => props.theme.hoverBackgroundColor};
        cursor: default;
      }
      > div {
        margin-left: 13px;
      }
    }
  }
  .keySelected {
    background-color: ${props => props.theme.hoverBackgroundColor};
    cursor: default;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
