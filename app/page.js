// app/page.js
import SpaceBackground from './components/SpaceBackground';
import BlackHole from './components/BlackHole';

const Home = () => {
  return (
    <>
      <SpaceBackground />
      <BlackHole />
      <h1 style={{ color: 'white', textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        Welcome to My Portfolio
      </h1>
    </>
  );
};

export default Home;