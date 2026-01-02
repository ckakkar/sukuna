import * as THREE from "three"

export const VoidShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x7dd3fc) },
    depth: { value: 5.0 },
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
    uniform float depth;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Recursive pattern function
    float recursivePattern(vec2 p, float iterations) {
      float pattern = 0.0;
      for (float i = 0.0; i < iterations; i += 1.0) {
        float scale = pow(2.0, i);
        vec2 scaledP = p * scale;
        pattern += sin(scaledP.x + time * (0.5 + i * 0.1)) * 
                   sin(scaledP.y + time * (0.5 + i * 0.1)) / scale;
      }
      return pattern / iterations;
    }
    
    void main() {
      vec2 center = vUv - 0.5;
      float dist = length(center);
      
      // Infinite recursive pattern
      float pattern = recursivePattern(center * 10.0, depth);
      
      // Radial gradient
      float radial = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Information particles effect
      float particles = 0.0;
      for (float i = 0.0; i < 20.0; i += 1.0) {
        vec2 particlePos = vec2(
          sin(i * 0.5 + time) * 0.3,
          cos(i * 0.7 + time * 0.8) * 0.3
        );
        float particleDist = length(center - particlePos);
        particles += smoothstep(0.05, 0.0, particleDist) * 0.3;
      }
      
      // Combine effects
      float finalPattern = pattern * radial + particles;
      finalPattern = pow(finalPattern, 1.2);
      
      vec3 finalColor = color * finalPattern;
      float alpha = finalPattern * 0.7;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}

