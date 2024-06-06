import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { handleResize } from "../../lib";

export default function ShaderPractice2() {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.domElement.id = "shader-practice2-canvas";
    renderer.setClearColor(0x333333, 1);

    document.body.appendChild(renderer.domElement);

    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 1.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const createObject = () => {
        const material = new THREE.RawShaderMaterial({
            // wireframe: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
        });
        const geometry = new THREE.PlaneGeometry(1, 1, 16, 16);

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    };

    const addEvent = () => {
        window.addEventListener("resize", () => handleResize(renderer, camera));
    };

    const draw = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
            draw();
        });
    };

    const initialize = () => {
        createObject();
        addEvent();
        handleResize(renderer, camera);
        draw();
    };

    initialize();
}
