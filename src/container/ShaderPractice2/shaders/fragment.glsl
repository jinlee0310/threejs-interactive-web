precision mediump float;

varying vec2 vUv;

float smoothy(float edge0, float edge1, float x){
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);

    float strength = t * t * (3.0 - (2.0 * t));

    return strength;
}

void main()
{
    // 1. 그라데이션
    // float x = vUv.x;
    // float y = vUv.y;

    // float col = x ;

    // gl_FragColor = vec4(col, col, col, 1.0);

    // 2. 대각선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green =vec3(0.0, 1.0, 0.0);

    // if(y <= x + 0.005 && y >= x - 0.005){
    //   col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 3. 곡선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green =vec3(0.0, 1.0, 0.0);

    // if(y <= x * x + 0.005 && y >= x * x - 0.005){
    //   col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 4. 그래프 + 그라데이션
    // float x = vUv.x * 2.0;
    // float y = vUv.y;

    // vec3 col = vec3(x * x);
    // vec3 green =vec3(0.0, 1.0, 0.0);

    // if(y <= x * x + 0.005 && y >= x * x - 0.005){
    //   col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 5. step
    // float x = vUv.x;
    // float y = vUv.y;

    // float strength = step(0.5, x);

    // if(strength == 0.0){
    //   discard;
    // }

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 6. min, max
    // float x = vUv.x;
    // float y = vUv.y;

    // float strength = max(0.5, x);

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 7. clamp
    // float x = vUv.x;
    // float y = vUv.y;

    // float strength = clamp(x, 0.3, 0.7);

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 8. smoothy
    // float x = vUv.x;
    // float y = vUv.y;

    // float strength = smoothy(0.3, 0.7, x);
    // float strength = smoothstep(0.3, 0.7, x);

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 9. mix
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    // vec3 blue = vec3(0.0, 0.0, 1.0);
    // vec3 col = mix(green, blue, x);

    // gl_FragColor = vec4(col, 1.0);

    // 10. pow
    float x = vUv.x;
    float y = vUv.y;

    vec3 col = vec3(x);
    vec3 green =vec3(0.0, 1.0, 0.0);

    if(y <= pow(x, 2.0) + 0.005 && y >= pow(x, 2.0) - 0.005){
      col = green;
    }

    gl_FragColor = vec4(col, 1.0);


}