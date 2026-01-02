import * as THREE from "three"

export const BarrierShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x9333ea) },
    distortion: { value: 0.1 },
  },
  vertexShader: `
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      // Hexagonal distortion
      vec3 pos = position;
      pos.xy += sin(pos.z * 2.0 + time) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float distortion;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Hexagonal grid function
    float hexagon(vec2 p) {
      p = abs(p);
      return max(p.x + p.y * 0.57735, p.y * 1.1547) - 1.0;
    }
    
    void main() {
      // Hexagonal grid pattern
      vec2 grid = vec2(20.0, 20.0);
      vec2 cell = floor(vUv * grid);
      vec2 cellUv = fract(vUv * grid) - 0.5;
      
      float hex = hexagon(cellUv);
      float hexPattern = smoothstep(0.02, 0.0, hex);
      
      // Animated distortion
      vec2 distortedUv = vUv + sin(vUv * 10.0 + time * 2.0) * distortion;
      float distortionPattern = sin(distortedUv.x * 15.0) * sin(distortedUv.y * 15.0);
      
      // Combine patterns
      float pattern = hexPattern * (0.5 + distortionPattern * 0.5);
      pattern += sin(time * 2.0) * 0.1;
      
      // Edge glow
      float edge = smoothstep(0.0, 0.1, hex);
      pattern += edge * 0.5;
      
      vec3 finalColor = color * pattern;
      float alpha = pattern * 0.6;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}

