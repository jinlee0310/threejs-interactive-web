import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { handleResize } from "../../lib";

export default function renderDesk() {
    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setClearColor(0x333333);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2; // 노출 정도
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자 효과

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 3);

    const gltfLoader = new GLTFLoader();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const createObject = () => {
        gltfLoader.load("./assets/models/desk/desk-modeling.glb", (gltf) => {
            gltf.scene.scale.set(0.25, 0.25, 0.25);
            scene.add(gltf.scene);

            scene.traverse((child) => {
                // scene을 순회
                if (
                    child.isMesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        });
    };

    const gui = new GUI();

    const createLight = () => {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024; // 그림자 해상도
        directionalLight.shadow.mapSize.height = 1024; // 그림자 해상도
        directionalLight.shadow.normalBias = 0.05; // 그림자의 표현 정도
        directionalLight.position.set(2, 2, 2);

        gui.add(directionalLight.position, "x").min(-10).max(10).step(0.01);
        gui.add(directionalLight.position, "y").min(-10).max(10).step(0.01);
        gui.add(directionalLight.position, "z").min(-10).max(10).step(0.01);

        scene.add(directionalLight);
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
        createLight();
        addEvent();
        handleResize(renderer, camera);
        draw();
    };

    initialize();
}
