import ReactSearchAutocomplete from './react-search-autocomplete/ReactSearchAutocomplete';

export default function CoinSearch({ availableCoins = [] }) {
  const formatResult = item => `${item.name} (${item.symbol})`;

  return (
    <div className="w-5/6">
      <ReactSearchAutocomplete
        items={availableCoins}
        fuseOptions={{ keys: ['name', 'symbol'], shouldSort: false }}
        placeholder="Search coins..."
        formatResult={formatResult}
        autoFocus
        styling={{
          height: '36px',
          borderRadius: '4px',
          boxShadow: 'none',
          fontSize: '16px',
          clearIconMargin: '3px 8px 0 0',
        }}
      />
    </div>
  );
}
