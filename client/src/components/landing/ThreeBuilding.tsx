"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function Building() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* Main Tower */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 6, 2]} />
                <meshStandardMaterial color="#4f46e5" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Side Wing */}
            <mesh position={[1.5, -1, 0.5]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 4, 1.5]} />
                <meshStandardMaterial color="#6366f1" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Another Wing */}
            <mesh position={[-1.2, -2, -0.5]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 3, 1.5]} />
                <meshStandardMaterial color="#818cf8" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Floating Elements */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[2, 2, 2]} castShadow receiveShadow>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#c7d2fe" />
                </mesh>
                <mesh position={[-2, 1, 2]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial color="#e0e7ff" />
                </mesh>
            </Float>
        </group>
    );
}

export default function ThreeBuilding() {
    return (
        <div className="h-[500px] w-full lg:h-[600px] relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
                <Environment preset="city" />
                <Float rotationIntensity={0.4}>
                    <Building />
                </Float>
            </Canvas>
        </div>
    );
}
