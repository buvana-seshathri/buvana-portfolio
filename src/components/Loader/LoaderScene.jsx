import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fontJson from '../../assets/fonts/fraunces-soft-black.typeface.json';
import { currentTheme } from '../../theme/themes.js';

const WORD = 'buvana';
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Solid, puffy block letters, laid out and centered as one word.
function useLetters() {
  return useMemo(() => {
    const font = new FontLoader().parse(fontJson);
    const res = font.data.resolution;
    let cursor = 0;
    const letters = [...WORD].map((ch) => {
      const geo = new TextGeometry(ch, {
        font, size: 1, depth: 0.22, curveSegments: 16,
        bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.05, bevelSegments: 10,
      });
      geo.computeBoundingBox();
      const cx = (geo.boundingBox.min.x + geo.boundingBox.max.x) / 2;
      geo.translate(-cx, 0, -0.11);
      const x = cursor + cx;
      cursor += (font.data.glyphs[ch].ha / res) * 0.97;
      return { geo, x };
    });
    const width = cursor;
    const minY = Math.min(...letters.map((l) => (l.geo.computeBoundingBox(), l.geo.boundingBox.min.y)));
    const maxY = Math.max(...letters.map((l) => l.geo.boundingBox.max.y));
    const dy = -(minY + maxY) / 2;
    letters.forEach((l) => {
      l.x -= width / 2;
      l.geo.translate(0, dy, 0);
    });
    return { letters, width, minY: minY + dy, maxY: maxY + dy };
  }, []);
}

// A glossy material that paints a smooth 4-color gradient up to a wavy fill line.
// Positions are measured across the whole word, so the gradient flows letter to letter.
function useFillMaterial(theme, bounds) {
  return useMemo(() => {
    const uniforms = {
      uFill: { value: 0 },
      uTime: { value: 0 },
      uOffsetX: { value: 0 },
      uWordMin: { value: new THREE.Vector2(-bounds.width / 2, bounds.minY) },
      uWordMax: { value: new THREE.Vector2(bounds.width / 2, bounds.maxY) },
      uEmpty: { value: new THREE.Color(theme.empty) },
      uC0: { value: new THREE.Color(theme.fill[0]) },
      uC1: { value: new THREE.Color(theme.fill[1]) },
      uC2: { value: new THREE.Color(theme.fill[2]) },
      uC3: { value: new THREE.Color(theme.fill[3]) },
      uSurface: { value: new THREE.Color(theme.surface) },
    };
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.22,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.6,
      sheenColor: new THREE.Color('#C6D5FF'),
      envMapIntensity: 1.1,
    });
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLocal;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocal = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           varying vec3 vLocal;
           uniform float uFill, uTime, uOffsetX;
           uniform vec2 uWordMin, uWordMax;
           uniform vec3 uEmpty, uC0, uC1, uC2, uC3, uSurface;
           float gFill;
           vec3 gCol;
           vec3 gradient(float t) {
             t = clamp(t, 0.0, 1.0);
             vec3 c = mix(uC0, uC1, smoothstep(0.0, 0.38, t));
             c = mix(c, uC2, smoothstep(0.3, 0.7, t));
             return mix(c, uC3, smoothstep(0.62, 1.0, t));
           }`
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
           float wx = vLocal.x + uOffsetX;
           vec2 w = (vec2(wx, vLocal.y) - uWordMin) / (uWordMax - uWordMin);
           float wave = sin(wx * 5.0 + uTime * 2.2) * 0.022 + sin(wx * 11.0 - uTime * 3.0) * 0.01;
           float level = uFill * 1.1 - 0.05 + wave * (1.0 - uFill * uFill);
           gFill = smoothstep(level + 0.015, level - 0.015, w.y);
           // diagonal blend, plus a slow drift so the colors feel alive
           float gt = w.y * 0.75 + w.x * 0.25 + sin(uTime * 0.6 + w.x * 3.0) * 0.06;
           gCol = gradient(gt);
           float line = (1.0 - smoothstep(0.0, 0.02, abs(w.y - level))) * step(0.01, uFill) * (1.0 - step(0.999, uFill));
           diffuseColor.rgb = mix(uEmpty, gCol, gFill) + uSurface * line * 0.6;`
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           totalEmissiveRadiance += gCol * gFill * 0.12;`
        );
    };
    mat.userData.uniforms = uniforms;
    return mat;
  }, [theme, bounds]);
}

function Letter({ geo, x, index, progress, theme, bounds }) {
  const group = useRef(null);
  const material = useFillMaterial(theme, bounds);
  const spring = useRef({ y: 1.6 + index * 0.25, v: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20);

    // drop in one after another with a small overshoot, then bob gently as if floating
    const sp = spring.current;
    if (t > 0.15 + index * 0.09) {
      sp.v += (0 - sp.y) * 70 * dt;
      sp.v *= Math.exp(-6.5 * dt);
      sp.y += sp.v * dt;
    }
    g.position.set(x, sp.y + Math.sin(t * 1.5 + index * 0.9) * 0.05, 0);
    g.rotation.z = Math.sin(t * 1.1 + index * 1.3) * 0.045;
    g.rotation.x = Math.sin(t * 0.9 + index) * 0.07;
    g.rotation.y = Math.sin(t * 0.7 + index * 0.6) * 0.08;

    const u = material.userData.uniforms;
    u.uFill.value = clamp01(progress.current * 1.04 - index * 0.012);
    u.uTime.value = t;
    u.uOffsetX.value = x;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={material} />
    </group>
  );
}

// a soft glow under the word, like the letters float just above a surface
function SoftShadow({ width }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128, 32, 0, 128, 32, 128);
    grad.addColorStop(0, 'rgba(109,74,224,0.35)');
    grad.addColorStop(1, 'rgba(109,74,224,0)');
    g.setTransform(1, 0, 0, 0.25, 0, 24);
    g.fillStyle = grad;
    g.fillRect(0, -96, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, -0.72, -0.4]} rotation-x={-Math.PI / 2.4} scale={[width * 1.25, 1.1, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Word({ progress }) {
  const { letters, width, minY, maxY } = useLetters();
  const bounds = useMemo(() => ({ width, minY, maxY }), [width, minY, maxY]);
  const theme = currentTheme().loader;
  const root = useRef(null);
  const { camera, size, pointer } = useThree();

  useFrame(() => {
    // keep the word at ~62% of the screen width (86% on phones)
    const aspect = size.width / size.height;
    const share = aspect < 1 ? 0.86 : 0.62;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const dist = width / share / 2 / (Math.tan(fov / 2) * aspect);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.max(dist, 5), 0.2);
    if (root.current) {
      root.current.rotation.y += (pointer.x * 0.15 - root.current.rotation.y) * 0.05;
      root.current.rotation.x += (-pointer.y * 0.08 - root.current.rotation.x) * 0.05;
    }
  });

  return (
    <>
      <group ref={root} position-y={0.1}>
        {letters.map((l, i) => (
          <Letter key={i} {...l} index={i} progress={progress} theme={theme} bounds={bounds} />
        ))}
      </group>
      <SoftShadow width={width} />
    </>
  );
}

export default function LoaderScene({ progress, onReady }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 6, 6]} intensity={1.5} />
      <Word progress={progress} />
      {/* soft studio light from shapes, for glossy highlights without loading an HDR */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer form="rect" intensity={4} position={[0, 4, 6]} scale={[10, 1.2, 1]} />
          <Lightformer form="rect" intensity={2} position={[-6, 1, 3]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
          <Lightformer form="rect" color="#819BFF" intensity={3} position={[6, -1, 3]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        </group>
      </Environment>
    </Canvas>
  );
}
