// precision mediump float;

uniform sampler2D uTexture;

in float vRandomPosition;
in vec2 vUv;

out vec4 fragColor;

void main(){
  vec4 tex = texture(uTexture, vUv);

  fragColor = tex * vRandomPosition;
  // gl_FragColor = vec4(vRandomPosition, vRandomPosition, 1.0, 1.0);
}