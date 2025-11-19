import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface BodyPart {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  relatedTests: string[];
  description: string;
}

const bodyParts: BodyPart[] = [
  {
    name: "간 (Liver)",
    position: [0.3, 0.5, 0],
    scale: [0.4, 0.3, 0.3],
    color: "#8B4513",
    relatedTests: ["liver"],
    description: "간기능 검사 - ALT, AST, ALP, GGT",
  },
  {
    name: "신장 (Kidneys)",
    position: [-0.3, 0.3, -0.3],
    scale: [0.25, 0.35, 0.25],
    color: "#A0522D",
    relatedTests: ["kidney"],
    description: "신장기능 검사 - Creatinine, BUN, 전해질",
  },
  {
    name: "심장 (Heart)",
    position: [0, 0.8, 0.2],
    scale: [0.35, 0.35, 0.35],
    color: "#DC143C",
    relatedTests: ["heart"],
    description: "심장 검사 - 심전도, 심장 초음파",
  },
  {
    name: "소화기 (Digestive)",
    position: [0, 0, 0],
    scale: [0.6, 0.8, 0.5],
    color: "#FFB6C1",
    relatedTests: ["digestive"],
    description: "소화기 관련 증상 및 검사",
  },
  {
    name: "피부 (Skin)",
    position: [0, 0.5, 0.6],
    scale: [1.0, 0.9, 0.2],
    color: "#F5DEB3",
    relatedTests: ["skin"],
    description: "피부 상태 및 피부질환 검사",
  },
  {
    name: "근골격 (Musculoskeletal)",
    position: [0, -0.5, 0],
    scale: [0.8, 0.4, 0.6],
    color: "#D2B48C",
    relatedTests: [],
    description: "근골격계 검사 - X-ray, 관절 검사",
  },
];

interface BodyPartMeshProps {
  part: BodyPart;
  onClick: () => void;
  isSelected: boolean;
  onHover: (hover: boolean) => void;
}

function BodyPartMesh({ part, onClick, isSelected, onHover }: BodyPartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      // Subtle pulsing effect when selected
      if (isSelected) {
        meshRef.current.scale.setScalar(
          1 + Math.sin(Date.now() * 0.003) * 0.05
        );
      } else {
        meshRef.current.scale.set(...part.scale);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={part.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
    >
      <boxGeometry args={part.scale} />
      <meshStandardMaterial
        color={isSelected || hovered ? "#3b82f6" : part.color}
        emissive={isSelected || hovered ? "#3b82f6" : "#000000"}
        emissiveIntensity={isSelected || hovered ? 0.3 : 0}
        transparent
        opacity={isSelected || hovered ? 0.9 : 0.7}
      />
    </mesh>
  );
}

interface DogModel3DProps {
  onPartClick: (part: BodyPart) => void;
  selectedPart: BodyPart | null;
}

function DogScene({ onPartClick, selectedPart }: DogModel3DProps) {
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Dog body parts */}
      {bodyParts.map((part) => (
        <BodyPartMesh
          key={part.name}
          part={part}
          onClick={() => onPartClick(part)}
          isSelected={selectedPart?.name === part.name}
          onHover={(hover) => setHoveredPart(hover ? part : null)}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

export function DogModel3D({ onPartClick, selectedPart }: DogModel3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
        <DogScene onPartClick={onPartClick} selectedPart={selectedPart} />
      </Canvas>
    </div>
  );
}

export { bodyParts };
export type { BodyPart };
