

import StarField from '../components/StarField';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Space Theme Portfolio',
  description: 'A space-themed portfolio using Next.js and Three.js',
};

export default function Home() {
  return (
    <div>
      <Navbar />
      <StarField />
    </div>
  );
}