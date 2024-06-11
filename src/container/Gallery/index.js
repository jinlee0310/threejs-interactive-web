import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import renderHTML from "./renderHTML";

export default function renderGallery() {
    renderHTML();

    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(canvasSize.width, canvasSize.height);

    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 3);

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);

    const createObject = () => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    };

    const create = () => {
        createObject();
    };

    const draw = () => {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(draw);
    };

    const resize = () => {
        handleResize(renderer, camera);
    };

    const addEvent = () => {
        window.addEventListener("resize", resize);
    };

    const initialize = () => {
        create();
        draw();
        resize();
        addEvent();
    };

    // initialize();
}
