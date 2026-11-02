import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import './Loader.css';

const LoaderScene = lazy(() => import('./LoaderScene.jsx'));

const params = new URLSearchParams(window.location.search);
const MIN_DURATION = Number(params.get('loaderMs')) || 4200; // ms the water takes to fill
const HOLD = 700; // ms to admire the full letters before fading

// Full-screen intro: solid letters fill with a gradient on a plain, softly shaded background, then fade into the page.
export default function Loader({ onDone }) {
  const progress = useRef(0);
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // if the 3D scene can't start (old device, no WebGL), don't keep people waiting
  useEffect(() => {
    const id = setTimeout(() => setSceneReady(true), 4000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (params.has('skipLoader')) {
      onDone();
      return;
    }
    if (!sceneReady) return; // the fill starts once the letters are on screen
    let raf = 0;
    let start = 0;
    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 1200 : MIN_DURATION;

    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      // gentle ease-in-out so the rise is visible the whole way; hold at 96% until fonts are ready
      const eased = p * p * (3 - 2 * p);
      progress.current = fontsReady ? eased : Math.min(eased, 0.96);
      setPct(Math.round(progress.current * 100));
      if (progress.current < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setLeaving(true), HOLD);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, sceneReady]);

  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, 900);
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  return (
    <div className={`loader${leaving ? ' loader--leaving' : ''}`} role="status" aria-label={`Loading ${pct}%`}>
      <Suspense fallback={<p className="loader__fallback">buvana</p>}>
        <LoaderScene progress={progress} onReady={() => setSceneReady(true)} />
      </Suspense>
      <p className="loader__status">
        pouring small worlds · <b>{pct}%</b>
      </p>
    </div>
  );
}
