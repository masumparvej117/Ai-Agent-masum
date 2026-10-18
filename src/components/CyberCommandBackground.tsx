import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CyberCommandBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040712, 0.012);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 38);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x040712, 1);
    container.appendChild(renderer.domElement);

    // Group for entire interactive 3D world
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 4. Holographic Wireframe Globe
    const globeRadius = 9;
    const globeGeometry = new THREE.IcosahedronGeometry(globeRadius, 4);
    const globeWireframe = new THREE.WireframeGeometry(globeGeometry);
    const globeLineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    const globeLines = new THREE.LineSegments(globeWireframe, globeLineMaterial);
    globeLines.position.set(0, 10, -15);
    worldGroup.add(globeLines);

    // Inner glowing sphere core
    const innerSphereGeo = new THREE.SphereGeometry(globeRadius * 0.75, 24, 24);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9d,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    globeLines.add(innerSphere);

    // Holographic Orbital Rings
    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.45 }),
      new THREE.LineBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.35 }),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 })
    ];

    const rings: THREE.LineLoop[] = [];
    [13, 16, 19].forEach((radius, i) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 90;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.LineLoop(ringGeo, ringMaterials[i % ringMaterials.length]);
      ring.position.copy(globeLines.position);
      ring.rotation.x = Math.PI / 2.3 + (i * 0.2);
      ring.rotation.y = (i * 0.3);
      worldGroup.add(ring);
      rings.push(ring);
    });

    // 5. Digital City Skyline (Blocks with glowing edges)
    const cityGroup = new THREE.Group();
    const cityCount = 55;
    const cityGeometries: THREE.BufferGeometry[] = [];
    const cityEdgeGeometries: THREE.BufferGeometry[] = [];

    const cityMat = new THREE.MeshBasicMaterial({
      color: 0x060f24,
      transparent: true,
      opacity: 0.75
    });

    const edgeMatCyan = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const edgeMatGreen = new THREE.LineBasicMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < cityCount; i++) {
      const width = 1.2 + Math.random() * 2.2;
      const depth = 1.2 + Math.random() * 2.2;
      const height = 4 + Math.random() * 16;

      const boxGeo = new THREE.BoxGeometry(width, height, depth);
      cityGeometries.push(boxGeo);

      const building = new THREE.Mesh(boxGeo, cityMat);
      const angle = (i / cityCount) * Math.PI * 1.6 - Math.PI * 0.8;
      const dist = 28 + Math.random() * 20;

      building.position.x = Math.sin(angle) * dist + (Math.random() - 0.5) * 6;
      building.position.z = -Math.cos(angle) * dist - 8 + (Math.random() - 0.5) * 6;
      building.position.y = height / 2 - 4;

      // Add glowing neon edges
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      cityEdgeGeometries.push(edgesGeo);
      const edges = new THREE.LineSegments(
        edgesGeo,
        i % 3 === 0 ? edgeMatGreen : edgeMatCyan
      );
      building.add(edges);

      cityGroup.add(building);
    }
    worldGroup.add(cityGroup);

    // 6. Cyber Command Floor Grid & Luminous Platforms
    const gridHelper = new THREE.GridHelper(120, 60, 0x00f5ff, 0x0a1e3b);
    gridHelper.position.y = -4;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.28;
    worldGroup.add(gridHelper);

    // Concentric luminous platform rings on the command floor
    const platformRingsGroup = new THREE.Group();
    [8, 16, 26, 38].forEach((r, idx) => {
      const circleGeo = new THREE.BufferGeometry();
      const pts: THREE.Vector3[] = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const rad = (s / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(rad) * r, 0, Math.sin(rad) * r));
      }
      circleGeo.setFromPoints(pts);
      const cLine = new THREE.LineLoop(
        circleGeo,
        new THREE.LineBasicMaterial({
          color: idx % 2 === 0 ? 0x00f5ff : 0x00ff9d,
          transparent: true,
          opacity: 0.35 - (idx * 0.06),
          blending: THREE.AdditiveBlending
        })
      );
      cLine.position.y = -3.95;
      platformRingsGroup.add(cLine);
    });
    worldGroup.add(platformRingsGroup);

    // 7. Data Stream Particles (Floating Cyber Dust)
    const particleCount = 420;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f5ff);
    const greenColor = new THREE.Color(0x00ff9d);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 80;
      particlePositions[i3 + 1] = Math.random() * 40 - 4;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 80;

      particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 1] = 0.04 + Math.random() * 0.08;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      const c = Math.random() > 0.4 ? cyanColor : greenColor;
      particleColors[i3] = c.r;
      particleColors[i3 + 1] = c.g;
      particleColors[i3 + 2] = c.b;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particles);

    // 8. Parallax and Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 8;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 5;
      targetY = 8 + mouseY * 3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Parallax
      camera.position.x += (targetX - camera.position.x) * 0.035;
      camera.position.y += (targetY - camera.position.y) * 0.035;
      camera.lookAt(0, 6, -10);

      // Rotate Globe & Rings
      globeLines.rotation.y = elapsed * 0.12;
      globeLines.rotation.x = Math.sin(elapsed * 0.08) * 0.1;
      innerSphere.rotation.y = -elapsed * 0.18;

      rings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (0.15 + idx * 0.05) * (idx % 2 === 0 ? 1 : -1);
      });

      // Slowly pulse platform rings
      platformRingsGroup.rotation.y = -elapsed * 0.04;

      // Animate Particles Floating Upwards
      const pos = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3] += particleVelocities[i3];
        pos[i3 + 1] += particleVelocities[i3 + 1];
        pos[i3 + 2] += particleVelocities[i3 + 2];

        // Reset if drifted too high
        if (pos[i3 + 1] > 36) {
          pos[i3 + 1] = -4;
          pos[i3] = (Math.random() - 0.5) * 80;
          pos[i3 + 2] = (Math.random() - 0.5) * 80;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js objects
      globeGeometry.dispose();
      globeWireframe.dispose();
      globeLineMaterial.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();

      ringMaterials.forEach((m) => m.dispose());
      cityGeometries.forEach((g) => g.dispose());
      cityEdgeGeometries.forEach((g) => g.dispose());
      cityMat.dispose();
      edgeMatCyan.dispose();
      edgeMatGreen.dispose();

      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three.js canvas mount container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Cinematic Dark Vignette & Glassmorphism Overlay (Preserves 100% WCAG AA text contrast) */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#050813]/70 to-[#03060f]/95"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(6, 12, 26, 0.4) 0%, rgba(4, 7, 18, 0.82) 60%, rgba(3, 5, 12, 0.96) 100%)'
        }}
      />

      {/* Ambient Cyber Neon Gradient Spotlights */}
      <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] bg-emerald-500/8 rounded-full blur-[140px]" />
      <div className="absolute -bottom-24 left-1/3 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[160px]" />

      {/* Cyber Grid Lines Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-35" />
    </div>
  );
};
