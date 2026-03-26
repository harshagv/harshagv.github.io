import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CyberAstrolabe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const smoothedScroll = useRef(0);

  // Keyframes corresponding to scroll sections:
  // Designed for hyper-dramatic sweeping transitions
  // Designed for hyper-dramatic sweeping transitions
  const keyframes = [
    { p: 0.00, pos: [3.5, 0, 0], rot: [0, 0, 0], scale: 1.0 },                 
    { p: 0.25, pos: [-2.0, -0.5, -2], rot: [Math.PI, Math.PI/3, Math.PI/2], scale: 1.6 }, // Noticeable cinematic focus without being overwhelming
    { p: 0.50, pos: [2.5, 1, -4], rot: [0, Math.PI*1.5, Math.PI], scale: 0.8 },   
    { p: 0.75, pos: [0, 2.0, -2], rot: [Math.PI/4, Math.PI*2, 0], scale: 1.1 },      
    { p: 1.00, pos: [0, 0, 2], rot: [Math.PI*2, Math.PI*2, Math.PI/2], scale: 1.3 },             
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
        if (scrollProgress >= keyframes[i].p && scrollProgress <= keyframes[i+1].p) {
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

    // Continual subtle ambient rotations inside the structure
    if (knotRef.current) {
      knotRef.current.rotation.x = time * 0.2;
      knotRef.current.rotation.y = time * 0.3;
    }
    
    if (ring1Ref.current) ring1Ref.current.rotation.x = time * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.y = time * 0.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = time * 0.3;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        
        {/* Core Torus Knot */}
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[1.2, 0.35, 256, 64]} />
          {/* High end metal aesthetic */}
          <meshPhysicalMaterial 
            color="#222222"
            metalness={1}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#0CAFFF"
            emissiveIntensity={0.6}
            wireframe={false}
          />
        </mesh>

        {/* Outer Gyro Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#0CAFFF" transparent opacity={0.6} />
        </mesh>
        
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#00ff66" transparent opacity={0.4} />
        </mesh>

        <mesh ref={ring3Ref} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.8, 0.005, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        
      </Float>
    </group>
  );
};

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
  return (
    <>
      {/* Studio Lighting for the metallic finish */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={5} color="#00ff66" />
      <spotLight position={[10, -10, 10]} angle={0.3} penumbra={1} intensity={5} color="#0CAFFF" />
      
      {/* Environment map gives the metal extremely realistic reflections */}
      <Environment preset="city" />
      
      <CameraController />
      <CyberAstrolabe />
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />
    </>
  );
};

export default Scene;
