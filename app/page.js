

import Head from 'next/head';
import StarField from '../components/StarField';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Space Theme Portfolio</title>
        <meta name="description" content="A space-themed portfolio using Next.js and Three.js" />
      </Head>
      <StarField />
    </div>
  );
}