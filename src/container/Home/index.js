import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import monitorDisplayVertexShader from "./shaders/vertex.glsl";
import monitorDisplayFragmentShader from "./shaders/fragment.glsl";

export default function renderHome() {
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

    const aspect = canvasSize.width / canvasSize.height;
    const viewSize = 2;
    const camera = new THREE.OrthographicCamera(
        -(aspect * viewSize) / 2,
        (aspect * viewSize) / 2,
        viewSize / 2,
        -viewSize / 2,
        0.1,
        100
    );
    camera.position.set(-1, 1, 1);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./assets/models/home/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const createObject = () => {
        gltfLoader.load("./assets/models/home/home-modeling.glb", (gltf) => {
            gltf.scene.scale.set(0.25, 0.25, 0.25);
            scene.add(gltf.scene);

            scene.traverse((child) => {
                // scene을 순회
                if (child.name === "stand") {
                    const pointLight = new THREE.PointLight(0xffff00, 0.3);
                    pointLight.scale.set(0.001, 0.001, 0.001);

                    const pointLightHelper = new THREE.PointLightHelper(
                        pointLight,
                        100
                    );

                    pointLight.position.set(
                        child.position.x * 0.25,
                        child.position.y * 0.25 + 0.4,
                        child.position.z * 0.25
                    );
                    scene.add(pointLight);
                    // scene.add(pointLightHelper);
                }
                if (child.name === "monitorDisplay") {
                    child.material = new THREE.ShaderMaterial({
                        vertexShader: monitorDisplayVertexShader,
                        fragmentShader: monitorDisplayFragmentShader,
                    });
                }
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

    const createLight = () => {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024; // 그림자 해상도
        directionalLight.shadow.mapSize.height = 1024; // 그림자 해상도
        directionalLight.shadow.normalBias = 0.05; // 그림자의 표현 정도
        directionalLight.position.set(-2.89, 3.62, 4.27);

        scene.add(directionalLight);
    };

    const resize = () => {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        const aspect = canvasSize.width / canvasSize.height;
        camera.left = -(aspect * viewSize) / 2;
        camera.right = (aspect * viewSize) / 2;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasSize.width, canvasSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const addEvent = () => {
        window.addEventListener("resize", resize);
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
        resize();
        draw();
    };

    initialize();
}
