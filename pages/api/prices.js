import { getSession } from 'next-auth/client';

const MOCK_DATA = [
  {
    id: 'BTC',
    currency: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '50000',
    '1d': {
      volume: '38963575228.42',
      price_change: '-505.52175075',
      price_change_pct: '-0.0091',
      volume_change: '-11903648419.13',
      volume_change_pct: '-0.2340',
      market_cap_change: '-9480479516.13',
      market_cap_change_pct: '-0.0091',
    },
    '7d': {
      volume: '307087412352.60',
      price_change: '7126.39253079',
      price_change_pct: '0.1494',
      volume_change: '4018483433.55',
      volume_change_pct: '0.0133',
      market_cap_change: '134562182272.54',
      market_cap_change_pct: '0.1498',
    },
    '30d': {
      volume: '1394828906797.79',
      price_change: '8347.51117500',
      price_change_pct: '0.1796',
      volume_change: '-122229926886.58',
      volume_change_pct: '-0.0806',
      market_cap_change: '158547700189.47',
      market_cap_change_pct: '0.1813',
    },
    '365d': {
      volume: '21133649933992.32',
      price_change: '43450.28907672',
      price_change_pct: '3.8189',
      volume_change: '10467340072426.06',
      volume_change_pct: '0.9813',
      market_cap_change: '822262245877.58',
      market_cap_change_pct: '3.9039',
    },
    ytd: {
      volume: '18406049763907.03',
      price_change: '21948.67227856',
      price_change_pct: '0.6676',
      volume_change: '10069344393753.37',
      volume_change_pct: '1.2078',
      market_cap_change: '421761013408.47',
      market_cap_change_pct: '0.6901',
    },
  },
  {
    id: 'ETH',
    currency: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '3600',
    '1d': {
      volume: '23204238069.39',
      price_change: '-45.37195329',
      price_change_pct: '-0.0125',
      volume_change: '-7201585833.16',
      volume_change_pct: '-0.2368',
      market_cap_change: '-5299472348.59',
      market_cap_change_pct: '-0.0124',
    },
    '7d': {
      volume: '192215923090.24',
      price_change: '195.49221174',
      price_change_pct: '0.0577',
      volume_change: '-34812216261.70',
      volume_change_pct: '-0.1533',
      market_cap_change: '23355872874.49',
      market_cap_change_pct: '0.0586',
    },
    '30d': {
      volume: '1020513020681.30',
      price_change: '148.91039201',
      price_change_pct: '0.0434',
      volume_change: '-183943121446.32',
      volume_change_pct: '-0.1527',
      market_cap_change: '18934025168.36',
      market_cap_change_pct: '0.0470',
    },
    '365d': {
      volume: '14988177836102.79',
      price_change: '3206.68046142',
      price_change_pct: '8.5640',
      volume_change: '10256090824518.02',
      volume_change_pct: '2.1674',
      market_cap_change: '379763266086.43',
      market_cap_change_pct: '8.9808',
    },
    ytd: {
      volume: '13667543173644.13',
      price_change: '2607.47823893',
      price_change_pct: '2.6781',
      volume_change: '9620728567146.38',
      volume_change_pct: '2.3774',
      market_cap_change: '310991142347.09',
      market_cap_change_pct: '2.8003',
    },
  },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // TODO: make actual API request to get data here
  // https://h420wm7t6e.execute-api.us-east-1.amazonaws.com/dev/tickers?currency=USD

  res.status(200).json({ data: MOCK_DATA });
}
