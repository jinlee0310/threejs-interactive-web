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

    const clock = new THREE.Clock();

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
    camera.position.set(0, 0, 1.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const createEarth = () => {
        const material = new THREE.ShaderMaterial({
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
            uniforms: {
                uTexture: {
                    value: textureLoader.load(
                        "./assets/texture/2k_earth_specular_map.png"
                    ),
                },
                uTime: { value: 0 },
            },
            vertexShader: pointsVertexShader,
            fragmentShader: pointsFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const geometry = new THREE.IcosahedronGeometry(0.8, 30, 30);
        geometry.rotateY(-Math.PI);

        const mesh = new THREE.Points(geometry, material);

        return mesh;
    };

    const createEarthGlow = () => {
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uZoom: { value: 1 },
            },
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
            side: THREE.BackSide,
            transparent: true,
        });

        const glowGeometry = new THREE.SphereGeometry(1, 40, 40);
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);

        return glow;
    };

    const create = () => {
        const earth = createEarth();
        const earthPoints = createEarthPoints();
        const earthGlow = createEarthGlow();

        scene.add(earth, earthPoints, earthGlow);
        return { earthGlow, earthPoints, earth };
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

    const draw = (obj) => {
        const { earthGlow, earthPoints, earth } = obj;

        controls.update();
        renderer.render(scene, camera);

        // console.log(camera.position.z);

        earthGlow.material.uniforms.uZoom.value = controls.target.distanceTo(
            controls.object.position
        );
        earthPoints.material.uniforms.uTime.value = clock.getElapsedTime();
        earth.rotation.x += 0.0005;
        earth.rotation.y += 0.0005;
        earthPoints.rotation.x += 0.0005;
        earthPoints.rotation.y += 0.0005;

        requestAnimationFrame(() => {
            draw(obj);
        });
    };

    const initialize = () => {
        const obj = create();
        addEvent();
        resize();
        draw(obj);
    };

    initialize();
}
