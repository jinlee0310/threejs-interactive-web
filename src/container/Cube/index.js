import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { handleResize } from "../../lib";
import renderHamburger from "../../layouts/Hamburger";

export function renderCube() {
    renderHamburger();

    const options = {
        color: 0x00ffff,
    };

    const renderer = new Three.WebGLRenderer({
        // alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75, // 시야각
        window.innerWidth / window.innerHeight, // 종횡비
        1, // near
        500 // far
    );

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.autoRotate = true;
    // controls.autoRotateSpeed = 30;
    controls.enableDamping = true;
    // controls.dampingFactor = 0.01;
    controls.enableZoom = true;
    controls.enablePan = true;
    // controls.maxDistance = 50;
    // controls.minDistance = 10;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI / 3;

    const cubeGeometry = new Three.IcosahedronGeometry(1);
    const cubeMaterial = new Three.MeshLambertMaterial({
        color: 0x00ffff,
        emissive: 0x111111,
    });
    const cube = new Three.Mesh(cubeGeometry, cubeMaterial);

    const skeletonGeometry = new Three.IcosahedronGeometry(2);
    const skeletonMaterial = new Three.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        color: 0xaaaaaa,
    });
    const skeleton = new Three.Mesh(skeletonGeometry, skeletonMaterial);

    scene.add(cube, skeleton);

    camera.position.z = 5;

    const directionalLight = new Three.DirectionalLight(0xffffff, 1);

    scene.add(directionalLight);

    const clock = new Three.Clock();

    render();

    function render() {
        const elapsedTime = clock.getElapsedTime();

        // cube.rotation.x = elapsedTime;
        // cube.rotation.y = elapsedTime;

        // skeleton.rotation.x = elapsedTime * 1.5;
        // skeleton.rotation.y = elapsedTime * 1.5;

        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () => handleResize(renderer, camera));

    const gui = new GUI();

    gui.add(cube.position, "y", -3, 3, 1);
    gui.add(cube, "visible");

    gui.addColor(options, "color").onChange((v) => {
        cube.material.color.set(v);
    });
}
