import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Diamond3D = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(100, 100);
    renderer.setClearColor(0x000000, 0);
    
    // Only append if the ref is available and doesn't already have a child
    if (mountRef.current && !mountRef.current.hasChildNodes()) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Create diamond geometry
    const diamondGeometry = new THREE.OctahedronGeometry(1, 0);
    
    // Create material with shiny appearance
    const diamondMaterial = new THREE.MeshPhongMaterial({
      color: 0x00bfff,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    
    // Create the diamond mesh
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    scene.add(diamond);
    
    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 0, 1);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0, 0, -1);
    scene.add(light2);
    
    const light3 = new THREE.AmbientLight(0x404040);
    scene.add(light3);
    
    // Position camera
    camera.position.z = 3;
    
    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the diamond
      diamond.rotation.x += 0.01;
      diamond.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      diamondGeometry.dispose();
      diamondMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className="w-24 h-24 mx-auto"></div>;
};

export default Diamond3D; 