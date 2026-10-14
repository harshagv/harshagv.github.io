import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { Stars, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

// ─── Earth Texture URLs ──────────────────────────────────────────────────────
const EARTH_SPEC = 'https://unpkg.com/three-globe@2.35.0/example/img/earth-water.png';

// ─── Sun Position (higher & further for longer god-rays + better terminator angle)
const SUN_POSITION: [number, number, number] = [18, 4, -12];
const SUN_DIRECTION = new THREE.Vector3(...SUN_POSITION).normalize();

// ─── Procedural Lens Flare Textures ──────────────────────────────────────────
const createFlareTexture = (
  size: number,
  innerColor: string,
  outerColor: string,
  falloff: number = 0.5
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(falloff, outerColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
};

const SunLensFlare: React.FC<{ lightRef: React.RefObject<THREE.DirectionalLight | null> }> = ({ lightRef }) => {
  const lensflareRef = useRef<Lensflare | null>(null);

  useEffect(() => {
    if (!lightRef.current) return;

    const textureBig = createFlareTexture(512, 'rgba(255, 230, 180, 1)', 'rgba(255, 160, 60, 0.18)', 0.12);
    const textureMedium = createFlareTexture(256, 'rgba(255, 200, 100, 0.7)', 'rgba(255, 120, 40, 0)', 0.35);
    const textureSmall = createFlareTexture(128, 'rgba(200, 180, 255, 0.45)', 'rgba(100, 100, 255, 0)', 0.3);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureBig, 420, 0, new THREE.Color(1, 0.92, 0.75)));
    lensflare.addElement(new LensflareElement(textureMedium, 180, 0.08, new THREE.Color(1, 0.82, 0.55)));
    lensflare.addElement(new LensflareElement(textureSmall, 70, 0.35, new THREE.Color(0.7, 0.75, 1)));
    lensflare.addElement(new LensflareElement(textureSmall, 50, 0.55, new THREE.Color(1, 0.7, 0.5)));
    lensflare.addElement(new LensflareElement(textureSmall, 90, 0.75, new THREE.Color(0.5, 0.8, 1)));

    lightRef.current.add(lensflare);
    lensflareRef.current = lensflare;

    return () => {
      if (lightRef.current && lensflareRef.current) {
        lightRef.current.remove(lensflareRef.current);
      }
      lensflareRef.current = null;
    };
  }, [lightRef]);

  return null;
};

// ─── Visible Sun Disk + Core Glow ────────────────────────────────────────────
const SunDisk: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 0.4) * 0.04;
      coreRef.current.scale.setScalar(pulse);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group position={SUN_POSITION}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#FFF5E0" toneMapped={false} />
      </mesh>

      <mesh ref={glowRef} scale={[2.8, 2.8, 2.8]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial
          color="#FFB060"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

// ─── Multi-layer Volumetric God Rays ─────────────────────────────────────────
const GodRays: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    const makeShaft = (intensity: number, warm: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.15, warm ? `rgba(255,180,80,${intensity * 0.4})` : `rgba(255,210,150,${intensity * 0.3})`);
      grad.addColorStop(0.5, warm ? `rgba(255,200,100,${intensity})` : `rgba(255,230,180,${intensity * 0.7})`);
      grad.addColorStop(0.85, warm ? `rgba(255,160,50,${intensity * 0.3})` : `rgba(255,200,120,${intensity * 0.2})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 1024);

      const sideGrad = ctx.createLinearGradient(0, 0, 256, 0);
      sideGrad.addColorStop(0, 'rgba(0,0,0,0)');
      sideGrad.addColorStop(0.35, 'rgba(255,255,255,1)');
      sideGrad.addColorStop(0.65, 'rgba(255,255,255,1)');
      sideGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = sideGrad;
      ctx.fillRect(0, 0, 256, 1024);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

      return new THREE.SpriteMaterial({
        map: tex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 1,
        toneMapped: false,
      });
    };

    return [
      makeShaft(0.55, true),
      makeShaft(0.35, false),
      makeShaft(0.25, true),
      makeShaft(0.40, true),
    ];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const sprite = child as THREE.Sprite;
      const baseOpacity = [0.7, 0.45, 0.35, 0.55][i];
      sprite.material.opacity = baseOpacity * (0.85 + Math.sin(t * 0.25 + i) * 0.15);
      sprite.material.rotation = Math.sin(t * 0.08 + i * 0.7) * 0.04;
    });
  });

  return (
    <group ref={groupRef} position={SUN_POSITION}>
      {materials.map((mat, i) => {
        const scaleX = [3.5, 2.2, 5.5, 1.8][i];
        const scaleY = [28, 18, 38, 12][i];
        const offset = [
          [0, 0, 0],
          [1.2, 0.8, -0.5],
          [-0.8, -1.1, 0.3],
          [0.4, -0.3, 0.6],
        ][i];

        return (
          <sprite
            key={i}
            material={mat}
            scale={[scaleX, scaleY, 1]}
            position={offset as [number, number, number]}
          />
        );
      })}
    </group>
  );
};

// ─── Binary Globe Shader (anti-aliased 0s and 1s on landmasses) ──────────────
// FIX: glyphs stay dot-sized (3px), but each pixel's coverage is box-filtered
// with 4×4 sub-samples instead of one hard step() test at the pixel centre.
// The glyph's total brightness then stays constant as it slides across pixels
// during rotation / parallax, so the dots stop blinking without changing the look.
const DotMatrixVertexShader = `
  uniform float uPointSize;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;

  void main() {
    vNormal      = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;

    // Equirectangular UVs for the land mask lookup
    vec3 n = normalize(position);
    vUv = vec2(
      0.5 + atan(n.x, n.z) / (2.0 * 3.141592653589793),
      0.5 + asin(n.y)      /        3.141592653589793
    );

    gl_PointSize = uPointSize;
    gl_Position  = projectionMatrix * mvPosition;
  }
`;

const DotMatrixFragmentShader = `
  uniform sampler2D maskTexture;
  uniform vec3 colorFront;
  uniform vec3 colorBack;
  uniform vec3 sunDirection;

  uniform float uPointSize;
  uniform float uGlyphBoost;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;

  // Fast hash → [0, 1]
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Digit "1" inside a [0,1]^2 sprite coord (same shape as before)
  float drawOne(vec2 pc) {
    vec2 c = pc - 0.5;
    float bar   = step(abs(c.x), 0.10) * step(abs(c.y), 0.40);
    float serif = step(c.x, 0.0) * step(-c.x, 0.18)
                * step(c.y, 0.38) * step(0.26, c.y);
    return min(bar + serif, 1.0);
  }

  // Digit "0" inside a [0,1]^2 sprite coord (same shape as before)
  float drawZero(vec2 pc) {
    vec2 c = pc - 0.5;
    float outer = dot(c / vec2(0.26, 0.40), c / vec2(0.26, 0.40));
    float inner = dot(c / vec2(0.13, 0.26), c / vec2(0.13, 0.26));
    return step(outer, 1.0) * step(1.0, inner);
  }

  float glyph(vec2 pc, float isOne) {
    return isOne > 0.5 ? drawOne(pc) : drawZero(pc);
  }

  void main() {
    // Land mask (EARTH_SPEC: water = white, land = dark)
    float isWater = texture2D(maskTexture, vUv).r;
    if (isWater > 0.5) discard;

    // Cull back side
    vec3 viewDir = normalize(-vPosition);
    float facing = dot(viewDir, vNormal);
    if (facing < 0.0) discard;

    // Static 0/1 per cell (same as before)
    float isOne = step(0.5, hash21(floor(vUv * vec2(128.0, 64.0))));

    // gl_PointCoord has y pointing down – flip so glyphs are upright
    vec2 pc = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);

    // Box-filtered coverage: 4×4 samples across this pixel's footprint,
    // instead of a single on/off test at the pixel centre
    float px = 1.0 / uPointSize; // one screen pixel in sprite units
    float coverage = 0.0;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 4; j++) {
        vec2 o = (vec2(float(i), float(j)) + 0.5) / 4.0 - 0.5;
        coverage += glyph(pc + o * px, isOne);
      }
    }
    coverage = min(coverage / 16.0 * uGlyphBoost, 1.0);
    if (coverage < 0.01) discard;

    // Sun illumination
    float sunDot = max(0.0, dot(vWorldNormal, sunDirection));
    float sunLit = smoothstep(0.05, 0.55, sunDot);
    float rim    = pow(1.0 - abs(dot(viewDir, vNormal)), 3.5) * sunLit;

    float mixFactor = smoothstep(0.0, 0.55, facing);
    vec3  baseColor = mix(colorBack, colorFront, mixFactor);

    vec3 litColor = baseColor * (0.5 + sunLit * 1.15);
    litColor += vec3(1.0, 0.85, 0.55) * rim * 0.75;
    litColor += colorFront * sunLit * 0.18;

    float alpha = mix(0.10, 0.78, mixFactor) * (0.45 + sunLit * 0.45);
    alpha *= coverage;                      // soft glyph edges
    alpha *= smoothstep(0.0, 0.12, facing); // fade at the limb instead of popping

    gl_FragColor = vec4(litColor, alpha);
  }
`;

// ─── Atmosphere Halo – DAY SIDE ONLY (Cyber / Matrix aesthetic) ──────────────
const HaloVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HaloFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  uniform vec3 color;           // primary neon #00FF66
  uniform vec3 accentColor;     // cooler secondary (cyan-green)
  uniform float power;
  uniform float intensity;
  uniform vec3 sunDirection;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, power);
    
    float sunDot = dot(vWorldNormal, sunDirection);
    
    // Strict day-side only
    float dayMask = smoothstep(0.0, 0.28, sunDot);
    if (dayMask <= 0.001) discard;
    
    // Soft intensity falloff toward the terminator so the brightest part
    // sits in the middle of the day side (classic cyber rim)
    float midBoost = smoothstep(0.05, 0.55, sunDot) * (1.0 - smoothstep(0.55, 0.95, sunDot));
    
    // Very thin, high-power rim
    float rim = fresnel * intensity * dayMask;
    
    // Primary pure neon green (dominant)
    vec3 primary = color * rim * (0.85 + midBoost * 0.4);
    
    // Subtle cooler accent that sits slightly outside the main rim
    // (gives a digital / layered HUD feel without warmth)
    float outer = pow(fresnel, power * 0.65);
    vec3 accent = accentColor * outer * intensity * 0.45 * dayMask;
    
    vec3 finalColor = primary + accent;
    float finalAlpha = max(rim, outer * 0.5);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

const AtmosphereHalo: React.FC<{ radius: number }> = ({ radius }) => {
  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color('#00FF66') },        // pure neon green – core
    accentColor: { value: new THREE.Color('#00E8A0') },  // cooler cyan-green accent
    intensity: { value: 1.95 },
    power: { value: 9.9 },                               // higher = thinner, sharper rim
    sunDirection: { value: SUN_DIRECTION.clone() },
  }), []);

  return (
    <mesh scale={[1.022, 1.022, 1.022]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={HaloVertexShader}
        fragmentShader={HaloFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Optional secondary ultra-thin outer glow (keeps depth, still cyber)
const AtmosphereScatterLayer: React.FC<{ radius: number }> = ({ radius }) => {
  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color('#00FF66') },
    intensity: { value: 0.35 },
    power: { value: 4.2 },
    sunDirection: { value: SUN_DIRECTION.clone() },
  }), []);

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;
    uniform vec3 color;
    uniform float intensity;
    uniform float power;
    uniform vec3 sunDirection;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), power);
      
      float sunDot = dot(vWorldNormal, sunDirection);
      float dayMask = smoothstep(0.0, 0.3, sunDot);
      if (dayMask <= 0.001) discard;
      
      float alpha = fresnel * intensity * dayMask;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh scale={[1.038, 1.038, 1.038]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ─── Location Marker ─────────────────────────────────────────────────────────
const LocationMarker: React.FC<{ lat: number; lon: number; radius: number }> = ({ lat, lon, radius }) => {
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const { position, quaternion } = useMemo(() => {
    const phi = (lat * Math.PI) / 180;
    const theta = (lon * Math.PI) / 180;

    const x = radius * Math.cos(phi) * Math.sin(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.cos(theta);

    const pos = new THREE.Vector3(x, y, z);
    const up = new THREE.Vector3(0, 0, 1);
    const normal = pos.clone().normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);

    return { position: pos, quaternion: quat };
  }, [lat, lon, radius]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (dotRef.current) {
      (dotRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.6 * Math.abs(Math.sin(time * 3));
    }
    if (ringRef.current) {
      const scale = 1 + (time * 1.5) % 2;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - (scale - 1) / 2);
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={dotRef}>
        <circleGeometry args={[0.015, 32]} />
        <meshBasicMaterial color="#00FF66" transparent depthTest={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.015, 0.025, 32]} />
        <meshBasicMaterial color="#00FF66" transparent depthTest={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// ─── Dot Matrix Globe ────────────────────────────────────────────────────────
const GLOBE_RADIUS = 1.8;
const POINT_SIZE = 3.0;  // dot-sized, as in the original
const GLYPH_BOOST = 1.5; // brightens the soft-edged dots to match the old look

const DotMatrixGlobe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const smoothedScroll = useRef(0);

  const [maskTexture, setMaskTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      EARTH_SPEC,
      (tex) => {
        tex.colorSpace = THREE.LinearSRGBColorSpace;
        setMaskTexture(tex);
      },
      undefined,
      (err) => console.error('Failed to load earth mask texture:', err)
    );
  }, []);

  const uniforms = useMemo(() => {
    if (!maskTexture) return null;
    return {
      maskTexture: { value: maskTexture },
      colorFront: { value: new THREE.Color('#00FF66') },
      colorBack: { value: new THREE.Color('#002208') },
      sunDirection: { value: SUN_DIRECTION.clone() },
      uPointSize: { value: POINT_SIZE },
      uGlyphBoost: { value: GLYPH_BOOST },
    };
  }, [maskTexture]);

  const keyframes = useMemo(() => [
    { p: 0.00, pos: [3.0, 0, 0], rot: [0, 0, 0], scale: 1.0 },
    { p: 0.25, pos: [-2.0, -0.5, -2], rot: [Math.PI / 4, Math.PI / 6, 0], scale: 1.6 },
    { p: 0.50, pos: [2.5, 1, -4], rot: [-Math.PI / 6, Math.PI / 4, 0], scale: 0.8 },
    { p: 0.75, pos: [-4.0, -2.0, -10], rot: [Math.PI / 3, -Math.PI / 3, 0], scale: 0.4 },
    { p: 1.00, pos: [0, 0, 2], rot: [-Math.PI / 4, Math.PI / 6, 0], scale: 1.3 },
  ], []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (rotationGroupRef.current) rotationGroupRef.current.rotation.y += delta * 0.0575; // +15% rotation speed

    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const rawScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    smoothedScroll.current = THREE.MathUtils.damp(smoothedScroll.current, rawScrollProgress, 6, delta);
    const scrollProgress = smoothedScroll.current;

    if (groupRef.current) {
      let startIndex = 0;
      for (let i = 0; i < keyframes.length - 1; i++) {
        if (scrollProgress >= keyframes[i].p && scrollProgress <= keyframes[i + 1].p) {
          startIndex = i;
          break;
        }
      }
      const start = keyframes[startIndex];
      const end = keyframes[Math.min(startIndex + 1, keyframes.length - 1)];
      const segmentProgress = (scrollProgress - start.p) / (end.p - start.p || 1);
      const ease = segmentProgress < 0.5
        ? 4 * segmentProgress * segmentProgress * segmentProgress
        : 1 - Math.pow(-2 * segmentProgress + 2, 3) / 2;

      groupRef.current.position.x = THREE.MathUtils.lerp(start.pos[0], end.pos[0], ease);
      groupRef.current.position.y = THREE.MathUtils.lerp(start.pos[1], end.pos[1], ease) + Math.sin(time * 0.3) * 0.08;
      groupRef.current.position.z = THREE.MathUtils.lerp(start.pos[2], end.pos[2], ease);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(start.rot[0], end.rot[0], ease);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(start.rot[1], end.rot[1], ease);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(start.rot[2], end.rot[2], ease);

      const s = THREE.MathUtils.lerp(start.scale, end.scale, ease);
      groupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      <PresentationControls
        global={true}
        cursor={true}
        snap={true}
        speed={1.5}
        polar={[-0.2, 0.2]}
        azimuth={[-0.5, 0.5]}
      >
        <group ref={rotationGroupRef}>
          <mesh scale={[0.99, 0.99, 0.99]}>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {uniforms && (
            <points>
              <icosahedronGeometry args={[GLOBE_RADIUS, 60]} />
              <shaderMaterial
                vertexShader={DotMatrixVertexShader}
                fragmentShader={DotMatrixFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
          )}

          <LocationMarker lat={-33.8688} lon={151.2093} radius={GLOBE_RADIUS * 1.01} />
        </group>
      </PresentationControls>

      {/* Primary neon atmosphere + golden terminator – day side only */}
      <AtmosphereHalo radius={GLOBE_RADIUS} />
      {/* Secondary soft scatter layer – day side only */}
      <AtmosphereScatterLayer radius={GLOBE_RADIUS} />
    </group>
  );
};

// ─── Parallax Starfield ──────────────────────────────────────────────────────
const ParallaxStars: React.FC = () => {
  const nearStarsRef = useRef<THREE.Group>(null);
  const midStarsRef = useRef<THREE.Group>(null);
  const farStarsRef = useRef<THREE.Group>(null);
  const smoothedScroll = useRef(0);

  useFrame((_state, delta) => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const rawProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    smoothedScroll.current = THREE.MathUtils.damp(smoothedScroll.current, rawProgress, 3, delta);
    const scroll = smoothedScroll.current;

    if (nearStarsRef.current) {
      nearStarsRef.current.position.y = scroll * -8;
      nearStarsRef.current.position.x = scroll * 2;
    }
    if (midStarsRef.current) {
      midStarsRef.current.position.y = scroll * -4;
      midStarsRef.current.position.x = scroll * -1;
    }
    if (farStarsRef.current) {
      farStarsRef.current.position.y = scroll * -1.5;
    }
  });

  return (
    <>
      <group ref={nearStarsRef}>
        <Stars radius={60} depth={30} count={400} factor={5} saturation={0} fade speed={0.8} />
      </group>
      <group ref={midStarsRef}>
        <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={1} />
      </group>
      <group ref={farStarsRef}>
        <Stars radius={120} depth={60} count={1200} factor={2} saturation={0} fade speed={1.2} />
      </group>
    </>
  );
};

// ─── Camera Controller ───────────────────────────────────────────────────────
const CameraController: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (prefersReducedMotion) {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.05);
    } else {
      const targetX = state.pointer.x * 0.5;
      const targetY = state.pointer.y * 0.5;
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    }

    state.camera.position.z = 8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ─── Main Scene ──────────────────────────────────────────────────────────────
const Scene: React.FC = () => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('scene-ready'));
    (window as any)._sceneReady = true;
  }, []);

  return (
    <>
      {/* Extremely low ambient so the sun + atmosphere dominate */}
      <ambientLight intensity={0.035} color="#0a2a14" />

      {/* Main cinematic sun – NO shadows */}
      <directionalLight
        ref={dirLightRef}
        position={SUN_POSITION}
        intensity={12}
        color="#FFE8C0"
      />

      {/* Soft opposite fill so night side isn't pure black */}
      <directionalLight
        position={[-8, -2, 6]}
        intensity={0.32}
        color="#004422"
      />

      <SunLensFlare lightRef={dirLightRef} />
      <SunDisk />
      <GodRays />

      <CameraController />
      <DotMatrixGlobe />
      <ParallaxStars />
    </>
  );
};

export default Scene;