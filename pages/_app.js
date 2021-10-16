import { Provider } from 'next-auth/client';
import Head from 'next/head';

import '../styles/globals.css';
import '../styles/css-loader.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Crypto Numismatics</title>
        <meta name="description" content="Cryptocurrency portfolio tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
