import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const CryptographicCore: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerWireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate cores in opposite directions
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = time * 0.2;
      innerCoreRef.current.rotation.x = time * 0.1;
    }
    
    if (outerWireframeRef.current) {
      outerWireframeRef.current.rotation.y = -time * 0.15;
      outerWireframeRef.current.rotation.z = time * 0.05;
    }

    // Gentle tilt based on mouse position
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      // Smooth interpolation for silky movement
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Inner Solid Core */}
        <Icosahedron ref={innerCoreRef} args={[1.5, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#111111" 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={1}
          />
        </Icosahedron>

        {/* Outer Glow/Wireframe Mesh */}
        <Icosahedron ref={outerWireframeRef} args={[1.9, 1]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color="#00ff66" 
            wireframe={true} 
            transparent 
            opacity={0.3} 
          />
        </Icosahedron>
        
        {/* Additional outer subtle sphere for 'shield' effect */}
        <Sphere args={[2.2, 32, 32]}>
          <meshBasicMaterial 
            color="#00e5ff" 
            wireframe={true} 
            transparent 
            opacity={0.05} 
          />
        </Sphere>
      </Float>
    </group>
  );
};

const DataParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 700;

  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Create a large sphere of particles
      const distance = 10 + Math.random() * 20;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 

      pos[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = distance * Math.cos(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={positions.length / 3} 
          array={positions} 
          itemSize={3} 
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00ff66" 
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

const Scene: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#00ff66" />
      <pointLight position={[0, 0, -5]} intensity={1} color="#00e5ff" />
      
      {/* 3D Elements */}
      <CryptographicCore />
      <DataParticles />
    </>
  );
};

export default Scene;
