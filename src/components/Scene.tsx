import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/endurance.glb';

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
          <primitive object={clonedScene} />
        </group>
      </Float>
    </group>
  );
};

// Preload the model so it starts downloading immediately
useGLTF.preload(MODEL_PATH);

const CameraController: React.FC = () => {
  useFrame((state) => {
    // Elegant ambient parallax based on pointer
    const targetX = (state.pointer.x * 0.5);
    const targetY = (state.pointer.y * 0.5);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // HARD LOCK Z to 8 so it NEVER crashes into or swallows the text/screen.
    state.camera.position.z = 8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};



const Scene: React.FC = () => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

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

      {/* Strong Directional Light positioned to create a glowing rim effect from the right/back */}
      <directionalLight
        ref={dirLightRef}
        position={[15, 2, -10]}
        intensity={8}
        castShadow
      />

      {/* Restored Environmental lighting to give the metal realistic specularity on all sides */}
      <Environment preset="night" environmentIntensity={0.5} />

      <CameraController />
      <EnduranceSpacecraft />
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />

    </>
  );
};

export default Scene;
