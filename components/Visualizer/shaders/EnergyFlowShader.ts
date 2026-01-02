import * as THREE from "three"

export const EnergyFlowShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x9333ea) },
    intensity: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Flowing energy pattern
      float flow = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
      flow += sin(vUv.y * 8.0 + time * 1.5) * 0.3;
      flow += sin((vUv.x + vUv.y) * 6.0 + time * 3.0) * 0.2;
      
      // Energy waves
      float wave = sin(length(vUv - 0.5) * 15.0 - time * 4.0) * 0.5 + 0.5;
      
      // Combine patterns
      float energy = flow * wave;
      energy = pow(energy, 1.5);
      
      // Glow effect
      vec3 finalColor = color * energy * intensity;
      float alpha = energy * 0.8;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}

