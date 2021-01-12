import "../styles/globals.css";
import Layout from "../components/Layout/Layout";
import SocketProvider from "../components/socketStore";

function MyApp({ Component, pageProps }) {
  return (
    <SocketProvider>
      <div>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SocketProvider>
  );
}

export default MyApp;
