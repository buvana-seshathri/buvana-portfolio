// A spinning ring of curved, rounded photos with a rippling name ribbon.
// Inspired by the pmndrs "cards with border radius" example; here it auto-rotates
// and spins on drag instead of taking over page scroll.
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import { easing } from 'maath';
import './carouselMaterials.js';
import { site } from '../../content/site.js';
import { currentTheme } from '../../theme/themes.js';

// Every image in src/assets/carousel/ is picked up automatically, no filenames in code.
// Sorted by name with numbers compared as numbers, so 1, 2, ... 10 stay in order.
const PHOTOS = Object.entries(
  import.meta.glob('../../assets/carousel/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    import: 'default',
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

const RING_RADIUS = 1.6;
const CARD_W = 1.18;
const RIBBON_RADIUS = RING_RADIUS + 0.24; // sits clear of the cards' outward bulge
const RIBBON_HEIGHT = 0.16;
const RIBBON_SPEED = 0.55; // the band turns at about half the speed of the cards
const RIBBON_WAVE = 0.11; // wiggle height, kept well inside the card height
const AUTO_SPEED = 0.025; // turns per second

// Shared spin state: auto-rotation plus drag with a little inertia.
function useSpin() {
  const { gl } = useThree();
  const spin = useMemo(() => ({ offset: 0, velocity: 0, dragging: false, lastX: 0, moved: 0 }), []);
  useEffect(() => {
    const el = gl.domElement;
    const down = (e) => {
      spin.dragging = true;
      spin.lastX = e.clientX;
      spin.moved = 0;
    };
    const move = (e) => {
      if (!spin.dragging) return;
      const dx = e.clientX - spin.lastX;
      spin.lastX = e.clientX;
      spin.moved += Math.abs(dx);
      spin.velocity = (-dx / el.clientWidth) * 0.6;
      spin.offset += spin.velocity;
    };
    const up = () => (spin.dragging = false);
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, spin]);
  return spin;
}

function Rig({ children, spin }) {
  const ref = useRef(null);
  const { size } = useThree();
  useFrame((state, delta) => {
    if (!spin.dragging) {
      spin.velocity *= Math.exp(-3 * delta);
      spin.offset += spin.velocity + AUTO_SPEED * delta;
    }
    ref.current.rotation.y = -spin.offset * Math.PI * 2; // spin inside the fixed tilt
    state.events.update?.(); // raycast every frame so hover follows the spinning cards

    // fit the ring to the canvas, then let the camera drift with the pointer
    const aspect = size.width / size.height;
    const fov = THREE.MathUtils.degToRad(state.camera.fov);
    const fitW = (RING_RADIUS * 2.55) / 2 / (Math.tan(fov / 2) * aspect);
    const fitH = 2.4 / 2 / Math.tan(fov / 2);
    const dist = Math.max(fitW, fitH);
    easing.damp3(state.camera.position, [-state.pointer.x * 1.6, state.pointer.y * 0.8 + 1.4, dist], 0.35, delta);
    state.camera.lookAt(0, 0, 0);
    if (state.scene.fog) {
      state.scene.fog.near = dist - 1.2;
      state.scene.fog.far = dist + 2.6;
    }
  });
  // the tilt lives on an outer group so it stays fixed while the ring spins,
  // matching the band's tilt exactly (otherwise they drift into each other)
  return (
    <group rotation={[0, 0, 0.12]}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

function Card({ url, width, position, rotation }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const k = hovered ? 1.15 : 1;
    target.set(width * k, width * 0.75 * k, 1);
    easing.damp3(ref.current.scale, target, 0.1, delta);
    easing.damp(ref.current.material, 'radius', hovered ? 0.18 : 0.08, 0.2, delta);
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.25, 0.2, delta);
  });

  // The bent plane curves toward its back. Facing it toward the ring's center makes the
  // curve bulge outward; mirroring the group then flips the picture so it reads correctly.
  return (
    <group position={position} rotation={rotation} scale={[-1, 1, 1]}>
      <Image
        ref={ref}
        url={url}
        transparent
        side={THREE.DoubleSide}
        scale={[width, width * 0.75]}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <bentPlaneGeometry args={[0.12, 1, 1, 24, 12]} />
      </Image>
    </group>
  );
}

function Carousel() {
  const count = PHOTOS.length;
  // shrink the cards when there are lots of photos so they never overlap
  const width = Math.min(CARD_W, ((2 * Math.PI * RING_RADIUS) / Math.max(count, 1)) * 0.93);
  return PHOTOS.map((url, i) => {
    const a = (i / count) * Math.PI * 2;
    return (
      <Card
        key={url}
        url={url}
        width={width}
        position={[Math.sin(a) * RING_RADIUS, 0, Math.cos(a) * RING_RADIUS]}
        rotation={[0, Math.PI + a, 0]}
      />
    );
  });
}

// The name, printed on a band that wraps the ring and ripples as it spins.
// The text keeps its natural proportions: we work out how many copies fit around the band
// and size each tile to match, so nothing is stretched.
function useRibbonTexture(text, colors) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const font = '400 62px "Fraunces Variable", Fraunces, Georgia, serif';
    (document.fonts?.load(font) ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      const H = 128;
      const pxPerUnit = H / RIBBON_HEIGHT;
      const c = document.createElement('canvas');
      const g = c.getContext('2d');
      g.font = font;
      const label = `${text}   ✦   `;
      const natural = g.measureText(label).width;
      const circumference = 2 * Math.PI * RIBBON_RADIUS * pxPerUnit;
      const repeat = Math.max(1, Math.round(circumference / natural));
      c.width = Math.round(circumference / repeat);
      c.height = H;
      const grad = g.createLinearGradient(0, 0, c.width, 0);
      grad.addColorStop(0, colors.bandA);
      grad.addColorStop(0.5, colors.bandB);
      grad.addColorStop(1, colors.bandA);
      g.fillStyle = grad;
      g.fillRect(0, 0, c.width, c.height);
      g.font = font; // resizing the canvas resets the context
      g.fillStyle = colors.text;
      g.textBaseline = 'middle';
      // any leftover width is split evenly on both sides, so the spacing stays even when tiled
      g.fillText(label, (c.width - natural) / 2, H / 2 + 3);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat, 1);
      t.anisotropy = 8;
      setResult({ texture: t, repeat });
    });
    return () => {
      cancelled = true;
    };
  }, [text, colors]);
  return result;
}

function Ribbon({ spin }) {
  const ref = useRef(null);
  const theme = currentTheme().carousel;
  const ribbon = useRibbonTexture(site.hero.ribbon, theme.ribbon);
  const last = useRef(0);
  useFrame((_, delta) => {
    const m = ref.current?.material;
    if (!m || !m.map || !ribbon) return;
    // ripple a little faster while you drag, but always gently
    m.time.value += Math.min(Math.abs(spin.offset - last.current) * 18, 0.05) + delta * 0.5;
    last.current = spin.offset;
    // slide the text in the cards' direction at about half their speed
    m.map.offset.x = spin.offset * ribbon.repeat * RIBBON_SPEED;
  });
  if (!ribbon) return null;
  return (
    <group rotation={[0, 0, 0.12]}>
      <mesh ref={ref} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[RIBBON_RADIUS, RIBBON_RADIUS, RIBBON_HEIGHT, 160, 16, true]} />
        <meshSineMaterial map={ribbon.texture} amplitude={RIBBON_WAVE} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene() {
  const spin = useSpin();
  const theme = currentTheme().carousel;
  return (
    <>
      <fog attach="fog" args={[theme.fog, 8.5, 12]} />
      <Rig spin={spin}>
        <Carousel />
      </Rig>
      <Ribbon spin={spin} />
    </>
  );
}

export default function PhotoCarousel() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.4, 10], fov: 15 }} gl={{ antialias: true, alpha: true }}>
      <Scene />
    </Canvas>
  );
}
