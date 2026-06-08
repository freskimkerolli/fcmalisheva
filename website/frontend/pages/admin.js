import dynamic from 'next/dynamic';
import Head from 'next/head';

const AdminApp = dynamic(() => import('../components/AdminApp'), { ssr: false });

AdminPage.getLayout = (page) => page;

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>FC Malisheva — Admin</title>
        <link rel="icon" type="image/png" href="/assets/MalishevaLogo.png" />
      </Head>
      <AdminApp />
    </>
  );
}