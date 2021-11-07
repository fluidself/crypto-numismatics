import useSWR from 'swr';

const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function useDashboardData() {
  const { data: currencies, error: currenciesError } = useSWR(
    `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&convert=USD&status=active`,
    fetcher,
  );
  const { data: holdings, error: holdingsError } = useSWR('/api/holdings', fetcher);
  let isError = false;
  let availableCoins;
  let populatedHoldings;
  let totals;

  if (holdings?.holdings && currencies?.length) {
    const partialCurrencies = currencies.slice(0, 1500);
    populatedHoldings = getPopulatedHoldings(holdings.holdings, partialCurrencies);
    totals = getTotals(populatedHoldings, partialCurrencies);
    populatedHoldings.map(holding => (holding.allocation = (100 / totals.total) * holding.value));
    availableCoins = partialCurrencies.map(element => ({ name: element.name, symbol: element.symbol }));
  }

  if (currenciesError) {
    isError = { type: 'currencies', error: currenciesError };
  } else if (holdingsError) {
    isError = { type: 'holdings', ...holdingsError };
  }

  return {
    availableCoins,
    populatedHoldings,
    totals,
    isLoading: !isError && !availableCoins && !populatedHoldings,
    isError,
  };
}

function getPopulatedHoldings(holdings, prices) {
  const populatedHoldings = holdings.map(holding => {
    const tickerObj = prices.filter(element => element.symbol === holding.symbol)[0];

    return {
      id: holding._id,
      symbol: holding.symbol,
      name: holding.name,
      amount: holding.amount,
      price: parseFloat(tickerObj.price),
      value: holding.amount * parseFloat(tickerObj.price),
      percent_change_24h: (parseFloat(tickerObj['1d'].price_change_pct) * 100).toFixed(2),
      percent_change_7d: (parseFloat(tickerObj['7d'].price_change_pct) * 100).toFixed(2),
      percent_change_30d: (parseFloat(tickerObj['30d'].price_change_pct) * 100).toFixed(2),
      percent_change_365d: (parseFloat(tickerObj['365d'].price_change_pct) * 100).toFixed(2),
    };
  });

  return populatedHoldings.sort((a, b) => b.value - a.value);
}

function getTotals(populatedHoldings, prices) {
  // calculate aggregate portfolio value and performance
  const total = populatedHoldings.reduce((sum, holding) => sum + holding.value, 0);
  const total24HrsAgo = populatedHoldings.reduce(
    (sum, holding) => sum + getPastValue(holding.value, holding.percent_change_24h),
    0,
  );
  const change24Hrs = total - total24HrsAgo;
  const change24HrsPct = 100 * (total / total24HrsAgo - 1);
  const total7DaysAgo = populatedHoldings.reduce(
    (sum, holding) => sum + getPastValue(holding.value, holding.percent_change_7d),
    0,
  );
  const change7Days = total - total7DaysAgo;
  const change7DaysPct = 100 * (total / total7DaysAgo - 1);
  const total30DaysAgo = populatedHoldings.reduce(
    (sum, holding) => sum + getPastValue(holding.value, holding.percent_change_30d),
    0,
  );
  const change30Days = total - total30DaysAgo;
  const change30DaysPct = 100 * (total / total30DaysAgo - 1);
  const total365DaysAgo = populatedHoldings.reduce(
    (sum, holding) => sum + getPastValue(holding.value, holding.percent_change_365d),
    0,
  );
  const change365Days = total - total365DaysAgo;
  const change365DaysPct = 100 * (total / total365DaysAgo - 1);

  const btcPrice = prices.find(element => element.symbol === 'BTC').price;
  const totalBTC = total / btcPrice;

  return {
    total: total,
    totalBTC: round(totalBTC, 3),
    change24Hrs: round(change24Hrs),
    change24HrsPct: change24HrsPct.toFixed(2),
    change7Days: round(change7Days),
    change7DaysPct: change7DaysPct.toFixed(2),
    change30Days: round(change30Days),
    change30DaysPct: change30DaysPct.toFixed(2),
    change365Days: round(change365Days),
    change365DaysPct: change365DaysPct.toFixed(2),
  };
}

const getPastValue = (value, pctChange) => value / (1 + pctChange / 100);

export const round = (value, decimals = 3) => {
  // rounds input to selected number of decimals and applies a comma thousands-separator to large values
  if (Math.abs(value) >= 1) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
      .toFixed(decimals)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return value.toFixed(5).toString();
  }
};

export const deleteHolding = holdingId =>
  fetch(`/api/holdings/${holdingId}`, {
    method: 'DELETE',
  });

export const updateHolding = (holdingId, amount) =>
  fetch(`/api/holdings/${holdingId}`, {
    method: 'PUT',
    body: JSON.stringify({ id: holdingId, amount }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    if (immediate && !timeout) func.apply(context, args);
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
