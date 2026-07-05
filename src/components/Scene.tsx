import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { Float, Stars, Environment, useGLTF, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

const MODEL_PATH = '/models/endurance.glb';

// ─── Procedural Lens Flare Textures ──────────────────────────────────────────
// Generate textures on-the-fly using Canvas2D so we don't need external assets

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
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

// ─── 1. Sun Lens Flare Component ─────────────────────────────────────────────

const SunLensFlare: React.FC<{ lightRef: React.RefObject<THREE.DirectionalLight | null> }> = ({ lightRef }) => {
  const lensflareRef = useRef<Lensflare | null>(null);

  useEffect(() => {
    if (!lightRef.current) return;

    // Create procedural flare textures
    const textureBig = createFlareTexture(512, 'rgba(255, 220, 150, 1)', 'rgba(255, 160, 60, 0.15)', 0.15);
    const textureMedium = createFlareTexture(256, 'rgba(255, 200, 100, 0.6)', 'rgba(255, 120, 40, 0)', 0.4);
    const textureSmall = createFlareTexture(128, 'rgba(200, 180, 255, 0.4)', 'rgba(100, 100, 255, 0)', 0.3);

    const lensflare = new Lensflare();
    // Main bright center flare
    lensflare.addElement(new LensflareElement(textureBig, 300, 0, new THREE.Color(1, 0.9, 0.7)));
    // Secondary warm glow
    lensflare.addElement(new LensflareElement(textureMedium, 150, 0.1, new THREE.Color(1, 0.8, 0.5)));
    // Subtle chromatic aberration rings
    lensflare.addElement(new LensflareElement(textureSmall, 60, 0.4, new THREE.Color(0.7, 0.7, 1)));
    lensflare.addElement(new LensflareElement(textureSmall, 40, 0.6, new THREE.Color(1, 0.7, 0.5)));
    lensflare.addElement(new LensflareElement(textureSmall, 80, 0.8, new THREE.Color(0.5, 0.8, 1)));

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

// ─── 2. Volumetric God Rays Component ────────────────────────────────────────
// A sprite-based approximation of light shafts from the sun position

const GodRays: React.FC<{ lightPosition: [number, number, number] }> = ({ lightPosition }) => {
  const spriteRef = useRef<THREE.Sprite>(null);

  const godRayMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const half = 256;

    // Create elongated radial gradient for the light shaft effect
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255, 200, 120, 0.25)');
    gradient.addColorStop(0.15, 'rgba(255, 180, 80, 0.12)');
    gradient.addColorStop(0.4, 'rgba(255, 150, 50, 0.04)');
    gradient.addColorStop(1, 'rgba(255, 100, 20, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
  }, []);

  useFrame((state) => {
    if (!spriteRef.current) return;
    // Subtle pulsing intensity
    const pulse = 0.5 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    spriteRef.current.material.opacity = pulse;
    // Slow rotation for organic feel
    spriteRef.current.material.rotation = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <sprite
      ref={spriteRef}
      position={lightPosition}
      scale={[25, 25, 1]}
      material={godRayMaterial}
    />
  );
};

// ─── 5. Parallax Starfield Component ─────────────────────────────────────────
// Multiple star layers at different depths that shift based on scroll progress

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

    // Each layer moves at a different rate to create depth parallax
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
      {/* Near layer: fewer, brighter stars that shift the most */}
      <group ref={nearStarsRef}>
        <Stars radius={60} depth={30} count={400} factor={5} saturation={0} fade speed={0.8} />
      </group>
      {/* Mid layer: moderate density and shift */}
      <group ref={midStarsRef}>
        <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={1} />
      </group>
      {/* Far layer: dense, faint, barely moves */}
      <group ref={farStarsRef}>
        <Stars radius={120} depth={60} count={1200} factor={2} saturation={0} fade speed={1.2} />
      </group>
    </>
  );
};

// ─── Endurance Spacecraft ────────────────────────────────────────────────────

const EnduranceSpacecraft: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const enduranceRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  const smoothedScroll = useRef(0);

  // Clone the scene so we don't mutate the cached original
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Auto-center and auto-scale the model to fit our scene
  useEffect(() => {
    if (!clonedScene) return;

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());

    // Do NOT auto-center via bounding box. The original model's origin (0,0,0) 
    // is the true pivot. Bounding boxes include uneven geometry which shifts the pivot 
    // and causes the 'big circle' wobble during rotation.

    // Scale up by another 20% from previous size (3.6 units)
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4.32;
    const scaleFactor = targetSize / maxDim;
    clonedScene.scale.setScalar(scaleFactor);

    // Upgrade all materials for warm golden metallic look (matching reference image)
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.metalness !== undefined) {
            mat.metalness = Math.max(mat.metalness, 0.8);
            mat.roughness = Math.max(mat.roughness, 0.4); // Satin finish to diffuse sunlight across more of the model
            mat.envMapIntensity = 0.65; // Boost environment reflections slightly for richer metallic detail

            // Fresnel rim-light via onBeforeCompile
            mat.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                #include <dithering_fragment>
                float fresnel = abs(dot(normalize(vNormal), normalize(vViewPosition)));
                fresnel = 1.0 - fresnel;
                fresnel = pow(fresnel, 3.0);
                // Subtle bright rim glow to make the silhouette read even in shadow
                gl_FragColor.rgb += vec3(0.6, 0.8, 1.0) * fresnel * 0.4;
                `
              );
            };
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  // Keyframes designed to aggressively sweep the spacecraft past the camera
  const keyframes = [
    { p: 0.00, pos: [3.5, 0, 0], rot: [0, 0, 0], scale: 1.0 },
    { p: 0.25, pos: [-2.0, -0.5, -2], rot: [Math.PI / 4, Math.PI / 6, 0], scale: 1.6 },
    { p: 0.50, pos: [2.5, 1, -4], rot: [-Math.PI / 6, Math.PI / 4, 0], scale: 0.8 },
    { p: 0.75, pos: [-4.0, -2.0, -10], rot: [Math.PI / 3, -Math.PI / 3, 0], scale: 0.4 },
    { p: 1.00, pos: [0, 0, 2], rot: [-Math.PI / 4, Math.PI / 6, 0], scale: 1.3 },
  ];

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const rawScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

    // Physics Engine: Dampen the scroll progress organically for massive cinematic weight
    smoothedScroll.current = THREE.MathUtils.damp(smoothedScroll.current, rawScrollProgress, 3, delta);
    const scrollProgress = smoothedScroll.current;

    // Calculate current keyframe segment
    let startIndex = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (scrollProgress >= keyframes[i].p && scrollProgress <= keyframes[i + 1].p) {
        startIndex = i;
        break;
      }
    }
    const start = keyframes[startIndex];
    const end = keyframes[Math.min(startIndex + 1, keyframes.length - 1)];

    // Normalize progress to segment
    const segmentProgress = (scrollProgress - start.p) / (end.p - start.p || 1);

    // Apple-like ease-in-out cubic curve mapped over the damped physics
    const ease = segmentProgress < 0.5
      ? 4 * segmentProgress * segmentProgress * segmentProgress
      : 1 - Math.pow(-2 * segmentProgress + 2, 3) / 2;

    const targetX = THREE.MathUtils.lerp(start.pos[0], end.pos[0], ease);
    const targetY = THREE.MathUtils.lerp(start.pos[1], end.pos[1], ease);
    const targetZ = THREE.MathUtils.lerp(start.pos[2], end.pos[2], ease);

    const targetRotX = THREE.MathUtils.lerp(start.rot[0], end.rot[0], ease);
    const targetRotY = THREE.MathUtils.lerp(start.rot[1], end.rot[1], ease);
    const targetRotZ = THREE.MathUtils.lerp(start.rot[2], end.rot[2], ease);

    const targetScale = THREE.MathUtils.lerp(start.scale, end.scale, ease);

    // Apply main group kinematics instantly as the raw scalar is already damped
    if (groupRef.current) {
      groupRef.current.position.set(targetX, targetY, targetZ);
      groupRef.current.rotation.set(targetRotX, targetRotY, targetRotZ);
      groupRef.current.scale.setScalar(targetScale);
    }

    // The Endurance physically rotates around its Y axis
    if (enduranceRef.current) {
      enduranceRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.05}>
        <group ref={enduranceRef}>
          {/* PresentationControls allow subtle mouse dragging/rotation independently from the GSAP scroll animations */}
          <PresentationControls
            global={false}
            cursor={true}
            snap={true}
            speed={1.5}
            polar={[-0.1, 0.1]}
            azimuth={[-0.5, 0.5]}
          >
            <primitive object={clonedScene} />
          </PresentationControls>
        </group>
      </Float>
    </group>
  );
};

// Preload the model so it starts downloading immediately
useGLTF.preload(MODEL_PATH);

const CameraController: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (prefersReducedMotion) {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.05);
    } else {
      // Elegant ambient parallax based on pointer
      const targetX = (state.pointer.x * 0.5);
      const targetY = (state.pointer.y * 0.5);
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    }

    // HARD LOCK Z to 8 so it NEVER crashes into or swallows the text/screen.
    state.camera.position.z = 8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ─── Sun Light Position (shared constant) ────────────────────────────────────
const SUN_POSITION: [number, number, number] = [15, 2, -10];

// ─── Main Scene ──────────────────────────────────────────────────────────────

const Scene: React.FC = () => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('scene-ready'));
    (window as any)._sceneReady = true;
  }, []);

  useFrame((state) => {
    if (dirLightRef.current) {
      // Shift sun color between deep golden orange and brighter yellow/white
      const hue = 0.085 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.035;
      dirLightRef.current.color.setHSL(hue, 1, 0.6);
    }
  });

  return (
    <>
      {/* Gentle ambient light to lift the deep space contrast and reveal details on the dark side */}
      <ambientLight intensity={0.4} />

      {/* 3. Strong Directional Light with properly configured shadow map */}
      <directionalLight
        ref={dirLightRef}
        position={SUN_POSITION}
        intensity={8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* 1. Cinematic Lens Flare attached to the sun */}
      <SunLensFlare lightRef={dirLightRef} />

      {/* 2. Volumetric God Rays emanating from the sun position */}
      <GodRays lightPosition={SUN_POSITION} />

      {/* Restored Environmental lighting to give the metal realistic specularity on all sides */}
      <Environment preset="night" environmentIntensity={0.5} />

      <CameraController />
      <EnduranceSpacecraft />

      {/* 5. Multi-layer parallax starfield (replaces the old static Stars) */}
      <ParallaxStars />
    </>
  );
};

export default Scene;
