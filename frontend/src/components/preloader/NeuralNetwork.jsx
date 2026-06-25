import { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const NODE_COUNT = 16;
const SPHERE_RADIUS = 2.8;
const CONNECTION_DISTANCE = 4.5;

function Nodes() {
  const meshRef = useRef(null);
  const { isDarkMode } = useTheme();
  const { mouse, viewport } = useThree();

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SPHERE_RADIUS * (0.5 + Math.random() * 0.5);
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(pos);
  }, []);

  const color = useMemo(
    () => (isDarkMode ? new THREE.Color('#3b82f6') : new THREE.Color('#60a5fa')),
    [isDarkMode]
  );

  const sizes = useMemo(() => {
    const s = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) s[i] = 0.04 + Math.random() * 0.08;
    return s;
  }, []);

  const nodesRef = useRef(null);

  useFrame((state, delta) => {
    if (!nodesRef.current) return;
    nodesRef.current.rotation.y += delta * 0.08;
    nodesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    nodesRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.04) * 0.03;

    const px = (mouse.x * viewport.width * 0.15);
    const py = (-mouse.y * viewport.height * 0.15);
    nodesRef.current.position.x += (px - nodesRef.current.position.x) * 0.02;
    nodesRef.current.position.y += (py - nodesRef.current.position.y) * 0.02;
  });

  return (
    <group ref={nodesRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NODE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={NODE_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Connections() {
  const { isDarkMode } = useTheme();
  const lineRef = useRef(null);

  const positions = useMemo(() => {
    const points = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = SPHERE_RADIUS * (0.5 + Math.random() * 0.5);
      const p1 = new THREE.Vector3(
        r1 * Math.sin(phi1) * Math.cos(theta1),
        r1 * Math.sin(phi1) * Math.sin(theta1),
        r1 * Math.cos(phi1)
      );

      for (let j = i + 1; j < NODE_COUNT; j++) {
        const theta2 = Math.random() * Math.PI * 2;
        const phi2 = Math.acos(2 * Math.random() - 1);
        const r2 = SPHERE_RADIUS * (0.5 + Math.random() * 0.5);
        const p2 = new THREE.Vector3(
          r2 * Math.sin(phi2) * Math.cos(theta2),
          r2 * Math.sin(phi2) * Math.sin(theta2),
          r2 * Math.cos(phi2)
        );

        if (p1.distanceTo(p2) < CONNECTION_DISTANCE) {
          points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        }
      }
    }
    return new Float32Array(points);
  }, []);

  const color = useMemo(
    () => (isDarkMode ? '#3b82f6' : '#60a5fa'),
    [isDarkMode]
  );

  useFrame((state, delta) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y += delta * 0.08;
    lineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    lineRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.04) * 0.03;
  });

  return (
    <group ref={lineRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function NeuralScene() {
  const { isDarkMode } = useTheme();

  const bgColor = useMemo(
    () => (isDarkMode ? '#0a0a1a' : '#f8f9fa'),
    [isDarkMode]
  );

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.5} />
      <Connections />
      <Nodes />
    </>
  );
}

export const NeuralNetwork = () => {
  const { isDarkMode } = useTheme();

  const bgStyle = useMemo(
    () => ({
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      background: isDarkMode
        ? 'radial-gradient(ellipse at center, rgba(59,130,246,0.03) 0%, transparent 70%)'
        : 'radial-gradient(ellipse at center, rgba(59,130,246,0.02) 0%, transparent 70%)',
    }),
    [isDarkMode]
  );

  return (
    <div style={bgStyle}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.7,
        }}
      >
        <Suspense fallback={null}>
          <NeuralScene />
        </Suspense>
      </Canvas>
    </div>
  );
};
