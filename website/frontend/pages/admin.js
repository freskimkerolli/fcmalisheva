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
        <div className="header-spacer">
          <button onClick={switchLocale} className="lang-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {locale === 'en' ? (
              <><img src="/assets/logos/Al.jpg" alt="SQ" style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} /><span>SQ</span></>
            ) : (
              <><img src="/assets/logos/Gb.jpg" alt="EN" style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} /><span>EN</span></>
            )}
          </button>
        </div>
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
