import { useEffect } from 'react';
import * as THREE from 'three';

const BlackHole = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const geometry = new THREE.CircleGeometry(1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(geometry, material);
    blackHole.position.set(0, 5, -5); // Position it at the top
    scene.add(blackHole);

    return () => {
      scene.remove(blackHole);
    };
  }, []);

  return null;
};

export default BlackHole;