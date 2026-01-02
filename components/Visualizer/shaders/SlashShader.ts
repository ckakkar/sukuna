import * as THREE from "three"

export const SlashShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xa855f7) },
    intensity: { value: 1.0 },
    angle: { value: 0.0 },
  },
  vertexShader: `
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Screen tear effect
      float tear = sin(position.y * 10.0 + time * 5.0) * 0.1;
      vec3 pos = position;
      pos.x += tear;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    uniform float angle;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 center = vUv - 0.5;
      
      // Rotate UV coordinates
      float cosAngle = cos(angle);
      float sinAngle = sin(angle);
      vec2 rotated = vec2(
        center.x * cosAngle - center.y * sinAngle,
        center.x * sinAngle + center.y * cosAngle
      );
      
      // Slash line
      float slashDist = abs(rotated.y);
      float slash = smoothstep(0.02, 0.0, slashDist);
      
      // Animated edge
      float edge = sin(rotated.x * 50.0 + time * 10.0) * 0.5 + 0.5;
      slash *= edge;
      
      // Trail effect
      float trail = smoothstep(0.5, -0.5, rotated.x) * 
                    smoothstep(-0.5, 0.5, rotated.x);
      slash *= trail;
      
      // Glow
      float glow = exp(-slashDist * 20.0);
      slash += glow * 0.3;
      
      vec3 finalColor = color * slash * intensity;
      float alpha = slash * 0.9;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}

