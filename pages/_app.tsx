import Layout from '../components/Layout'
import type { AppProps } from 'next/app'
import SSRProvider from 'react-bootstrap/SSRProvider'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'maplibre-gl/dist/maplibre-gl.css'
import '../styles/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Layout opengraph={pageProps.opengraph}>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>)
}

export default MyApp
