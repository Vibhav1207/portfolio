

"use client"; 

import React, { useEffect } from 'react';
import * as THREE from 'three';

const StarField = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const stars = [];
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    for (let i = 0; i < 10000; i++) {
      const star = new THREE.Vector3(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
      stars.push(star);
    }

    starGeometry.setFromPoints(stars);
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    camera.position.z = 1;

    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.x += 0.0005;
      starField.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose(); 
    };
  }, []);

  return null;
};

export default StarField;