import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { handleResize } from "../../lib";

export default function shaderPractice() {
    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x333333, 1);
    renderer.domElement.id = "shader-practice-canvas";

    document.body.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75, // 시야각
        canvasSize.width / canvasSize.height, // 카메라 종횡비
        0.1,
        100
    );
    camera.position.set(0, 0, 2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const createMesh = () => {
        const planeMaterial = new THREE.ShaderMaterial({
            // Shader에는 미리 정의된 값들이 있음
            uniforms: {
                uTime: { value: 0 },
                uTexture: {
                    value: textureLoader.load(
                        "./assets/texture/new-beginnings.jpg"
                    ),
                },
            },
            glslVersion: THREE.GLSL3,
            wireframe: false,
            side: THREE.DoubleSide,
            vertexShader,
            fragmentShader,
        });

        const planeGeometry = new THREE.PlaneGeometry(1, 965 / 720, 16, 16);
        const verticesCount = planeGeometry.attributes.position.count;
        const randomPositions = new Float32Array(verticesCount);

        for (let i = 0; i < verticesCount; i++) {
            randomPositions[i] = (Math.random() - 0.5) * 2;
        }

        planeGeometry.setAttribute(
            "aRandomPosition",
            new THREE.BufferAttribute(randomPositions, 1)
        );

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        scene.add(plane);

        return plane;
    };

    const draw = (mesh) => {
        renderer.render(scene, camera);
        controls.update();

        mesh.material.uniforms.uTime.value = clock.getElapsedTime();

        requestAnimationFrame(() => {
            draw(mesh);
        });
    };

    const addEvent = () => {
        window.addEventListener("resize", () => handleResize(renderer, camera));
    };

    const init = () => {
        const mesh = createMesh();
        draw(mesh);
        addEvent();
        handleResize(renderer, camera);
    };

    init();
}
