import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';

const AdminApp = dynamic(() => import('../components/AdminApp'), { ssr: false });

function AdminHeader() {
  const { locale, switchLocale } = useTranslation();
  return (
    <header className="site-header">
      <div className="header-inner" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link href="/" className="brand">
          <img src="/assets/MalishevaLogo.png" alt="FC Malisheva" className="logo" />
          <span className="site-title">FC Malisheva</span>
        </Link>
        <div className="header-spacer" id="admin-header-actions" style={{ gap: '8px' }} />
      </div>
    </header>
  );
}

AdminPage.getLayout = (page) => (
  <>
    <Head>
      <title>FC Malisheva — Admin</title>
      <link rel="icon" type="image/png" href="/assets/MalishevaLogo.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <AdminHeader />
    <main>{page}</main>
    <Footer />
  </>
);

export default function AdminPage() {
  return <AdminApp />;
}
