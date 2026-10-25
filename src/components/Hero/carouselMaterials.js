// Geometry and material helpers for the project carousel.
// Adapted from the pmndrs "cards with border radius" example (MIT, Poimandres),
// which credits Paul West (@prisoner849) for the bent plane.
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// A plane bent along a circular arc, so each card hugs the ring.
export class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, ...args) {
    super(...args);
    const p = this.parameters;
    const hw = p.width * 0.5;
    const a = new THREE.Vector2(-hw, 0);
    const b = new THREE.Vector2(0, radius);
    const c = new THREE.Vector2(hw, 0);
    const ab = new THREE.Vector2().subVectors(a, b);
    const bc = new THREE.Vector2().subVectors(b, c);
    const ac = new THREE.Vector2().subVectors(a, c);
    const r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    const center = new THREE.Vector2(0, radius - r);
    const baseV = new THREE.Vector2().subVectors(a, center);
    const baseAngle = baseV.angle() - Math.PI * 0.5;
    const arc = baseAngle * 2;
    const uv = this.attributes.uv;
    const pos = this.attributes.position;
    const v = new THREE.Vector2();
    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i);
      const y = pos.getY(i);
      v.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, v.x, y, -v.y);
    }
    pos.needsUpdate = true;
  }
}

// Basic material whose vertices ripple in a sine wave, for the name ribbon.
export class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor({ amplitude = 0.12, ...parameters } = {}) {
    super(parameters);
    this.setValues(parameters);
    this.time = { value: 0 };
    this.amp = { value: amplitude };
  }
  // how far the band moves up and down, in world units
  get amplitude() {
    return this.amp.value;
  }
  set amplitude(v) {
    if (this.amp) this.amp.value = v;
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time;
    shader.uniforms.amp = this.amp;
    shader.vertexShader = `uniform float time;\nuniform float amp;\n${shader.vertexShader}`;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      'vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) * amp, position.z);'
    );
  }
}

extend({ BentPlaneGeometry, MeshSineMaterial });
