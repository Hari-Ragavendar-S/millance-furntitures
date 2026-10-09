import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

// Individual Lottery Ball Component
function LotteryBall({ number, position, isAnimating }) {
  const ballRef = useRef();
  const velocity = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));

  useFrame(() => {
    if (!ballRef.current || !isAnimating) return;

    // Update position
    ballRef.current.position.add(velocity.current);

    // Bounce off sphere walls (radius 1.8)
    const distance = ballRef.current.position.length();
    if (distance > 1.6) {
      // Reflect velocity
      const normal = ballRef.current.position.clone().normalize();
      velocity.current.reflect(normal).multiplyScalar(0.95);
      ballRef.current.position.normalize().multiplyScalar(1.6);
    }

    // Slow rotation
    ballRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={ballRef} position={position}>
      {/* Ball sphere */}
      <Sphere args={[0.15, 16, 16]}>
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.3}
          roughness={0.4}
          emissive="#F9FAFB"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Number text on ball */}
      <Text
        position={[0, 0, 0.16]}
        fontSize={0.12}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#FFFFFF"
      >
        {number}
      </Text>
    </group>
  );
}

// Glass Sphere Container
function GlassSphere() {
  return (
    <Sphere args={[2, 64, 64]}>
      <meshPhysicalMaterial
        color="#6D28D9"
        transparent
        opacity={0.08}
        roughness={0.1}
        metalness={0.1}
        transmission={0.95}
        thickness={0.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

// Golden Base
function GoldenBase() {
  return (
    <group position={[0, -2.3, 0]}>
      {/* Top disc */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.15, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.9}
          roughness={0.2}
          emissive="#FBBF24"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Middle cylinder */}
      <mesh>
        <cylinderGeometry args={[1.8, 2.2, 0.6, 32]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.8}
          roughness={0.3}
          emissive="#F59E0B"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Bottom disc */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.2, 32]} />
        <meshStandardMaterial
          color="#B45309"
          metalness={0.9}
          roughness={0.2}
          emissive="#D97706"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Rotating Rings
function RotatingRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.3;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.2;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.25;
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#F59E0B"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[2.4, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#F472B6"
          emissive="#DB2777"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      <mesh ref={ring3Ref} rotation={[0, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6D28D9"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// Main Scene
function LotteryScene({ balls, isAnimating }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#FFFFFF" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#8B5CF6" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.2}
        color="#FBBF24"
        castShadow
      />
      
      {/* Glass Sphere */}
      <GlassSphere />
      
      {/* Lottery Balls */}
      {balls.map((ball) => (
        <LotteryBall
          key={ball.id}
          number={ball.number}
          position={ball.position}
          isAnimating={isAnimating}
        />
      ))}
      
      {/* Rotating Rings */}
      <RotatingRings />
      
      {/* Golden Base */}
      <GoldenBase />
    </>
  );
}

// Main Lottery Sphere Component
const LotterySphere = ({ isAnimating = true }) => {
  // Generate lottery balls with random positions inside sphere
  const balls = useMemo(() => {
    const generatedBalls = [];
    const usedNumbers = new Set();
    
    for (let i = 0; i < 20; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * 99) + 1;
      } while (usedNumbers.has(num));
      
      usedNumbers.add(num);
      
      // Random position inside sphere (radius < 1.5)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 1.3 + 0.3;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      generatedBalls.push({
        id: i,
        number: String(num).padStart(2, '0'),
        position: [x, y, z]
      });
    }
    
    return generatedBalls;
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <LotteryScene balls={balls} isAnimating={isAnimating} />
      </Canvas>
    </div>
  );
};

export default LotterySphere;
