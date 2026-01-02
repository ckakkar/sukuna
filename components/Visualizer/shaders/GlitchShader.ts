import * as THREE from "three"

export const GlitchShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x9333ea) },
    intensity: { value: 0.0 },
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
    
    // Random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Digital glitch effect
      float glitch = step(0.98, random(vec2(time * 10.0, uv.y)));
      
      // RGB split effect (simulated)
      float splitAmount = intensity * 0.02;
      vec2 rUv = uv + vec2(splitAmount, 0.0);
      vec2 bUv = uv - vec2(splitAmount, 0.0);
      
      // Base pattern
      float pattern = sin(rUv.x * 20.0 + time) * sin(rUv.y * 20.0 + time);
      float rPattern = pattern;
      float gPattern = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time);
      float bPattern = sin(bUv.x * 20.0 + time) * sin(bUv.y * 20.0 + time);
      
      // Block distortion
      vec2 blockUv = floor(uv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
      float blockGlitch = random(blockUv + time) * intensity;
      uv.x += blockGlitch * 0.1;
      
      // Scan lines
      float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.5 + 0.5;
      scanline = pow(scanline, 10.0);
      
      // Combine effects
      vec3 finalColor = vec3(
        rPattern * color.r,
        gPattern * color.g,
        bPattern * color.b
      );
      finalColor += glitch * intensity * 0.5;
      finalColor *= (0.7 + scanline * 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
}

