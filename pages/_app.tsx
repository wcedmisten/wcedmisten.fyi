import Layout from '../components/Layout'
import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Layout ogImagePath={pageProps.ogImagePath}>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>)
}

export default MyApp
