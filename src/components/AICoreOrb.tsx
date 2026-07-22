import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AIState } from '../types';

interface AICoreOrbProps {
  aiState: AIState;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel?: number; // 0 to 1
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AICoreOrb: React.FC<AICoreOrbProps> = ({
  aiState,
  isListening,
  isSpeaking,
  audioLevel = 0,
  onClick,
  size = 'md',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);

  // Dimension scaling
  const pixelSizes = {
    sm: { width: 140, height: 140 },
    md: { width: 220, height: 220 },
    lg: { width: 320, height: 320 },
    xl: { width: 440, height: 440 },
  };
  const dimensions = pixelSizes[size];

  // 1. Three.js Glowing Particle Mesh Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = dimensions.width;
    const height = dimensions.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Create particle sphere
    const particleCount = size === 'xl' ? 1800 : size === 'lg' ? 1400 : 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const radius = size === 'xl' ? 70 : size === 'lg' ? 55 : 38;

    for (let i = 0; i < particleCount; i++) {
      // Uniform point distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Base Cyan/Ice Color
      colors[i * 3] = 0.1;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(6,182,212,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: size === 'xl' ? 4.5 : 3.5,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Inner glowing core sphere
    const innerGeo = new THREE.IcosahedronGeometry(radius * 0.55, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      // Rotation speeds based on AI State
      let rotSpeedY = 0.005;
      let rotSpeedX = 0.002;
      let pulseAmp = 0.05;
      let pulseFreq = 2.0;

      // Target colors depending on state
      let rTarget = 0.02, gTarget = 0.7, bTarget = 0.95; // Idle cyan

      if (aiState === 'listening' || isListening) {
        // Vibrant Violet / Pink Pulse
        rTarget = 0.8; gTarget = 0.2; bTarget = 1.0;
        rotSpeedY = 0.015;
        pulseAmp = 0.25 + audioLevel * 0.4;
        pulseFreq = 5.0;
      } else if (aiState === 'thinking') {
        // Golden / Amber Pulse
        rTarget = 0.95; gTarget = 0.75; bTarget = 0.1;
        rotSpeedY = 0.035;
        rotSpeedX = 0.015;
        pulseAmp = 0.15;
        pulseFreq = 8.0;
      } else if (aiState === 'speaking' || isSpeaking) {
        // High Energy Bright Teal / Emerald
        rTarget = 0.05; gTarget = 0.95; bTarget = 0.6;
        rotSpeedY = 0.02;
        pulseAmp = 0.2 + (Math.sin(elapsedTime * 12) * 0.15);
        pulseFreq = 6.0;
      } else if (aiState === 'executing') {
        // Deep Crimson Crimson Gold
        rTarget = 0.9; gTarget = 0.3; bTarget = 0.2;
        rotSpeedY = 0.025;
      }

      particles.rotation.y += rotSpeedY;
      particles.rotation.x += rotSpeedX;
      innerMesh.rotation.y -= rotSpeedY * 1.5;
      innerMesh.rotation.z += rotSpeedX;

      // Pulse points along normals
      const scaleFactor = 1 + Math.sin(elapsedTime * pulseFreq) * pulseAmp;
      innerMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const ox = originalPositions[ix];
        const oy = originalPositions[iy];
        const oz = originalPositions[iz];

        const noise = Math.sin(ox * 0.05 + elapsedTime * 3) * Math.cos(oy * 0.05 + elapsedTime * 2) * 4;

        posArr[ix] = ox * scaleFactor + noise;
        posArr[iy] = oy * scaleFactor + noise;
        posArr[iz] = oz * scaleFactor + noise;

        // Smooth transition color toward target
        colArr[ix] += (rTarget - colArr[ix]) * 0.05;
        colArr[iy] += (gTarget - colArr[iy]) * 0.05;
        colArr[iz] += (bTarget - colArr[iz]) * 0.05;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, [aiState, isListening, isSpeaking, size, dimensions.width, dimensions.height]);

  // 2. 2D Waveform Canvas
  useEffect(() => {
    const canvas = waveformRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let step = 0;

    const renderWaveform = () => {
      animId = requestAnimationFrame(renderWaveform);
      step += 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.lineWidth = 2;
      ctx.beginPath();

      let strokeStyle = 'rgba(6, 182, 212, 0.8)';
      if (aiState === 'listening' || isListening) strokeStyle = 'rgba(217, 70, 239, 0.9)';
      if (aiState === 'thinking') strokeStyle = 'rgba(245, 158, 11, 0.9)';
      if (aiState === 'speaking' || isSpeaking) strokeStyle = 'rgba(16, 185, 129, 0.9)';

      ctx.strokeStyle = strokeStyle;

      for (let x = 0; x < width; x += 3) {
        let amplitude = 4;
        if (aiState === 'listening' || isListening) amplitude = 14 + audioLevel * 20;
        if (aiState === 'thinking') amplitude = 8;
        if (aiState === 'speaking' || isSpeaking) amplitude = 12 + Math.sin(step * 2) * 8;

        const y = centerY + Math.sin(x * 0.05 + step) * Math.cos(x * 0.02 + step * 0.5) * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    renderWaveform();
    return () => cancelAnimationFrame(animId);
  }, [aiState, isListening, isSpeaking, audioLevel]);

  // Status Badge Label
  const stateLabels: Record<AIState, { text: string; bg: string; textCol: string }> = {
    idle: { text: 'FRIDAY ONLINE', bg: 'bg-cyan-500/20 border-cyan-500/40', textCol: 'text-cyan-400' },
    listening: { text: 'LISTENING...', bg: 'bg-fuchsia-500/20 border-fuchsia-500/40', textCol: 'text-fuchsia-300' },
    thinking: { text: 'PROCESSING INTENT...', bg: 'bg-amber-500/20 border-amber-500/40', textCol: 'text-amber-300' },
    speaking: { text: 'TRANSMITTING VOICE...', bg: 'bg-emerald-500/20 border-emerald-500/40', textCol: 'text-emerald-300' },
    executing: { text: 'EXECUTING WORKFLOW...', bg: 'bg-rose-500/20 border-rose-500/40', textCol: 'text-rose-300' },
  };

  const badge = stateLabels[aiState] || stateLabels.idle;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center cursor-pointer select-none group transition-all duration-300`}
      style={{ width: dimensions.width, height: dimensions.height + 40 }}
    >
      {/* Liquid Glass Glow Halo Background */}
      <div
        className={`absolute rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-60 group-hover:opacity-90 ${
          aiState === 'listening'
            ? 'bg-fuchsia-600/40 w-48 h-48'
            : aiState === 'thinking'
            ? 'bg-amber-500/40 w-48 h-48'
            : aiState === 'speaking'
            ? 'bg-emerald-500/40 w-48 h-48'
            : 'bg-cyan-500/30 w-40 h-40'
        }`}
      />

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="z-10 relative flex items-center justify-center" />

      {/* Waveform Strip */}
      <div className="z-20 w-3/4 h-8 mt-[-10px] flex items-center justify-center">
        <canvas ref={waveformRef} width={dimensions.width * 0.75} height={28} className="w-full h-full" />
      </div>

      {/* HUD State Indicator Badge */}
      <div
        className={`z-20 mt-1 px-3 py-1 rounded-full text-[10px] tracking-widest font-mono font-semibold border backdrop-blur-md transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-1.5 ${badge.bg} ${badge.textCol}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full animate-ping ${
            aiState === 'listening'
              ? 'bg-fuchsia-400'
              : aiState === 'thinking'
              ? 'bg-amber-400'
              : aiState === 'speaking'
              ? 'bg-emerald-400'
              : 'bg-cyan-400'
          }`}
        />
        {badge.text}
      </div>
    </div>
  );
};
