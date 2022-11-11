import Head from 'next/head';
import styles from '@/styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Swiss brain observatory</title>
      </Head>

      <main className={styles.main}>
        <h1>Welcome to the Swiss Brain Observatory</h1>
      </main>
    </div>
  );
}
