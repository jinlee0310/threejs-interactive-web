import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { handleResize } from "../../lib";
import { gsap } from "gsap";
import renderNav from "./Navigation";

export default function renderMain() {
    renderNav();

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });

    renderer.setClearColor(0xfffdd2);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        47,
        window.innerWidth / innerHeight,
        1,
        500
    );
    camera.position.set(0, 0, 80);

    const controls = new OrbitControls(camera, renderer.domElement);

    const createRing = () => {
        const ringGeometry = new THREE.TorusGeometry(8, 1, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: "#E53935",
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);

        ring.position.set(30, 10, 0);

        return ring;
    };

    const createTriangle = () => {
        const triangleGeometry = new THREE.TorusGeometry(8, 1, 16, 3);
        const triangleMaterial = new THREE.MeshStandardMaterial({
            color: "#4CAF50",
        });
        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);

        triangle.position.set(-30, 20, -5);

        return triangle;
    };

    const createCube = () => {
        const geometry = new THREE.BoxGeometry(16, 16, 1);
        const material = new THREE.MeshStandardMaterial({ color: "#0e0398" });
        const cube = new THREE.Mesh(geometry, material);

        cube.rotation.y = -Math.PI / 6;
        cube.position.set(10, -20, 5);

        return cube;
    };

    const createLight = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

        ambientLight.position.set(-5, -5, -5);

        return ambientLight;
    };

    const create = () => {
        const light = createLight();
        const cube = createCube();
        const triangle = createTriangle();
        const ring = createRing();

        scene.add(light, cube, triangle, ring);

        return { light, cube, triangle, ring };
    };

    const addAnimation = (obj) => {
        const { triangle, ring, cube } = obj;

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

        gsap.to(cube.rotation, {
            duration: 2,
            repeat: -1,
            ease: "none",
            yoyo: true,
            y: Math.PI / 6,
        });
    };

    function draw(obj) {
        const { triangle, cube } = obj;

        triangle.position.y += 0.05;
        if (triangle.position.y > 50) {
            triangle.position.y = -45;
        }

        cube.position.x -= 0.03;
        if (cube.position.x < -80) {
            cube.position.x = 80;
        }

        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(() => draw(obj));
    }

    const resize = () => {
        handleResize(renderer, camera);
    };

    const addEvent = () => {
        window.addEventListener("resize", () => handleResize(renderer, camera));
    };

    const initialize = () => {
        const obj = create();
        addAnimation(obj);
        addEvent();
        resize();
        draw(obj);
    };

    initialize();
}
