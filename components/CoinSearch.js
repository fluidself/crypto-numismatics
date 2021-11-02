import ReactSearchAutocomplete from './react-search-autocomplete/ReactSearchAutocomplete';

export default function CoinSearch({ availableCoins = [] }) {
  const formatResult = item => `${item.name} (${item.symbol})`;

  return (
    <div className="w-5/6">
      <ReactSearchAutocomplete
        items={availableCoins}
        fuseOptions={{ keys: ['name', 'symbol'], shouldSort: false }}
        placeholder="Asset"
        formatResult={formatResult}
        autoFocus
      />
    </div>
  );
}
