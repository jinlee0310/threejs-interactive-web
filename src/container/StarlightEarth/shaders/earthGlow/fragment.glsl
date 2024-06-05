varying vec3 vNormal;

uniform float uZoom;

void main() {
  vec3 lightSource = vec3(0.0, 0.0, 3.0);
  // float strength = max(1.0, pow(1.0 / (1.0 - (uZoom / 2.0)), 5.0));
  float intensity = dot(vNormal, lightSource);
  vec3 greenCol = vec3(0.246, 0.623, 0.557);

  gl_FragColor = vec4(greenCol, 1.0) * intensity;
}