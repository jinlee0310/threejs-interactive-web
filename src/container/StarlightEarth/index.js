import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/earth/vertex.glsl";
import fragmentShader from "./shaders/earth/fragment.glsl";
import pointsVertexShader from "./shaders/earthPoints/vertex.glsl";
import pointsFragmentShader from "./shaders/earthPoints/fragment.glsl";
import glowVertexShader from "./shaders/earthGlow/vertex.glsl";
import glowFragmentShader from "./shaders/earthGlow/fragment.glsl";

export default function renderStarlightEarth() {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.id = "starlight-earth-canvas";

    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

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

    const createEarth = () => {
        const material = new THREE.ShaderMaterial({
            wireframe: false,
            uniforms: {
                uTexture: {
                    value: textureLoader.load(
                        "./assets/texture/2k_earth_specular_map.png"
                    ),
                },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        });

        const geometry = new THREE.SphereGeometry(0.8, 30, 30);
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    };

    const createEarthPoints = () => {
        const material = new THREE.ShaderMaterial({
            wireframe: true,
            uniforms: {
                uTexture: {
                    value: textureLoader.load(
                        "./assets/texture/2k_earth_specular_map.png"
                    ),
                },
            },
            vertexShader: pointsVertexShader,
            fragmentShader: pointsFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        });

        const geometry = new THREE.IcosahedronGeometry(0.8, 20, 20);
        geometry.rotateY(-Math.PI);

        const mesh = new THREE.Points(geometry, material);

        return mesh;
    };

    const create = () => {
        const earth = createEarth();
        const earthPoints = createEarthPoints();

        scene.add(earth, earthPoints);
    };

    const resize = () => {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        camera.aspect = canvasSize.width / canvasSize.height;
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
        create();
        addEvent();
        resize();
        draw();
    };

    initialize();
}
