import * as Three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import { gsap } from "gsap";
import renderNav from "./Navigation";

export default function renderMain() {
    renderNav();

    const renderer = new Three.WebGLRenderer({
        antialias: true,
        alpha: true,
    });

    renderer.setClearColor(0xfffdd2);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / innerHeight,
        1,
        500
    );

    camera.position.set(0, 0, 50);

    const ringGeometry = new Three.TorusGeometry(8, 1, 16, 100);
    const ringMaterial = new Three.MeshStandardMaterial({ color: "#E53935" });
    const ring = new Three.Mesh(ringGeometry, ringMaterial);

    ring.position.set(30, 10, 0);

    scene.add(ring);

    const triangleGeometry = new Three.TorusGeometry(8, 1, 16, 3);
    const triangleMaterial = new Three.MeshStandardMaterial({
        color: "#4CAF50",
    });
    const triangle = new Three.Mesh(triangleGeometry, triangleMaterial);

    triangle.position.set(-20, 20, 0);

    scene.add(triangle);

    const geometry = new Three.BoxGeometry(16, 16, 1);
    const material = new Three.MeshStandardMaterial({ color: "#0e0398" });
    const cube = new Three.Mesh(geometry, material);

    cube.position.set(20, -20, 0);

    scene.add(cube);

    const ambientLight = new Three.AmbientLight(0xffffff, 0.8);

    ambientLight.position.set(-5, -5, -5);

    scene.add(ambientLight);

    const axesHelper = new Three.AxesHelper(300);

    const controls = new OrbitControls(camera, renderer.domElement);

    // scene.add(axesHelper);

    gsap.to(triangle.rotation, {
        duration: 6,
        y: Math.PI * 2,
        repeat: -1,
        ease: "none",
    });

    gsap.to(ring.rotation, {
        duration: 10,
        y: Math.PI * 2,
        repeat: -1,
        ease: "none",
    });

    render();

    function render() {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }

    window.addEventListener("resize", () =>
        handleResize(renderer, camera, scene, controls)
    );
}
