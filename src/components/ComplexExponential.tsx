import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const arrowCount = 16;
const rotationSpeed = 0.2;
const colors = ["#FF5733", "#33FFBD", "#FF5733"];

function Arrow({
  angle,
  color,
  interactive,
  setInteractiveAngle,
}: {
  angle: number;
  color: string;
  interactive: boolean;
  setInteractiveAngle: (angle: number) => void;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ mouse }) => {
    if (interactive) {
      const mouseX = (mouse.x * Math.PI) / 2;
      setInteractiveAngle(mouseX);
      if (ref.current) {
        ref.current.rotation.z = mouseX;
      }
    } else {
      if (ref.current) {
        ref.current.rotation.z += rotationSpeed * 0.01;
      }
    }
  });

  return (
    <group ref={ref} position={[Math.cos(angle), Math.sin(angle), 0]}>
      <coneGeometry args={[0.1, 0.4, 16]} />
      <meshStandardMaterial color={color} />
    </group>
  );
}

export default function ComplexExponentialScene() {
  const [interactive, setInteractive] = useState(false);
  const [interactiveAngle, setInteractiveAngle] = useState(0);

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {Array.from({ length: arrowCount }).map((_, i) => (
        <Arrow
          key={i}
          angle={(i / arrowCount) * Math.PI * 2}
          color={colors[i % colors.length]}
          interactive={interactive}
          setInteractiveAngle={setInteractiveAngle}
        />
      ))}
      <mesh position={[2, 2, 0]} onClick={() => setInteractive(!interactive)}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={interactive ? "orange" : "gray"} />
      </mesh>
    </Canvas>
  );
}
