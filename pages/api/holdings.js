import { getSession } from 'next-auth/client';

const MOCK_HOLDINGS = [
  { id: '5fed8b2792bc314ce585cde6', symbol: 'BTC', name: 'Bitcoin', amount: 0.1534 },
  { id: '5fed8b3192bc314ce585e315', symbol: 'ETH', name: 'Ethereum', amount: 1.8 },
  // { id: '5fed8b3a92bc314ce585f248', symbol: 'LTC', name: 'Litecoin', amount: 0.6 },
];

// https://github.com/thomahau/crypto-numismatics/blob/master/routes/holdings.js

export default async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  if (req.method === 'GET') {
    // TODO: make actual API request to get data here

    res.status(200).json({ holdings: MOCK_HOLDINGS });
  } else if (req.method === 'POST') {
    // see api-routes-project
    return;
  } else if (req.method === 'PUT') {
    // see api-routes-project
    return;
  } else if (req.method === 'DELETE') {
    // see api-routes-project
    return;
  }
}
