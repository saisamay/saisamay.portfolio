import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeDViewer = ({ modelUrl, onClose }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!modelUrl) return;

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load model
    const loader = new GLTFLoader();
    let model;
    
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      
      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      const scale = 5 / maxDim;
      model.scale.set(scale, scale, scale);
      
      model.position.sub(center.multiplyScalar(scale));
      scene.add(model);
      
      camera.position.z = 10;
    });

    // Animation loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  if (!modelUrl) return null;

  return (
    <div id="modal-3d-viewer" className="modal-overlay show">
      <div className="modal-content">
        <button id="modal-close-button" className="modal-close" onClick={onClose}>&times;</button>
        <div id="model-canvas-container" ref={mountRef}></div>
        <p className="modal-instructions">Click and drag to rotate. Scroll to zoom.</p>
      </div>
    </div>
  );
};

export default ThreeDViewer;
