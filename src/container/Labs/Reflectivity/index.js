import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

export const Reflectivity = () => {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 50);

    const gui = new GUI();

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);

    const createTorusKnot = () => {
        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            roughness: 0,
            metalness: 0.2,
        });
        const mesh = new THREE.Mesh(geometry, material);

        gui.add(material, "roughness").min(0).max(1).step(0.01);
        gui.add(material, "metalness").min(0).max(1).step(0.01);

        scene.add(mesh);
    };

    const addLight = () => {
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(0, 16, 20);
        scene.add(light);
    };

    const draw = () => {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(draw);
    };

    const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const addEvent = () => {
        window.addEventListener("resize", resize);
    };

    const initialize = () => {
        createTorusKnot();
        addLight();
        draw();
        resize();
        addEvent();
    };

    initialize();
};
