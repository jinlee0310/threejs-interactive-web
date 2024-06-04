// uniform mat4 projectionMatrix; // 3D -> 2D
// uniform mat4 viewMatrix; // camera
// uniform mat4 modelMatrix; // mesh
// uniform mat4 modelViewMatrix; // camera + mesh
uniform float uTime;

// attribute vec3 position; // position
in float aRandomPosition;
// attribute vec2 uv;

out float vRandomPosition;
out vec2 vUv;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandomPosition / 20.0 * sin(uTime);
  // modelPosition.z += sin(uTime + modelPosition.x) / 2.0;

  vRandomPosition = (aRandomPosition + 1.0) / 2.0;
  vRandomPosition /= uTime * 0.3;

  vUv=uv;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}