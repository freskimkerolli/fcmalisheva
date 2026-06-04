import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>FC Malisheva | Superliga & Conference League</title>
        <meta
          name="description"
          content="Website zyrtar i FC Malisheva, skuadrës së Superligës së Kosovës dhe Conference League."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/MalishevaLogo.png" />
      </Head>
      <Header />
      <main className="page-container">{children}</main>
      <Footer />
    </>
  );
}
