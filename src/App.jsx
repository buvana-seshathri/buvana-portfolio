import { useCallback, useState } from 'react';
import Loader from './components/Loader/Loader.jsx';
import Nav from './components/Nav/Nav.jsx';
import Pager from './components/Pager/Pager.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Journey from './components/Journey/Journey.jsx';

// Every page of the site, in order. `id` is its address (#about); the first page has no hash.
// To add a page: add it here, and give the matching nav link in site.js the same href (#id).
const PAGES = [
  { id: 'top', aliases: ['', 'home'], label: 'Home', render: (p) => <Hero {...p} /> },
  { id: 'about', label: 'About', render: (p) => <About {...p} /> },
  { id: 'journey', label: 'Journey', render: (p) => <Journey {...p} /> },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const handleLoaded = useCallback(() => {
    document.documentElement.dataset.loaded = 'true'; // lets the page entry animations start
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Loader onDone={handleLoaded} />}
      <Nav current={current} />
      <Pager pages={PAGES} onChange={setCurrent} />
    </>
  );
}
