const defaultTheme = {
  height: '36px',
  border: '1px solid #dfe1e5',
  borderRadius: '4px',
  backgroundColor: 'white',
  boxShadow: 'none',
  hoverBackgroundColor: '#eee',
  color: '#212121',
  fontSize: '16px',
  fontFamily: 'Arial',
  iconColor: 'grey',
  lineColor: 'rgb(232, 234, 237)',
  placeholderColor: 'grey',
  zIndex: 0,
  clearIconMargin: '3px 8px 0 0',
  searchIconMargin: '0 0 0 16px',
};

const defaultFuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name'],
};

export { defaultTheme, defaultFuseOptions };
