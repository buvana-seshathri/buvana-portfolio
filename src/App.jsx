import { useCallback, useState } from 'react';
import Loader from './components/Loader/Loader.jsx';
import Nav from './components/Nav/Nav.jsx';
import Hero from './components/Hero/Hero.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleLoaded = useCallback(() => {
    document.documentElement.dataset.loaded = 'true'; // lets the hero entry animations start
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Loader onDone={handleLoaded} />}
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
